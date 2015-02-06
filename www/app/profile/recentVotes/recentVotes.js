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

  self.fetchVotedPolls = function (refresh) {
    var query = {voterId: '54caf3a20f16cd696750c96c' };
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