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
  'auth',
  'config',
function ($ionicPlatform, $cordovaOauth, $ionicHistory, $state, $http, auth, config) {
  $ionicPlatform.ready(function() {
    window.StatusBar.hide();
  });
  var self = this;

  self.loading = false;

  self.facebookLogin = function () {
    $cordovaOauth
      .facebook(config.fbAppId, ['email','user_friends'])
      .then(function (result) {
        self.loading = true;
        return $http.post(config.baseUrl + '/login', {
          grantType: 'facebook',
          facebookAccessToken: result.access_token
        });
      }).then(function (response) {
        auth.authenticate(response.data.user, response.data.access_token);
        $ionicHistory.nextViewOptions({ 
          disableBack: true,
          disableAnimate: true
        });
        self.loading = false;
        window.StatusBar.show();
        $state.go('tab.home', {}, { location: 'replace', reload: true });
      });
  };
}]);