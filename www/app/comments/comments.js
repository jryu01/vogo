'use strict';

angular.module('voteit.comments', [])

.config(function ($stateProvider) {
  $stateProvider.state('tab.tab-home-comments', {
    url: '/tab-home/comments',
    views: {
      'tab-home': {
        templateUrl: 'app/comments/comments.html',
        controller: 'CommentsCtrl as ctrl'
      }
    }
  });
})

.controller('CommentsCtrl', [function () {

}]);