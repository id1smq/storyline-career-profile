window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var once = player.once;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
var update = player.update;
var pointerX = player.pointerX;
var pointerY = player.pointerY;
var showPointer = player.showPointer;
var hidePointer = player.hidePointer;
var slideWidth = player.slideWidth;
var slideHeight = player.slideHeight;
window.Script1 = function()
{
  var loadedCount = 0; //keep track of how many libraries loaded, so we do not reload the same again
var amountOfLibs = 1; //How many unique JS libraries are we loading
var player = GetPlayer();

//Place WO with empty index.html and all external file sets in individual folders
//on stand alone slide in another scene. Set to open into a new window.
//Add a button to that slide that relaunches the slide with the WO.
//publish that slide, click button, and record the location of the WO folder
//which is text string afte "/story_content/WebObjects/" in URL
//Save string in woFolder variable so this script can find and load files
var woFolder = player.GetVar("woFolder"); //Get location of the WO files in the SL site
console.log("woFolder: " + woFolder);

function loadJSfile(filename, filetype){
	if (filetype=="js"){ //if filename is a external JavaScript file
		var fileref=document.createElement('script');
		
		fileref.setAttribute("type","text/javascript");
		fileref.setAttribute("src", filename);

		fileref.onload = function() {
			loadedCount++;
			console.log(loadedCount+" JS / "+filename+' loaded.');

			if(loadedCount >= amountOfLibs){//if we loaded all the unique JS files, then indicate and exit
			//register the plugin (just once)
				gsap.registerPlugin(MotionPathPlugin);
				
				//will only run this loader when javascriptsLoaded == false
				player.SetVar("javascriptsLoaded", true);
			}
		};
	}
	else if (filetype=="css"){ //if filename is an external CSS file
		var fileref=document.createElement("link")

		fileref.setAttribute("rel", "stylesheet")
		fileref.setAttribute("type", "text/css")
		fileref.setAttribute("href", filename);

		fileref.onload = function() {
			loadedCount++;
			console.log(loadedCount+" CSS / "+filename+' loaded.');

			if(loadedCount >= amountOfLibs){
				player.SetVar("javascriptsLoaded", true);
			}
		};
	}
	if (typeof fileref!="undefined") {
		document.getElementsByTagName("head")[0].appendChild(fileref)
	}
}

//When we change anything in the scriptFolder this needs to change
var scriptFolder ="story_content/WebObjects/" + woFolder + "/";

//And lastly we call the functions we want to run
//add the folder names and files names to the WO path
loadJSfile(scriptFolder+"GSAP/MotionPathPlugin.min.js", "js");

}

