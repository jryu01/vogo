'use strict';

angular.module('voteit.login', [
  'ionic',
  'ngCordova',
  'voteit.config'
])

.config(function ($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'app/login/login.html',
    controller: 'LoginCtrl as ctrl'
  });
})

.controller('LoginCtrl', [
  '$cordovaOauth', 
  '$ionicHistory',
  '$state',
  '$http',
  'auth',
  'config',
function ($cordovaOauth, $ionicHistory, $state, $http, auth, config) {

  var self = this;

  self.facebookLogin = function () {
    $cordovaOauth
      .facebook(config.fbAppId, ['email','user_friends'])
      .then(function (result) {
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
        $state.go('tab.home', {}, { location: 'replace', reload: true });
      });
        //TODO: handle error
  };
}]);