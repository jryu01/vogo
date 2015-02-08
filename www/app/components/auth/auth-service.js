'use strict';
angular.module('voteit.auth.service', ['LocalStorageModule'])

.factory('auth', ['localStorageService', function (localStorageService) {
  var userProfile = localStorageService.get('user') || undefined,
      accessToken = localStorageService.get('token') || undefined;
  return {
    getToken: function () {
      return accessToken; 
    },
    getUser: function () {
      return userProfile; 
    },
    isAuthenticated: function () {
      return !!(userProfile && accessToken);
    },
    authenticate: function (user, token) {
      userProfile = user;
      accessToken = token;
      return this;
    },
    logout: function () {
      localStorageService.remove('user');
      localStorageService.remove('token');
      accessToken = undefined;  
      userProfile = undefined;
    }
  };
}]);