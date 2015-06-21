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
}])
.directive('textFill', function () {
  return {
    restrict: 'EAC',
    compile: function ($element) {
      var content = '<span class="text"' +
                          ' style="word-wrap: break-word;">' +
                       $element[0].innerHTML + 
                    '</span>';
      $element[0].innerHTML = content;
      return function link($scope, $elem, $attr) {
        var elem = $elem[0],
            minFontSize = $attr.minFontSize || 6,
            text = elem.querySelector('.text'),
            maxWidth = elem.offsetWidth,
            maxHeight = elem.offsetHeight;
        


        var resizeFont = function () {
          var fontSize = parseInt($attr.maxFontSize, 10) || 30,
              normalFS = parseInt($attr.wsNormalAt, 10) || fontSize,
              textWidth,
              textHeight,
              overflow;
          elem.classList.remove('vertical-center');
          do {
            elem.style.whiteSpace = (fontSize <= normalFS) ? 'normal' : '';
            elem.style.lineHeight = (fontSize <= 13) ? '15px' : '';
            text.style.fontSize = fontSize + 'px';
            textWidth = text.offsetWidth;
            textHeight = text.offsetHeight;
            fontSize -= 1;
            overflow = (fontSize > 18) ? 
              (textWidth > maxWidth) :
              (textHeight > maxHeight || textWidth > maxWidth);
          } while (overflow && fontSize >= minFontSize);
          elem.classList.add('vertical-center');
        };
        // resize font whenever text changes
        $scope.$watch(function () {
          return text.innerHTML;
        }, resizeFont);
      };
    }
  };
});