'use strict';

angular.module('voteit.profile.recentVotes', [
  'ionic',
  'restangular',
  'voteit.pollCard'
])

.config(function ($stateProvider) {
  $stateProvider.state('tab.profile-recent-votes', {
    url: '/recent-votes',
    views: {
      'tab-profile': {
        templateUrl: 'app/profile/recentVotes/recentVotes.html',
        controller: 'RecentVotesCtrl as ctrl'
      }
    }
  });
})

.controller('RecentVotesCtrl', [
  '$scope',
  'Restangular', 
function ($scope, Restangular) {

  var self = this;
  var polls = Restangular.all('polls');

  self.polls = [];
  self.noMoreData = false;

  var tk = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NGNhZjNhMjBmMTZjZDY5Njc1MGM5NmMiLCJleHAiOjE0MjgyODI0MzA4Njd9.FHIJ-Hb9msWPQ7aoJ64HNjOwMpfX2S-S6KeOPw5toEA';

  self.fetchVotedPolls = function (refresh) {
    var query = {'access_token': tk, voterId: '54caf3a20f16cd696750c96c' };
    if (!refresh && self.polls.length > 0) {
      query.votedBefore = self.polls[self.polls.length -1].votes[0].createdAt;
    }
    polls.getList(query).then(function (polls) {
      self.noMoreData = (polls.length === 0);
      if (refresh) {
        self.polls = polls;
        $scope.$broadcast('scroll.refreshComplete');
      } else {
        self.polls = self.polls.concat(polls);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    });
  };
}]);