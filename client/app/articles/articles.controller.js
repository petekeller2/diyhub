'use strict';

angular.module('DIYhub')
  .controller('ArticlesCtrl', function ($scope, $http, socket, Auth) {
	
	$scope.getCurrentUser = Auth.getCurrentUser;
	
	console.log("USERNAME IS: " + $scope.getCurrentUser().name);

	$scope.articles = [];
	$scope.comments = [];
	
	$scope.newTitleArticle = '';
	$scope.newContentArticle = '';
	$scope.newComment = '';
		
	$scope.opened = false;
	$scope.read = false;
	$scope.formCheckTitleArticle = false;
	$scope.formCheckContentArticle = false;
	$scope.formCheckComment = false;
	$scope.writeArticle = false;
	$scope.viewComments = false;
	$scope.commentWriteShow = false;
	
	$scope.showWriteComment = function() {
		$scope.commentWriteShow = !$scope.commentWriteShow;
	};
	
	$scope.showComments = function() {
		$scope.viewComments = !$scope.viewComments;
	};
	
	$http.get('/api/comments').success(function(comments)
	{
		$scope.comments = comments;
		socket.syncUpdates('comment', $scope.comments);
	});
	
	$http.get('/api/articles').success(function(articles)
	{
		$scope.articles = articles;
		socket.syncUpdates('article', $scope.articles);
	}); 
	
	$scope.back = function() {
		$scope.read = !$scope.read;
	};
	
	$scope.view = function(article)
	{
		$scope.read = !$scope.read;
		$scope.articleSelected = article;
	};

    $scope.deleteArticle = function(article) {
      $http.delete('/api/articles/' + article._id);
    };
	
	$scope.articleWriteBack = function() {
		$scope.writeArticle = !$scope.writeArticle;
	};	
	
	$scope.articleWrite = function() {
	$scope.formCheckTitleArticle = false;
	$scope.formCheckContentArticle = false;
	if($scope.newTitleArticle === '') {
		$scope.formCheckTitleArticle = true;
		console.log("Was not sent to database, no title");
        return;
      }
	if($scope.newContentArticle === '') {
		$scope.formCheckContentArticle = true;
		console.log("Was not sent to database, no content");
        return;	
	}
      $http.post('/api/articles', { title: $scope.newTitleArticle, content: $scope.newContentArticle, author: $scope.getCurrentUser().name, numberOfComments: 0});
      $scope.newTitleArticle = '';
	  $scope.newContentArticle = '';
	  console.log("Title: " + $scope.newTitleArticle + " Content: " + $scope.newContentArticle + " was sent to database");
	  $scope.articleWriteBack();
	};

	
 	$scope.writeComment = function(article) 
	{
	
		console.log("newComment: " + $scope.newComment);
		console.log("article: " + article);
		console.log("commenter: " + $scope.getCurrentUser().name + " on: " + Date.now());

		$scope.formCheckComment = false;
		if($scope.newComment === '') {
			$scope.formCheckComment = true;
			console.log("Was not sent to database, no comment");
			return;
		}
		
		console.log("newComment: " + $scope.newComment);
		
		$http.post('/api/comments', { commentContent: $scope.newComment, commenter: $scope.getCurrentUser().name + " on: " + Date.now(), link: article._id});
		
		$scope.numOfComments = article; 
		console.log("numOfComments: " + $scope.numOfComments);
		
		$scope.numOfComments = $scope.numOfComments.numberOfComments;		
		$scope.commentCount = ($scope.numOfComments + 1);
		console.log("commentCount: " + $scope.commentCount);
		
		$http.put('/api/articles/' + article._id, { numberOfComments: $scope.commentCount});
		
		$scope.newComment = '';
		$scope.commentWriteShow = !$scope.commentWriteShow;
	}; 
	
	$scope.$on('$destroy', function () 
	{
	  socket.unsyncUpdates('article');
	  socket.unsyncUpdates('comment');
	});

  });
