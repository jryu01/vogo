'use strict';

angular.module('voteit.auth', ['voteit.auth.service'])

.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push('authIntercepter'); 
}])

.run([
  '$rootScope', 
  '$window',
  '$state', 
  'auth', 
function ($rootScope, $window, $state, auth) {
  $rootScope.$on('$stateChangeStart', 
    function (event, toState, toParams, fromState, fromParams) {

    if (toState.name === 'login' && auth.isAuthenticated()) {
      event.preventDefault();
      $state.go('tab.tab-home-home');
    }
    
    if (toState.data && toState.data.requiresLogin) {
      if (!auth.isAuthenticated()) {
        event.preventDefault();
        $window.location.href = 'index.html';
      }
    }
  });
}])

//TODO: move this to seperate file and test
.factory('authIntercepter', [
  'auth', 
  '$q', 
  '$injector', 
function (auth, $q, $injector) {
  return {
    request: function (config) {
      config.headers['x-access-token'] = auth.getToken();
      return config;
    },
    responseError: function (rejection) {
      var $state = $injector.get('$state');
      var $ionicHistory = $injector.get('$ionicHistory');

      if (rejection.status === 401) {
        $ionicHistory.nextViewOptions({ 
          disableBack: true,
          disableAnimate: true
        });
        $state.go('login', {}, {location: 'replace', reload: true});
      }
      return $q.reject(rejection);
    } 
  };
}]);