'use strict';

angular.module('voteit.home', [
  'ionic'
])

.config(function ($stateProvider) {
  $stateProvider.state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'app/home/home.html',
        controller: 'HomeCtrl as ctrl'
      }
    }
  });
})

.controller('HomeCtrl', [
  '$scope', 
  '$ionicModal',
  'Restangular',
function ($scope, $ionicModal, Restangular) {
  var self = this,
      basePolls = Restangular.all('polls');

  self.createPollModal = '';
  self.newPoll = { 
    subject1: { text: '' },
    subject2: { text: '' }
  };


  $ionicModal
  .fromTemplateUrl('app/home/create-poll-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    self.createPollModal = modal;
  });

  self.openModal = function () {
    self.newPoll.subject1.text = '';
    self.newPoll.subject2.text = '';
    self.createPollModal.show();
  };

  self.closeModal = function() {
    self.createPollModal.hide();
  };

  //TODO: handle erros
  self.submit = function () {
    basePolls.post(self.newPoll).then(function (poll) {
      self.closeModal();
    }).catch(function () {

    });
  };
}]);