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
  '$ionicHistory',
  '$cordovaDialogs',
  '$state',
  'User',
function ($ionicHistory, $cordovaDialogs, $state, User) {
  var self = this;

  self.loading = false;

  self.facebookLogin = function () {
    self.loading = true;
    User.signin()
      .then(User.setS3Info)
      .then(function () {
        $ionicHistory.nextViewOptions({ 
          disableBack: true,
          disableAnimate: true
        });
        $state.go('tab.tab-home-home', {}, { location: 'replace', reload: true });
      }).catch(function (err) {
        User.signout();
        switch (err) {
        case 'The sign in flow was canceled':
          $cordovaDialogs
            .alert('User canceled the signin', 'Signin Canceled', 'OK');
          break;
        default: 
          $cordovaDialogs
            .alert('Signin failed', 'Error', 'OK');
        }
      }).finally(function () {
        self.loading = false;
      });
  };
}]);