'use strict';

angular.module('voteit.tab.userlist', [])

.config(function ($stateProvider) {
  $stateProvider.state('tab.tab-home-userlist', {
    url: '/tab-home/userlist',
    params: { userId: '', pollId: '', answer: '', type: '' },
    views: {
      'tab-home': {
        templateUrl: 'app/tab/userlist/userlist.html',
        controller: 'UserlistCtrl as userlist'
      }
    }
  });
  $stateProvider.state('tab.tab-profile-userlist', {
    url: '/tab-profile/userlist',
    params: { userId: '', pollId: '', answer: '', type: '' },
    views: {
      'tab-profile': {
        templateUrl: 'app/tab/userlist/userlist.html',
        controller: 'UserlistCtrl as userlist'
      }
    }
  });
})

.controller('UserlistCtrl', [
  'User',
  'Polls',
  '$stateParams', 
  '$q',
function (User, Polls, $stateParams, $q) {
  var self = this,
      type = $stateParams.type,
      promise;

  self.users = [];
  self.me = User.getMe();
  self.title = type.charAt(0).toUpperCase() + type.slice(1);

  switch (type) {
  case 'following':
    promise =  User.getFollowing($stateParams.userId, 0);
    break;
  case 'followers':
    promise =  User.getFollowers($stateParams.userId, 0);
    break;
  case 'voters':
    promise =  Polls.getVoters($stateParams.pollId, $stateParams.answer, 0);
    break;
  default: 
    promise = $q.reject(new Error ('Unknown userlist type'));
  }

  //TODO: Infinite scroll
  promise.then(function (users) {
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
}]);