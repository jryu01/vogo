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
        // templateUrl: 'app/home/create-poll-modal.html',
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

  //   document.addEventListener('deviceready', function () {
  //   var options = {
  //     quality: 50,
  //     destinationType: Camera.DestinationType.DATA_URL,
  //     sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
  //     allowEdit: true,
  //     encodingType: Camera.EncodingType.JPEG,
  //     targetWidth: 100,
  //     targetHeight: 100,
  //     popoverOptions: CameraPopoverOptions,
  //     saveToPhotoAlbum: false
  //   };

  //   $cordovaCamera.getPicture(options).then(function(imageData) {
  //     var image = document.getElementById('myImage');
  //     image.src = "data:image/jpeg;base64," + imageData;
  //   }, function(err) {
  //     // error
  //   });

  // }, false);

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
      // destinationType: window.Camera.DestinationType.DATA_URL,
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
      console.log('result: ', result);
    }).catch(function (err) {
      console.log(err);
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
    console.log(poll);
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

.controller('createPollModalCtrl', [function () {

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