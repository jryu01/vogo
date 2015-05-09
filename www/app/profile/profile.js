'use strict';

angular.module('voteit.profile', [
  'ionic',
  'voteit.auth',
  'voteit.profile.recentPolls',
  'voteit.profile.recentVotes'
])

.config(function ($stateProvider) {
  $stateProvider.state('tab.tab-profile-profile', {
    url: '/tab-profile/profile/:me',
    params: {user: null},
    views: {
      'tab-profile': {
        templateUrl: 'app/profile/profile.html',
        controller: 'ProfileCtrl as ctrl'
      }
    }
  });
  $stateProvider.state('tab.tab-home-profile', {
    params: {user: null},
    views: {
      'tab-home': {
        templateUrl: 'app/profile/profile.html',
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
function (auth, User, $scope, $stateParams, $ionicTabsDelegate) {
  var self = this, 
      me = User.getMe(),
      uid = '';

  self.profile = {};
  self.showSetting = false;
  self.isMyProfile = false;

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
  init();

  // .then(function (user) {
  //   // self.user = user;
  // });

  // self.tabs = {
  //   selected: 0
  // };

  // self.selectTab = function (index) {
  //   $ionicTabsDelegate.$getByHandle('custom-tabs-handle').select(index);
  //   self.tabs.selected = index;
  // };

  // $scope.$on('$ionicView.beforeEnter', function () {
  //   if (ionic.Platform.isAndroid()) {
  //     $scope.$emit('tab.show');
  //   }
  // });

}])
.directive('profileShrink', [function () {

  var shrink = function(header, amt, max) {
    amt = Math.min(max, amt);
    ionic.requestAnimationFrame(function () {
      header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
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
          header = ionContent.querySelector('.profile-info'),
          headerHeight = header.offsetHeight;
      
      $element.bind('scroll', function (e) {
        var scrollTop = null;
        if (e.detail) {
          scrollTop = e.detail.scrollTop;
        } else if (e.target) {
          scrollTop = e.target.scrollTop;
        }
        if (scrollTop > starty) {
          // Start shrinking
          shrinkAmt = headerHeight - Math.max(0, (starty + headerHeight) - scrollTop);
          shrink(header, shrinkAmt, maxShrinkAmt);
        } else {
          shrink(header, 0, maxShrinkAmt);
        }
      });
    }
  };
}]);