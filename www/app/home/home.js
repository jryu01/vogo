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
  'dataService',
function ($scope, $ionicModal, Restangular, dataService) {
  var self = this,
      Polls = Restangular.all('polls');

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

      var myPolls = dataService.getData('myPolls');
      if (myPolls) {
        myPolls.unshift(poll);
      }
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
    self.loading = true;
    Polls.get('random', {exclude: [self.votedPollId]}).then(function (poll) {
      if (!poll) {
        self.msgCards.push({
          message: '<span>No more polls.<br>Try again later.</span>'
        });
        self.loading = false;
        return;
      }
      self.polls.push(poll);
      self.loading = false;
    }).catch(function (e) {
      console.log(e);
      self.msgCards.push({
        message: '<span>Something wrong happend.<br>Try again.</span>'
      });
      self.loading = false;
    });
  };
  // init card
  self.addCard();
}])

.controller('CardCtrl', [
  '$scope', 
  '$ionicSwipeCardDelegate',
  'dataService',
function ($scope, $ionicSwipeCardDelegate, dataService) {

  var self = this;

  self.vote = function (poll, subjectId) {
    poll.post('votes', { subjectId: subjectId }).then(function (votedPoll) {
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