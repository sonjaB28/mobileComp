// global variables 
doCalibrate = true;
paused = false;
// constants
min_height = 100;
min_width = 100;

// preload image data
if (document.images) {
	var img1 = new Image();
	var img2 = new Image();
	var img3 = new Image();

	img1.src = "img/labyrinth.jpg";
	img2.src = "img/fluffball.png";
	img3.src = "img/MrLaba.jpg";
}

window.onload = function() {
  init();
};

window.onresize = function() {resize();}

function init() {
	doCalibrate = true;	
	paused = true;
	pause();

// load images	
	bgImg = img1;
	
// load canvas
	var canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	context.canvas.height = bgImg.naturalHeight;
	context.canvas.width = bgImg.naturalWidth;
	
// draw background
	context.setTransform(1,0,0,1, 0, 0);
	context.drawImage(bgImg, 0, 0);
	
// get bg data
	imgData = context.getImageData(0, 0, bgImg.naturalWidth, bgImg.naturalHeight);
	
// place context at start coordinates
	context.setTransform(1,0,0,1, 0, 0);
	
// draw
	resize();
}


// btn functions
function calibrate() {
	doCalibrate = true;
}

function reset() {
// draw
	resize();
}

function pause() {
	if(paused) {
		document.getElementById("pause_btn").innerHTML = "Pause";
		paused = false;
	} else {
		document.getElementById("pause_btn").innerHTML = "Unpause";
		paused = true;
	}
}

// drawing functions
function resize() {
	
	var height = document.body.clientHeight
			-document.getElementById("header_game").clientHeight
			-1.2*document.getElementById("footer_game").clientHeight;
	var width = window.innerWidth-100;

	// update canvas size
	context.canvas.height = min(height, bgImg.naturalHeight);
	context.canvas.width = min(width, bgImg.naturalWidth);
	
	draw();
}

function draw() {
	context.setTransform(1,0,0,1, 0, 0);
	context.clearRect(0,0, context.canvas.width, context.canvas.height);
	context.setTransform(1,0,0,1, 0, 0);
	context.drawImage(bgImg, 0, 0);
}



// other functions
function min(a, b) {
	if(a<b) {
		return a;
	} else {
		return b;
	}
}
function addText() {
	var help = document.body.clientHeight
			-document.getElementById("header_game").clientHeight
			-1.2*document.getElementById("footer_game").clientHeight;
	document.getElementById("text").innerHTML += ", " + help + " & " + "";
}