'use strict';

angular.module('voteit.home', [
  'ionic',
  'ionic.contrib.ui.cards'
])

.config(function ($stateProvider) {
  $stateProvider.state('tab.tab-home-home', {
    url: '/tab-home/home',
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
  'User', 
  '$timeout',
  '$cordovaCamera',
  '$cordovaFileTransfer',
function ($scope, $ionicModal, dataService, Polls, User, $timeout, $cordovaCamera, $cordovaFileTransfer) {

  var self = this;

  self.polls = [];
  self.msgCards = [];
  self.loading = false;

  self.createPollModal = '';
  self.newPoll = { 
    question: '',
    answer1: { text: '', picture: '' },
    answer2: { text: '', picture: '' }
  };

  $ionicModal
  .fromTemplateUrl('app/home/create-poll-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    self.createPollModal = modal;
  });

  self.openModal = function () {
    if (window.StatusBar) { window.StatusBar.styleDefault(); }
    self.newPoll.question = '';
    self.newPoll.answer1.text = '';
    self.newPoll.answer2.text = '';
    self.newPoll.answer1.picture = '';
    self.newPoll.answer2.picture = '';
    self.createPollModal.show();
  };

  self.closeModal = function() {
    if (window.StatusBar) { window.StatusBar.styleLightContent(); }
    self.createPollModal.hide();
  };

  self.getPhoto = function (sourceType) {
    // sourcetype PHOTOLIBRARY or 
    var options = {
      quality: 50,
      destinationType: window.Camera.DestinationType.FILE_URI,
      sourceType: window.Camera.PictureSourceType[sourceType],
      allowEdit: true,
      encodingType: window.Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: window.CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function (imageUri) {
      var user = User.getMe();
      var s3Info = User.getS3Info();
      var options = {};
      options.params = {
        'key': user.id + '/' + Date.now() + '.jpeg',
        'AWSAccessKeyId': s3Info.accessKey,
        'acl': 'public-read',
        'policy': s3Info.policy,
        'signature': s3Info.signature,
        'Content-Type': 'image/jpeg'
      };
     return $cordovaFileTransfer.upload(s3Info.uploadUrl, imageUri, options);
    }).then(function (result) {
      if (!self.newPoll.answer1.picture) {
        self.newPoll.answer1.picture = result.headers.Location;
      } else {
        self.newPoll.answer2.picture = result.headers.Location;
      }
    }).catch(function (err) {

    });
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
    }).catch(function (err) {

    });
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
  $scope.$on('$ionicView.enter', function () {
    $scope.$emit('tab.show');
  });
}])

.controller('createPollModalCtrl', [function () {

}])

.controller('CardCtrl', [
  '$scope', 
  '$ionicSwipeCardDelegate',
  'dataService',
  'Polls',
function ($scope, $ionicSwipeCardDelegate, dataService, Polls) {

  var self = this;

  self.vote = function (poll, answerNum) {
    if(!poll.voted) {
      poll['answer' + answerNum].numVotes += 1;
      poll.voted = true;
      Polls.vote(poll, answerNum).then(function (vote) {
        // if polls for my votes are loaded already
        var votes = dataService.getData('myVotes');
        if (votes) {
          votes.unshift(vote);
        }
      });
    }
  };
}]);