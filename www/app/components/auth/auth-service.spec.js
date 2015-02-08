'use strict';
/*jshint expr: true*/

describe('Auth module: auth service', function() {

  var service, localStorageServiceMock;

  beforeEach(module('auth.service', function ($provide) {
    localStorageServiceMock = {
      get: sinon.stub(),
      set: sinon.stub(),
      remove: sinon.stub()
    };
    $provide.value('localStorageService', localStorageServiceMock);
  }));

  describe('without data from local storage', function () {

    beforeEach(inject(function ($injector) {
      localStorageServiceMock.get.withArgs('user').returns(null);
      localStorageServiceMock.get.withArgs('token').returns(null);
      service = $injector.get('auth'); 
    }));

    it('should have undefined token', function () {
      expect(service.getToken()).to.be.undefined;
    });

    it('should have undefined user', function () {
      expect(service.getUser()).to.be.undefined;
    });

    it('should return false on #isAuthenticated', function () {
      expect(service.isAuthenticated()).to.be.false;
    });

    it('should authenticate a user with token', function () {
      var result = service.authenticate({ name: 'authenticated user' }, 'TOKEN123');

      expect(result).to.equal(service); // expect method chaining availablity
      expect(service.getToken()).to.equal('TOKEN123');
      expect(service.getUser()).to.deep.equal({ name: 'authenticated user'});
    });

    it('should return true on #isAuthenticated with authenticated user',
      function () {
      service.authenticate({ name: 'authenticated user' }, 'TOKEN123');
      expect(service.isAuthenticated()).to.be.true;
    });

    it('should return false on #isAuthenticated when either token or user is missing', function () {

      service.authenticate({ user: 'hello' });
      expect(service.isAuthenticated()).to.be.false;

      service.authenticate(null, 'FAKETOKEN');
      expect(service.isAuthenticated()).to.be.false;

      service.authenticate();
      expect(service.isAuthenticated()).to.be.false;
    });

  });
  describe('with data from local storage', function () {

    beforeEach(inject(function ($injector) {
      localStorageServiceMock.get.withArgs('user').returns({ name: 'bob' });
      localStorageServiceMock.get.withArgs('token').returns('FACKETOKEN123');
      service = $injector.get('auth'); 
    }));

    it('should get a token', function () {
      expect(service.getToken()).to.equal('FACKETOKEN123');
    });

    it('should get a user', function () {
      expect(service.getUser()).to.deep.equal({ name: 'bob' });
    });

    it('should logout a current user', function () {
      service.logout(); 

      expect(localStorageServiceMock.remove).to.have.been.calledWith('user');
      expect(localStorageServiceMock.remove).to.have.been.calledWith('token');
      expect(service.isAuthenticated()).to.be.false;
      expect(service.getToken()).to.be.undefined;
      expect(service.getUser()).to.be.undefined;
    });

  });
});