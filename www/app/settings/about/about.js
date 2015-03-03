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
function ($cordovaEmailComposer) {
  var self = this;

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
  
}]);