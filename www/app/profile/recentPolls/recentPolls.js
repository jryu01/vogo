'use strict';

angular.module('voteit.profile.recentPolls', [
  'ionic',
  'restangular',
  'voteit.pollCard'
])

.config(function ($stateProvider) {
  
  $stateProvider.state('tab.profile-recent-polls', {
    url: '/recent-polls',
    views: {
      'tab-profile': {
        templateUrl: 'app/profile/recentPolls/recentPolls.html',
        controller: 'RecentPollsCtrl as ctrl'
      }
    }
  });
})

.controller('RecentPollsCtrl', [
  '$scope', 
  'Restangular', 
function ($scope, Restangular) {

  var self = this;
  var myPolls = Restangular.all('me/polls');

  self.polls = [];
  self.noMoreData = false;

  var tk = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NGNhZjNhMjBmMTZjZDY5Njc1MGM5NmMiLCJleHAiOjE0MjgyODI0MzA4Njd9.FHIJ-Hb9msWPQ7aoJ64HNjOwMpfX2S-S6KeOPw5toEA';


  self.fetchPolls = function (refresh) {
    var query = {'access_token': tk};
    if (!refresh && self.polls.length > 0) {
      query.before = self.polls[self.polls.length -1].updatedAt;
    }
    myPolls.getList(query).then(function (polls) {
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