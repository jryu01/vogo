'use strict';

angular.module('voteit.vocard', [
  'utills',
  'n3-pie-chart'
])
.directive('vocard', [
  'Polls',
function (Polls) {
  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'app/components/vocard/vocard.html',
    link: function ($scope) {
      var poll = $scope.poll;

      var updatePie = function (answer1, answer2, duration) {
        var COLOR_BOLD = '#A5D5F4',
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

      $scope.vote = function (poll, answerNum) {
        if (!poll.isVotedByMe) {
          Polls.vote(poll, answerNum);
          $scope.$emit('vocard:updatePie', 1000);
        }
      };

      $scope.$on('vocard:updatePie', function (ev, duration) {
        updatePie(poll.answer1.numVotes, poll.answer2.numVotes, duration || 0);
      });
    }
  };
}]);