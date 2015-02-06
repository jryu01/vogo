'use strict';
/* jshint unused: false */

angular.module('voteit.pollCard', [])
  .directive('voPollCard', [function() {
    return {
      templateUrl: 'app/components/pollcard/pollcard.html',
      restrict: 'AE',
      scope: {
        pollData: '='
      },
      link: function ($scope, $element, $attr) {
        $scope.getRatioOne = function (poll) {
          if (poll.totalNumVotes === 0) {
            return 0;
          }
          return poll.subject1.numVotes / poll.totalNumVotes;
        };
        $scope.getRatioTwo = function (poll) {
          if (poll.totalNumVotes === 0) {
            return 0;
          }
          return poll.subject2.numVotes / poll.totalNumVotes;
        };
      }
    };
}]);