window.Script2 = function()
{
  //GSAP Animated menu

//This contains all the needed parts, so you only have to call one script with some flags set
//This will initialize the menu, set up a resize observer, move the menu forward or backward, and remove the resize observer
//depending upon how the flag variables are set

let player = GetPlayer();

let menuDebug = player.GetVar("menuDebug");

if (player.GetVar("menuEndResizer")) {
	let ro = player.GetVar("menuResizer");

	ro.disconnect();
	
	if (menuDebug) {console.log("Stop resizing");}
	
	player.SetVar("menuEndResizer",false);
	return;
}
if (menuDebug) {console.log("Continuing...");}

let ro;
let menuItem = [];
let itemPathMap = player.GetVar("itemPathMap");
let allPaths = [];
let menuItemCount = player.GetVar("menuItemCount");

// These are used to indicate how the menu items should appear at each stopping location on the menu path
// Use them to give the menu some depth if desired (e.g., to simulated 3-D paths
// "To" = the styles to use at the end of each path segment movement
// "FromFor" = the styles to use as a starting point when moving FORWARD
// "FromBak" = the styles to use as a starting point when moving BACKWARD

let scaleFactorTo = player.GetVar("scaleFactorTo");
let opacityFactorTo = player.GetVar("opacityFactorTo");
let zIndexFactorTo = player.GetVar("zIndexFactorTo");

//Set the Scaling Array
let scaleFactorFromFor = [];
let scaleFactorFromBak = [];

//Set the Opacity Array
let opacityFactorFromFor = [];
let opacityFactorFromBak = [];

//Set the zIndex Array
let zIndexFactorFromFor = [];
let zIndexFactorFromBak = [];

//adjust the styling maps for the forward and Backward From directions
for(let i = 0; i < scaleFactorTo.length; i++) {
	//This is the "To" array, shifted and wrapping one position the the right
	scaleFactorFromFor[i] = scaleFactorTo[((i == 0) ? (scaleFactorTo.length -1) : (i-1))];
	//This is the "To" array, shifted and wrapping one position the the left
	scaleFactorFromBak[i] = scaleFactorTo[((i == (scaleFactorTo.length -1)) ? (0) : (i+1))];
	
	opacityFactorFromFor[i] = opacityFactorTo[((i == 0) ? (scaleFactorTo.length -1) : (i-1))];
	opacityFactorFromBak[i] = opacityFactorTo[((i == (scaleFactorTo.length -1)) ? (0) : (i+1))];	
	
	zIndexFactorFromFor[i] = zIndexFactorTo[((i == 0) ? (scaleFactorTo.length -1) : (i-1))];
	zIndexFactorFromBak[i] = zIndexFactorTo[((i == (scaleFactorTo.length -1)) ? (0) : (i+1))];	
}

// ***also see the itemPathMap array in the initializeMenu() function below to set menu item starting positions

//----Resize Observer function----------------------------------------------------------------------------------------------
// watch for document resizing and keep the menu items where they should be
// this just uses the last known movement paths to redraw the menu items at the end of each path
// if you resize WHILE the animation is running (unlikely), it will not properly align until you move the menu or resize again
if (player.GetVar("initMenu")) {
	ro = new ResizeObserver(entries => {
		try {
			if (!player.GetVar("menuEndResizer")) {
			
			let player = GetPlayer();

			let menuDebug = player.GetVar("menuDebug");
			let menuItemCount = player.GetVar("menuItemCount");
			let scaleFactorTo = player.GetVar("scaleFactorTo");
			let opacityFactorTo = player.GetVar("opacityFactorTo");
			let zIndexFactorTo = player.GetVar("zIndexFactorTo");
			let itemPathMap = player.GetVar("itemPathMap");
			let allPaths = [];
			let menuItem = [];
			
			if (menuDebug) {console.log("Resizing called...");}

			//Now, set accurate starting positions based on itemPathMap

			//get each element in the menu
			for (let i = 0; i < menuItemCount; i++) {
				menuItem[i] = document.querySelector("[data-acc-text='menuItem_" + (i+1) + "']");
			}		

			//get updated array of paths for the menu items to follow
			allPaths = document.querySelectorAll("[data-acc-text='menuPath'] path");
			//use these to set correct endpoints	

			//set the animation endpoint for each menu item
			for (let i = 0; i < menuItemCount; i++) {
				gsap.set(menuItem[i], {
				  motionPath: {
					path: allPaths[itemPathMap[i]],
					align: allPaths[itemPathMap[i]],
					alignOrigin: [0.5, 0.5],
					autoRotate: false,
				  },
				  transformOrigin: "50% 50%",
				  scale: scaleFactorTo[itemPathMap[i]],
				  opacity: opacityFactorTo[itemPathMap[i]],
				  zIndex: zIndexFactorTo[itemPathMap[i]]
				});
			}
				
			if (menuDebug) {console.log("Resizing done.");}
		}
		} catch (error) {
			console.log("resizeObserver Error catch");
			console.log(error);
		}
	});

	//keep track of resize observer so we can recall or cancel it later
	player.SetVar("menuResizer", ro);
}


//----Initialize function called from timeout----------------------------------------------------------------------------
// sets the starting positions of the menu items,
// locates the menu path shape (e.g., an ellipse),
// duplicates the original path once for each menu item,
// for each menu item, extracts a segment of the original path for it to traverse during a menu advance,
// overwrites each of the path copies with the new segments
// sets the menu items into the correct starting positions
// unhides the menu
// indicates which item is currently front-most
// attaches a resize observer to an object on the to keep everything the the correct positions
// save any reused variables back to SL for later script calls

	function initializeMenu() {
		let menuDebug = player.GetVar("menuDebug");
		if (menuDebug) {console.log("Initializing");}
		
		let rawPath, splitPath, splitPathString, allPaths, tmp;
		let menuPath;
		let colorList = ["#0088CC","#FFC512","#0088CC","#FFC512","#0088CC","#FFC512","#0088CC","#FFC512","#0088CC"];//starts with blue, yellow...
		
		let menuGroup = document.querySelector("[data-acc-text='menuGroup']");
		let ro = player.GetVar("menuResizer");
		let pathSegment = player.GetVar("pathSegment");
		
		//***Note: the MotionPath GSAP plug-in is registered on the master slide, after loading the JS code from the web object folder
		
		//get the path to follow and save a copy of the original
		menuPath = document.querySelector("[data-acc-text='menuPath'] path");
		player.SetVar("originalPath", menuPath);// in case we might need it again later (not used right now)
		
		//Assume we have 1 original path, then add copies for each new segment to overwrite
		for (let i = 1; i < menuItemCount; i++) {
			
			//clone this element
			tmp = menuPath.cloneNode(true);
			menuPath.parentNode.insertBefore(tmp,menuPath.nextSibling);
		}

		//Get the raw path from the element
		rawPath = MotionPathPlugin.getRawPath(menuPath);
		
		//get list of all path elements in the svg
		allPaths = document.querySelectorAll("[data-acc-text='menuPath'] path");
		
		
		
		//overwrite data in each path with sliced segments
		for (let i = 0; i < menuItemCount; i++) {
			if (pathSegment[0] == "auto") {
				//calculate even splits along length based on number of menu items
				splitPath = MotionPathPlugin.sliceRawPath(rawPath,(1/menuItemCount)*i,(1/menuItemCount)*(i+1));
			}
			else {
				//get from array of fractional pairs [start0, end0, start1, end1, ...]
				splitPath = MotionPathPlugin.sliceRawPath(rawPath,pathSegment[2*i],pathSegment[2*i+1]);
			}
			splitPathString = MotionPathPlugin.rawPathToString(splitPath);

			//overwrite the data attribute of this path segment
			(allPaths[i]).setAttribute("d",splitPathString);
			
			//if debugging, set different colors for the different path segments so you can see where they are
			if (menuDebug) {
				(allPaths[i]).setAttribute("stroke",colorList[((i < colorList.length) ? i : colorList.length-1)]);
				(allPaths[i]).setAttribute("stroke-opacity", 1);
			}
			
		}
		
		//Now we have an SVG with the original single path split into several contiguous sub paths, each copied into sequential path entries
		
		//Now, set accurate starting positions based on itemPathMap
		
		//get each element in the menu
		for (let i = 0; i < menuItemCount; i++) {
			menuItem[i] = document.querySelector("[data-acc-text='menuItem_" + (i+1) + "']");
		}		
		
		//get updated array of paths for the menu items to follow
		allPaths = document.querySelectorAll("[data-acc-text='menuPath'] path");
		//use these to set correct endpoints	
		
		
		//set the animation endpoint for each menu item
		for (let i = 0; i < menuItemCount; i++) {
				
			gsap.set(menuItem[i], {
			  motionPath: {
				path: allPaths[itemPathMap[i]],
				align: allPaths[itemPathMap[i]],
				alignOrigin: [0.5, 0.5],
				autoRotate: false,
			  },
			  transformOrigin: "50% 50%",
			  scale: scaleFactorTo[itemPathMap[i]],
			  opacity: opacityFactorTo[itemPathMap[i]],
			  zIndex: zIndexFactorTo[itemPathMap[i]]
			});
		}
		
		//fade in menu group when done
		gsap.to(menuGroup, {opacity: 1, duration: 0.5});
		
		//indicate which menu item is in front (i+1)
		//this is defined as the item in positon 0 (or at the end of segment #0, the first path segment)
		//change the comparison to set a different primary position
		for (let i = 0; i < menuItemCount; i++) {
			if (itemPathMap[i] == player.GetVar("menuFrontPosition")) {
				player.SetVar("frontMenuItem", i+1);
			}
		}
		
		//Attach the resize observer function attached to main slide base layer
		//let e= document.querySelector("[data-acc-text='Mask 1']");//could also attach this to an object on each slide with accessibility label "Mask1", or whatever
		let e= document.getElementsByClassName("slide-layer base-layer")[0];
		ro.observe(e);
		
		if (menuDebug) {console.log("Resizer started...");}

		//Save the data needed for later to SL (for future JS calls and resizing function)
		//player.SetVar("scaleFactorTo", scaleFactorTo);
		//player.SetVar("opacityFactorTo", opacityFactorTo);
		//player.SetVar("zIndexFactorTo", zIndexFactorTo);
		//player.SetVar("itemPathMap", itemPathMap);
		
		player.SetVar("initMenu", false);
	}

//----Initialize------------------------------------------------------------------------------------------------------------
// Run Initialize the first time this script is called. Uses "initMenu == true" as a flag.
// uses a timeout to make sure the elements are loaded (defaults to 0.25 seconds),
// this routine hides the menu while initializing
if (player.GetVar("initMenu")) {
	
	//hide menu while initializing
	let menuGroup = document.querySelector("[data-acc-text='menuGroup']");
	menuGroup.style.opacity = 0;

	//use a timeout to ensure all menu parts have loaded before initializing
	//defaults to 0.5 sec

	//set delay before initializing
	setTimeout(initializeMenu, 500);
}


//----Main------------------------------------------------------------------------------------------------------------
// This routine checks for the menu movement direction,
// loads the last path map so we know which segments the menu items need to follow
// adjust the path map for moving forward or backward
// adjust the factor map to assign the correct style attributes to the menu items
// moves the menu items accordingly
// indicates which menu item is front=most
// saves the updated path map

else {
	
	if (menuDebug) {console.log("Main");}
	
	let factorMap = [];	
	
	//Get menu movement direction; is it forward?
	let menuForward = player.GetVar("menuForward");
	
	//load last paths followed by menu items
	itemPathMap = player.GetVar("itemPathMap");
	
	//get each element in the menu
	for (let i = 0; i < menuItemCount; i++) {
		menuItem[i] = document.querySelector("[data-acc-text='menuItem_" + (i+1) + "']");
	}		
	
	//get all the paths for the menu items to follow
	allPaths = document.querySelectorAll("[data-acc-text='menuPath'] path");
	
	//if going backward, adjust the factor map to represent the values (opacity, scale, zIndex) from the previous rather than current segment
	if (!menuForward) {
		for (let i = 0; i < menuItemCount; i++) {
			factorMap[i] = (((itemPathMap[i] - 1) < (0)) ? (menuItemCount -1) : (itemPathMap[i] - 1));
		}
	}
	//if moving forward, step to next path segment BEFORE move. Keep factor map aligned with current segments
	else {
		for (let i = 0; i < menuItemCount; i++) {
			factorMap[i] = (((itemPathMap[i] + 1) > (menuItemCount -1)) ? 0 : (itemPathMap[i] + 1));
			itemPathMap[i] = (((itemPathMap[i] + 1) > (menuItemCount -1)) ? 0 : (itemPathMap[i] + 1));
		}
	}

	
	//move all of the menu items forward along the next path, or backward along the current path
	//Note:  I am not very GSAP savvy, so these fromTo statements may not be structured 100% correctly
	for (let i = 0; i < menuItemCount; i++) {
		
		if (menuForward) {		
			gsap.fromTo(menuItem[i], {
			  motionPath: {
				path: allPaths[itemPathMap[i]],
				align: allPaths[itemPathMap[i]],
				alignOrigin: [0.5, 0.5],
				autoRotate: false,
			  },
			  transformOrigin: "50% 50%",
			  scale: scaleFactorFromFor[factorMap[i]],
			  opacity: opacityFactorFromFor[factorMap[i]],
			  zIndex: zIndexFactorFromFor[factorMap[i]]
			},
			{
			motionPath: {
				path: allPaths[itemPathMap[i]],
				align: allPaths[itemPathMap[i]],
				alignOrigin: [0.5, 0.5],
				autoRotate: false,
			  },
			  transformOrigin: "50% 50%",
			  duration: 1,
			  ease: "power1.inOut",
			  scale: scaleFactorTo[factorMap[i]],
			  opacity: opacityFactorTo[factorMap[i]],
			  zIndex: zIndexFactorTo[factorMap[i]],
			});
		}
		else {
			gsap.fromTo(menuItem[i], {
			  motionPath: {
				path: allPaths[itemPathMap[i]],
				align: allPaths[itemPathMap[i]],
				alignOrigin: [0.5, 0.5],
				autoRotate: false,
			  },
			  transformOrigin: "50% 50%",
			  scale: scaleFactorTo[factorMap[i]],
			  opacity: opacityFactorTo[factorMap[i]],
			  zIndex: zIndexFactorTo[factorMap[i]]
			},
			{
			motionPath: {
				path: allPaths[itemPathMap[i]],
				align: allPaths[itemPathMap[i]],
				alignOrigin: [0.5, 0.5],
				autoRotate: false,
			  },
			  transformOrigin: "50% 50%",
			  duration: 1,
			  ease: "power1.inOut",
			  scale: scaleFactorFromBak[factorMap[i]],
			  opacity: opacityFactorFromBak[factorMap[i]],
			  zIndex: zIndexFactorFromBak[factorMap[i]],
			  runBackwards: true
			});
		}

	}
	
	//if moving backward, step to previous path segment AFTER move, since move reversed current segment
	if (!menuForward) {
		for (let i = 0; i < menuItemCount; i++) {
			itemPathMap[i] = (((itemPathMap[i] - 1) < (0)) ? (menuItemCount -1) : (itemPathMap[i] - 1));
		}
	}
		
	//indicate which menu item is now in front (i+1)
	for (let i = 0; i < menuItemCount; i++) {
		if (itemPathMap[i] == player.GetVar("menuFrontPosition")) {
			player.SetVar("frontMenuItem", i+1);
		}
	}
	
	//Save the updated data needed for later
	player.SetVar("itemPathMap", itemPathMap);


//----End of Script---------------------------------------------------------------------------------------------------------
}
}

