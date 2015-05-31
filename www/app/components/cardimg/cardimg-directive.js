'use strict';
/* jshint unused: false */

angular.module('voCardImg', [])
  .directive('voCardImg', [function() {
    return {
      template: '' + 
        '         <div class="pic1"></div>' +
        '         <div class="pic2"></div>',
      restrict: 'E',
      link: function ($scope, element, attrs) {
        var elem = element[0],
            pic1 = elem.children[0],
            pic2 = elem.children[1];

        elem.style.padding = 0;
        elem.style.display = 'flex';
        elem.style.display = '-webkit-flex';
        elem.style.width = attrs.width || '100%';
        elem.style.height = attrs.height || '300px';

        pic1.style['background-color'] = '#DDD';
        pic1.style['background-position'] = 'center center';
        pic1.style['background-repeat'] = 'no-repeat';
        pic1.style['background-size'] = 'cover';
        pic1.style.width = '50%';
        pic1.style.height = '100%';

        pic2.style['background-color'] = '#DDD';
        pic2.style['background-position'] = 'center center';
        pic2.style['background-repeat'] = 'no-repeat';
        pic2.style['background-size'] = 'cover';
        pic2.style.width = '50%';
        pic2.style.height = '100%';

        attrs.$observe('src1', function (value) {
          if (value) {
            pic1.style['background-image'] = 'url("' + value + '")';
          } else {
            pic1.style['background-image'] = '';
          }
          $scope.src1 = value; 
        }); 
        attrs.$observe('src2', function (value) {
          if (value) {
            pic2.style['background-image'] = 'url("' + value + '")';
            pic2.style['background-size'] = 'cover';
            pic2.style.width = '50%';
            pic1.style.width = '50%';
          } else {
            pic2.style['background-image'] = '';
            pic2.style.width = '0%';
            pic1.style.width = '100%';
          }
          $scope.src2 = value; 
        }); 
      }
    };
}]);

        // <div class="card">
        // <div class="item item-image row"
        //       ng-class="{ singlePic: !ctrl.newPoll.answer2.picture, 
        //         doublePic: ctrl.newPoll.answer2.picture}">
        //   <img class="col a1pic" 
        //         ng-src="{{ctrl.newPoll.answer1.picture}}">
        //   <img class="col a2pic" 
        //         ng-if="ctrl.newPoll.answer2.picture" 
        //         ng-src="{{ctrl.newPoll.answer2.picture}}">
        // </div>