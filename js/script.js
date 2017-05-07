// global variables 
doCalibrate = true;
paused = false;
landscape_mode = false;

// constants
movement = 4;
range = 2;

// preload image data
if (document.images) {
	var img1 = new Image();
	var img2 = new Image();
	var img3 = new Image();

	img1.src = "img/labyrinth.jpg";
	img2.src = "img/fluffball.png";
	img3.src = "img/MrLaba.jpg";
	
	
	actorImg = new Image();
	actorImg.src = "img/fluffball_small.png";
}

window.onload = function() {
  init();
};

window.onresize = function() {resize();}

function init() {	
	pos_x = 5;
	pos_y = 5;
	alpha_standard = 0;
	beta_standard = 0;
	gamma_standard = 0;	
	offset_x = 0;
	offset_y = 0;
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
	
	canvasWidth = canvas.width;
	canvasHeight = canvas.height; 
	
	actorWidth = actorImg.naturalWidth;
	actorHeight = actorImg.naturalHeight;
// get bg data
	imgData = context.getImageData(0, 0, bgImg.naturalWidth, bgImg.naturalHeight);
	
// place context at start coordinates
	context.setTransform(1,0,0,1, pos_x, pos_y);
	
// draw
	resize();
}


// btn functions
function calibrate() {
	doCalibrate = true;
}

function reset() {	
	pos_x = 5;
	pos_y = 5;
	alpha_standard = 0;
	beta_standard = 0;
	gamma_standard = 0;
	doCalibrate = true;	
	paused = true;
	pause();

	offset_x = 0;
	offset_y = 0;
	
	// draw background
	context.setTransform(1,0,0,1, 0, 0);
	context.drawImage(bgImg, 0, 0);
	
	// place context at start coordinates
	context.setTransform(1,0,0,1, pos_x, pos_y);
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

// Keyboard Usage
window.addEventListener("keydown", function(e) {
	var e = window.event||e;
	var x_axis = 0;
	var y_axis = 0;
	
	
	switch(e.keyCode) { 
	  case 37: // left
		x_axis = -(range+1);
		e.preventDefault();
	    break;
	  case 38: // up
		y_axis = -(range+1);
		e.preventDefault();
	    break;
	  case 39: // right
		x_axis = (range+1);
		e.preventDefault();
	    break;
	  case 40: // down
		y_axis = (range+1);
		e.preventDefault();
	    break;
	}
	landscape_mode = false;
	update(0, y_axis, x_axis);	
}, true);

// mobile device
window.addEventListener("deviceorientation", function(event) {
	var alpha = event.alpha;
	var beta = event.beta;
	var gamma = event.gamma;
	
	if(doCalibrate == true) {
		alpha_standard = alpha;
		beta_standard = beta;
		gamma_standard = gamma;
		doCalibrate = false;
	}

	update(alpha-alpha_standard, beta-beta_standard, gamma-gamma_standard);
}, true);

// movement functions
function update(alpha, beta, gamma) {	
	if(paused) {
		return;
	}
	if(landscape_mode) {
		updatePosition(pos_x, pos_y, beta, -gamma);
	} else {
		updatePosition(pos_x, pos_y, gamma, beta);
	}
	updatePosition(pos_x, pos_y, gamma, beta);

	draw();
}

function updatePosition(x, y, gamma, beta) {
	var x_dir = getDirection(gamma);
	var y_dir = getDirection(beta);	
	
	// check for wall in x direction
	var slammedWall = false;
	if(x_dir != 0) {		
		for(var i=1; i <= movement; i++) {
			if(!slammedWall) {
				// move to left
				if(x_dir < 0) {
					if(slamsAWall(x-i,y, true)) {
						slammedWall = true;
						pos_x = x-i+1;
					} else {
						pos_x = x-i;
					}				
				}
				// move to right
				else {
					if(slamsAWall(x+actorWidth+i, y, true)) {
						slammedWall = true;
						pos_x = x+i-1;
					} else {
						pos_x = x+i;
					}
				}
			}		
		}
	}
	//check for wall in y direction
	slammedWall = false;
	if(y_dir != 0) {		
		for(var i=1; i <= movement; i++) {
			if(!slammedWall) {
				// move up
				if(y_dir < 0) {
					if(slamsAWall(x,y-i, false)) {
						slammedWall = true;
						pos_y = y-i+1;
					} else {
						pos_y = y-i;
					}				
				}
				// move down
				else {
					if(slamsAWall(x, y+actorHeight+i, false)) {
						slammedWall = true;
						pos_y = y+i-1;
					} else {
						pos_y = y+i;
					}
				}
			}		
		}
	}
}
function slamsAWall(x, y, check_vertical) {
	if(check_vertical) {
		for(var p = 0; p < actorHeight; p++) {
			var index = ((y+p)*canvasWidth+x)*4;
			if(imgData.data[index] < 50 && imgData.data[index+1] < 50 && imgData.data[index+2] < 50) {
				return true;
			}
		}
	} else {
		for(var q = 0; q < actorWidth; q++) {
			var index = (y*canvasWidth+x+q)*4;
			if(imgData.data[index] < 50 && imgData.data[index+1] < 50 && imgData.data[index+2] < 50) {
				return true;
			}
		}
	}
	return false;	
}
function getDirection(orientation) {
	if(orientation < -range) {
		return -1;
	} else if(orientation > range) {
		return  1;
	} else {
		return 0;	
	}
}

// movement of the background
function updateBackgroundPosition() {	
	if(pos_x > context.canvas.width/2 && pos_x < canvasWidth-context.canvas.width/2) {
		offset_x = context.canvas.width/2-pos_x;
	}
	if(pos_y > context.canvas.height/2 && pos_y < canvasHeight-context.canvas.height/2) {
		offset_y = context.canvas.height/2-pos_y;
	}
}

// drawing functions
function resize() {
	// check if device in landscape_mode
	if(window.innerHeight <= window.innerWidth) {
		landscape_mode = true;
	} else {
		landscape_mode = false;
	}
	doCalibrate = true;
	offset_x = 0;
	offset_y = 0;
	var height = document.body.clientHeight
			-document.getElementById("header_game").clientHeight
			-1.2*document.getElementById("footer_game").clientHeight;
	var width = window.innerWidth;

	// update canvas size
	context.canvas.height = min(height, bgImg.naturalHeight);
	context.canvas.width = min(width, bgImg.naturalWidth);
	
	draw();
}

function draw() {
	updateBackgroundPosition();
	context.setTransform(1,0,0,1, 0, 0);
	context.clearRect(0,0, context.canvas.width, context.canvas.height);
	context.setTransform(1,0,0,1, 0, 0);
	context.drawImage(bgImg, offset_x, offset_y);
	context.setTransform(1,0,0,1, pos_x, pos_y);
	context.drawImage(actorImg, offset_x, offset_y);
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
	document.getElementById("text").innerHTML += ", " + "LALALALALA" + " & " + "";
}
