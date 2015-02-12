'use strict';

angular.module('voteit.profile.recentPolls', [
  'ionic',
  'restangular',
  'voteit.pollCard'
])

.controller('RecentPollsCtrl', [
  '$scope', 
  'Restangular', 
function ($scope, Restangular) {

  var self = this;
  var MyPolls = Restangular.all('me/polls');

  self.polls = [];
  self.noMoreData = false;

  self.fetchPolls = function (refresh) {
    var query = {};
    if (!refresh && self.polls.length > 0) {
      query.before = self.polls[self.polls.length -1].updatedAt;
    }
    MyPolls.getList(query).then(function (polls) {
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
  self.fetchPolls(true);
}]);