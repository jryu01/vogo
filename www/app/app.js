'use strict';

angular.module('voteit', [
  'ionic',
  'restangular',

  //components
  'voteit.auth',
  'voteit.config',
  'voteit.pollCard',
  'voteit.spinner',

  //subsections
  'voteit.login',
  'voteit.home',
  'voteit.profile',
])
// Platform specific settings
.config([
  'config',
  '$ionicConfigProvider',
function (config, $ionicConfigProvider) {

  // If it is running on android and dev mode, change localhost to 10.0.2.2
  if (config.env === 'development' && ionic.Platform.isAndroid()) {
    config.baseUrl = 'http://10.0.2.2:3000/api';
  }
  
  $ionicConfigProvider.platform.android.tabs.style('striped');
  
  // $ionicConfigProvider.tabs.style('striped');
  // $ionicConfigProvider.tabs.style('top');

}])


.config(function ($stateProvider, $urlRouterProvider, RestangularProvider, config) {

  $stateProvider

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'app/tab.html',
    data: {
      requiresLogin: true
    }
  });

  $urlRouterProvider.otherwise('/tab/home');

  RestangularProvider.setBaseUrl(config.baseUrl);
})

.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      window.StatusBar.styleDefault();
    }
  });

})

.run(function (config, auth) {
  // login with predefined user on development
  if (config.env === 'developmetn') {
    auth.authenticate({id: '54caf3a20f16cd696750c96c', name: 'Jaehwan Ryu'}, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NGNhZjNhMjBmMTZjZDY5Njc1MGM5NmMiLCJleHAiOjE0MjgyODI0MzA4Njd9.FHIJ-Hb9msWPQ7aoJ64HNjOwMpfX2S-S6KeOPw5toEA');
  }
});