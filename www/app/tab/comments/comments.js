'use strict';

angular.module('voteit.tab.comments', [])

.config(function ($stateProvider) {
  $stateProvider.state('tab.tab-home-comments', {
    url: '/tab-home/comments',
    params: { pollId: '', poll: null },
    views: {
      'tab-home': {
        templateUrl: 'app/tab/comments/comments.html',
        controller: 'CommentsCtrl as ctrl'
      }
    }
  });
  $stateProvider.state('tab.tab-profile-comments', {
    url: '/tab-profile/comments',
    params: { pollId: '', poll: null },
    views: {
      'tab-profile': {
        templateUrl: 'app/tab/comments/comments.html',
        controller: 'CommentsCtrl as ctrl'
      }
    }
  });
})

.controller('CommentsCtrl', [
  '$scope',
  'Polls',
  '$stateParams', 
  '$ionicScrollDelegate',
function ($scope, Polls, $stateParams, $ionicScrollDelegate) {
  var self = this,
      poll = $stateParams.poll;
  self.comments = [];
  self.newComment = '';

  Polls.getComments(poll, 0, 99999).then(function (comments) {
    self.comments = comments;
  });

  self.addComment = function () {
    if (self.newComment) {
      Polls.comment(poll, self.newComment).then(function (c) {
        poll.numComments += 1;
        self.comments.push(c); 
        $ionicScrollDelegate.scrollBottom(true);
      });
      self.newComment = '';
    }
  };
  self.scrollBottom = function () {
    $ionicScrollDelegate.scrollBottom(true);
  };

  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.$emit('tab.hide');
  });
  $scope.$on('$ionicView.beforeLeave', function () {
    $scope.$emit('tab.show');
  });
}]);