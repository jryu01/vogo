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
    abstract: true, // default to recent-votes view
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
  '$state',
  '$ionicHistory',
function (auth, $state, $ionicHistory) {
  var self = this;
  
  self.profileName = auth.getUser().name;

  self.signout = function () {
    auth.logout();
    $ionicHistory.nextViewOptions({ 
      disableBack: true,
      disableAnimate: true
    });
    $state.go('login', {}, {location: 'replace', reload: true});
  };
}]);