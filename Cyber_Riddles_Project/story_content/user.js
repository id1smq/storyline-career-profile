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
var amountOfLibs = 2; //How many unique JS libraries are we loading
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
				//gsap.registerPlugin(MotionPathPlugin);
				
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
loadJSfile(scriptFolder+"JavaScript/xapiwrapper.min.js", "js");
loadJSfile(scriptFolder+"JavaScript/xapianonlearner.js", "js");
}

window.Script2 = function()
{
  var loadedCount = 0; //keep track of how many libraries loaded, so we do not reload the same again
var amountOfLibs = 2; //How many unique JS libraries are we loading
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
				//gsap.registerPlugin(MotionPathPlugin);
				
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
loadJSfile(scriptFolder+"JavaScript/xapiwrapper.min.js", "js");
loadJSfile(scriptFolder+"JavaScript/xapianonlearner.js", "js");
}

window.Script3 = function()
{
  manageTimer.course.reset();
manageTimer.course.start()
}

window.Script4 = function()
{
  var loadedCount = 0; //keep track of how many libraries loaded, so we do not reload the same again
var amountOfLibs = 2; //How many unique JS libraries are we loading
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
				//gsap.registerPlugin(MotionPathPlugin);
				
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
loadJSfile(scriptFolder+"JavaScript/xapiwrapper.min.js", "js");
loadJSfile(scriptFolder+"JavaScript/xapianonlearner.js", "js");
}

window.Script5 = function()
{
  var loadedCount = 0; //keep track of how many libraries loaded, so we do not reload the same again
var amountOfLibs = 2; //How many unique JS libraries are we loading
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
				//gsap.registerPlugin(MotionPathPlugin);
				
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
loadJSfile(scriptFolder+"JavaScript/xapiwrapper.min.js", "js");
loadJSfile(scriptFolder+"JavaScript/xapianonlearner.js", "js");
}

window.Script6 = function()
{
  var loadedCount = 0; //keep track of how many libraries loaded, so we do not reload the same again
var amountOfLibs = 2; //How many unique JS libraries are we loading
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
				//gsap.registerPlugin(MotionPathPlugin);
				
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
loadJSfile(scriptFolder+"JavaScript/xapiwrapper.min.js", "js");
loadJSfile(scriptFolder+"JavaScript/xapianonlearner.js", "js");
}

window.Script7 = function()
{
  var loadedCount = 0; //keep track of how many libraries loaded, so we do not reload the same again
var amountOfLibs = 2; //How many unique JS libraries are we loading
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
				//gsap.registerPlugin(MotionPathPlugin);
				
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
loadJSfile(scriptFolder+"JavaScript/xapiwrapper.min.js", "js");
loadJSfile(scriptFolder+"JavaScript/xapianonlearner.js", "js");
}

window.Script8 = function()
{
  var loadedCount = 0; //keep track of how many libraries loaded, so we do not reload the same again
var amountOfLibs = 2; //How many unique JS libraries are we loading
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
				//gsap.registerPlugin(MotionPathPlugin);
				
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
loadJSfile(scriptFolder+"JavaScript/xapiwrapper.min.js", "js");
loadJSfile(scriptFolder+"JavaScript/xapianonlearner.js", "js");
}

window.Script9 = function()
{
  var loadedCount = 0; //keep track of how many libraries loaded, so we do not reload the same again
var amountOfLibs = 2; //How many unique JS libraries are we loading
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
				//gsap.registerPlugin(MotionPathPlugin);
				
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
loadJSfile(scriptFolder+"JavaScript/xapiwrapper.min.js", "js");
loadJSfile(scriptFolder+"JavaScript/xapianonlearner.js", "js");
}

window.Script10 = function()
{
  var loadedCount = 0; //keep track of how many libraries loaded, so we do not reload the same again
var amountOfLibs = 2; //How many unique JS libraries are we loading
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
				//gsap.registerPlugin(MotionPathPlugin);
				
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
loadJSfile(scriptFolder+"JavaScript/xapiwrapper.min.js", "js");
loadJSfile(scriptFolder+"JavaScript/xapianonlearner.js", "js");
}

window.Script11 = function()
{
  var loadedCount = 0; //keep track of how many libraries loaded, so we do not reload the same again
var amountOfLibs = 2; //How many unique JS libraries are we loading
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
				//gsap.registerPlugin(MotionPathPlugin);
				
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
loadJSfile(scriptFolder+"JavaScript/xapiwrapper.min.js", "js");
loadJSfile(scriptFolder+"JavaScript/xapianonlearner.js", "js");
}

window.Script12 = function()
{
  var loadedCount = 0; //keep track of how many libraries loaded, so we do not reload the same again
var amountOfLibs = 2; //How many unique JS libraries are we loading
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
				//gsap.registerPlugin(MotionPathPlugin);
				
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
loadJSfile(scriptFolder+"JavaScript/xapiwrapper.min.js", "js");
loadJSfile(scriptFolder+"JavaScript/xapianonlearner.js", "js");
}

window.Script13 = function()
{
  manageTimer.course.stop()
}

window.Script14 = function()
{
  sendStatement("course")

}

window.Script15 = function()
{
  manageTimer.slide.reset();
}

window.Script16 = function()
{
  populateLeaderboard()
}

window.Script17 = function()
{
  populateleaderboard();


}

window.Script18 = function()
{
  boldLeaderboard();
}

window.Script19 = function()
{
  var loadedCount = 0; //keep track of how many libraries loaded, so we do not reload the same again
var amountOfLibs = 2; //How many unique JS libraries are we loading
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
				//gsap.registerPlugin(MotionPathPlugin);
				
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
loadJSfile(scriptFolder+"JavaScript/xapiwrapper.min.js", "js");
loadJSfile(scriptFolder+"JavaScript/xapianonlearner.js", "js");
}

window.Script20 = function()
{
  var loadedCount = 0; //keep track of how many libraries loaded, so we do not reload the same again
var amountOfLibs = 2; //How many unique JS libraries are we loading
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
				//gsap.registerPlugin(MotionPathPlugin);
				
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
loadJSfile(scriptFolder+"JavaScript/xapiwrapper.min.js", "js");
loadJSfile(scriptFolder+"JavaScript/xapianonlearner.js", "js");
}

};
