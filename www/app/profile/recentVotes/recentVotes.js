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
  '$timeout',
  '$ionicScrollDelegate',
function ($scope, Restangular, auth, dataService, $timeout, $ionicScrollDelegate) {

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
    var start = Date.now();
    Polls.getList(query).then(function (polls) {
      var queryTime = Date.now() - start;
      self.noMoreData = (polls.length === 0);
      if (refresh) {
        $timeout(function () {
          self.polls = polls;
          $scope.$broadcast('scroll.refreshComplete');
          dataService.setData('myVotes', self.polls);
        }, queryTime > 700 ? 0 : 700 - queryTime); // wait atleast 700 ms
      } else {
        self.polls = self.polls.concat(polls);
        $scope.$broadcast('scroll.infiniteScrollComplete');
        dataService.setData('myVotes', self.polls);
      }
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