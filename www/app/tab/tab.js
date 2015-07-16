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

  // register device token
  User.registerDeviceToken();

  //fetch notification count and check every 30 seconds
  var notifier;
  var setNotifier = function () {
    Notification.checkNewNotification().catch(console.error);
    notifier = $interval(function () {
      Notification.checkNewNotification().catch(console.error);
    }, 30 * 1000);
  };
  setNotifier();

  $ionicPlatform.on('pause', function () {
    $interval.cancel(notifier);
    notifier = undefined;
  });

  $ionicPlatform.on('resume', function () {
    if (!notifier) {
      setNotifier();
    }
  });

  $scope.$on('$destroy', function() {
    $interval.cancel(notifier);
    notifier = undefined;
  });
  //////////////////////////////

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