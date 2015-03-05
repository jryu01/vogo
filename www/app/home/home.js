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
  'dataService',
  'Polls',
  '$timeout',
function ($scope, $ionicModal, dataService, Polls, $timeout) {
  var self = this;

  self.polls = [];
  self.msgCards = [];
  self.loading = false;
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
    window.StatusBar.styleDefault();
    self.newPoll.subject1.text = '';
    self.newPoll.subject2.text = '';
    self.createPollModal.show();
  };

  self.closeModal = function() {
    window.StatusBar.styleLightContent();
    self.createPollModal.hide();
  };

  //TODO: handle erros
  self.createPoll = function () {
    Polls.create(self.newPoll).then(function (poll) {
      self.closeModal();
      self.msgCards = [];
      self.polls = [];
      self.addCard();

      var myPolls = dataService.getData('myPolls');
      if (myPolls) {
        myPolls.unshift(poll);
      }
    }).catch(function () {});
  };
  /////////////////////////////////////////////////////////////////////////////
  // Handle poll cards
  self.cardSwiped = function() {
    $timeout(function () {
      self.addCard();
    }, 300);
  };

  self.cardDestroyed = function(index, isMsgCard) {
    if (isMsgCard) {
      self.msgCards.splice(index, 1); 
    } else {
      self.polls.splice(index, 1);
    }
  };

  self.addCard = function () {
    var poll = Polls.getNextPoll();
    if (!poll) {
      self.msgCards.push({
        message: '<span>No more polls.<br>Try again later.</span>'
      });
      return;
    }
    self.polls.push(poll);
  };

  self.init = function () {
    self.loading = true;
    Polls.getNextPolls().then(function () {
      self.addCard();
      self.loading = false;
    });
  };
  self.init();
}])

.controller('CardCtrl', [
  '$scope', 
  '$ionicSwipeCardDelegate',
  'dataService',
  'Polls',
function ($scope, $ionicSwipeCardDelegate, dataService, Polls) {

  var self = this;

  self.vote = function (poll, subjectId) {
    Polls.vote(poll, subjectId).then(function (votedPoll) {
      // if polls for my votes are loaded already
      var votedPolls = dataService.getData('myVotes');
      if (votedPolls) {
        votedPolls.unshift(votedPoll);
      }
    });
    self.goAway();
  };

  self.goAway = function() {
    var card = $ionicSwipeCardDelegate.getSwipeableCard($scope);
    // NOTE: when card moves upward, negative y value is set and remains
    // unchanged after card moves back to original position. This seems to
    // prevent card go away. so set x and y value to neatural position before
    // swipe called. This behaviour should be fixed in the swipe-card module
    // eventually.
    card.x = 0;
    card.y = 0;
    card.swipe();
  };
}]);