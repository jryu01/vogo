'use strict';
/* jshint quotmark: false */

angular.module('voteit.polls', [])

.factory('Polls', [
  'User',
  'Restangular', 
  '$q', 
  'config',
  '$http', 
  '$timeout',
function (User, Restangular, $q, config, $http, $timeout) {

  var that = {
    queue: [],
    currentPoll: null
  };

  var Polls = Restangular.all('polls');

  var extract = function (result) {
    return result.data;
  };

  var url = function () {
    var args = Array.prototype.slice.call(arguments),
        url = config.baseUrl;
    args.forEach(function (urlSegment) {
      url = url + '/' + urlSegment;
    });
    return url;
  };

  that.getNextPolls = function (refresh) {
    var query = {};
    // if (exclude) {
    //   query.exclude = exclude;
    // }
    if (refresh) {
      that.queue = [];
      that.currentPoll = null;
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
    that.currentPoll = that.queue.shift();
    return that.currentPoll;
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
    $timeout(function () {
      that.findAndUpdatePollFromQueue(poll);
    });
    return Polls.one(poll.id)
      .post('votes', { answer: answerNum })
      .catch(function () {
      });
  };

  // among feched polls(used in home tab), find voted poll and update
  that.findAndUpdatePollFromQueue = function (poll) {
    var curPoll = that.currentPoll;
    if (curPoll.id === poll.id && curPoll !== poll) {
      return _.assign(that.currentPoll, poll);
    }

    that.queue.forEach(function (p) {
      if (p.id === poll.id && p !== poll) {
        _.assign(p, poll);
      }
    });
  };

  that.getVoters = function (pollId, answer, skip) {
    var opts = {};
    opts.params = { answer: answer, limit: 100, skip: skip };
    return $http.get(url('polls', pollId, 'voters'), opts)
      .then(extract)
      .then(function (users) {
        return users.map(function (user) { return user.id; });
      })
      .then(User.getFollowingInfo);
  };

  that.getOne = function (pollId) {
    
    var markIfVoted = function (poll) {
      var pollId = poll.id,
      params = { params: { pollIds: [pollId] } },
      me = User.getMe();

      return $http.get(url('users', me.id, 'votes'), params)
        .then(extract)
        .then(function (vote) {
          if (vote.length > 0) {
            poll.isVotedByMe = true;
            poll.answerVotedByMe = vote[0].answer;
          }
          return poll;
        });
    };
    return $http.get(url('polls', pollId))
      .then(extract)
      .then(markIfVoted);
  };

  that.comment = function (poll, text) {
    return Polls.one(poll.id).post('comments', { text: text });
  };

  that.getComments = function (poll, skip, limit) {
    return Polls.one(poll.id).getList('comments', {skip: skip, limit: limit});
  };

  return that;
}]);