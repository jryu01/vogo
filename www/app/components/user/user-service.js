'use strict';
/* jshint quotmark: false */

angular.module('voteit.user', ['voteit.config'])

.factory('User', [
  'Restangular',
  'config',
  '$http', 
  'auth',
function (Restangular, config, $http, auth) {
  var that = {};

  that.getProfile = auth.getUser;

  that.getVotes = function () {
    var id = that.getProfile().id;
    var query = { voterId: id };
    return $http.get(config.baseUrl + '/polls', {params: query});
  };

  return that;
}]);