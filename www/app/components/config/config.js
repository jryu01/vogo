'use strict';
/* jshint quotmark: false */

angular.module('voteit.config', [])

.constant('config', {
  "version": "0.3.0",
  "env": "production",
  "baseUrl": "http://vogo-api-production.elasticbeanstalk.com/api",
  "fbAppId": "790356791001298"
});