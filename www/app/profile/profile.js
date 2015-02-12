'use strict';

angular.module('voteit.profile', [
  'ionic',
  'voteit.auth',
  'voteit.profile.recentPolls',
  'voteit.profile.recentVotes',
  'voteit.profile.settings'
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
function (auth) {
  var self = this;

  self.profileName = auth.getUser().name;
  self.selectedTab = 'myVotes';

  self.selectTab = function (tabName) {
    self.selectedTab = tabName;
  };
}]);