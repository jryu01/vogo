'use strict';

angular.module('voteit.home', [
  'ionic',
  'ionic.contrib.ui.cards'
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
      Polls = Restangular.all('polls');

  self.polls = [];
  self.msgCards = [];
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
  self.createPoll = function () {
    Polls.post(self.newPoll).then(function (poll) {
      self.closeModal();
      self.msgCards = [];
      self.polls = [poll];
    }).catch(function () {});
  };
  /////////////////////////////////////////////////////////////////////////////
  // Handle poll cards
  self.cardSwiped = function() {
    self.addCard();
  };

  self.cardDestroyed = function(index, isMsgCard) {
    if (isMsgCard) {
      self.msgCards.splice(index, 1); 
    } else {
      self.polls.splice(index, 1);
    }
  };

  self.setVotedPollId = function (pollId) {
    self.votedPollId = pollId;
  };

  self.addCard = function() {
    Polls.get('random', {exclude: [self.votedPollId]}).then(function (poll) {
      if (!poll) {
        self.msgCards.push({
          message: '<span>No more polls.<br>Try again later.</span>'
        });
        return;
      }
      self.polls.push(poll);
    }).catch(function (e) {
      console.log(e);
      self.msgCards.push({
        message: '<span>Something wrong happend.<br>Try again.</span>'
      });
    });
  };
  // init card
  self.addCard();
}])

.controller('CardCtrl', [
  '$scope', 
  '$ionicSwipeCardDelegate',
function ($scope, $ionicSwipeCardDelegate) {

  var self = this;

  self.vote = function (poll, subjectId) {
    poll.post('votes', { subjectId: subjectId });
    self.goAway();
  };

  self.goAway = function() {
    var card = $ionicSwipeCardDelegate.getSwipeableCard($scope);
    card.swipe();
  };
}]);