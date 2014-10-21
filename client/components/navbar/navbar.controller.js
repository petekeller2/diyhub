'use strict';

angular.module('DIYhub')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/' //onClick to fill in top left?
    },
	{
      'title': 'Guides',
      'link': '/guides'
    }
	];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    //$scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
	  if($location.path()=='/')
	  {
		$scope.upperLeft = true;
	  }
	  else if($location.path()=='/login')
	  {
		$scope.upperRight = true;	  
	  }
	  else if($location.path()!=='/login' && $location.path()!=='/')
	  {
		$scope.upperLeft = false;
		$scope.upperRight = false;
	  }
	  //console.log("Upper left corner is covered. " + $scope.upperLeft);
	  //console.log("Upper right corner is covered. " + $scope.upperRight);

      return route === $location.path();
    };
  });