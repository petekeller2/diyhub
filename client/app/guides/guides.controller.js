'use strict';
//need a hide-show for: creating a guide, the guide menu(list of the guides) and a specific guide
angular.module('DIYhub')
  .controller('GuidesCtrl', function ($scope, $http, socket, Auth) {
	
	$scope.getCurrentUser = Auth.getCurrentUser;
	
	console.log("USERNAME IS: " + $scope.getCurrentUser().name);
	
	$scope.texts = [];
	$scope.edits = [];
	
	$scope.newTitle = '';
	$scope.newContent = '';
	
	$scope.formCheckTitle = false;
	$scope.formCheckContent = false;
	$scope.opened = false;
	$scope.read = false;
	$scope.writeGuide = false;
	$scope.viewEdits = false;
	
	$scope.showEdits = function() {
		$scope.viewEdits = !$scope.viewEdits;
	};
	
	$scope.cancel = function() {
		$scope.opened = !$scope.opened;
	};
	
	$scope.diyWriteBack = function() {
		$scope.writeGuide = !$scope.writeGuide;
	};

	$scope.view = function(text)
	{
		$scope.read = !$scope.read;
		$scope.textSelected = text;
	};
	
	$scope.back = function() {
		$scope.read = !$scope.read;
	};
//	$scope.modified() = main.isModify();
  //  $scope.opened=false;
  
	 $scope.toggle = function(text) {
		$scope.opened = !$scope.opened;
		//console.log($scope.opened);
		$scope.textSave = text;
		console.log("Toggle value in angular scope: " + $scope.textSave); 
		$scope.width = document.getElementById('article').offsetWidth;
		$scope.hieght = document.getElementById('article').offsetHeight;
		console.log("Article width is " + $scope.width + " and article height is " + $scope.hieght);
		$scope.editContent = '<textarea id="txtArea" rows="4" cols="50">' + $scope.textSave.content + '</textarea>'
		document.getElementById('editText').innerHTML = $scope.editContent; 
		//console.log($scope.content);
	  //  $scope.$apply();
	};
	
	$http.get('/api/edits').success(function(edits)
	{
		$scope.edits = edits;
		socket.syncUpdates('edit', $scope.edits);
	});

    $http.get('/api/instructions').success(function(texts) {
	console.log("Length: " + texts.length);
      $scope.texts = texts;
      socket.syncUpdates('instruction', $scope.texts);
    });
	
	/*********   Have a last updated field in instructions so they can be sorted by time  
				Have no initial transition in animation or have it be a fade in animation	**********/
	$scope.acceptEdit = function(editMade, editorName, editTag, textEditors) {

		if(textEditors === undefined)
		{
			$http.put('/api/instructions/' + editTag, { content: editMade, editors : editorName});
			/* $http.get('/api/instructions/' + $scope.textSelected._id).success(function(text) {
				$scope.textSelected = text;
				socket.syncUpdates('instruction', $scope.texts);
			}); */
			$scope.showEdits();
			return;
		}
		else if(textEditors != undefined)
		{
			$http.put('/api/instructions/' + editTag, { content: editMade, editors : textEditors + ", " + editorName});
			/* $http.get('/api/instructions/' + $scope.textSelected._id).success(function(text) {
				$scope.textSelected = text;
			});*/
			$scope.showEdits(); 
			return;
		}
		else
		{
			console.error("ERROR: See acceptEdit in guides.controller.js to debug error");
		}
	};
	
	/* $scope.addText = function(newValue) {
		$scope.modify=!$scope.modify;
		$scope.sample = newValue;
	 };*/

/*     $scope.addInstruction = function() {
      if($scope.newTitle === '' || $scope.newContent === '') {
        return;
      }
      $http.post('/api/instructions', { title: $scope.newTitle, content: $scope.newContent, author: $scope.getCurrentUser().name});
      $scope.newTitle = '';
	  $scope.newContent = '';
    }; */
	
	$scope.diyWrite = function() 
	{
		$scope.formCheckTitle = false;
		$scope.formCheckContent = false;
		if($scope.newTitle === '') 
		{
			$scope.formCheckTitle = true;
			console.log("Was not sent to database, no title");
			return;
		}
		if($scope.newContent === '')
		{
			$scope.formCheckContent = true;
			console.log("Was not sent to database, no content");
			return;	
		}
	    $http.post('/api/instructions', { title: $scope.newTitle, content: $scope.newContent, author: $scope.getCurrentUser().name, pendingEditCount: 0});
	    $scope.newTitle = '';
	    $scope.newContent = '';
	    console.log("Title: " + $scope.newTitle + " Content: " + $scope.newContent + " was sent to database");
	    $scope.diyWriteBack();
	};
	
    $scope.updateInstruction = function(instruction) {
		//$scope.content = ' <form class="instruction-update-form-new"> <label>instruction Update New</label> <p class="input-group"> <textarea id="txtArea" rows="4" cols="50">' + $scope.textSave.message + '</textarea> <span class="input-group-btn"></span> </p> </form> <button type="submit" class="btn btn-primary" ng-click="updateinstruction(textSave)">Update</button> '
	//document.getElementById('editText').innerHTML = $scope.content;
	//$scope.modify=!$scope.modify;
	$(function() {
	$scope.editedContent = $('textarea#txtArea').val();
	console.log("this is the old textarea val: " + $scope.editedContent); 
	
	console.log("this is the instruction input: " + instruction.content);
	  if($scope.editedContent === instruction.content) {		//if there are no changes
        return;
      }
	  /*
	 if($scope.updateMessage === '') {
        return;
      }*/
	  
	 // $http.get('/api/instructions/' + instruction._id).success(function() {
	  $scope.compareOld = (instruction.content).split(" ");
      socket.syncUpdates('instruction', $scope.compareOld);//redundant?
	  console.log("Old message: " + $scope.compareOld);
	  console.log("instruction.MESSAGE: " + instruction.content);
		
		console.log("New message: " + $scope.editedContent);
	  
	  $scope.compareNew = ($scope.editedContent).split(" ");
	  console.log($scope.compareNew);
	  console.log($scope.compareNew.length);
	  console.log($scope.compareNew[2]);
	  console.log($scope.compareNew[200]);//undefined
	  
	 //if($scope.compareNew.length>$scope.compareOld.length)
	 
/*  This shows what the edit added or removed from the original guide.
 *
 *
*/ 
//for suggested changes	, maybe not assign function as variable   //bool changed to a string for 4
var getAddedorRemovedItem = function (sourceArray1, sourceArray2, bool) {
    var added = [], addedLoc = [], removed = [], removeLoc = [], i=0;
    sourceArray1.forEach(function(item){
		i++;
        if (sourceArray2.indexOf(item) == -1) {
			//console.log(item);
			console.log(i);
			addedLoc.push(i);
            added.push(item);
        }
    });
	console.log(addedLoc);
	i=0;
    sourceArray2.forEach(function (item) {
		i++;
        if (sourceArray1.indexOf(item) == -1) {
			removeLoc.push(i);
            removed.push(item);
        }
   });
   console.log(removeLoc);
   
   //console.log(added);
   //console.log(removed);
   if(bool==true)
   {
		return removed;
   }
   else if(bool==false)
   {
		return added;
   }
   else
   {
		console.log('getAddedorRemovedItem error');
   }
}
  
  var dog = getAddedorRemovedItem($scope.compareNew,$scope.compareOld, true);
  console.log("removed: " + dog);
  var cat = getAddedorRemovedItem($scope.compareNew,$scope.compareOld, false);
  console.log("added: " + cat);
  //console.log(getAddedorRemovedItem($scope.compareNew,$scope.compareOld, false));

	

	 if($scope.getCurrentUser().name === instruction.author && instruction.author !== undefined)
	 {
		 $http.put('/api/instructions/' + instruction._id, { content: $scope.editedContent });
		 console.log("Updating your own post");
	 }
	 else
	 {
	 	$http.get('/api/instructions/' + instruction._id).success(function(text) {
				//console.log("text: " + text);
				//console.log("count(text): " + text.pendingEditCount);
				//socket.syncUpdates('instruction', $scope.textSelected);
				$scope.numberOfEdits = text; 
				$scope.numberOfEdits = $scope.numberOfEdits.pendingEditCount;
				console.log("count(numberOfEdits): " + $scope.numberOfEdits);
				$scope.editCount = ($scope.numberOfEdits + 1);
				console.log("edit count: " + $scope.editCount);
				$http.put('/api/instructions/' + instruction._id, { pendingEditCount: $scope.editCount});
			});
		
		//this if is only for testing purposes		
		if($scope.getCurrentUser().name === undefined)
		{
			$http.post('/api/edits', { editedContent: $scope.editedContent, editor: "anonymous on: " + Date.now(), link: instruction._id});

		}
		else if($scope.getCurrentUser().name !== undefined)
		{
			$http.post('/api/edits', { editedContent: $scope.editedContent, editor: $scope.getCurrentUser().name + " on: " + Date.now(), link: instruction._id});
		}
	  }
/* 	  $http.put('/api/instructions/' + instruction._id, { content: $scope.editedContent });
	  $scope.editedContent = ''; */
	  	  
		$scope.editedContent = '';
	    $scope.opened = !$scope.opened;

	  //});
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
		
	//modify or show instruction
	//$scope.modify = false;
	
	/*
	 $http.get('/api/instructions/53d6fbcd9d9ea4c823ca9eb7').success(function(firstText) {
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
	  socket.unsyncUpdates('instruction');
	  socket.unsyncUpdates('edit');
	  });
  });