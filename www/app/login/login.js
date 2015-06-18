'use strict';

angular.module('voteit.login', [
  'ionic',
  'ngCordova',
  'voteit.config'
])

.config(function ($stateProvider) {
  $stateProvider.state('login', {
    // url: '/login',
    url: '/',
    templateUrl: 'app/login/login.html',
    controller: 'LoginCtrl as ctrl'
  });
})

.controller('LoginCtrl', [
  '$ionicPlatform',
  '$cordovaOauth', 
  '$ionicHistory',
  '$state',
  '$http',
  'User',
function ($ionicPlatform, $cordovaOauth, $ionicHistory, $state, $http, User) {
  $ionicPlatform.ready(function() {
    window.StatusBar.hide();
  });
  var self = this;

  self.loading = false;

  self.facebookLogin = function () {
    self.loading = true;
    User.signin().then(function () {
      $ionicHistory.nextViewOptions({ 
        disableBack: true,
        disableAnimate: true
      });
      window.StatusBar.show();
      $state.go('tab.tab-home-home', {}, { location: 'replace', reload: true });
    }).catch(function (err) {
      console.log(err);
    }).finally(function () {
      self.loading = false;
    });
  };
}]);