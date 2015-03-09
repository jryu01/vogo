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
  '$timeout',
function ($scope, Restangular, dataService, $timeout) {

  var self = this;
  var MyPolls = Restangular.all('me/polls');

  self.polls = [];
  self.noMoreData = false;

  self.fetchPolls = function (refresh) {
    var query = {};
    if (!refresh && self.polls.length > 0) {
      query.before = self.polls[self.polls.length -1].updatedAt;
    }
    var start = Date.now();
    MyPolls.getList(query).then(function (polls) {
      var queryTime = Date.now() - start;
      self.noMoreData = (polls.length === 0);
      if (refresh) {
        $timeout(function () {
          self.polls = polls;
          $scope.$broadcast('scroll.refreshComplete');
        }, queryTime > 700 ? 0 : 700 - queryTime); // wait atleast 700 ms
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