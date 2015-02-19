'use strict';

angular.module('voteit.profile.recentVotes', [
  'ionic',
  'restangular',
  'voteit.pollCard',
  'voteit.auth'
])

.controller('RecentVotesCtrl', [
  '$scope',
  'Restangular',
  'auth',
  'dataService',
function ($scope, Restangular, auth, dataService) {

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
      dataService.setData('myVotes', self.polls);
    });
  };

  var init = function () {
    self.polls = dataService.getData('myVotes') || [];
    if (self.polls.length === 0) {
      self.fetchVotedPolls(true);
    } else {
      self.polls.length = 10; // limit to 10 items
    }
  };
  init();
}]);