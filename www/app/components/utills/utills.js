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
});