'use strict';

angular.module('voteit.tab.profile', [
  'ionic',
  'voteit.auth',
  'voteit.tab.profile.recentPolls',
  'voteit.tab.profile.recentVotes'
])

.config(function ($stateProvider) {
  $stateProvider.state('tab.tab-profile-profile', {
    url: '/tab-profile/profile',
    params: { user: null, settings: false },
    views: {
      'tab-profile': {
        templateUrl: 'app/tab/profile/profile.html',
        controller: 'ProfileCtrl as ctrl'
      }
    }
  });

  $stateProvider.state('tab.tab-home-profile', {
    url: '/tab-home/profile',
    params: { user: null },
    views: {
      'tab-home': {
        templateUrl: 'app/tab/profile/profile.html',
        controller: 'ProfileCtrl as ctrl'
      }
    }
  });
})

.controller('ProfileCtrl', [
  'auth',
  'User',
  '$scope',
  '$stateParams',
  '$ionicTabsDelegate',
  '$ionicScrollDelegate',
function (auth, User, $scope, $stateParams, $ionicTabsDelegate, $ionicScrollDelegate) {
  var self = this, 
      uid = '';

  var init = function () {
    self.tabs = {
      selected: 0
    };
    uid = $stateParams.user.userId || $stateParams.user.id;
    self.profile = {};
    self.profile.name = $stateParams.user.name;
    self.profile.picture = $stateParams.user.picture;
    self.showSetting = $stateParams.settings;
    self.isMyProfile = (uid === User.getMe().id) ? true : false;

    User.getProfileByUserId(uid).then(function (profile) {
      self.profile = profile;
    });
  };

  var setScrollPosition = function () {
    var pollScroll = $ionicScrollDelegate.$getByHandle('pollScroll'),
        voteScroll = $ionicScrollDelegate.$getByHandle('voteScroll');
      voteScroll.scrollTop();
      pollScroll.scrollTop();
  };

  self.selectTab = function (index) {
    setScrollPosition(index);
    $ionicTabsDelegate.$getByHandle('custom-tabs-handle').select(index);
    self.tabs.selected = index;
  };

  init();

}])
.directive('profileShrink', [function () {

  var shrink = function(shrinkElem, amt, max) {
    amt = Math.min(max, amt);
    ionic.requestAnimationFrame(function () {
      shrinkElem.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
    });
  };
  var getParentIonContent = function (elem) {
    var node = elem[0].parentNode;
    while (node.nodeName.toLowerCase() !== 'ion-content') {
      node = node.parentNode;
    }
    return node;
  };
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      var starty = $scope.$eval($attr.profileShrink) || 0,
          shrinkAmt,
          maxShrinkAmt = 220,
          ionContent = getParentIonContent($element),
          shrinkElem = ionContent.querySelector('.profile-info'),
          shrinkElemHeight = shrinkElem.offsetHeight;
          // contentHeight = $element[0].offsetHeight;

      // $element[0].querySelector('.scroll').style['min-height'] = (contentHeight + maxShrinkAmt) + 'px';
      
      $element.bind('scroll', function (e) {
        var scrollTop = null;
        if (e.detail) {
          scrollTop = e.detail.scrollTop;
        } else if (e.target) {
          scrollTop = e.target.scrollTop;
        }
        if (scrollTop > starty) {
          // Start shrinking
          shrinkAmt = shrinkElemHeight - Math.max(0, shrinkElemHeight - scrollTop);
          shrink(shrinkElem, shrinkAmt, maxShrinkAmt);
        } else {
          shrink(shrinkElem, 0, maxShrinkAmt);
        }
      });
    }
  };
}])

.factory('voTabsDelegate', [function () {
  return {};
}])
.directive('voTabs', [
  'voTabsDelegate',
function (voTabsDelegate) {
  return {
    restrict: 'E',
    scope: true,
    transclude: true,
    template: '<div class="tab-headers">' +
      '  <div ng-repeat="tab in tabs"' +
      '       style="z-index: 2000;"' + 
      '       ng-click="selectTab($index)"' +
      // '       ng-class="{selected: isSelectedTab($index)}">' +
      '     <span ng-bind="tab.title"></span>' +
      '  </div>' +
      '</div>' +
      '<div ng-transclude></div> ',
    controller: function ($scope) {
      var self = this,
          currentIndex = 0;  
      $scope.tabs = [];

      self.registerTab = function (title, scope) {
        if ($scope.tabs.length === 0) {
          scope.$element.css({ display: 'block'});
        } else {
          scope.$element.css({ display: 'none'});
        }
        $scope.tabs.push({title: title, scope: scope});
      };

      $scope.selectTab = function (index) {
        currentIndex = index;
        $scope.tabs.forEach(function (tab, i) {
          var display = (currentIndex === i) ? 'block': 'none';
          tab.scope.$element.css({ display: display });
        });
      };
    }
  };
}])

.directive('voTab', [
function () {
  return {
    restrict: 'E',
    transclude: true,
    template: '<div ng-transclude><div>',
    require: '^voTabs',
    scope: true,
    link: function ($scope, $element, $attr, tabCtrl) {
      $scope.$element = $element;
      tabCtrl.registerTab($attr.title, $scope);   
    }
  };
}]);