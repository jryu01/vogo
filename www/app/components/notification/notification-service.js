'use strict';
/* jshint quotmark: false */

angular.module('voteit.notification', ['voteit.config'])

.factory('Notification', [
  'config',
  '$http', 
  '$q',
  'User',
function (config, $http, $q, User) {

  var that = {},
      user = User.getMe();

  if (!user.nLastCheckedDate) {
    user.nLastCheckedDate = Date.now();
    User.saveMe(user);
  }

  that.count = 0;

  var url = function () {
    var args = Array.prototype.slice.call(arguments),
        url = config.baseUrl;
    args.forEach(function (urlSegment) {
      url = url + '/' + urlSegment;
    });
    return url;
  };

  var extract = function (result) {
    return result.data;
  };

  that.checkNewNotification = function () {
    var opts = {};
    var user = User.getMe();
    opts.params = { after: user.nLastCheckedDate };
    return $http.get(url('notifications', 'count'), opts)
      .then(extract)
      .then(function (result) {
        that.count = result.count;
      });
  };

  that.clearNewNotification = function () {
    var user = User.getMe();
    user.nLastCheckedDate = Date.now();
    User.saveMe(user);
    that.count = 0;
  };

  that.get = function () {
    return $http.get(url('notifications')).then(extract);
  };
  
  return that;
}]);