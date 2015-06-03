'use strict';

angular.module('voteit.vocard', [
  'n3-pie-chart'
])
.directive('vocard', [
  'Polls',
function (Polls) {
  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'app/components/vocard/vocard.html',
    link: function ($scope, $element, $attr) {
      var poll = $scope.poll;
      var updatePie = function (answer1, answer2) {
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
          total: answer1 + answer2 
        };
        $scope.pieData = [a2Data, a1Data];
      };
      if ($scope.poll.isVotedByMe) {
        updatePie(poll.answer1.numVotes, poll.answer2.numVotes);
      }
      $scope.vote = function (poll, answerNum) {
        Polls.vote(poll, answerNum).then(function () {
          updatePie(poll.answer1.numVotes, poll.answer2.numVotes);
        });
      };
    }
  };
}]);