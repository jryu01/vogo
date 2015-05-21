'use strict';

angular.module('voteit.tab.pollcard', [])

.config(function ($stateProvider) {
  $stateProvider.state('tab.tab-home-pollcard', {
    url: '/tab-home/pollcard',
    params: { id: '', poll: null },
    views: {
      'tab-home': {
        templateUrl: 'app/tab/pollcard/pollcard.html',
        controller: 'PollcardCtrl as ctrl'
      }
    }
  });
  $stateProvider.state('tab.tab-profile-pollcard', {
    url: '/tab-profile/pollcard',
    params: { id: '', poll: null },
    views: {
      'tab-profile': {
        templateUrl: 'app/tab/pollcard/pollcard.html',
        controller: 'PollcardCtrl as ctrl'
      }
    }
  });
})

.controller('PollcardCtrl', [
  '$scope',
  '$stateParams', 
  'Polls',
function ($scope, $stateParams, Polls) {
  var self = this;
  self.poll = $stateParams.poll;
  
 self.vote = function (poll, answerNum) {
    if (!poll.isVotedByMe) {
      poll['answer' + answerNum].numVotes += 1;
      poll.isVotedByMe = true;
      Polls.vote(poll, answerNum);
    }
  };
}]);