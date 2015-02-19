'use strict';

angular.module('mm.dataService', [])

.factory('dataService', function () {
  var data = {};
  return {
    // keys: function () {
      //TODO: list keys
    // },
    setData: function (name, value) {
      data[name] = value;
    },
    getData: function (name) {
      return data[name];
    }
  };
});