window.Script3 = function()
{
  var loadedCount = 0; //keep track of how many libraries loaded, so we do not reload the same again
var amountOfLibs = 1; //How many unique JS libraries are we loading
var player = GetPlayer();

//Place WO with empty index.html and all external file sets in individual folders
//on stand alone slide in another scene. Set to open into a new window.
//Add a button to that slide that relaunches the slide with the WO.
//publish that slide, click button, and record the location of the WO folder
//which is text string afte "/story_content/WebObjects/" in URL
//Save string in woFolder variable so this script can find and load files
var woFolder = player.GetVar("woFolder"); //Get location of the WO files in the SL site
console.log("woFolder: " + woFolder);

function loadJSfile(filename, filetype){
	if (filetype=="js"){ //if filename is a external JavaScript file
		var fileref=document.createElement('script');
		
		fileref.setAttribute("type","text/javascript");
		fileref.setAttribute("src", filename);

		fileref.onload = function() {
			loadedCount++;
			console.log(loadedCount+" JS / "+filename+' loaded.');

			if(loadedCount >= amountOfLibs){//if we loaded all the unique JS files, then indicate and exit
			//register the plugin (just once)
				gsap.registerPlugin(MotionPathPlugin);
				
				//will only run this loader when javascriptsLoaded == false
				player.SetVar("javascriptsLoaded", true);
			}
		};
	}
	else if (filetype=="css"){ //if filename is an external CSS file
		var fileref=document.createElement("link")

		fileref.setAttribute("rel", "stylesheet")
		fileref.setAttribute("type", "text/css")
		fileref.setAttribute("href", filename);

		fileref.onload = function() {
			loadedCount++;
			console.log(loadedCount+" CSS / "+filename+' loaded.');

			if(loadedCount >= amountOfLibs){
				player.SetVar("javascriptsLoaded", true);
			}
		};
	}
	if (typeof fileref!="undefined") {
		document.getElementsByTagName("head")[0].appendChild(fileref)
	}
}

//When we change anything in the scriptFolder this needs to change
var scriptFolder ="story_content/WebObjects/" + woFolder + "/";

//And lastly we call the functions we want to run
//add the folder names and files names to the WO path
loadJSfile(scriptFolder+"GSAP/MotionPathPlugin.min.js", "js");

}

