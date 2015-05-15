'use strict';

angular.module('voteit.tab.profile', [
  'ionic',
  'voteit.auth',
  'voteit.tab.profile.recentPolls',
  'voteit.tab.profile.recentVotes'
])

.config(function ($stateProvider) {
  $stateProvider.state('tab.tab-profile-profile', {
    url: '/tab-profile/profile/:me',
    params: {user: null},
    views: {
      'tab-profile': {
        templateUrl: 'app/tab/profile/profile.html',
        controller: 'ProfileCtrl as ctrl'
      }
    }
  });
  $stateProvider.state('tab.tab-home-profile', {
    params: {user: null},
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
      me = User.getMe(),
      uid = '';

  self.profile = {};
  self.showSetting = false;
  self.isMyProfile = false;
  self.tabs = {
    selected: 0
  };

  var init = function () {
    if ($stateParams.me === 'me') {
      // entered by clicking profile tab
      uid = me.id;
      self.profile.name = me.name;
      self.profile.picture = me.picture;
      self.showSetting = true;
      self.isMyProfile = true;
    } else {
      uid = $stateParams.user.userId;
      self.profile.name = $stateParams.user.name;
      self.profile.picture = $stateParams.user.picture;
      self.isMyProfile = 
        ($stateParams.user.userId === User.getMe().id) ? true : false;
    }

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
}]);