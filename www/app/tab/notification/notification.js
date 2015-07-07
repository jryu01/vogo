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

  $scope.$on('$ionicView.enter', function () {
    Notification.clearNewNotification();
    self.fetchNotification();
  });

  self.fetchNotification = function () {
    Notification.clearNewNotification();
    Notification.get()
      .then(function (result) {
        self.notifications = result;
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

}]);