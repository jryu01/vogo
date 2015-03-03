'use strict';

angular.module('voteit.profile', [
  'ionic',
  'voteit.auth',
  'voteit.profile.recentPolls',
  'voteit.profile.recentVotes'
])

.config(function ($stateProvider) {
  $stateProvider.state('tab.profile', {
    url: '/profile',
    views: {
      'tab-profile': {
        templateUrl: 'app/profile/profile.html',
        controller: 'ProfileCtrl as ctrl'
      }
    }
  });
})

.controller('ProfileCtrl', [
  'auth',
  '$scope',
  '$ionicTabsDelegate',
function (auth, $scope, $ionicTabsDelegate) {
  var self = this;

  self.profileName = auth.getUser().name;

  self.tabs = {
    selected: 0
  };
  self.selectTab = function (index) {
    $ionicTabsDelegate.$getByHandle('custom-tabs-handle').select(index);
    self.tabs.selected = index;
  };

  $scope.$on('$ionicView.beforeEnter', function () {
    if (ionic.Platform.isAndroid()) {
      $scope.$emit('tab.show');
    }
  });

}]);