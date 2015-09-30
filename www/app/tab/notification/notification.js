'use strict';

angular.module('voteit.tab.notification', [])

.config(function ($stateProvider) {
  $stateProvider.state('tab.tab-notification-notification', {
    url: '/tab-notification/notification',
    views: {
      'tab-notification': {
        templateUrl: 'app/tab/notification/notification.html',
        controller: 'NotificationCtrl as nCtrl'
      }
    }
  });
})

.controller('NotificationCtrl', [
  '$scope',
  'User',
  'Notification',
  '$ionicLoading',
function ($scope, User, Notification, $ionicLoading) {

  var self = this,
      enteredFirstTime = true;

  self.notifications = [];
  self.nextNotifications = [];

  $scope.$on('$ionicView.beforeEnter', function () {
    if (Notification.hasNextNotificationStateInfo()) {
      return Notification.goNextNotificationState();
    }
    if (Notification.count > 0 || enteredFirstTime) {
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>',
        duration: 5000
      });
      self.nextNotifications = [];
      Notification.clearNewNotification();
      self.fetchNotification().finally($ionicLoading.hide);
    }
    enteredFirstTime = false;
  });

  self.fetchNotification = function () {
    Notification.clearNewNotification();
    return Notification.get()
      .then(function (result) {
        self.notifications = result.splice(0, 20);
        self.nextNotifications = result;
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  self.moreNotifications = function () {
    return self.nextNotifications.length > 0;
  };

  self.loadMore = function () {
    var next = self.nextNotifications.splice(0,10);
    self.notifications = self.notifications.concat(next);
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };

}]);