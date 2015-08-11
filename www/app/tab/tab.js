'use strict';

angular.module('voteit.tab', [
  'voteit.tab.home',
  'voteit.tab.notification',
  'voteit.tab.profile',
  'voteit.tab.settings',
  'voteit.tab.about',
  'voteit.tab.polldetail',
  'voteit.tab.userlist'
])

.config(['$stateProvider', function ($stateProvider) {

  $stateProvider

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'app/tab/tab.html',
    data: {
      requiresLogin: true
    },
    controller: 'TabController as tabCtrl'
  });

}])

.controller('TabController', [
  '$scope', 
  '$ionicHistory',
  '$state',
  'User',
  'Notification',
  '$interval',
  '$ionicPlatform',
function ($scope, $ionicHistory, $state, User, Notification, $interval, $ionicPlatform) {
  var self = this;  

  self.hideTab = false;
  self.me = User.getMe();
  self.notification = Notification;

  User.registerDeviceToken();

  //fetch notification count and check every 30 seconds
  // var notifier;
  // var setNotifier = function () {
  //   Notification.checkNewNotification().catch(console.error);
  //   notifier = $interval(function () {
  //     Notification.checkNewNotification().catch(console.error);
  //   }, 30 * 1000);
  // };
  // setNotifier();

  // $ionicPlatform.on('pause', function () {
  //   $interval.cancel(notifier);
  //   notifier = undefined;
  // });

  Notification.checkNewNotification().catch(console.error);

  $ionicPlatform.on('resume', function () {
    // if (!notifier) {
    //   setNotifier();
    // }
    Notification.checkNewNotification().catch(console.error);
  });

  // $scope.$on('$destroy', function() {
  //   $interval.cancel(notifier);
  //   notifier = undefined;
  // });
  //////////////////////////////

  // register push notification event handler
  $scope.$on('$cordovaPush:notificationReceived', function (ev, notification) {
    //on android register events
    if (notification.event === 'registered' && notification.regid.length > 0) {
      return User.postAndroidToken(notification.regid);
    }

    var stateName, stateParams;

    // notification is received and opened when app is non-foreground mode
    // in which ios returns '0' and android returns false
    if (notification.foreground === '0' || notification.foreground === false) {
      notification = notification.payload || notification;

      if (notification.objectType === 'poll') {
        stateName = 'tab.tab-notification-polldetail';
        stateParams = { id: notification.objectId };
      } else if (notification.objectType === 'user') {
        stateName = 'tab.tab-notification-profile';
        stateParams = { id: notification.objectId };
      }
      if (!stateName) { return; }

      Notification.goNotificationTabWithNextState(stateName, stateParams); 
    } else {
      // when notification is recieved in foreground mode 
      // just check for new notification count
      Notification.checkNewNotification().catch(console.error);
    }
  });

  self.go = function (to, params, options) {
    // stateName in the form of tab.tab-name-toStateName
    var stateName = $ionicHistory.currentView().stateName,
        tabName = stateName.substring(4, stateName.indexOf('-', 8));
    options = options || {};
    $state.go(to = 'tab.' + tabName + '-' + to, params, options);
  };

  $scope.$on('tab.hide', function () {
    self.hideTab = true;
  });
  $scope.$on('tab.show', function () {
    self.hideTab = false;
  });
  
}]);