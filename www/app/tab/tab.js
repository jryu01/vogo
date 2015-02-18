'use strict';

angular.module('voteit.tab', [
  'ionic',
])

.config(['$stateProvider', function ($stateProvider) {

  $stateProvider

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'app/tab/tab.html',
    data: {
      requiresLogin: true
    }
  });

}])

.controller('TabController', ['$scope', function ($scope) {
  var self = this;  

  self.hideTab = false;

  $scope.$on('tab.hide', function () {
    self.hideTab = true;
  });
  $scope.$on('tab.show', function () {
    self.hideTab = false;
  });
  
}]);