window.Script4 = function()
{
  //GSAP Animated menu

//This contains all the needed parts, so you only have to call one script with some flags set
//This will initialize the menu, set up a resize observer, move the menu forward or backward, and remove the resize observer
//depending upon how the flag variables are set

let player = GetPlayer();

let menuDebug = player.GetVar("menuDebug");

if (player.GetVar("menuEndResizer")) {
	let ro = player.GetVar("menuResizer");

	ro.disconnect();
	
	if (menuDebug) {console.log("Stop resizing");}
	
	player.SetVar("menuEndResizer",false);
	return;
}
if (menuDebug) {console.log("Continuing...");}

let ro;
let menuItem = [];
let itemPathMap = player.GetVar("itemPathMap");
let allPaths = [];
let menuItemCount = player.GetVar("menuItemCount");

// These are used to indicate how the menu items should appear at each stopping location on the menu path
// Use them to give the menu some depth if desired (e.g., to simulated 3-D paths
// "To" = the styles to use at the end of each path segment movement
// "FromFor" = the styles to use as a starting point when moving FORWARD
// "FromBak" = the styles to use as a starting point when moving BACKWARD

let scaleFactorTo = player.GetVar("scaleFactorTo");
let opacityFactorTo = player.GetVar("opacityFactorTo");
let zIndexFactorTo = player.GetVar("zIndexFactorTo");

//Set the Scaling Array
let scaleFactorFromFor = [];
let scaleFactorFromBak = [];

//Set the Opacity Array
let opacityFactorFromFor = [];
let opacityFactorFromBak = [];

//Set the zIndex Array
let zIndexFactorFromFor = [];
let zIndexFactorFromBak = [];

//adjust the styling maps for the forward and Backward From directions
for(let i = 0; i < scaleFactorTo.length; i++) {
	//This is the "To" array, shifted and wrapping one position the the right
	scaleFactorFromFor[i] = scaleFactorTo[((i == 0) ? (scaleFactorTo.length -1) : (i-1))];
	//This is the "To" array, shifted and wrapping one position the the left
	scaleFactorFromBak[i] = scaleFactorTo[((i == (scaleFactorTo.length -1)) ? (0) : (i+1))];
	
	opacityFactorFromFor[i] = opacityFactorTo[((i == 0) ? (scaleFactorTo.length -1) : (i-1))];
	opacityFactorFromBak[i] = opacityFactorTo[((i == (scaleFactorTo.length -1)) ? (0) : (i+1))];	
	
	zIndexFactorFromFor[i] = zIndexFactorTo[((i == 0) ? (scaleFactorTo.length -1) : (i-1))];
	zIndexFactorFromBak[i] = zIndexFactorTo[((i == (scaleFactorTo.length -1)) ? (0) : (i+1))];	
}

// ***also see the itemPathMap array in the initializeMenu() function below to set menu item starting positions

//----Resize Observer function----------------------------------------------------------------------------------------------
// watch for document resizing and keep the menu items where they should be
// this just uses the last known movement paths to redraw the menu items at the end of each path
// if you resize WHILE the animation is running (unlikely), it will not properly align until you move the menu or resize again
if (player.GetVar("initMenu")) {
	ro = new ResizeObserver(entries => {
		try {
			if (!player.GetVar("menuEndResizer")) {
			
			let player = GetPlayer();

			let menuDebug = player.GetVar("menuDebug");
			let menuItemCount = player.GetVar("menuItemCount");
			let scaleFactorTo = player.GetVar("scaleFactorTo");
			let opacityFactorTo = player.GetVar("opacityFactorTo");
			let zIndexFactorTo = player.GetVar("zIndexFactorTo");
			let itemPathMap = player.GetVar("itemPathMap");
			let allPaths = [];
			let menuItem = [];
			
			if (menuDebug) {console.log("Resizing called...");}

			//Now, set accurate starting positions based on itemPathMap

			//get each element in the menu
			for (let i = 0; i < menuItemCount; i++) {
				menuItem[i] = document.querySelector("[data-acc-text='menuItem_" + (i+1) + "']");
			}		

			//get updated array of paths for the menu items to follow
			allPaths = document.querySelectorAll("[data-acc-text='menuPath'] path");
			//use these to set correct endpoints	

			//set the animation endpoint for each menu item
			for (let i = 0; i < menuItemCount; i++) {
				gsap.set(menuItem[i], {
				  motionPath: {
					path: allPaths[itemPathMap[i]],
					align: allPaths[itemPathMap[i]],
					alignOrigin: [0.5, 0.5],
					autoRotate: false,
				  },
				  transformOrigin: "50% 50%",
				  scale: scaleFactorTo[itemPathMap[i]],
				  opacity: opacityFactorTo[itemPathMap[i]],
				  zIndex: zIndexFactorTo[itemPathMap[i]]
				});
			}
				
			if (menuDebug) {console.log("Resizing done.");}
		}
		} catch (error) {
			console.log("resizeObserver Error catch");
			console.log(error);
		}
	});

	//keep track of resize observer so we can recall or cancel it later
	player.SetVar("menuResizer", ro);
}


//----Initialize function called from timeout----------------------------------------------------------------------------
// sets the starting positions of the menu items,
// locates the menu path shape (e.g., an ellipse),
// duplicates the original path once for each menu item,
// for each menu item, extracts a segment of the original path for it to traverse during a menu advance,
// overwrites each of the path copies with the new segments
// sets the menu items into the correct starting positions
// unhides the menu
// indicates which item is currently front-most
// attaches a resize observer to an object on the to keep everything the the correct positions
// save any reused variables back to SL for later script calls

	function initializeMenu() {
		let menuDebug = player.GetVar("menuDebug");
		if (menuDebug) {console.log("Initializing");}
		
		let rawPath, splitPath, splitPathString, allPaths, tmp;
		let menuPath;
		let colorList = ["#0088CC","#FFC512","#0088CC","#FFC512","#0088CC","#FFC512","#0088CC","#FFC512","#0088CC"];//starts with blue, yellow...
		
		let menuGroup = document.querySelector("[data-acc-text='menuGroup']");
		let ro = player.GetVar("menuResizer");
		let pathSegment = player.GetVar("pathSegment");
		
		//***Note: the MotionPath GSAP plug-in is registered on the master slide, after loading the JS code from the web object folder
		
		//get the path to follow and save a copy of the original
		menuPath = document.querySelector("[data-acc-text='menuPath'] path");
		player.SetVar("originalPath", menuPath);// in case we might need it again later (not used right now)
		
		//Assume we have 1 original path, then add copies for each new segment to overwrite
		for (let i = 1; i < menuItemCount; i++) {
			
			//clone this element
			tmp = menuPath.cloneNode(true);
			menuPath.parentNode.insertBefore(tmp,menuPath.nextSibling);
		}

		//Get the raw path from the element
		rawPath = MotionPathPlugin.getRawPath(menuPath);
		
		//get list of all path elements in the svg
		allPaths = document.querySelectorAll("[data-acc-text='menuPath'] path");
		
		
		
		//overwrite data in each path with sliced segments
		for (let i = 0; i < menuItemCount; i++) {
			if (pathSegment[0] == "auto") {
				//calculate even splits along length based on number of menu items
				splitPath = MotionPathPlugin.sliceRawPath(rawPath,(1/menuItemCount)*i,(1/menuItemCount)*(i+1));
			}
			else {
				//get from array of fractional pairs [start0, end0, start1, end1, ...]
				splitPath = MotionPathPlugin.sliceRawPath(rawPath,pathSegment[2*i],pathSegment[2*i+1]);
			}
			splitPathString = MotionPathPlugin.rawPathToString(splitPath);

			//overwrite the data attribute of this path segment
			(allPaths[i]).setAttribute("d",splitPathString);
			
			//if debugging, set different colors for the different path segments so you can see where they are
			if (menuDebug) {
				(allPaths[i]).setAttribute("stroke",colorList[((i < colorList.length) ? i : colorList.length-1)]);
				(allPaths[i]).setAttribute("stroke-opacity", 1);
			}
			
		}
		
		//Now we have an SVG with the original single path split into several contiguous sub paths, each copied into sequential path entries
		
		//Now, set accurate starting positions based on itemPathMap
		
		//get each element in the menu
		for (let i = 0; i < menuItemCount; i++) {
			menuItem[i] = document.querySelector("[data-acc-text='menuItem_" + (i+1) + "']");
		}		
		
		//get updated array of paths for the menu items to follow
		allPaths = document.querySelectorAll("[data-acc-text='menuPath'] path");
		//use these to set correct endpoints	
		
		
		//set the animation endpoint for each menu item
		for (let i = 0; i < menuItemCount; i++) {
				
			gsap.set(menuItem[i], {
			  motionPath: {
				path: allPaths[itemPathMap[i]],
				align: allPaths[itemPathMap[i]],
				alignOrigin: [0.5, 0.5],
				autoRotate: false,
			  },
			  transformOrigin: "50% 50%",
			  scale: scaleFactorTo[itemPathMap[i]],
			  opacity: opacityFactorTo[itemPathMap[i]],
			  zIndex: zIndexFactorTo[itemPathMap[i]]
			});
		}
		
		//fade in menu group when done
		gsap.to(menuGroup, {opacity: 1, duration: 0.5});
		
		//indicate which menu item is in front (i+1)
		//this is defined as the item in positon 0 (or at the end of segment #0, the first path segment)
		//change the comparison to set a different primary position
		for (let i = 0; i < menuItemCount; i++) {
			if (itemPathMap[i] == player.GetVar("menuFrontPosition")) {
				player.SetVar("frontMenuItem", i+1);
			}
		}
		
		//Attach the resize observer function attached to main slide base layer
		//let e= document.querySelector("[data-acc-text='Mask 1']");//could also attach this to an object on each slide with accessibility label "Mask1", or whatever
		let e= document.getElementsByClassName("slide-layer base-layer")[0];
		ro.observe(e);
		
		if (menuDebug) {console.log("Resizer started...");}

		//Save the data needed for later to SL (for future JS calls and resizing function)
		//player.SetVar("scaleFactorTo", scaleFactorTo);
		//player.SetVar("opacityFactorTo", opacityFactorTo);
		//player.SetVar("zIndexFactorTo", zIndexFactorTo);
		//player.SetVar("itemPathMap", itemPathMap);
		
		player.SetVar("initMenu", false);
	}

//----Initialize------------------------------------------------------------------------------------------------------------
// Run Initialize the first time this script is called. Uses "initMenu == true" as a flag.
// uses a timeout to make sure the elements are loaded (defaults to 0.25 seconds),
// this routine hides the menu while initializing
if (player.GetVar("initMenu")) {
	
	//hide menu while initializing
	let menuGroup = document.querySelector("[data-acc-text='menuGroup']");
	menuGroup.style.opacity = 0;

	//use a timeout to ensure all menu parts have loaded before initializing
	//defaults to 0.5 sec

	//set delay before initializing
	setTimeout(initializeMenu, 500);
}


//----Main------------------------------------------------------------------------------------------------------------
// This routine checks for the menu movement direction,
// loads the last path map so we know which segments the menu items need to follow
// adjust the path map for moving forward or backward
// adjust the factor map to assign the correct style attributes to the menu items
// moves the menu items accordingly
// indicates which menu item is front=most
// saves the updated path map

else {
	
	if (menuDebug) {console.log("Main");}
	
	let factorMap = [];	
	
	//Get menu movement direction; is it forward?
	let menuForward = player.GetVar("menuForward");
	
	//load last paths followed by menu items
	itemPathMap = player.GetVar("itemPathMap");
	
	//get each element in the menu
	for (let i = 0; i < menuItemCount; i++) {
		menuItem[i] = document.querySelector("[data-acc-text='menuItem_" + (i+1) + "']");
	}		
	
	//get all the paths for the menu items to follow
	allPaths = document.querySelectorAll("[data-acc-text='menuPath'] path");
	
	//if going backward, adjust the factor map to represent the values (opacity, scale, zIndex) from the previous rather than current segment
	if (!menuForward) {
		for (let i = 0; i < menuItemCount; i++) {
			factorMap[i] = (((itemPathMap[i] - 1) < (0)) ? (menuItemCount -1) : (itemPathMap[i] - 1));
		}
	}
	//if moving forward, step to next path segment BEFORE move. Keep factor map aligned with current segments
	else {
		for (let i = 0; i < menuItemCount; i++) {
			factorMap[i] = (((itemPathMap[i] + 1) > (menuItemCount -1)) ? 0 : (itemPathMap[i] + 1));
			itemPathMap[i] = (((itemPathMap[i] + 1) > (menuItemCount -1)) ? 0 : (itemPathMap[i] + 1));
		}
	}

	
	//move all of the menu items forward along the next path, or backward along the current path
	//Note:  I am not very GSAP savvy, so these fromTo statements may not be structured 100% correctly
	for (let i = 0; i < menuItemCount; i++) {
		
		if (menuForward) {		
			gsap.fromTo(menuItem[i], {
			  motionPath: {
				path: allPaths[itemPathMap[i]],
				align: allPaths[itemPathMap[i]],
				alignOrigin: [0.5, 0.5],
				autoRotate: false,
			  },
			  transformOrigin: "50% 50%",
			  scale: scaleFactorFromFor[factorMap[i]],
			  opacity: opacityFactorFromFor[factorMap[i]],
			  zIndex: zIndexFactorFromFor[factorMap[i]]
			},
			{
			motionPath: {
				path: allPaths[itemPathMap[i]],
				align: allPaths[itemPathMap[i]],
				alignOrigin: [0.5, 0.5],
				autoRotate: false,
			  },
			  transformOrigin: "50% 50%",
			  duration: 1,
			  ease: "power1.inOut",
			  scale: scaleFactorTo[factorMap[i]],
			  opacity: opacityFactorTo[factorMap[i]],
			  zIndex: zIndexFactorTo[factorMap[i]],
			});
		}
		else {
			gsap.fromTo(menuItem[i], {
			  motionPath: {
				path: allPaths[itemPathMap[i]],
				align: allPaths[itemPathMap[i]],
				alignOrigin: [0.5, 0.5],
				autoRotate: false,
			  },
			  transformOrigin: "50% 50%",
			  scale: scaleFactorTo[factorMap[i]],
			  opacity: opacityFactorTo[factorMap[i]],
			  zIndex: zIndexFactorTo[factorMap[i]]
			},
			{
			motionPath: {
				path: allPaths[itemPathMap[i]],
				align: allPaths[itemPathMap[i]],
				alignOrigin: [0.5, 0.5],
				autoRotate: false,
			  },
			  transformOrigin: "50% 50%",
			  duration: 1,
			  ease: "power1.inOut",
			  scale: scaleFactorFromBak[factorMap[i]],
			  opacity: opacityFactorFromBak[factorMap[i]],
			  zIndex: zIndexFactorFromBak[factorMap[i]],
			  runBackwards: true
			});
		}

	}
	
	//if moving backward, step to previous path segment AFTER move, since move reversed current segment
	if (!menuForward) {
		for (let i = 0; i < menuItemCount; i++) {
			itemPathMap[i] = (((itemPathMap[i] - 1) < (0)) ? (menuItemCount -1) : (itemPathMap[i] - 1));
		}
	}
		
	//indicate which menu item is now in front (i+1)
	for (let i = 0; i < menuItemCount; i++) {
		if (itemPathMap[i] == player.GetVar("menuFrontPosition")) {
			player.SetVar("frontMenuItem", i+1);
		}
	}
	
	//Save the updated data needed for later
	player.SetVar("itemPathMap", itemPathMap);


//----End of Script---------------------------------------------------------------------------------------------------------
}
}

