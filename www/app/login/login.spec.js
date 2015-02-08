'use strict';
/*jshint expr: true*/

describe('myApp.login module: login controller', function() {

  var ctrl, $rootScope, $q, $httpBackend;

  var mockCordovaOauth, 
      mockIonicHistory, 
      mockState,
      mockAuth,
      mockFbResponse,
      mockLoginResponse;

  beforeEach(function () {
    mockCordovaOauth = { facebook: sinon.stub() };
    mockIonicHistory = { nextViewOptions: sinon.stub() };
    mockState = { go: sinon.stub() };
    mockAuth = { authenticate: sinon.stub() };

    mockFbResponse = { access_token: 'FAKE_FB_ACCESS_TOKEN' };
    mockLoginResponse = { 
      user: { id: 123 },
      access_token: 'FAKE_APP_ACCESS_TOKEN'
    };
  });

  beforeEach(module('myApp.login'));

  beforeEach(inject(function (_$httpBackend_) {
    $httpBackend = _$httpBackend_;
    $httpBackend.whenGET('app/login/login.html').respond(200);
  }));

  beforeEach(inject(function (_$controller_, _$q_, _$rootScope_) {

    $q = _$q_;
    $rootScope = _$rootScope_;

    ctrl = _$controller_('LoginCtrl', {
      $cordovaOauth: mockCordovaOauth,
      $ionicHistory: mockIonicHistory,
      $state: mockState,
      auth: mockAuth,
      BASE_URL: 'http://www.test.com',
      FB_APP_ID: '12345678'
    });
  }));

  describe('#facebookLogin', function () {

    beforeEach(function () {
      var fbDeferred = $q.defer();
      fbDeferred.resolve(mockFbResponse);
      mockCordovaOauth.facebook.returns(fbDeferred.promise);

      $httpBackend.whenPOST('http://www.test.com/login')
        .respond(mockLoginResponse);
    });

    afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
   });

    it('should send request to get facebook access_token', function () {
      ctrl.facebookLogin();
      $httpBackend.flush();
      expect(mockCordovaOauth.facebook).to.have.been.calledWith(
        '12345678',
        ['email', 'user_friends']
      );
    });

    it('should send POST login request with facebook token', function () {
      $httpBackend.expectPOST('http://www.test.com/login', {
        grantType: 'facebook',
        facebookAccessToken: 'FAKE_FB_ACCESS_TOKEN'
      });
      ctrl.facebookLogin();
      $httpBackend.flush();
    });

    it('should authenticate user with a token', function () {
      ctrl.facebookLogin();
      $httpBackend.flush();
      expect(mockAuth.authenticate).to.have.been.calledWith(
        { id: 123 }, 
        'FAKE_APP_ACCESS_TOKEN'
      );
    });

    it('should disable back button on the next view', function () {
      ctrl.facebookLogin();
      $httpBackend.flush();
      expect(mockIonicHistory.nextViewOptions).to.have.been.calledWith({
        disableBack: true,
        disableAnimate: true
      });
    });

    it('should change state to activitylist', function () {
      ctrl.facebookLogin();
      $httpBackend.flush();
      expect(mockState.go).to.have.been.calledWith(
        'activitylist',
        {},
        { location: 'replace', reload: true }
      );
    });
  });
});