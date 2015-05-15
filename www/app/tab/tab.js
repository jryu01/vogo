'use strict';

angular.module('voteit.tab', [
  'voteit.tab.comments',
  'voteit.tab.home',
  'voteit.tab.profile',
  'voteit.tab.settings',
  'voteit.tab.about'
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

.controller('TabController', [
  '$scope', 
  '$ionicHistory',
  '$state',
function ($scope, $ionicHistory, $state) {
  var self = this;  

  self.hideTab = false;

  self.go = function (to, params, options) {
    // stateName in the form of tab.tab-name-toStateName
    var stateName = $ionicHistory.currentView().stateName,
        tabName = stateName.substring(4, stateName.indexOf('-', 8));

    $state.go(to = 'tab.' + tabName + '-' + to, params, options);
  };

  $scope.$on('tab.hide', function () {
    self.hideTab = true;
  });
  $scope.$on('tab.show', function () {
    self.hideTab = false;
  });
  
}]);