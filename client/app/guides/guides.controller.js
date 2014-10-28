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
	
	$scope.diyWrite = function() {
	$scope.formCheckTitle = false;
	$scope.formCheckContent = false;
	if($scope.newTitle === '') {
		$scope.formCheckTitle = true;
		console.log("Was not sent to database, no title");
        return;
      }
	if($scope.newContent === '') {
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
		console.log('wat');
   }
}
  
  var dog = getAddedorRemovedItem($scope.compareNew,$scope.compareOld, true);
  console.log("removed: " + dog);
  var cat = getAddedorRemovedItem($scope.compareNew,$scope.compareOld, false);
  console.log("added: " + cat);
  //console.log(getAddedorRemovedItem($scope.compareNew,$scope.compareOld, false));

	 /*
	 var insertions=[];//rename to insertions
	 var deletions=[];
	 var storeDeletions=[];
	 var wasDeletions = false;
	 //var insertionCheck = 0;
	 var checkDel=false;
	 var i5;
	  //var streak=0; //look up clojures
	  //console.log("streak "  + streak);
	  for(var i=0; i<$scope.compareNew.length; i++)
	  {
	  	console.log("Reached the loop! " + i);
		var insertionCheck = 0;
		//var i3=0;//was var i3=i;
		for(var i2=0; i2<$scope.compareOld.length; i2++)
		{
			if($scope.compareNew[i]===undefined)
			{
				console.error("COMPARE LOOP ERROR, NEW IS UNDEFINED");
			}
			if($scope.compareNew[i]===null)
			{
				console.error("COMPARE LOOP ERROR, NEW IS NULL");
			}
			if($scope.compareOld[i2]===undefined)
			{
				console.error("COMPARE LOOP ERROR, OLD IS UNDEFINED");
			}
			if($scope.compareOld[i2]===null)
			{
				console.error("COMPARE LOOP ERROR, OLD IS NULL");
			}
		
			if($scope.compareNew[i]!==$scope.compareOld[i2])
			{
				
				//streak=0;
				for(var i3=i2; i3<$scope.compareNew.length; i3++)//i2 was insertionCheck
				{
					console.log("i3: " + i3);
					//deletions[i3];
					if($scope.compareNew[i]===$scope.compareOld[i3])//<-----------------------------------------
					{
						//i3++;
						deletions[i3]=true;
						//i3--;
						console.log("Deletions were made at index: " + i3);
						wasDeletions=true;
						i3=$scope.compareNew.length;
					}

				}
				
				if(wasDeletions===false)
				{
					console.log("Deletions array before empty " + deletions);
					deletions=[];
					console.log("Deletions array after empty " + deletions);
					console.log("Insertion! " + i);
					insertions[i]=true;
				}
				if(wasDeletions===true)
				{
					wasDeletions=false;
					//vsr i20 = something else something else is 0 if storeDel length is undefined
					for(var i20=storeDeletions.length, i9=0; i9<deletions.length; i9++, i20++)
					{
						//i20=storeDeletions.length;
						console.log("i20 " + i20);
						storeDeletions[i20]=deletions[i9];
					}
					deletions=[];
					i3=$scope.compareNew.length;
				}
				if(wasDeletions===undefined)
				{
					console.log("INNER LOOP ERROR FOR COMPARE NEW TO OLD GUIDE");
				}
			}
			if($scope.compareNew[i]===$scope.compareOld[i2])//i here and below were i3
			{
				console.log("Match! " + i);
/* 				streak++;
				if(streak>1)
				{ */
				//if both equal to each other than no insertions
					//insertions[i3-2,i3-1,i3]=false; //probably have to break this up into 3 lines
					/* insertions[i3-2]=false;
					insertions[i3-1]=false; */
					//insertions[i]=false;
					//insertionCheck++;
					/* checkDel=true;
					i5=i;
					while(checkDel===true)
					{
						i5--;
						if($scope.compareNew[i5]===$scope.compareOld[i5] && insertions[i5]===false && i5>=0)
						{
							console.log("Deletion! " + i5);
						}
						else
						{
							checkDel==false;
						}
					} */
					
					//i2=$scope.compareOld.length;
					//i++;
					
					
				/* 	console.log("Streak! " + i3);
				}//look up mongoose query for updates updating insertions additions ect
				i3++;
				i2--; */
		/*	}

				//i3++;
		}
	  }
	  for(var i4=0; i4<$scope.compareNew.length; i4++)
	  {
		console.log("COMPARE USEING NEW INSERTIONS: " + insertions[i4]);
		console.log("COMPARE USEING NEW DELETIONS: " + storeDeletions[i4]);//was i20
	  }
	  for(var i6=0; i6<$scope.compareOld.length; i6++)//was i4
	  {
		console.log("COMPARE USEING OLD INSERTIONS: " + insertions[i6]);//was i4
		console.log("COMPARE USEING OLD DELETIONS: " + storeDeletions[i6]);//was i20
	  }
	 */

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