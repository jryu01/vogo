'use strict';

angular.module('voteit.profile.recentVotes', [
  'ionic',
  'restangular',
  'voteit.pollCard',
  'voteit.auth'
])

.controller('RecentVotesCtrl', [
  '$scope',
  'auth',
  'User',
  '$stateParams',
function ($scope, auth, User, $stateParams) {

  var self = this,
      user = $stateParams.user || User.getMe(),
      uid =  user.userId || user.id;

  self.votes = [];
  self.noMoreData = false;

  self.fetchVotes = function (refresh) {
    var lastVote = (!refresh && self.votes[self.votes.length - 1]) || {},
        done = (refresh) ? 'scroll.refreshComplete' : 
                           'scroll.infiniteScrollComplete';
    User.getVotesById(uid, lastVote.id).then(function (votes) {
      console.log(votes[0]._poll);
      self.noMoreData = (votes.length === 0);
      self.votes = (refresh) ? votes : self.votes.concat(votes);
      $scope.$broadcast(done);
    });
  };
}]);