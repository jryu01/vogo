'use strict';

angular.module('voteit.home', [
  'ionic'
])

.config(function ($stateProvider) {
  $stateProvider.state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'app/home/home.html',
        controller: 'HomeCtrl as ctrl'
      }
    }
  });
})

.controller('HomeCtrl', [function () {

}]);