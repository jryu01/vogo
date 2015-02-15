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
  '$scope',
  'auth',
  '$state',
  '$ionicHistory',
function ($scope, auth, $state, $ionicHistory) {
  var self = this;

  $scope.$on('$ionicView.beforeEnter', function () {
    if (ionic.Platform.isAndroid()) {
      $scope.$emit('tab.hide');
    }
  });
  $scope.$on('$ionicView.beforeLeave', function () {
    if (ionic.Platform.isAndroid()) {
      $scope.$emit('tab.show');
    }
  });
  
  self.signout = function () {
    auth.logout();
    $ionicHistory.nextViewOptions({ 
      disableBack: true,
      disableAnimate: true
    });
    $state.go('login', {}, {location: 'replace', reload: true});
  };
}]);