window.Script5 = function()
{
  ///How many menu items are used
let menuItemCount = 9;

// These are used to indicate how the menu items should appear at each stopping location on the menu path
// Use them to give the menu some depth if desired (e.g., to simulated 3-D paths
// "To" = the styles to use at the end of each path segment movement
// "FromFor" = the styles to use as a starting point when moving FORWARD
// "FromBak" = the styles to use as a starting point when moving BACKWARD

//Set the Scaling, Opacity, and zIndex Arrays
let scaleFactorTo = [.75, 1.2, 0.50, 0.45, 0.30, 0.35, 0.40, 0.50, 0.50];//circular menu, clockwise from right
let opacityFactorTo = [0.80, 1, 1.00, 0.90, 0.60, 0.50, 0.40, 0.40, 1.00];
let zIndexFactorTo = [1,8,7,6,5,2,3,4,9];

//Map the path segments to each of the menu items
//this is the path the menu item last followed, currently at the end of the path
//this gets updated before each move (whether backward or forward)

let itemPathMap = [1,2,3,4,5,6,7,8,0];// currently, item 1 at end of segment2, item 2 at end or segment3, ...


// Build equal segments with a small phase offset
//function buildSegmentsWithOffset(n, phaseSegs){
 // const seg = [];
 // for (let i = 0; i < n; i++) {
 //   let a = (i + phaseSegs) / n, b = (i + 1 + phaseSegs) / n;
 //   if (b <= a) b += 1;
//    a -= Math.floor(a); b -= Math.floor(b);
 //   seg.push(a, b);
 // }
 // return seg;
//}

// Nudge “left/clockwise” a little (e.g., ~1/10 of a slot)
//const phaseSegs = 1.22; // try 0.05–0.20 until it looks like ~40–50 px on your oval
//let pathSegment = buildSegmentsWithOffset(menuItemCount, phaseSegs);


//specify how the path is segmented, ot let it auto divide
//let pathSegment = ["auto"];
//or
//specify as fraction (value = 0 to 1) in array [start0, end0, start1, end1, ...]
//let pathSegment = [];

// segment lengths: seg1 = 0.20, others = 0.10 each
let pathSegment = [
  0.00, 0.10,  // seg 0 (10%)
  0.10, 0.25,  // seg 1 (20%)  <-- menuItem_1 lives here with your current map
  0.25, 0.35,  // seg 2 (10%)
  0.35, 0.45,  // seg 3 (10%)
  0.45, 0.55,  // seg 4 (10%)
  0.55, 0.65,  // seg 5 (10%)
  0.65, 0.75,  // seg 6 (10%)
  0.75, 0.85,  // seg 7 (10%)
  0.85, 1.00   // seg 8 (10%)
];



let menuFrontPosition = 0;//which menu position is the frontmost? (0 to menuItemCount-1)

let menuDebug = true; //show path segments for guidance

let player = GetPlayer();

player.SetVar("menuItemCount", menuItemCount);
player.SetVar("scaleFactorTo", scaleFactorTo);
player.SetVar("opacityFactorTo", opacityFactorTo);
player.SetVar("zIndexFactorTo", zIndexFactorTo);
player.SetVar("itemPathMap", itemPathMap);
player.SetVar("pathSegment", pathSegment);
player.SetVar("menuFrontPosition", menuFrontPosition);
player.SetVar("menuDebug", menuDebug);
player.SetVar("initMenu", true);// indicate script should initialize the menu on the first run
player.SetVar("triggerMenu", !player.GetVar("triggerMenu"));// trigger the menu script


}

window.Script6 = function()
{
  var loadedCount = 0; //keep track of how many libraries loaded, so we do not reload the same again
var amountOfLibs = 1; //How many unique JS libraries are we loading
var player = GetPlayer();

//Place WO with empty index.html and all external file sets in individual folders
//on stand alone slide in another scene. Set to open into a new window.
//Add a button to that slide that relaunches the slide with the WO.
//publish that slide, click button, and record the location of the WO folder
//which is text string afte "/story_content/WebObjects/" in URL
//Save string in woFolder variable so this script can find and load files
var woFolder = player.GetVar("woFolder"); //Get location of the WO files in the SL site
console.log("woFolder: " + woFolder);

function loadJSfile(filename, filetype){
	if (filetype=="js"){ //if filename is a external JavaScript file
		var fileref=document.createElement('script');
		
		fileref.setAttribute("type","text/javascript");
		fileref.setAttribute("src", filename);

		fileref.onload = function() {
			loadedCount++;
			console.log(loadedCount+" JS / "+filename+' loaded.');

			if(loadedCount >= amountOfLibs){//if we loaded all the unique JS files, then indicate and exit
			//register the plugin (just once)
				gsap.registerPlugin(MotionPathPlugin);
				
				//will only run this loader when javascriptsLoaded == false
				player.SetVar("javascriptsLoaded", true);
			}
		};
	}
	else if (filetype=="css"){ //if filename is an external CSS file
		var fileref=document.createElement("link")

		fileref.setAttribute("rel", "stylesheet")
		fileref.setAttribute("type", "text/css")
		fileref.setAttribute("href", filename);

		fileref.onload = function() {
			loadedCount++;
			console.log(loadedCount+" CSS / "+filename+' loaded.');

			if(loadedCount >= amountOfLibs){
				player.SetVar("javascriptsLoaded", true);
			}
		};
	}
	if (typeof fileref!="undefined") {
		document.getElementsByTagName("head")[0].appendChild(fileref)
	}
}

//When we change anything in the scriptFolder this needs to change
var scriptFolder ="story_content/WebObjects/" + woFolder + "/";

//And lastly we call the functions we want to run
//add the folder names and files names to the WO path
loadJSfile(scriptFolder+"GSAP/MotionPathPlugin.min.js", "js");

}

