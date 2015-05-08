'use strict';

angular.module('voteit.profile', [
  'ionic',
  'voteit.auth',
  'voteit.profile.recentPolls',
  'voteit.profile.recentVotes'
])

.config(function ($stateProvider) {
  $stateProvider.state('tab.tab-profile-profile', {
    url: '/tab-profile/profile/:me',
    params: {user: null},
    views: {
      'tab-profile': {
        templateUrl: 'app/profile/profile.html',
        controller: 'ProfileCtrl as ctrl'
      }
    }
  });
  $stateProvider.state('tab.tab-home-profile', {
    params: {user: null},
    views: {
      'tab-home': {
        templateUrl: 'app/profile/profile.html',
        controller: 'ProfileCtrl as ctrl'
      }
    }
  });
})

.controller('ProfileCtrl', [
  'auth',
  'User',
  '$scope',
  '$stateParams',
  '$ionicTabsDelegate',
function (auth, User, $scope, $stateParams, $ionicTabsDelegate) {
  var self = this;

  self.profileName = '';
  self.showSetting = false;
  self.isMyProfile = false;

  console.log($stateParams);

  if ($stateParams.me === 'me') {
    self.profileName = User.getMe().name;
    self.showSetting = true;
    self.isMyProfile = true;
  } else {
    self.profileName = $stateParams.user.name;
    self.isMyProfile = 
      ($stateParams.user.id === User.getMe().id) ? true : false;
  }

  // self.tabs = {
  //   selected: 0
  // };

  // self.selectTab = function (index) {
  //   $ionicTabsDelegate.$getByHandle('custom-tabs-handle').select(index);
  //   self.tabs.selected = index;
  // };

  // $scope.$on('$ionicView.beforeEnter', function () {
  //   if (ionic.Platform.isAndroid()) {
  //     $scope.$emit('tab.show');
  //   }
  // });

}]);