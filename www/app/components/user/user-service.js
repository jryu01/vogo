'use strict';
/* jshint quotmark: false */

angular.module('voteit.user', ['voteit.config'])

.factory('User', [
  'Restangular',
  'config',
  '$http', 
  'auth',
  '$cordovaOauth',
  'localStorageService',
function (Restangular, config, $http, auth, $cordovaOauth, localStorageService) {

  var that = {};

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

  that.getProfile = auth.getUser;

  that.getVotes = function () {
    var id = that.getProfile().id;
    var query = { voterId: id };
    return $http.get(config.baseUrl + '/polls', {params: query});
  };

  return that;
}]);