window.Script7 = function()
{
  //GSAP Animated menu

//This contains all the needed parts, so you only have to call one script with some flags set
//This will initialize the menu, set up a resize observer, move the menu forward or backward, and remove the resize observer
//depending upon how the flag variables are set

let player = GetPlayer();

let menuDebug = player.GetVar("menuDebug");

if (player.GetVar("menuEndResizer")) {
	let ro = player.GetVar("menuResizer");

	ro.disconnect();
	
	if (menuDebug) {console.log("Stop resizing");}
	
	player.SetVar("menuEndResizer",false);
	return;
}
if (menuDebug) {console.log("Continuing...");}

let ro;
let menuItem = [];
let itemPathMap = player.GetVar("itemPathMap");
let allPaths = [];
let menuItemCount = player.GetVar("menuItemCount");

// These are used to indicate how the menu items should appear at each stopping location on the menu path
// Use them to give the menu some depth if desired (e.g., to simulated 3-D paths
// "To" = the styles to use at the end of each path segment movement
// "FromFor" = the styles to use as a starting point when moving FORWARD
// "FromBak" = the styles to use as a starting point when moving BACKWARD

let scaleFactorTo = player.GetVar("scaleFactorTo");
let opacityFactorTo = player.GetVar("opacityFactorTo");
let zIndexFactorTo = player.GetVar("zIndexFactorTo");

//Set the Scaling Array
let scaleFactorFromFor = [];
let scaleFactorFromBak = [];

//Set the Opacity Array
let opacityFactorFromFor = [];
let opacityFactorFromBak = [];

//Set the zIndex Array
let zIndexFactorFromFor = [];
let zIndexFactorFromBak = [];

//adjust the styling maps for the forward and Backward From directions
for(let i = 0; i < scaleFactorTo.length; i++) {
	//This is the "To" array, shifted and wrapping one position the the right
	scaleFactorFromFor[i] = scaleFactorTo[((i == 0) ? (scaleFactorTo.length -1) : (i-1))];
	//This is the "To" array, shifted and wrapping one position the the left
	scaleFactorFromBak[i] = scaleFactorTo[((i == (scaleFactorTo.length -1)) ? (0) : (i+1))];
	
	opacityFactorFromFor[i] = opacityFactorTo[((i == 0) ? (scaleFactorTo.length -1) : (i-1))];
	opacityFactorFromBak[i] = opacityFactorTo[((i == (scaleFactorTo.length -1)) ? (0) : (i+1))];	
	
	zIndexFactorFromFor[i] = zIndexFactorTo[((i == 0) ? (scaleFactorTo.length -1) : (i-1))];
	zIndexFactorFromBak[i] = zIndexFactorTo[((i == (scaleFactorTo.length -1)) ? (0) : (i+1))];	
}

// ***also see the itemPathMap array in the initializeMenu() function below to set menu item starting positions

//----Resize Observer function----------------------------------------------------------------------------------------------
// watch for document resizing and keep the menu items where they should be
// this just uses the last known movement paths to redraw the menu items at the end of each path
// if you resize WHILE the animation is running (unlikely), it will not properly align until you move the menu or resize again
if (player.GetVar("initMenu")) {
	ro = new ResizeObserver(entries => {
		try {
			if (!player.GetVar("menuEndResizer")) {
			
			let player = GetPlayer();

			let menuDebug = player.GetVar("menuDebug");
			let menuItemCount = player.GetVar("menuItemCount");
			let scaleFactorTo = player.GetVar("scaleFactorTo");
			let opacityFactorTo = player.GetVar("opacityFactorTo");
			let zIndexFactorTo = player.GetVar("zIndexFactorTo");
			let itemPathMap = player.GetVar("itemPathMap");
			let allPaths = [];
			let menuItem = [];
			
			if (menuDebug) {console.log("Resizing called...");}

			//Now, set accurate starting positions based on itemPathMap

			//get each element in the menu
			for (let i = 0; i < menuItemCount; i++) {
				menuItem[i] = document.querySelector("[data-acc-text='menuItem_" + (i+1) + "']");
			}		

			//get updated array of paths for the menu items to follow
			allPaths = document.querySelectorAll("[data-acc-text='menuPath'] path");
			//use these to set correct endpoints	

			//set the animation endpoint for each menu item
			for (let i = 0; i < menuItemCount; i++) {
				gsap.set(menuItem[i], {
				  motionPath: {
					path: allPaths[itemPathMap[i]],
					align: allPaths[itemPathMap[i]],
					alignOrigin: [0.5, 0.5],
					autoRotate: false,
				  },
				  transformOrigin: "50% 50%",
				  scale: scaleFactorTo[itemPathMap[i]],
				  opacity: opacityFactorTo[itemPathMap[i]],
				  zIndex: zIndexFactorTo[itemPathMap[i]]
				});
			}
				
			if (menuDebug) {console.log("Resizing done.");}
		}
		} catch (error) {
			console.log("resizeObserver Error catch");
			console.log(error);
		}
	});

	//keep track of resize observer so we can recall or cancel it later
	player.SetVar("menuResizer", ro);
}


//----Initialize function called from timeout----------------------------------------------------------------------------
// sets the starting positions of the menu items,
// locates the menu path shape (e.g., an ellipse),
// duplicates the original path once for each menu item,
// for each menu item, extracts a segment of the original path for it to traverse during a menu advance,
// overwrites each of the path copies with the new segments
// sets the menu items into the correct starting positions
// unhides the menu
// indicates which item is currently front-most
// attaches a resize observer to an object on the to keep everything the the correct positions
// save any reused variables back to SL for later script calls

	function initializeMenu() {
		let menuDebug = player.GetVar("menuDebug");
		if (menuDebug) {console.log("Initializing");}
		
		let rawPath, splitPath, splitPathString, allPaths, tmp;
		let menuPath;
		let colorList = ["#0088CC","#FFC512","#0088CC","#FFC512","#0088CC","#FFC512","#0088CC","#FFC512","#0088CC"];//starts with blue, yellow...
		
		let menuGroup = document.querySelector("[data-acc-text='menuGroup']");
		let ro = player.GetVar("menuResizer");
		let pathSegment = player.GetVar("pathSegment");
		
		//***Note: the MotionPath GSAP plug-in is registered on the master slide, after loading the JS code from the web object folder
		
		//get the path to follow and save a copy of the original
		menuPath = document.querySelector("[data-acc-text='menuPath'] path");
		player.SetVar("originalPath", menuPath);// in case we might need it again later (not used right now)
		
		//Assume we have 1 original path, then add copies for each new segment to overwrite
		for (let i = 1; i < menuItemCount; i++) {
			
			//clone this element
			tmp = menuPath.cloneNode(true);
			menuPath.parentNode.insertBefore(tmp,menuPath.nextSibling);
		}

		//Get the raw path from the element
		rawPath = MotionPathPlugin.getRawPath(menuPath);
		
		//get list of all path elements in the svg
		allPaths = document.querySelectorAll("[data-acc-text='menuPath'] path");
		
		
		
		//overwrite data in each path with sliced segments
		for (let i = 0; i < menuItemCount; i++) {
			if (pathSegment[0] == "auto") {
				//calculate even splits along length based on number of menu items
				splitPath = MotionPathPlugin.sliceRawPath(rawPath,(1/menuItemCount)*i,(1/menuItemCount)*(i+1));
			}
			else {
				//get from array of fractional pairs [start0, end0, start1, end1, ...]
				splitPath = MotionPathPlugin.sliceRawPath(rawPath,pathSegment[2*i],pathSegment[2*i+1]);
			}
			splitPathString = MotionPathPlugin.rawPathToString(splitPath);

			//overwrite the data attribute of this path segment
			(allPaths[i]).setAttribute("d",splitPathString);
			
			//if debugging, set different colors for the different path segments so you can see where they are
			if (menuDebug) {
				(allPaths[i]).setAttribute("stroke",colorList[((i < colorList.length) ? i : colorList.length-1)]);
				(allPaths[i]).setAttribute("stroke-opacity", 1);
			}
			
		}
		
		//Now we have an SVG with the original single path split into several contiguous sub paths, each copied into sequential path entries
		
		//Now, set accurate starting positions based on itemPathMap
		
		//get each element in the menu
		for (let i = 0; i < menuItemCount; i++) {
			menuItem[i] = document.querySelector("[data-acc-text='menuItem_" + (i+1) + "']");
		}		
		
		//get updated array of paths for the menu items to follow
		allPaths = document.querySelectorAll("[data-acc-text='menuPath'] path");
		//use these to set correct endpoints	
		
		
		//set the animation endpoint for each menu item
		for (let i = 0; i < menuItemCount; i++) {
				
			gsap.set(menuItem[i], {
			  motionPath: {
				path: allPaths[itemPathMap[i]],
				align: allPaths[itemPathMap[i]],
				alignOrigin: [0.5, 0.5],
				autoRotate: false,
			  },
			  transformOrigin: "50% 50%",
			  scale: scaleFactorTo[itemPathMap[i]],
			  opacity: opacityFactorTo[itemPathMap[i]],
			  zIndex: zIndexFactorTo[itemPathMap[i]]
			});
		}
		
		//fade in menu group when done
		gsap.to(menuGroup, {opacity: 1, duration: 0.5});
		
		//indicate which menu item is in front (i+1)
		//this is defined as the item in positon 0 (or at the end of segment #0, the first path segment)
		//change the comparison to set a different primary position
		for (let i = 0; i < menuItemCount; i++) {
			if (itemPathMap[i] == player.GetVar("menuFrontPosition")) {
				player.SetVar("frontMenuItem", i+1);
			}
		}
		
		//Attach the resize observer function attached to main slide base layer
		//let e= document.querySelector("[data-acc-text='Mask 1']");//could also attach this to an object on each slide with accessibility label "Mask1", or whatever
		let e= document.getElementsByClassName("slide-layer base-layer")[0];
		ro.observe(e);
		
		if (menuDebug) {console.log("Resizer started...");}

		//Save the data needed for later to SL (for future JS calls and resizing function)
		//player.SetVar("scaleFactorTo", scaleFactorTo);
		//player.SetVar("opacityFactorTo", opacityFactorTo);
		//player.SetVar("zIndexFactorTo", zIndexFactorTo);
		//player.SetVar("itemPathMap", itemPathMap);
		
		player.SetVar("initMenu", false);
	}

//----Initialize------------------------------------------------------------------------------------------------------------
// Run Initialize the first time this script is called. Uses "initMenu == true" as a flag.
// uses a timeout to make sure the elements are loaded (defaults to 0.25 seconds),
// this routine hides the menu while initializing
if (player.GetVar("initMenu")) {
	
	//hide menu while initializing
	let menuGroup = document.querySelector("[data-acc-text='menuGroup']");
	menuGroup.style.opacity = 0;

	//use a timeout to ensure all menu parts have loaded before initializing
	//defaults to 0.5 sec

	//set delay before initializing
	setTimeout(initializeMenu, 500);
}


//----Main------------------------------------------------------------------------------------------------------------
// This routine checks for the menu movement direction,
// loads the last path map so we know which segments the menu items need to follow
// adjust the path map for moving forward or backward
// adjust the factor map to assign the correct style attributes to the menu items
// moves the menu items accordingly
// indicates which menu item is front=most
// saves the updated path map

else {
	
	if (menuDebug) {console.log("Main");}
	
	let factorMap = [];	
	
	//Get menu movement direction; is it forward?
	let menuForward = player.GetVar("menuForward");
	
	//load last paths followed by menu items
	itemPathMap = player.GetVar("itemPathMap");
	
	//get each element in the menu
	for (let i = 0; i < menuItemCount; i++) {
		menuItem[i] = document.querySelector("[data-acc-text='menuItem_" + (i+1) + "']");
	}		
	
	//get all the paths for the menu items to follow
	allPaths = document.querySelectorAll("[data-acc-text='menuPath'] path");
	
	//if going backward, adjust the factor map to represent the values (opacity, scale, zIndex) from the previous rather than current segment
	if (!menuForward) {
		for (let i = 0; i < menuItemCount; i++) {
			factorMap[i] = (((itemPathMap[i] - 1) < (0)) ? (menuItemCount -1) : (itemPathMap[i] - 1));
		}
	}
	//if moving forward, step to next path segment BEFORE move. Keep factor map aligned with current segments
	else {
		for (let i = 0; i < menuItemCount; i++) {
			factorMap[i] = (((itemPathMap[i] + 1) > (menuItemCount -1)) ? 0 : (itemPathMap[i] + 1));
			itemPathMap[i] = (((itemPathMap[i] + 1) > (menuItemCount -1)) ? 0 : (itemPathMap[i] + 1));
		}
	}

	
	//move all of the menu items forward along the next path, or backward along the current path
	//Note:  I am not very GSAP savvy, so these fromTo statements may not be structured 100% correctly
	for (let i = 0; i < menuItemCount; i++) {
		
		if (menuForward) {		
			gsap.fromTo(menuItem[i], {
			  motionPath: {
				path: allPaths[itemPathMap[i]],
				align: allPaths[itemPathMap[i]],
				alignOrigin: [0.5, 0.5],
				autoRotate: false,
			  },
			  transformOrigin: "50% 50%",
			  scale: scaleFactorFromFor[factorMap[i]],
			  opacity: opacityFactorFromFor[factorMap[i]],
			  zIndex: zIndexFactorFromFor[factorMap[i]]
			},
			{
			motionPath: {
				path: allPaths[itemPathMap[i]],
				align: allPaths[itemPathMap[i]],
				alignOrigin: [0.5, 0.5],
				autoRotate: false,
			  },
			  transformOrigin: "50% 50%",
			  duration: 1,
			  ease: "power1.inOut",
			  scale: scaleFactorTo[factorMap[i]],
			  opacity: opacityFactorTo[factorMap[i]],
			  zIndex: zIndexFactorTo[factorMap[i]],
			});
		}
		else {
			gsap.fromTo(menuItem[i], {
			  motionPath: {
				path: allPaths[itemPathMap[i]],
				align: allPaths[itemPathMap[i]],
				alignOrigin: [0.5, 0.5],
				autoRotate: false,
			  },
			  transformOrigin: "50% 50%",
			  scale: scaleFactorTo[factorMap[i]],
			  opacity: opacityFactorTo[factorMap[i]],
			  zIndex: zIndexFactorTo[factorMap[i]]
			},
			{
			motionPath: {
				path: allPaths[itemPathMap[i]],
				align: allPaths[itemPathMap[i]],
				alignOrigin: [0.5, 0.5],
				autoRotate: false,
			  },
			  transformOrigin: "50% 50%",
			  duration: 1,
			  ease: "power1.inOut",
			  scale: scaleFactorFromBak[factorMap[i]],
			  opacity: opacityFactorFromBak[factorMap[i]],
			  zIndex: zIndexFactorFromBak[factorMap[i]],
			  runBackwards: true
			});
		}

	}
	
	//if moving backward, step to previous path segment AFTER move, since move reversed current segment
	if (!menuForward) {
		for (let i = 0; i < menuItemCount; i++) {
			itemPathMap[i] = (((itemPathMap[i] - 1) < (0)) ? (menuItemCount -1) : (itemPathMap[i] - 1));
		}
	}
		
	//indicate which menu item is now in front (i+1)
	for (let i = 0; i < menuItemCount; i++) {
		if (itemPathMap[i] == player.GetVar("menuFrontPosition")) {
			player.SetVar("frontMenuItem", i+1);
		}
	}
	
	//Save the updated data needed for later
	player.SetVar("itemPathMap", itemPathMap);


//----End of Script---------------------------------------------------------------------------------------------------------
}
}

