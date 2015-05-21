'use strict';

angular.module('voteit', [
  'ionic',
  'ngCordova',
  'restangular',

  //components
  'voteit.auth',
  'voteit.config',
  'voteit.polls',
  'voteit.user',
  'voCardImg',

  //subsections
  'voteit.login',
  'voteit.tab',
])
// Platform specific settings
.config([
  'config',
  '$ionicConfigProvider',
function (config, $ionicConfigProvider) {

  // If it is running on android and dev mode, change localhost to 10.0.2.2
  if (config.env === 'development' && (ionic.Platform.isAndroid() || ionic.Platform.isIOS())) {
    // config.baseUrl = 'http://10.0.2.2:3000/api'; //android emulator
    // config.baseUrl = 'http://10.0.3.2:3000/api'; //genymotion
    config.baseUrl = 'http://192.168.0.26:3000/api'; //ios or android device

    // config.baseUrl = 'http://localhost:3000/api'; //ios emulator
  }

  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.tabs.position('bottom');

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
      window.cordova.plugins.Keyboard.disableScroll(true); //ios only
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
  //   auth.authenticate({id: '55258c7b6b2b0ffc5cc58e24', name: 'JH R'}, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NTI1OGM3YjZiMmIwZmZjNWNjNThlMjQiLCJleHAiOjE0MzQyNTY4ODA4NzB9.povaneYCvXu_EbTOU627m6SBBDSyj81IqQAX3jhBFQ4');
    // auth.authenticate({
    //   'email': 'testuser1@test.com',
    //   'name': 'Test User1',
    //   'picture': 'http://lorempixel.com/100/100/',
    //   'id': '554be56e11a864e3832decd1'
    // }, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NTRiZTU2ZTExYTg2NGUzODMyZGVjZDEiLCJleHAiOjE0MzYyMjE5OTcxMDB9.4evSv0naOQxDRr1r4V0hqhoeyERYPMi5oNGZMGI00XA');
  }
}]);