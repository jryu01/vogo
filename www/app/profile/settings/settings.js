'use strict';

angular.module('voteit.profile.settings', [
  'ionic',
  'restangular',
])

.config(function ($stateProvider) {
  $stateProvider.state('tab.settings', {
    url: '/settings',
    views: {
      'tab-profile': {
        templateUrl: 'app/profile/settings/settings.html',
        controller: 'SettingsCtrl as ctrl'
      }
    }
  });
})

.controller('SettingsCtrl', [
  'auth',
  '$state',
  '$ionicHistory',
function (auth, $state, $ionicHistory) {
  var self = this;

  self.signout = function () {
    auth.logout();
    $ionicHistory.nextViewOptions({ 
      disableBack: true,
      disableAnimate: true
    });
    $state.go('login', {}, {location: 'replace', reload: true});
  };
}]);