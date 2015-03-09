'use strict';

angular.module('voteit.settings.about', [])

.config(function ($stateProvider) {
  $stateProvider.state('tab.about', {
    url: '/about',
    views: {
      'tab-profile': {
        templateUrl: 'app/settings/about/about.html',
        controller: 'AboutCtrl as ctrl'
      }
    }
  });
})

.controller('AboutCtrl', [
  '$cordovaEmailComposer',
  'config',
function ($cordovaEmailComposer, config) {
  var self = this;

  self.version = config.version;
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
  
}]);