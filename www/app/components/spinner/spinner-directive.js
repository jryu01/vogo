'use strict';
/* jshint unused: false */

angular.module('voteit.spinner', [])
  .directive('voSpinner', [function() {
    return {
      template: '<div class="text-center">' +
               '  <i class="icon ion-loading-d"' +
               '    style="font-size: 30px; color: #666666;">' +
               '  </i>' +
               '</div>',
      restrict: 'EA'
    };
}]);