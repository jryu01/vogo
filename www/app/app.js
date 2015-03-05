'use strict';

angular.module('voteit', [
  'ionic',
  'ngCordova',
  'restangular',

  //components
  'mm.dataService',
  'voteit.auth',
  'voteit.config',
  'voteit.pollCard',
  'voteit.polls',

  //subsections
  'voteit.login',

  // inside tabs
  'voteit.tab',
  'voteit.home',
  'voteit.profile',
  'voteit.settings',
])
// Platform specific settings
.config([
  'config',
function (config) {

  // If it is running on android and dev mode, change localhost to 10.0.2.2
  if (config.env === 'development' && (ionic.Platform.isAndroid() || ionic.Platform.isIOS())) {
    // config.baseUrl = 'http://10.0.2.2:3000/api'; //android emulator
    // config.baseUrl = 'http://10.0.3.2:3000/api'; //genymotion
    config.baseUrl = 'http://192.168.2.17:3000/api'; //ios or android device
  }

}])

.config([
  '$urlRouterProvider', 
  'RestangularProvider', 
  'config', 
function ($urlRouterProvider, RestangularProvider, config) {

  $urlRouterProvider.otherwise('/');

  RestangularProvider.setBaseUrl(config.baseUrl);
}])

.run(['$ionicPlatform', function ($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    if (window.cordova && window.cordova.plugins.Keyboard) {
      window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      window.StatusBar.styleLightContent();
    }
    if (navigator.splashscreen) {
      navigator.splashscreen.hide();
    }
  });

}])

.run(['config', 'auth', function (config, auth) {
  // login with predefined user on development
  if (config.env === 'development') {
    auth.authenticate({id: '54caf3a20f16cd696750c96c', name: 'Jaehwan Ryu'}, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NGNhZjNhMjBmMTZjZDY5Njc1MGM5NmMiLCJleHAiOjE0MjgyODI0MzA4Njd9.FHIJ-Hb9msWPQ7aoJ64HNjOwMpfX2S-S6KeOPw5toEA');
  }
}]);