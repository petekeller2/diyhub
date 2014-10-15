'use strict';

angular.module('DIYhub')
  .config(function ($stateProvider) {
    $stateProvider
      .state('guides', {
        url: '/guides',
        templateUrl: 'app/guides/guides.html',
        controller: 'GuidesCtrl'
      });
  });