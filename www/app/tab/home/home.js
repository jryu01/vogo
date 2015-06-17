'use strict';

angular.module('voteit.tab.home', [
  'ionic.contrib.ui.cards'
])

.config(function ($stateProvider) {
  $stateProvider.state('tab.tab-home-home', {
    url: '/tab-home/home',
    views: {
      'tab-home': {
        templateUrl: 'app/tab/home/home.html',
        controller: 'HomeCtrl as home'
      }
    }
  });
})

.controller('HomeCtrl', [
  '$scope', 
  '$ionicModal',
  'Polls',
  'User', 
  '$ionicLoading',
  '$cordovaCamera',
  '$cordovaFile',
  '$cordovaFileTransfer',
function ($scope, $ionicModal, Polls, User, $ionicLoading, $cordovaCamera, $cordovaFile, $cordovaFileTransfer) {

  var self = this;

  var showLoading = function () {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
  };
  var hideLoading = function () {
    $ionicLoading.hide();
  };

  var uploadImgToS3 = function (imageUri) {
    var user = User.getMe(),
        s3Info = User.getS3Info(),
        fileName = user.id + '/' + Date.now() + '.jpeg',
        pictureUrl = s3Info.uploadUrl + fileName,
        options = {};

    options.params = {
      'key': fileName,
      'AWSAccessKeyId': s3Info.accessKey,
      'acl': 'public-read',
      'policy': s3Info.policy,
      'signature': s3Info.signature,
      'Content-Type': 'image/jpeg'
    };
    options.chunkedMode = false;
    options.headers = { 'Connection': 'close' };

    return $cordovaFileTransfer.upload(s3Info.uploadUrl, imageUri, options)
      .then(function () { return pictureUrl; });
  };

  var setPicture = function (url) {
    if (!self.newPoll.answer1.picture) {
      self.newPoll.answer1.picture = url;
    } else {
      self.newPoll.answer2.picture = url;
    }
  };

  //===========================================================================
  //                Create Poll Modal
  //===========================================================================

  self.newPoll = { 
    question: '',
    answer1: { text: '', picture: '' },
    answer2: { text: '', picture: '' }
  };
  self.createPollModal = '';

  $ionicModal
  .fromTemplateUrl('app/tab/home/create-poll-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    self.createPollModal = modal;
  });

  self.openModal = function () {
    self.createPollModal.show();
  };

  self.closeModal = function() {
    self.newPoll.question = '';
    self.newPoll.answer1.text = '';
    self.newPoll.answer2.text = '';
    self.newPoll.answer1.picture = '';
    self.newPoll.answer2.picture = '';

    self.resetImgSearch();

    self.createPollModal.hide();
  };

  self.getPhoto = function (sourceType) {
    // sourcetype PHOTOLIBRARY or CAMERA 
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
    showLoading();
    $cordovaCamera.getPicture(options)
      .then(uploadImgToS3)
      .then(setPicture)
      .catch(function () {})
      .finally(function () {
        hideLoading();
      });
  };

  self.createPoll = function () {
    if (self.creatingPoll) {
      return;
    }
    self.creatingPoll = true;
    showLoading();
    Polls.create(self.newPoll).then(function () {
      self.closeModal();
      $scope.$broadcast('HomeCtrl.cardCreated');
    }).catch(function () {
    }).finally(function () {
      self.creatingPoll = false;
      hideLoading(); 
    });
  };

  //===========================================================================
  //                Img Search Modal
  //===========================================================================

  self.imgSearchModal = '';
  self.imgSearchQuery = '';
  self.imgSearchResults = [];

  $ionicModal
  .fromTemplateUrl('app/tab/home/img-search-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    self.imgSearchModal = modal;
  });

  self.openImgSearchModal = function () {
    self.imgSearchModal.show();
  };

  self.closeImagSeach = function () {
    self.imgSearchModal.hide();
  };

  self.searchImg = function () {
    if (window.cordova && window.cordova.plugins) {
      window.cordova.plugins.Keyboard.close();
    }
    showLoading();
    User.searchImg(self.imgSearchQuery).then(function (r) {
      self.imgSearchResults = r;
      hideLoading();
    });
  };

  self.resetImgSearch = function () {
    self.imgSearchQuery = '';
    self.imgSearchResults = [];
  };

  self.selectImg = function (img) {
    var cordova = window.cordova;
    var url = img.MediaUrl,
        targetPath = cordova.file.dataDirectory + 'downloadedSearchImg',
        trustHosts = true,
        options = {};

    self.imgSearchModal.hide();
    self.resetImgSearch();
    showLoading();

    $cordovaFileTransfer
      .download(url, targetPath, options, trustHosts)
      .then(function (result) {
        var imageUri = result.nativeURL;
        return imageUri;
      }).then(uploadImgToS3)
      .then(setPicture)
      .catch(function () {})
      .finally(function () {
        hideLoading();
      });
  };

}])

.controller('CardsCtrl', [
  '$scope',
  '$ionicSwipeCardDelegate',
  'Polls',
  '$timeout',
function ($scope, $ionicSwipeCardDelegate, Polls, $timeout) {

  var self = this;

  self.polls = [];
  self.msgCards = [];
  self.loading = false;

  var init = function () {
    self.loading = true;
    Polls.getNextPolls().then(function () {
      self.addCard();
      self.loading = false;
    });
  };

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
      return self.msgCards.push({
        message: '<span><img src="img/minimon.png" width="80px" height="80px"><br>Wowww !!<br>You reviewed all polls !<br>It\'s your time to make one !</span>'
      });
    }
    self.polls.push(poll);
  };

  $scope.$on('HomeCtrl.cardCreated', function () {
    self.msgCards = [];
    self.polls = [];
    self.addCard();
  });

  init();
}]);