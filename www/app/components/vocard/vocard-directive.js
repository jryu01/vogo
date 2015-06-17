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
      var poll = $scope.poll,
          showAnimation = false;
      var updatePie = function (answer1, answer2, duration) {
        var COLOR_BOLD = '#28225c',
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
        showAnimation = true;
        Polls.vote(poll, answerNum).then(function () {
          showAnimation = false;
        });
      };
      $scope.$watch('poll.isVotedByMe', function(newValue) {
        var duration = (showAnimation) ? 1000 : 0;
        if (newValue) {
          updatePie(poll.answer1.numVotes, poll.answer2.numVotes, duration);
        }
      });
    }
  };
}]);