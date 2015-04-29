'use strict';

angular.module('voteit.comments', [])

.config(function ($stateProvider) {
  $stateProvider.state('tab.tab-home-comments', {
    url: '/tab-home/comments',
    params: {poll: null},
    views: {
      'tab-home': {
        templateUrl: 'app/comments/comments.html',
        controller: 'CommentsCtrl as ctrl'
      }
    }
  });
})

.controller('CommentsCtrl', [
  '$scope',
  'Polls',
  '$stateParams', 
function ($scope, Polls, $stateParams) {
  var self = this,
      poll = $stateParams.poll;
  self.comments = [];
  self.newComment = '';

  poll.getList('comments').then(function (comments) {
    self.comments = comments;
  });

  self.addComment = function () {
    if (self.newComment) {
      poll.post('comments', {text: self.newComment}).then(function (c) {
        poll.numComments += 1;
        self.comments.push(c); 
      });
      self.newComment = '';
    }
  };

  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.$emit('tab.hide');
  });
}]);