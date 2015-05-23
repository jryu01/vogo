'use strict';

angular.module('voteit.tab.userlist', [])

.config(function ($stateProvider) {
  $stateProvider.state('tab.tab-home-userlist', {
    url: '/tab-home/userlist',
    params: { userId: '', type: '' },
    views: {
      'tab-home': {
        templateUrl: 'app/tab/userlist/userlist.html',
        controller: 'UserlistCtrl as userlist'
      }
    }
  });
  $stateProvider.state('tab.tab-profile-userlist', {
    url: '/tab-profile/userlist',
    params: { userId: '', type: '' },
    views: {
      'tab-profile': {
        templateUrl: 'app/tab/userlist/userlist.html',
        controller: 'UserlistCtrl as userlist'
      }
    }
  });
})

.controller('UserlistCtrl', [
  '$scope',
  'User',
  '$stateParams', 
function ($scope, User, $stateParams) {
  var self = this,
      uid = $stateParams.userId,
      type = $stateParams.type,
      funcName;

  self.users = [];
  self.me = User.getMe();
  self.title = type.charAt(0).toUpperCase() + type.slice(1);

  if (type === 'following') {
    funcName = 'getFollowing';
  } else if (type === 'followers') {
    funcName = 'getFollowers';
  }
  //TODO: Infinite scroll and limit to 100
  User[funcName](uid).then(function (users) {
    self.users = users;
  });

  self.follow = function (user) {
    User.follow(user.userId).then(function () {
      user.following = true;
    });
  };

  self.unfollow = function (user) {
    User.unfollow(user.userId).then(function () {
      user.following = false;
    });
  };

  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.$emit('tab.hide');
  });
  $scope.$on('$ionicView.beforeLeave', function () {
    $scope.$emit('tab.show');
  });
}]);