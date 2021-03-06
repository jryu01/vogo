'use strict';

angular.module('voteit.tab.polldetail', [
  'n3-pie-chart'
])

.config(function ($stateProvider) {
  $stateProvider.state('tab.tab-home-polldetail', {
    url: '/tab-home/polldetail',
    params: { id: '', poll: null },
    views: {
      'tab-home': {
        templateUrl: 'app/tab/polldetail/polldetail.html',
        controller: 'PolldetailCtrl as ctrl'
      }
    }
  });

  $stateProvider.state('tab.tab-profile-polldetail', {
    url: '/tab-profile/polldetail',
    params: { id: '', poll: null },
    views: {
      'tab-profile': {
        templateUrl: 'app/tab/polldetail/polldetail.html',
        controller: 'PolldetailCtrl as ctrl'
      }
    }
  });

  $stateProvider.state('tab.tab-notification-polldetail', {
    url: '/tab-notification/polldetail',
    params: { id: '' },
    views: {
      'tab-notification': {
        templateUrl: 'app/tab/polldetail/polldetail.html',
        controller: 'PolldetailCtrl as ctrl'
      }
    }
  });
})

.controller('PolldetailCtrl', [
  '$scope',
  '$stateParams', 
  'Polls',
  '$ionicScrollDelegate',
  '$ionicLoading',
  '$q',
function ($scope, $stateParams, Polls, $ionicScrollDelegate, $ionicLoading, $q) {
  var self = this;

  $scope.poll = $stateParams.poll;
  self.newComment = '';

  var updatePie = function (answer1, answer2, duration) {
    var COLOR_BOLD = '#A5D5F4',
        COLOR_LIGHT = '#CDCCD3',
        a1Data = {label: 'answer1', value: answer1},
        a2Data = {label: 'answer2', value: answer2};
    $scope.pieData = [];
    $scope.pieOptions = {};
    a1Data.isBig = answer1 > answer2;
    a2Data.isBig = !a1Data.isBig;
    a1Data.color = (a1Data.isBig) ? COLOR_BOLD : COLOR_LIGHT;
    a2Data.color = (a2Data.isBig) ? COLOR_BOLD : COLOR_LIGHT;
    $scope.pieOptions = {
      thickness: 200, 
      mode: 'gauge', 
      total: answer1 + answer2,
      duration: duration
    };
    $scope.pieData = [a2Data, a1Data];
  };

  var getPollDetail = function (pollId, loading) {
    $scope.poll = {};
    if (loading) {
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>',
        duration: 5000
      });
    }
    var getPoll = Polls.getOne(pollId).then(function (poll) {
      if (poll.isVotedByMe) {
        updatePie(poll.answer1.numVotes, poll.answer2.numVotes);
      }
      _.assign($scope.poll, poll);
    });
    var getComments = Polls.getComments(pollId, 0, 99999)
      .then(function (comments) {
        $scope.poll.comments = comments;
      });
    return $q.all([getPoll, getComments]).finally(function () {
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    });  
  };

  var init = function () {
    var poll = $scope.poll,
        pollId = $stateParams.id;
    // if entered from notification tab, poll is null
    if (poll) {
      if (poll.isVotedByMe) {
        updatePie(poll.answer1.numVotes, poll.answer2.numVotes);
      }
      Polls.getComments(poll.id, 0, 99999).then(function (comments) {
        poll.comments = comments;
      });
    } else {
      // when enter from notification view
      getPollDetail(pollId, true);
    }
  };

  self.refresh = getPollDetail.bind(null, $stateParams.id);

  self.vote = function (poll, answerNum) {
    Polls.vote(poll, answerNum).then(function () {
      updatePie(poll.answer1.numVotes, poll.answer2.numVotes, 1000);
    });
  };

  self.addComment = function () {
    var poll = $scope.poll;
    if (!poll.comments) { poll.comments = []; }
    if (self.newComment) {
      Polls.comment(poll, self.newComment).then(function (c) {
        poll.numComments += 1;
        poll.comments.push(c); 
        Polls.findAndUpdatePollFromQueue(poll);
        $ionicScrollDelegate.scrollBottom(true);
      });
      self.newComment = '';
    }
  };

  self.scrollBottom = function () {
    $ionicScrollDelegate.scrollBottom(true);
  };

  $scope.$on('native.keyboardshow', self.scrollBottom);
  $scope.$on('native.keyboardhide', self.scrollBottom);
  $scope.$on('$ionicView.beforeEnter', init);
  $scope.$on('$ionicView.leave', function () {
    $scope.poll.comments = []; 
  });
}]);