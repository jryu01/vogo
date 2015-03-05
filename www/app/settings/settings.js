'use strict';

angular.module('voteit.settings', [
  'ionic',
  'restangular',
  'voteit.settings.about'
])

.config(function ($stateProvider) {
  $stateProvider.state('tab.settings', {
    url: '/settings',
    views: {
      'tab-profile': {
        templateUrl: 'app/settings/settings.html',
        controller: 'SettingsCtrl as ctrl'
      }
    }
  });
})

.controller('SettingsCtrl', [
  '$scope',
  'auth',
  '$state',
  '$cordovaEmailComposer',
  '$window',
function ($scope, auth, $state, $cordovaEmailComposer, $window) {
  var self = this;

  $scope.$on('$ionicView.beforeEnter', function () {
    if (ionic.Platform.isAndroid()) {
      $scope.$emit('tab.hide');
    }
  });

  self.openEmailComposer = function () {
    var email = {
      to: 'jaehwan.ryu@icloud.com',
      cc: '',
      subject: '',
      body: '',
      isHtml: true
    };
    $cordovaEmailComposer.open(email).then(null, function () {
      // user cancelled email
    });
  };
  
  self.signout = function () {
    auth.logout();
    $window.location.href = 'index.html';
  };
}]);