'use strict';

angular.module('DIYhub')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '' && $scope.newDescription === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing, info: $scope.newDescription });
	 // $http.post('/api/things', { info: $scope.newDescription });
      $scope.newThing = '';
	  $scope.newDescription = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
	
	//chat
	$scope.texts = [];
	
//	$scope.modified() = main.isModify();
  //  $scope.opened=false;
 $scope.toggle = function(text) {
    $scope.opened = !$scope.opened;
	//text.active = false;
    console.log($scope.opened);
	//console.log("Toggle value: " + text);
	$scope.textSave = text;
	console.log("Toggle value in angular scope: " + $scope.textSave); 
					//ng-model="updateMessage" was where id="txtArea" currently is
 	$scope.content = '<textarea id="txtArea" rows="4" cols="50">' + $scope.textSave.message + '</textarea>'
	document.getElementById('editText').innerHTML = $scope.content; 
	//console.log($scope.content);
  //  $scope.$apply();
};
    $http.get('/api/chats').success(function(texts) {
      $scope.texts = texts;
      socket.syncUpdates('chat', $scope.texts);
    });
	
	/* $scope.addText = function(newValue) {
		$scope.modify=!$scope.modify;
		$scope.sample = newValue;
	 };*/

    $scope.addChat = function() {
      if($scope.newMessage === '' && $scope.newUsername === '') {
        return;
      }
      $http.post('/api/chats', { message: $scope.newMessage, username: $scope.newUsername});
	 // $http.post('/api/things', { info: $scope.newDescription });
      $scope.newMessage = '';
	  $scope.newUsername = '';
    };
	
    $scope.updateChat = function(chat) {
		//$scope.content = ' <form class="chat-update-form-new"> <label>Chat Update New</label> <p class="input-group"> <textarea id="txtArea" rows="4" cols="50">' + $scope.textSave.message + '</textarea> <span class="input-group-btn"></span> </p> </form> <button type="submit" class="btn btn-primary" ng-click="updateChat(textSave)">Update</button> '
	//document.getElementById('editText').innerHTML = $scope.content;
	//$scope.modify=!$scope.modify;
	$(function() {
	$scope.editedMessage = $('textarea#txtArea').val();
	console.log("this is the old textarea val: " + $scope.editedMessage); 
	
	console.log("this is the chat input: " + chat.message);
	  if($scope.editedMessage === chat.message) {		//if there are no changes
        return;
      }
	  /*
	 if($scope.updateMessage === '') {
        return;
      }*/
	  
	  $http.get('/api/chats/' + chat._id).success(function() {
	  $scope.compareOld = (chat.message).split(" ");
     // socket.syncUpdates('chat', $scope.compareOld);
	  console.log("Old message: " + $scope.compareOld);
	  console.log("CHAT.MESSAGE: " + chat.message);
		
		console.log("New message: " + $scope.editedMessage);
	  
	  $scope.compareNew = ($scope.editedMessage).split(" ");
	  console.log($scope.compareNew);
	  console.log($scope.compareNew.length);
	  console.log($scope.compareNew[2]);
	  console.log($scope.compareNew[200]);//undefined
	  
	  //var deletions;
	/*   streak=0;
	  for(i=0; i>$scope.compareNew.length; i++)
	  {
		for(i2=0; i2>$scope.compareOld.length; i2++)
		{
			if($scope.compareNew[i]===$scope.compareOld[i2])
			{
				console.log("Match! ");
				streak++;
				if(streak>2)
				{
				//if both equal to each other than no deletions
					deletions[i]=false;
				}
				i++;
			}
			else
			{
				streak=0;
				console.log("Insertion! ");
				i++;
			}
		}
	  }
	 */
	 //post to a different api api/thing/chat._id/number
      $http.put('/api/chats/' + chat._id, { message: $scope.editedMessage });
	  $scope.editedMessage = '';
	  
	      $scope.opened = !$scope.opened;
		 // document.getElementById('editText').innerHTML ='Hellllooooooooooooooo';
		  	//chat.active = true;
	  });
	  });
    };
	
	//$scope.go = "testing";
	
	/*
	$( document ).ready(function(){
		  $("#txtArea").val(function(){
			return "hello";
		  });
		});
	*/
		
	//modify or show chat
	//$scope.modify = false;
	
	/*
	 $http.get('/api/chats/53d6fbcd9d9ea4c823ca9eb7').success(function(firstText) {
	$scope.sample = firstText.message;
	console.debug($scope.sample);
	
	//so it can be placed in textarea
	$scope.getObjectAsText = function () {
    $scope.textAreaModel = JSON.stringify($scope.sample);
	};
	
	$scope.$watch('textAreaModel', function () {
    try {
        $scope.sample = JSON.parse($scope.textAreaModel);
    } catch(exp) {
        //Exception handler
    };
});

	});*/

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
	  socket.unsyncUpdates('chat');//might not need
	  });
  });