window.Script8 = function()
{
  var loadedCount = 0; //keep track of how many libraries loaded, so we do not reload the same again
var amountOfLibs = 1; //How many unique JS libraries are we loading
var player = GetPlayer();

//Place WO with empty index.html and all external file sets in individual folders
//on stand alone slide in another scene. Set to open into a new window.
//Add a button to that slide that relaunches the slide with the WO.
//publish that slide, click button, and record the location of the WO folder
//which is text string afte "/story_content/WebObjects/" in URL
//Save string in woFolder variable so this script can find and load files
var woFolder = player.GetVar("woFolder"); //Get location of the WO files in the SL site
console.log("woFolder: " + woFolder);

function loadJSfile(filename, filetype){
	if (filetype=="js"){ //if filename is a external JavaScript file
		var fileref=document.createElement('script');
		
		fileref.setAttribute("type","text/javascript");
		fileref.setAttribute("src", filename);

		fileref.onload = function() {
			loadedCount++;
			console.log(loadedCount+" JS / "+filename+' loaded.');

			if(loadedCount >= amountOfLibs){//if we loaded all the unique JS files, then indicate and exit
			//register the plugin (just once)
				gsap.registerPlugin(MotionPathPlugin);
				
				//will only run this loader when javascriptsLoaded == false
				player.SetVar("javascriptsLoaded", true);
			}
		};
	}
	else if (filetype=="css"){ //if filename is an external CSS file
		var fileref=document.createElement("link")

		fileref.setAttribute("rel", "stylesheet")
		fileref.setAttribute("type", "text/css")
		fileref.setAttribute("href", filename);

		fileref.onload = function() {
			loadedCount++;
			console.log(loadedCount+" CSS / "+filename+' loaded.');

			if(loadedCount >= amountOfLibs){
				player.SetVar("javascriptsLoaded", true);
			}
		};
	}
	if (typeof fileref!="undefined") {
		document.getElementsByTagName("head")[0].appendChild(fileref)
	}
}

//When we change anything in the scriptFolder this needs to change
var scriptFolder ="story_content/WebObjects/" + woFolder + "/";

//And lastly we call the functions we want to run
//add the folder names and files names to the WO path
loadJSfile(scriptFolder+"GSAP/MotionPathPlugin.min.js", "js");

}

