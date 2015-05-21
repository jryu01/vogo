'use strict';

angular.module('voteit.tab.profile.recentPolls', [])

.controller('RecentPollsCtrl', [
  '$scope', 
  '$stateParams',
  'User',
function ($scope, $stateParams, User) {

  var self = this,
      user = $stateParams.user || User.getMe(),
      uid =  user.userId || user.id;

  self.polls = [];
  self.noMoreData = false;

  self.fetchPolls = function (refresh) {
    var lastVote = (!refresh && self.polls[self.polls.length - 1]) || {},
        done = (refresh) ? 'scroll.refreshComplete' : 
                           'scroll.infiniteScrollComplete';
    User.getPollsById(uid, lastVote.id).then(function (polls) {
      self.noMoreData = (polls.length === 0);
      self.polls = (refresh) ? polls : self.polls.concat(polls);
      $scope.$broadcast(done);
    });
  };

}]);