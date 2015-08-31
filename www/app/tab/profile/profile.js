'use strict';

angular.module('voteit.tab.profile', [
  'voteit.tab.profile.recentPolls',
  'voteit.tab.profile.recentVotes'
])

.config(function ($stateProvider) {
  $stateProvider.state('tab.tab-profile-profile', {
    url: '/tab-profile/profile/:myId',
    params: { id: '', user: null },
    views: {
      'tab-profile': {
        templateUrl: 'app/tab/profile/profile.html',
        controller: 'ProfileCtrl as ctrl'
      }
    }
  });

  $stateProvider.state('tab.tab-home-profile', {
    url: '/tab-home/profile',
    params: { id: '', user: null },
    views: {
      'tab-home': {
        templateUrl: 'app/tab/profile/profile.html',
        controller: 'ProfileCtrl as ctrl'
      }
    }
  });

  $stateProvider.state('tab.tab-notification-profile', {
    url: '/tab-notification/profile',
    params: { id: '', user: null },
    views: {
      'tab-notification': {
        templateUrl: 'app/tab/profile/profile.html',
        controller: 'ProfileCtrl as ctrl'
      }
    }
  });
})

.controller('ProfileCtrl', [
  'User',
  '$scope',
  '$stateParams',
function (User, $scope, $stateParams) {
  var self = this, 
      uid = $stateParams.id || $stateParams.myId;
  var init = function () {
    if ($stateParams.myId) {
      $stateParams.user = User.getMe();
      self.showSetting = true;
    }
    self.isMyProfile = (uid === User.getMe().id) ? true : false;
    self.profile = (self.isMyProfile) ? User.myProfile : {};
    self.profile.uid = uid;

    if ($stateParams.user) {
      self.profile.name = $stateParams.user.name;
      self.profile.picture = $stateParams.user.picture;
    } else {
      User.get(uid).then(function (user) {
        self.profile.name = user.name;
        self.profile.picture = user.picture;
      });
    }

    User.getFollowInfo(uid).then(function (info) {
      self.profile.numFollowing = info.numFollowing;
      self.profile.numFollowers = info.numFollowers;
      self.profile.following = info.following;
    });
  };

  self.follow = function (userId) {
    User.follow(userId).then(function () {
      self.profile.following = true;
      self.profile.numFollowers += 1;
    });
  };

  self.unfollow = function (userId) {
    User.unfollow(userId).then(function () {
      self.profile.following = false;
      self.profile.numFollowers -= 1;
    });
  };

  self.selectTab = function (index) {
    $scope.$broadcast('voTabs.select', index);
  };
  $scope.$on('$ionicView.beforeEnter', init);
}])

.directive('profileInfo', [
function () {
  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'app/tab/profile/profile-info.html',
    link: function ($scope, $element, $attr) {
      $scope.active = $attr.active;
    }
  };
}])

.directive('profileShrink', [function () {

  var shrink = function(shrinkElem, amt, max) {
    amt = Math.min(max, amt);
    ionic.requestAnimationFrame(function () {
      shrinkElem.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
    });
  };
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      var starty = $scope.$eval($attr.profileShrink) || 0,
          shrinkAmt,
          maxShrinkAmt = 220,
          shrinkElem = $element[0].parentNode.querySelector('.profile-info'),
          shrinkElemHeight = shrinkElem.offsetHeight;
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

.directive('voTabs', [
function () {
  return {
    restrict: 'E',
    scope: true,
    transclude: true,
    // template: '<div class="tab-headers">' +
      // '  <div ng-repeat="tab in tabs"' +
      // '       style="z-index: 2000;"' + 
      // '       ng-click="selectTab($index)"' +
      // '       ng-class="{selected: isSelectedTab($index)}">' +
      // '     <span ng-bind="tab.title"></span>' +
      // '  </div>' +
      // '</div>' +
      // '<div ng-transclude></div> ',
    template: '<div ng-transclude></div>',
    controller: function ($scope) {
      var self = this,
          currentIndex = 0;  
      $scope.tabs = [];

      self.registerTab = function (scope) {
        $scope.tabs.push({scope: scope});
        if ($scope.tabs.length === 1) {
          $scope.selectTab(0);
        }
      };

      $scope.selectTab = function (index) {
        currentIndex = index;
        $scope.tabs.forEach(function (tab, i) {
          tab.scope.$tabSelected = currentIndex === i;
        });
      };

      $scope.$on('voTabs.select', function (e, index) {
        $scope.selectTab(index);
      });
    }
  };
}])

.directive('voTab', [
  '$compile',
function ($compile) {
  return {
    restrict: 'E',
    require: '^voTabs',
    scope: true,
    compile: function (element) {

      // Remove the contents of the element so we can compile them later, if tab is selected
      var tabContentEle = document.createElement('div');
      for (var i = 0; i < element[0].children.length; i++) {
        tabContentEle.appendChild(element[0].children[i].cloneNode(true));
      }
      tabContentEle.style.display = 'none';
      element.empty();

      return function link($scope, $element, $attr, tabsCtrl) {
        var childScope,
            childElement,
            isTabContentAttached = false;
        $scope.$tabSelected = false;
   
        tabsCtrl.registerTab($scope);   

        function tabSelected(isSelected) {
          if (isSelected) {
            // this tab is being selected

            // check if the tab is already in the DOM
            // only do this if the tab has child elements
            if (!isTabContentAttached) {
              // tab should be selected and is NOT in the DOM
              // create a new scope and append it
              childScope = $scope.$new();
              childElement = angular.element(tabContentEle);
              childElement.css({ display: 'block' });
              $element.append(childElement);
              $compile(childElement)(childScope);
              isTabContentAttached = true;
            } else if (isTabContentAttached && childElement) {
              childElement.css({ display: 'block'});
            }
          } else {
            if (childElement) {
              childElement.css({ display: 'none'});
            }
          }
        }
        $scope.$watch('$tabSelected', tabSelected);
      };
    }
  };
}]);