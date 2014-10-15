'use strict';

describe('Controller: GuidesCtrl', function () {

  // load the controller's module
  beforeEach(module('DIYhub'));

  var GuidesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GuidesCtrl = $controller('GuidesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
