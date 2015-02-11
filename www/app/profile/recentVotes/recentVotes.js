'use strict';

angular.module('voteit.profile.recentVotes', [
  'ionic',
  'restangular',
  'voteit.pollCard',
  'voteit.auth'
])

.config(function ($stateProvider) {
  $stateProvider.state('tab.profile.recent-votes', {
    url: '',
    templateUrl: 'app/profile/recentVotes/recentVotes.html',
    controller: 'RecentVotesCtrl as ctrl'
  });
})

.controller('RecentVotesCtrl', [
  '$scope',
  'Restangular',
  'auth',
function ($scope, Restangular, auth) {

  var self = this;
  var Polls = Restangular.all('polls');
  var currentUser = auth.getUser();

  self.polls = [];
  self.noMoreData = false;

  self.fetchVotedPolls = function (refresh) {
    var query = { voterId: currentUser.id };
    if (!refresh && self.polls.length > 0) {
      query.votedBefore = self.polls[self.polls.length -1 ].votes[0].createdAt;
    }
    Polls.getList(query).then(function (polls) {
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
  self.fetchVotedPolls(true);
}]);