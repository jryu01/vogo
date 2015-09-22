'use strict';

angular.module('voteit', [
  'ionic',
  'ngCordova',
  'restangular',

  //components
  'utills',
  'voteit.auth',
  'voteit.config',
  'voteit.polls',
  'voteit.user',
  'voteit.notification',
  'voteit.vocard',
  // 'voteit.push',
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
    config.baseUrl = 'http://192.168.0.26:3000/api'; //ios or android device
    // config.baseUrl = 'http://localhost:3000/api'; //ios emulator
  }

  if(!ionic.Platform.isIOS()) {
    $ionicConfigProvider.scrolling.jsScrolling(false); 
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

// register keyboard events
.run(['$rootScope', function ($rootScope) {
  var broadCast = function (e) {
    $rootScope.$broadcast(e.type);
  };
  window.addEventListener('native.keyboardshow', broadCast);
  window.addEventListener('native.keyboardhide', broadCast);  
}])

// only for dev environment.
.run(['config', 'auth', '$http', 'localStorageService', 'User', function (config, auth, $http, localStorageService, User) {
  // login with predefined user on development and in browser env
  if (config.env === 'development' && !ionic.Platform.isWebView()) {
    // overwrite signin function
    User.signin = function () {
      var user1 = {
        'email': 'testuser1@test.com',
        'name': 'Test User1',
        'picture': 'http://lorempixel.com/100/100/',
        'id': '554be56e11a864e3832decd1',
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NTRiZTU2ZTExYTg2NGUzODMyZGVjZDEiLCJleHAiOjE0NDYwOTE5MjYwNDB9.6wD4JGG8ntZPh-0apg3HTFcEBodAfnWyRSNVL51BhqA'
      };
      var user2 = {
        'email': 'jryu@vogo.com',
        'name': 'Jaehwan Coding Master Ryu',
        'picture': 'http://lorempixel.com/200/200/',
        'id': '5591effffb89836a6130430d',
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NTkxZWZmZmZiODk4MzZhNjEzMDQzMGQiLCJleHAiOjE0NDYwOTIwNzAzMjN9.atbgK1nFWdIcOGOOoxUBbnOW7tb-fKCS-Pr5kmt7-mY'
      };
      var user3 = {
        'email': 'time0121@hotmail.com',
        'name': 'JH R',
        'picture': 'https://s3.amazonaws.com/dev.vogo/55258c7b6b2b0ffc5cc58e24/profile.jpg',
        'id': '55258c7b6b2b0ffc5cc58e24',
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NTI1OGM3YjZiMmIwZmZjNWNjNThlMjQiLCJleHAiOjE0NDgwNjA5NzQ5MzV9.AaSB3653ylY4lvU6FO4MGrbp462Gsegi4u65Nnt8bdk'
      };
      var testUser = user3;

      auth.authenticate(testUser, testUser.token);

      return $http.get(config.baseUrl + '/s3Info').then(function (res) {
        localStorageService.set('s3Info', res.data);
      });
    };
  }
}]);