'use strict';
/*jshint expr: true*/

describe('dataservice module', function() {

  beforeEach(module('dataService'));

  describe('dataService service', function(){

    var service;

    beforeEach(inject(function (dataService) {
      service = dataService;
    }));

    it('should be defined', function () {
      expect(service).to.be.ok;
    });

    it('should return undefined for undefined data', function () {
      expect(service.getData('anything')).to.be.undefined;
    });

    it('should set and get provided data', function () {

      service.setData('activities', [{id:1},{id:2}]);
      expect(service.getData('activities')).to.deep
          .equal([{id:1}, {id:2}]);
    });

  });
});