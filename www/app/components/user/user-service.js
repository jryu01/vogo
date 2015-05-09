'use strict';
/* jshint quotmark: false */

angular.module('voteit.user', ['voteit.config'])

.factory('User', [
  'Restangular',
  'config',
  '$http', 
  '$q',
  'auth',
  '$cordovaOauth',
  'localStorageService',
function (Restangular, config, $http, $q, auth, $cordovaOauth, localStorageService) {

  var that = {};
  var Users = Restangular.all('users');

  that.signin = function () {
    return $cordovaOauth
      .facebook(config.fbAppId, ['email','user_friends'])
      .then(function (result) {
        return $http.post(config.baseUrl + '/login', {
          grantType: 'facebook',
          facebookAccessToken: result.access_token
        });
      }).then(function (response) {
        auth.authenticate(response.data.user, response.data.access_token);
        return $http.get(config.baseUrl + '/s3info');
      }).then(function (response) {
        localStorageService.set('s3Info', response.data);
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
    var getUser = Users.get(id),
        getFollowingCount = Users.one(id).customGET('following-count'),
        getFollowersCount = Users.one(id).customGET('followers-count');
    return $q.all([getUser, getFollowingCount, getFollowersCount])
      .then(function (result) {
        var profile = {
          userId: id,
          name: result[0].name,
          picture: result[0].picture,
          numFollowing: result[1].numberOfFollowing,
          numFollowers: result[2].numberOfFollowers
        };
        return profile;
      });
  };

  that.getVotes = function () {
    var id = that.getMe().id;
    var query = { voterId: id };
    return $http.get(config.baseUrl + '/polls', {params: query});
  };

  return that;
}]);