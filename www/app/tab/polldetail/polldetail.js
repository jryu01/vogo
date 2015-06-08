'use strict';

angular.module('voteit.tab.polldetail', [
  'n3-pie-chart'
])

.config(function ($stateProvider) {
  $stateProvider.state('tab.tab-home-polldetail', {
    url: '/tab-home/polldetail',
    params: { id: '', poll: null },
    views: {
      'tab-home': {
        templateUrl: 'app/tab/polldetail/polldetail.html',
        controller: 'PollcardCtrl as ctrl'
      }
    }
  });
  $stateProvider.state('tab.tab-profile-polldetail', {
    url: '/tab-profile/polldetail',
    params: { id: '', poll: null },
    views: {
      'tab-profile': {
        templateUrl: 'app/tab/polldetail/polldetail.html',
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
  $scope.poll = $stateParams.poll;
  var poll = $scope.poll;

  var updatePie = function (answer1, answer2, duration) {
    var COLOR_BOLD = '#1E1532',
        COLOR_LIGHT = '#CDCCD3',
        a1Data = {label: 'answer1', value: answer1},
        a2Data = {label: 'answer2', value: answer2};
    $scope.pieData = [];
    $scope.pieOptions = {};
    a1Data.isBig = answer1 > answer2;
    a2Data.isBig = !a1Data.isBig;
    a1Data.color = (a1Data.isBig) ? COLOR_BOLD : COLOR_LIGHT;
    a2Data.color = (a2Data.isBig) ? COLOR_BOLD : COLOR_LIGHT;
    $scope.pieOptions = {
      thickness: 200, 
      mode: 'gauge', 
      total: answer1 + answer2,
      duration: duration
    };
    $scope.pieData = [a2Data, a1Data];
  };

  if ($scope.poll.isVotedByMe) {
    updatePie(poll.answer1.numVotes, poll.answer2.numVotes);
  }

  $scope.vote = function (poll, answerNum) {
    Polls.vote(poll, answerNum).then(function () {
      updatePie(poll.answer1.numVotes, poll.answer2.numVotes, 1000);
    });
  };

}]);