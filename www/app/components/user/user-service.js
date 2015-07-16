'use strict';
/* jshint quotmark: false */

angular.module('voteit.user', ['voteit.config'])

.factory('User', [
  'config',
  '$http', 
  '$q',
  'auth',
  '$cordovaOauth',
  '$cordovaPush',
  'localStorageService',
  '$ionicPlatform',
  '$timeout',
  '$cordovaDialogs',
function (config, $http, $q, auth, $cordovaOauth, $cordovaPush, localStorageService, $ionicPlatform, $timeout, $cordovaDialogs) {

  var that = {};

  that.myProfile = {};
  // that.myVotes = [];
  // that.myPolls = [];

  var url = function () {
    var args = Array.prototype.slice.call(arguments),
        url = config.baseUrl;
    args.forEach(function (urlSegment) {
      url = url + '/' + urlSegment;
    });
    return url;
  };

  var extract = function (result) {
    return result.data;
  };

  var mapToUserIds = function (users) {
    return users.map(function (user) { 
      return user.userId; 
    });
  };

  var markVotedPolls = function (polls) {
    // add isVotedByMe boolean value and answer number (if true) 
    // to each poll of polls array
    var pollIds = polls.map(function (poll) { return poll.id; }),
        params = { params: { pollIds: pollIds } },
        me = that.getMe();
    return $http.get(url('users', me.id, 'votes'), params)
      .then(extract)
      .then(function (myVotes) {
        var pollIdsVotedByMe = myVotes.map(function (v) { return v._poll; });
        polls.forEach(function (poll) {
          var index = pollIdsVotedByMe.indexOf(poll.id);
          poll.isVotedByMe = index >= 0;
          if (poll.isVotedByMe) { 
            poll.answerVotedByMe = myVotes[index].answer; 
          }
        });
        return polls;
      });
  };

  that.signin = function () {

    var loginData;

    var loginWithFbToken = function (fbLoginResult) {
      return $http.post(url('login'), {
        grantType: 'facebook',
        facebookAccessToken: fbLoginResult.access_token
      }).then(function (res) {
        loginData = res.data;
        auth.authenticate(res.data.user, res.data.access_token);
      });
    };

    return $cordovaOauth
      .facebook(config.fbAppId, ['email','user_friends'])
      .then(loginWithFbToken);
  };

  that.signout = function () {
    $cordovaPush.unregister();
    auth.logout(); 
  };

  that.setS3Info = function () {
    return $http.get(url('s3Info')).then(function (res) {
      localStorageService.set('s3Info', res.data);
    });
  };

  that.registerDeviceToken = function () {
    var doneOnTime = false;
    var iosConfig = {
      "badge": true,
      "sound": true,
      "alert": true,
    };

    return $ionicPlatform.ready().then(function () {

      //assumes if register doesn't finish within 2s, then push setting is off
      //(unless user first logged on)
      $timeout(function () {
        var user = that.getMe();

        //first time user login (user doesn't have iosPushSuggested field)
        if (user.iosPushSuggested === undefined) {
          user.iosPushSuggested = false;
          that.saveMe(user);
          return;
        }

        // suggest user to turn on push notification setting for this app
        if (user.iosPushSuggested === false) {
          $cordovaDialogs
            .alert(
              'Vogo works much better with push notifications turned on.' +
              'Enable them in the Settings. ' +
              'Sttings -> Notifications -> Vogo', 'Notifications!', 'OK'
            ).then(function () {
              user.iosPushSuggested = true;
              that.saveMe(user);
            });
        }

      }, 2000);

      return $cordovaPush.register(iosConfig);
    }).then(function (dToken) {
      return $http.post(url('deviceTokens'), { token: dToken });
    }).catch(function (e) {
      if (e === ' - remote notifications are not supported in the simulator') {
        return;
      }
      return $q.reject(e);
    }).finally(function () {
      doneOnTime = true;
    });

  };

  that.getMe = function () {
    return auth.getUser();
  };

  that.saveMe = function (user) {
    auth.saveUser(user);
  };

  that.getS3Info = function () {
    return localStorageService.get('s3Info');
  };

  that.follow = function (userId) {
    var me = that.getMe();
    return $http.put(url('users', me.id, 'following', userId))
    .then(function () {
      that.myProfile.numFollowing += 1;
    });
  };

  that.unfollow = function (userId) {
    var me = that.getMe();
    return $http.delete(url('users', me.id, 'following', userId))
    .then(function () {
      that.myProfile.numFollowing -= 1;
    });
  };

  that.getFollowInfo = function (userId) {
    var getFollowingCount = $http.get(url('users', userId, 'following-count')),
        getFollowersCount = $http.get(url('users', userId, 'followers-count')),
        getFollowingInfo = that.getFollowingInfo([userId]),
        promises = [ getFollowingCount, getFollowersCount, getFollowingInfo ];
    return $q.all(promises).then(function (result) {
      var info = {
        numFollowing: result[0].data.numberOfFollowing,
        numFollowers: result[1].data.numberOfFollowers,
        following: result[2][0].following
      };
      return info;
    });
  };
  // return following relationships info with authenticated user to userIds
  that.getFollowingInfo = function (userIds) {
    if (!(userIds && userIds.length > 0)) {
      return [];
    }
    var options = { params: { userId: userIds} };
    return $http.get(url('relationships', 'following'), options).then(extract);
  };

  that.getFollowing = function (userId, skip) {
    var opts = {};
    opts.params = { limit: 100, skip: skip };
    return $http.get(url('users', userId, 'following'), opts)
      .then(extract)
      .then(mapToUserIds)
      .then(that.getFollowingInfo);
  };

  that.getFollowers = function (userId, skip) {
    var opts = {};
    opts.params = { limit: 100, skip: skip };
    return $http.get(url('users', userId, 'followers'), opts)
      .then(extract)
      .then(mapToUserIds)
      .then(that.getFollowingInfo);
  };

  that.getVotesById = function (id, before) {
    var query = {};
    query.before = before; // before is vote id

    var convertToPollsArray = function (votes) {
      var polls = votes.map(function (vote) { 
        vote._poll._outer = vote;
        return vote._poll; 
      });
      return polls;
    };

    var restoreToVotesArray = function (polls) {
      var votes = polls.map(function (poll) {
        var vote = poll._outer;
        delete vote._poll._outer;
        return vote;
      });
      return votes;
    };

    var markPolls = function (polls) {
      var me = that.getMe();
      if (id === me.id) {
        // since all votes are currnt user's vote
        polls.forEach(function (poll) {
          poll.isVotedByMe = true;
          poll.answerVotedByMe = poll._outer.answer;
        });
        return polls;
      } else {
        return markVotedPolls(polls); 
      }
    };

    return $http.get(url('users', id, 'votes'), {params: query})
      .then(extract)
      .then(convertToPollsArray)
      .then(markPolls)
      .then(restoreToVotesArray);
  };
  
  that.getPollsById = function (id, before) {
    var query = {};
    query.before = before; // before is poll id

    return $http.get(url('users', id, 'polls'), {params: query})
      .then(extract)
      .then(markVotedPolls);
  };


  //TODO: move this to other service
  that.searchImg = function (query) {
    return $http.get(url('bing/search/image'), {params: { query: query }})
      .then(extract)
      .then(function (result) {
        var objects = result.d.results;
        return objects.map(function (obj) {
          return obj.Thumbnail;
        });
      });
  };
  
  return that;
}]);