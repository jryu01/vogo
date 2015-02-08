'use strict';

angular.module('voteit', [
  'ionic',
  'restangular',
  'voteit.config',
  'voteit.auth',
  'voteit.login',
  'voteit.home',
  'voteit.profile',
])
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

.config(function ($stateProvider, $urlRouterProvider, RestangularProvider, config) {

  $stateProvider

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'app/tab.html'
  });

  $urlRouterProvider.otherwise('/tab/home');

  RestangularProvider.setBaseUrl(config.baseUrl);

  // //will be removed
  // RestangularProvider.setDefaultHeaders({ 'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NGNhZjNhMjBmMTZjZDY5Njc1MGM5NmMiLCJleHAiOjE0MjgyODI0MzA4Njd9.FHIJ-Hb9msWPQ7aoJ64HNjOwMpfX2S-S6KeOPw5toEA' });
});
