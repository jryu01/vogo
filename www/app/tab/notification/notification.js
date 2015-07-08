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
function ($scope, User, Notification) {

  var self = this;

  self.notifications = [];
  self.nextNotifications = [];

  $scope.$on('$ionicView.enter', function () {
    self.nextNotifications = [];
    Notification.clearNewNotification();
    self.fetchNotification();
  });

  self.fetchNotification = function () {
    Notification.clearNewNotification();
    Notification.get()
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