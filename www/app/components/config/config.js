'use strict';
/* jshint quotmark: false */

angular.module('voteit.config', [])

.constant('config', {
  "version": "0.6.0",
  "env": "production",
  "baseUrl": "http://vogo-api-production.elasticbeanstalk.com/api",
  "googlePjNumber": "575724476904",
  "fbAppId": "790356791001298"
});