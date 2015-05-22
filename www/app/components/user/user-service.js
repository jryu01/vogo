'use strict';
/* jshint quotmark: false */

angular.module('voteit.user', ['voteit.config'])

.factory('User', [
  'config',
  '$http', 
  '$q',
  'auth',
  '$cordovaOauth',
  'localStorageService',
function (config, $http, $q, auth, $cordovaOauth, localStorageService) {

  var that = {};

  that.myProfile = {};

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

  var markVotedPolls = function (polls) {
    // add isVotedByMe boolean value to each poll of polls array
    var pollIds = polls.map(function (poll) { return poll.id; }),
        params = { params: { pollIds: pollIds } },
        me = that.getMe();
    return $http.get(url('users', me.id, 'votes'), params)
      .then(extract)
      .then(function (myVotes) {
        var pollIdsVotedByMe = myVotes.map(function (v) { return v._poll; });
        polls.forEach(function (poll) {
          poll.isVotedByMe = pollIdsVotedByMe.indexOf(poll.id) > 0;
        });
        return polls;
      });
  };

  that.signin = function () {
    return $cordovaOauth
      .facebook(config.fbAppId, ['email','user_friends'])
      .then(function (result) {
        return $http.post(url('login'), {
          grantType: 'facebook',
          facebookAccessToken: result.access_token
        });
      }).then(function (res) {
        auth.authenticate(res.data.user, res.data.access_token);
        return $http.get(url('s3Info'));
      }).then(function (res) {
        localStorageService.set('s3Info', res.data);
      });
  };

  that.signout = function () {
    auth.logout(); 
  };

  that.getMe = function () {
    return auth.getUser();
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

  that.getFollowingInfo = function (ids) {
    var options = { params: { userId: ids} };
    return $http.get(url('relationships', 'following'), options).then(extract);
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
  
  return that;
}]);