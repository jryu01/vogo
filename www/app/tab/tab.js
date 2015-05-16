'use strict';

angular.module('voteit.tab', [
  'voteit.tab.comments',
  'voteit.tab.home',
  'voteit.tab.profile',
  'voteit.tab.settings',
  'voteit.tab.about',
  'voteit.tab.pollcard'
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
  'User',
function ($scope, $ionicHistory, $state, User) {
  var self = this;  

  self.hideTab = false;
  self.me = User.getMe();

  self.go = function (to, params, options) {
    // stateName in the form of tab.tab-name-toStateName
    var stateName = $ionicHistory.currentView().stateName,
        tabName = stateName.substring(4, stateName.indexOf('-', 8));
    options = options || {};
    $state.go(to = 'tab.' + tabName + '-' + to, params, options);
  };

  self.selectProfileTab = function () {
    $state.go('tab.tab-profile-profile', { user: self.me, settings: true });
  };


  $scope.$on('tab.hide', function () {
    self.hideTab = true;
  });
  $scope.$on('tab.show', function () {
    self.hideTab = false;
  });
  
}]);