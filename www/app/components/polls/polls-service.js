'use strict';
/* jshint quotmark: false */

angular.module('voteit.polls', [])

.factory('Polls', ['Restangular', '$q', function (Restangular, $q) {

  var that = {
    queue: []
  };
  var Polls = Restangular.all('polls');

  that.getNextPolls = function (exclude) {
    var query = {};
    if (exclude) {
      query.exclude = exclude;
    }
    if (that.queue.length > 0) {
      var lastPoll = that.queue[that.queue.length - 1].id;
      query.before = lastPoll;
    }
    return Polls.getList(query).then(function (polls) {
      that.queue = that.queue.concat(polls);
    });
  };

  that.getNextPoll = function () {
    if (that.queue.length <= 3) {
      that.getNextPolls(that.lastVotedPollId);
    }
    return that.queue.shift();
  };

  that.create = function (poll) {
    return Polls.post(poll).then(function (poll) {
      that.queue.unshift(poll);
      return poll;
    });
  };

  that.vote = function (poll, answerNum) {
    if (poll.isVotedByMe) {
      return $q.reject('already voted');
    }
    poll['answer' + answerNum].numVotes += 1;
    poll.isVotedByMe = true;
    poll.answerVotedByMe = answerNum;
    return Polls.one(poll.id)
      .post('votes', { answer: answerNum })
      .catch(function () {
        poll['answer' + answerNum].numVotes -= 1;
        poll.isVotedByMe = false;
        poll.answerVotedByMe = undefined;
      });
  };

  that.comment = function (poll, text) {
    return Polls.one(poll.id).post('comments', { text: text });
  };

  that.getComments = function (poll, skip, limit) {
    return Polls.one(poll.id).getList('comments', {skip: skip, limit: limit});
  };

  return that;
}]);