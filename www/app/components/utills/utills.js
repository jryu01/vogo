'use strict';

angular.module('utills', [

])

.directive('blurMe', function($timeout, $parse) {
  return {
    link: function(scope, element, attrs) {
      var model = $parse(attrs.blurMe);
      scope.$watch(model, function(value) {
        if(value === true) { 
          $timeout(function() {
            element[0].blur(); 
          });
        }
      });
      // set attribute value to 'false' on blur event:
      element.bind('blur', function() {
         scope.$apply(model.assign(scope, false));
      });
    }
  };
})

.directive('focusMe', function($timeout, $parse) {
  return {
    link: function(scope, element, attrs) {
      var model = $parse(attrs.focusMe);
      scope.$watch(model, function(value) {
        if(value === true) { 
          $timeout(function() {
            element[0].focus(); 
          });
        }
      });
      // set attribute value to 'false' on focus event:
      element.bind('focus', function() {
         scope.$apply(model.assign(scope, false));
      });
    }
  };
})

.directive('textFill', function () {
  /*
    Automatically resize text fonts to fill the div. 
    Usage: 
    <div  text-fill
          max-font-size="28"
          min-font-size="9"
          ws-normal-at="18"> 
  */
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