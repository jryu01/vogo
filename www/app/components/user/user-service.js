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

  that.getProfileByUserId = function (id) {
    var getUser = $http.get(url('users', id)),
        getFollowingCount = $http.get(url('users', id, 'following-count')),
        getFollowersCount = $http.get(url('users', id, 'followers-count'));
    return $q.all([getUser, getFollowingCount, getFollowersCount])
      .then(function (result) {
        var profile = {
          userId: id,
          name: result[0].data.name,
          picture: result[0].data.picture,
          numFollowing: result[1].data.numberOfFollowing,
          numFollowers: result[2].data.numberOfFollowers
        };
        return profile;
      });
  };

  that.getVotesById = function (id, before) {
    var query = {};
    query.before = before; // before is vote id
    return $http.get(url('users', id, 'votes'), {params: query}).then(extract);
  };
  
  that.getPollsById = function (id, before) {
    var query = {};
    query.before = before; // before is poll id
    return $http.get(url('users', id, 'polls'), {params: query}).then(extract);
  };

  return that;
}]);