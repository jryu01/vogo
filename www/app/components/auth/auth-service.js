'use strict';
angular.module('voteit.auth.service', ['LocalStorageModule'])

.factory('auth', ['localStorageService', function (localStorageService) {
  var userProfile = localStorageService.get('user') || undefined,
      accessToken = localStorageService.get('token') || undefined;
  return {
    getToken: function () {
      return localStorageService.get('token'); 
    },
    getUser: function () {
      return localStorageService.get('user'); 
    },
    saveUser: function (user) {
      localStorageService.set('user', user);
    },
    isAuthenticated: function () {
      return !!(userProfile && accessToken);
    },
    authenticate: function (user, token) {
      userProfile = user;
      accessToken = token;
      localStorageService.set('user', userProfile); //NEEDS TEST
      localStorageService.set('token', accessToken); //NEEDS TEST
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