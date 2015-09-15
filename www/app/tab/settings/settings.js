'use strict';

angular.module('voteit.tab.settings', [])

.config(function ($stateProvider) {
  $stateProvider.state('tab.tab-profile-settings', {
    url: '/tab-profile/settings',
    views: {
      'tab-profile': {
        templateUrl: 'app/tab/settings/settings.html',
        controller: 'SettingsCtrl as ctrl'
      }
    }
  });
})

.controller('SettingsCtrl', [
  '$scope',
  'User',
  '$cordovaEmailComposer',
  '$window',
function ($scope, User, $cordovaEmailComposer, $window) {
  var self = this;

  self.openEmailComposer = function () {
    var email = {
      to: 'letsvogo@gmail.com',
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
    User.signout().then(function () {
      $window.location.href = 'index.html';
    });
  };
}]);