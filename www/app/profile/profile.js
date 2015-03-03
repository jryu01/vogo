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
function (auth, $scope) {
  var self = this;

  self.profileName = auth.getUser().name;

  $scope.$on('$ionicView.beforeEnter', function () {
    if (ionic.Platform.isAndroid()) {
      $scope.$emit('tab.show');
    }
  });

}]);