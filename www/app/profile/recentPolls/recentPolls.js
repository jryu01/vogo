'use strict';

angular.module('voteit.profile.recentPolls', [
  'ionic',
  'restangular',
  'voteit.pollCard'
])

.controller('RecentPollsCtrl', [
  '$scope', 
  'Restangular',
  'dataService', 
function ($scope, Restangular, dataService) {

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
      dataService.setData('myPolls', self.polls);
    });
  };
  var init = function () {
    self.polls = dataService.getData('myPolls') || [];
    if (self.polls.length === 0) {
      self.fetchPolls(true);
    } else {
      self.polls.length = 10; // limit to 10 items
    }
  };
  init();
}]);