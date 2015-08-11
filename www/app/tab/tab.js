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

  self.me = User.getMe();
  self.notification = Notification;

  User.registerDeviceToken();

  //fetch notification count
  Notification.checkNewNotification().catch(console.error);

  $ionicPlatform.on('resume', function () {
    Notification.checkNewNotification().catch(console.error);
  });

  // register push notification event handler
  $scope.$on('$cordovaPush:notificationReceived', function (ev, notification) {

    var stateName, stateParams;

    //on android register events
    if (notification.event === 'registered' && notification.regid.length > 0) {
      return User.postAndroidToken(notification.regid);
    }
    
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
  
  // top level nagivate function
  self.go = function (to, params, options) {
    // stateName in the form of tab.tab-name-toStateName
    var stateName = $ionicHistory.currentView().stateName,
        tabName = stateName.substring(4, stateName.indexOf('-', 8));
    options = options || {};
    $state.go(to = 'tab.' + tabName + '-' + to, params, options);
  };

}]);