window.Script9 = function()
{
  //GSAP Animated menu

//This contains all the needed parts, so you only have to call one script with some flags set
//This will initialize the menu, set up a resize observer, move the menu forward or backward, and remove the resize observer
//depending upon how the flag variables are set

let player = GetPlayer();

let menuDebug = player.GetVar("menuDebug");

if (player.GetVar("menuEndResizer")) {
	let ro = player.GetVar("menuResizer");

	ro.disconnect();
	
	if (menuDebug) {console.log("Stop resizing");}
	
	player.SetVar("menuEndResizer",false);
	return;
}
if (menuDebug) {console.log("Continuing...");}

let ro;
let menuItem = [];
let itemPathMap = player.GetVar("itemPathMap");
let allPaths = [];
let menuItemCount = player.GetVar("menuItemCount");

// These are used to indicate how the menu items should appear at each stopping location on the menu path
// Use them to give the menu some depth if desired (e.g., to simulated 3-D paths
// "To" = the styles to use at the end of each path segment movement
// "FromFor" = the styles to use as a starting point when moving FORWARD
// "FromBak" = the styles to use as a starting point when moving BACKWARD

let scaleFactorTo = player.GetVar("scaleFactorTo");
let opacityFactorTo = player.GetVar("opacityFactorTo");
let zIndexFactorTo = player.GetVar("zIndexFactorTo");

//Set the Scaling Array
let scaleFactorFromFor = [];
let scaleFactorFromBak = [];

//Set the Opacity Array
let opacityFactorFromFor = [];
let opacityFactorFromBak = [];

//Set the zIndex Array
let zIndexFactorFromFor = [];
let zIndexFactorFromBak = [];

//adjust the styling maps for the forward and Backward From directions
for(let i = 0; i < scaleFactorTo.length; i++) {
	//This is the "To" array, shifted and wrapping one position the the right
	scaleFactorFromFor[i] = scaleFactorTo[((i == 0) ? (scaleFactorTo.length -1) : (i-1))];
	//This is the "To" array, shifted and wrapping one position the the left
	scaleFactorFromBak[i] = scaleFactorTo[((i == (scaleFactorTo.length -1)) ? (0) : (i+1))];
	
	opacityFactorFromFor[i] = opacityFactorTo[((i == 0) ? (scaleFactorTo.length -1) : (i-1))];
	opacityFactorFromBak[i] = opacityFactorTo[((i == (scaleFactorTo.length -1)) ? (0) : (i+1))];	
	
	zIndexFactorFromFor[i] = zIndexFactorTo[((i == 0) ? (scaleFactorTo.length -1) : (i-1))];
	zIndexFactorFromBak[i] = zIndexFactorTo[((i == (scaleFactorTo.length -1)) ? (0) : (i+1))];	
}

// ***also see the itemPathMap array in the initializeMenu() function below to set menu item starting positions

//----Resize Observer function----------------------------------------------------------------------------------------------
// watch for document resizing and keep the menu items where they should be
// this just uses the last known movement paths to redraw the menu items at the end of each path
// if you resize WHILE the animation is running (unlikely), it will not properly align until you move the menu or resize again
if (player.GetVar("initMenu")) {
	ro = new ResizeObserver(entries => {
		try {
			if (!player.GetVar("menuEndResizer")) {
			
			let player = GetPlayer();

			let menuDebug = player.GetVar("menuDebug");
			let menuItemCount = player.GetVar("menuItemCount");
			let scaleFactorTo = player.GetVar("scaleFactorTo");
			let opacityFactorTo = player.GetVar("opacityFactorTo");
			let zIndexFactorTo = player.GetVar("zIndexFactorTo");
			let itemPathMap = player.GetVar("itemPathMap");
			let allPaths = [];
			let menuItem = [];
			
			if (menuDebug) {console.log("Resizing called...");}

			//Now, set accurate starting positions based on itemPathMap

			//get each element in the menu
			for (let i = 0; i < menuItemCount; i++) {
				menuItem[i] = document.querySelector("[data-acc-text='menuItem_" + (i+1) + "']");
			}		

			//get updated array of paths for the menu items to follow
			allPaths = document.querySelectorAll("[data-acc-text='menuPath'] path");
			//use these to set correct endpoints	

			//set the animation endpoint for each menu item
			for (let i = 0; i < menuItemCount; i++) {
				gsap.set(menuItem[i], {
				  motionPath: {
					path: allPaths[itemPathMap[i]],
					align: allPaths[itemPathMap[i]],
					alignOrigin: [0.5, 0.5],
					autoRotate: false,
				  },
				  transformOrigin: "50% 50%",
				  scale: scaleFactorTo[itemPathMap[i]],
				  opacity: opacityFactorTo[itemPathMap[i]],
				  zIndex: zIndexFactorTo[itemPathMap[i]]
				});
			}
				
			if (menuDebug) {console.log("Resizing done.");}
		}
		} catch (error) {
			console.log("resizeObserver Error catch");
			console.log(error);
		}
	});

	//keep track of resize observer so we can recall or cancel it later
	player.SetVar("menuResizer", ro);
}


//----Initialize function called from timeout----------------------------------------------------------------------------
// sets the starting positions of the menu items,
// locates the menu path shape (e.g., an ellipse),
// duplicates the original path once for each menu item,
// for each menu item, extracts a segment of the original path for it to traverse during a menu advance,
// overwrites each of the path copies with the new segments
// sets the menu items into the correct starting positions
// unhides the menu
// indicates which item is currently front-most
// attaches a resize observer to an object on the to keep everything the the correct positions
// save any reused variables back to SL for later script calls

	function initializeMenu() {
		let menuDebug = player.GetVar("menuDebug");
		if (menuDebug) {console.log("Initializing");}
		
		let rawPath, splitPath, splitPathString, allPaths, tmp;
		let menuPath;
		let colorList = ["#0088CC","#FFC512","#0088CC","#FFC512","#0088CC","#FFC512","#0088CC","#FFC512","#0088CC"];//starts with blue, yellow...
		
		let menuGroup = document.querySelector("[data-acc-text='menuGroup']");
		let ro = player.GetVar("menuResizer");
		let pathSegment = player.GetVar("pathSegment");
		
		//***Note: the MotionPath GSAP plug-in is registered on the master slide, after loading the JS code from the web object folder
		
		//get the path to follow and save a copy of the original
		menuPath = document.querySelector("[data-acc-text='menuPath'] path");
		player.SetVar("originalPath", menuPath);// in case we might need it again later (not used right now)
		
		//Assume we have 1 original path, then add copies for each new segment to overwrite
		for (let i = 1; i < menuItemCount; i++) {
			
			//clone this element
			tmp = menuPath.cloneNode(true);
			menuPath.parentNode.insertBefore(tmp,menuPath.nextSibling);
		}

		//Get the raw path from the element
		rawPath = MotionPathPlugin.getRawPath(menuPath);
		
		//get list of all path elements in the svg
		allPaths = document.querySelectorAll("[data-acc-text='menuPath'] path");
		
		
		
		//overwrite data in each path with sliced segments
		for (let i = 0; i < menuItemCount; i++) {
			if (pathSegment[0] == "auto") {
				//calculate even splits along length based on number of menu items
				splitPath = MotionPathPlugin.sliceRawPath(rawPath,(1/menuItemCount)*i,(1/menuItemCount)*(i+1));
			}
			else {
				//get from array of fractional pairs [start0, end0, start1, end1, ...]
				splitPath = MotionPathPlugin.sliceRawPath(rawPath,pathSegment[2*i],pathSegment[2*i+1]);
			}
			splitPathString = MotionPathPlugin.rawPathToString(splitPath);

			//overwrite the data attribute of this path segment
			(allPaths[i]).setAttribute("d",splitPathString);
			
			//if debugging, set different colors for the different path segments so you can see where they are
			if (menuDebug) {
				(allPaths[i]).setAttribute("stroke",colorList[((i < colorList.length) ? i : colorList.length-1)]);
				(allPaths[i]).setAttribute("stroke-opacity", 1);
			}
			
		}
		
		//Now we have an SVG with the original single path split into several contiguous sub paths, each copied into sequential path entries
		
		//Now, set accurate starting positions based on itemPathMap
		
		//get each element in the menu
		for (let i = 0; i < menuItemCount; i++) {
			menuItem[i] = document.querySelector("[data-acc-text='menuItem_" + (i+1) + "']");
		}		
		
		//get updated array of paths for the menu items to follow
		allPaths = document.querySelectorAll("[data-acc-text='menuPath'] path");
		//use these to set correct endpoints	
		
		
		//set the animation endpoint for each menu item
		for (let i = 0; i < menuItemCount; i++) {
				
			gsap.set(menuItem[i], {
			  motionPath: {
				path: allPaths[itemPathMap[i]],
				align: allPaths[itemPathMap[i]],
				alignOrigin: [0.5, 0.5],
				autoRotate: false,
			  },
			  transformOrigin: "50% 50%",
			  scale: scaleFactorTo[itemPathMap[i]],
			  opacity: opacityFactorTo[itemPathMap[i]],
			  zIndex: zIndexFactorTo[itemPathMap[i]]
			});
		}
		
		//fade in menu group when done
		gsap.to(menuGroup, {opacity: 1, duration: 0.5});
		
		//indicate which menu item is in front (i+1)
		//this is defined as the item in positon 0 (or at the end of segment #0, the first path segment)
		//change the comparison to set a different primary position
		for (let i = 0; i < menuItemCount; i++) {
			if (itemPathMap[i] == player.GetVar("menuFrontPosition")) {
				player.SetVar("frontMenuItem", i+1);
			}
		}
		
		//Attach the resize observer function attached to main slide base layer
		//let e= document.querySelector("[data-acc-text='Mask 1']");//could also attach this to an object on each slide with accessibility label "Mask1", or whatever
		let e= document.getElementsByClassName("slide-layer base-layer")[0];
		ro.observe(e);
		
		if (menuDebug) {console.log("Resizer started...");}

		//Save the data needed for later to SL (for future JS calls and resizing function)
		//player.SetVar("scaleFactorTo", scaleFactorTo);
		//player.SetVar("opacityFactorTo", opacityFactorTo);
		//player.SetVar("zIndexFactorTo", zIndexFactorTo);
		//player.SetVar("itemPathMap", itemPathMap);
		
		player.SetVar("initMenu", false);
	}

//----Initialize------------------------------------------------------------------------------------------------------------
// Run Initialize the first time this script is called. Uses "initMenu == true" as a flag.
// uses a timeout to make sure the elements are loaded (defaults to 0.25 seconds),
// this routine hides the menu while initializing
if (player.GetVar("initMenu")) {
	
	//hide menu while initializing
	let menuGroup = document.querySelector("[data-acc-text='menuGroup']");
	menuGroup.style.opacity = 0;

	//use a timeout to ensure all menu parts have loaded before initializing
	//defaults to 0.5 sec

	//set delay before initializing
	setTimeout(initializeMenu, 500);
}


//----Main------------------------------------------------------------------------------------------------------------
// This routine checks for the menu movement direction,
// loads the last path map so we know which segments the menu items need to follow
// adjust the path map for moving forward or backward
// adjust the factor map to assign the correct style attributes to the menu items
// moves the menu items accordingly
// indicates which menu item is front=most
// saves the updated path map

else {
	
	if (menuDebug) {console.log("Main");}
	
	let factorMap = [];	
	
	//Get menu movement direction; is it forward?
	let menuForward = player.GetVar("menuForward");
	
	//load last paths followed by menu items
	itemPathMap = player.GetVar("itemPathMap");
	
	//get each element in the menu
	for (let i = 0; i < menuItemCount; i++) {
		menuItem[i] = document.querySelector("[data-acc-text='menuItem_" + (i+1) + "']");
	}		
	
	//get all the paths for the menu items to follow
	allPaths = document.querySelectorAll("[data-acc-text='menuPath'] path");
	
	//if going backward, adjust the factor map to represent the values (opacity, scale, zIndex) from the previous rather than current segment
	if (!menuForward) {
		for (let i = 0; i < menuItemCount; i++) {
			factorMap[i] = (((itemPathMap[i] - 1) < (0)) ? (menuItemCount -1) : (itemPathMap[i] - 1));
		}
	}
	//if moving forward, step to next path segment BEFORE move. Keep factor map aligned with current segments
	else {
		for (let i = 0; i < menuItemCount; i++) {
			factorMap[i] = (((itemPathMap[i] + 1) > (menuItemCount -1)) ? 0 : (itemPathMap[i] + 1));
			itemPathMap[i] = (((itemPathMap[i] + 1) > (menuItemCount -1)) ? 0 : (itemPathMap[i] + 1));
		}
	}

	
	//move all of the menu items forward along the next path, or backward along the current path
	//Note:  I am not very GSAP savvy, so these fromTo statements may not be structured 100% correctly
	for (let i = 0; i < menuItemCount; i++) {
		
		if (menuForward) {		
			gsap.fromTo(menuItem[i], {
			  motionPath: {
				path: allPaths[itemPathMap[i]],
				align: allPaths[itemPathMap[i]],
				alignOrigin: [0.5, 0.5],
				autoRotate: false,
			  },
			  transformOrigin: "50% 50%",
			  scale: scaleFactorFromFor[factorMap[i]],
			  opacity: opacityFactorFromFor[factorMap[i]],
			  zIndex: zIndexFactorFromFor[factorMap[i]]
			},
			{
			motionPath: {
				path: allPaths[itemPathMap[i]],
				align: allPaths[itemPathMap[i]],
				alignOrigin: [0.5, 0.5],
				autoRotate: false,
			  },
			  transformOrigin: "50% 50%",
			  duration: 1,
			  ease: "power1.inOut",
			  scale: scaleFactorTo[factorMap[i]],
			  opacity: opacityFactorTo[factorMap[i]],
			  zIndex: zIndexFactorTo[factorMap[i]],
			});
		}
		else {
			gsap.fromTo(menuItem[i], {
			  motionPath: {
				path: allPaths[itemPathMap[i]],
				align: allPaths[itemPathMap[i]],
				alignOrigin: [0.5, 0.5],
				autoRotate: false,
			  },
			  transformOrigin: "50% 50%",
			  scale: scaleFactorTo[factorMap[i]],
			  opacity: opacityFactorTo[factorMap[i]],
			  zIndex: zIndexFactorTo[factorMap[i]]
			},
			{
			motionPath: {
				path: allPaths[itemPathMap[i]],
				align: allPaths[itemPathMap[i]],
				alignOrigin: [0.5, 0.5],
				autoRotate: false,
			  },
			  transformOrigin: "50% 50%",
			  duration: 1,
			  ease: "power1.inOut",
			  scale: scaleFactorFromBak[factorMap[i]],
			  opacity: opacityFactorFromBak[factorMap[i]],
			  zIndex: zIndexFactorFromBak[factorMap[i]],
			  runBackwards: true
			});
		}

	}
	
	//if moving backward, step to previous path segment AFTER move, since move reversed current segment
	if (!menuForward) {
		for (let i = 0; i < menuItemCount; i++) {
			itemPathMap[i] = (((itemPathMap[i] - 1) < (0)) ? (menuItemCount -1) : (itemPathMap[i] - 1));
		}
	}
		
	//indicate which menu item is now in front (i+1)
	for (let i = 0; i < menuItemCount; i++) {
		if (itemPathMap[i] == player.GetVar("menuFrontPosition")) {
			player.SetVar("frontMenuItem", i+1);
		}
	}
	
	//Save the updated data needed for later
	player.SetVar("itemPathMap", itemPathMap);


//----End of Script---------------------------------------------------------------------------------------------------------
}
}

};
