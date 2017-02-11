// src files
actorImg_src = "img/iah.jpg";
bgImg_src = "img/MrLaba.jpg";

// gloabl variables

movement = 4;
range = 2;
doCalibrate = true;
scale = 1;
landscape_mode = false;
paused = false;

function init() {
	x_pos = 5;
	y_pos = 5;
	alpha_standard = 0;
	beta_standard = 0;
	gamma_standard = 0;
	doCalibrate = true;	
	
	bg_x_pos = 0;
	bg_y_pos = 0;
	
	// load images
	actorImg = new Image();
	actorImg.src = actorImg_src;
	
	bgImg = new Image();
	bgImg.src = bgImg_src;
	
	// load canvas
	var canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	context.canvas.height = bgImg.naturalHeight;
	context.canvas.width = bgImg.naturalWidth;
	
	// draw background
	context.setTransform(1,0,0,1, 0, 0);
	context.drawImage(bgImg, 0, 0);
	
	// fill variables
	canvasWidth = canvas.width;
	canvasHeight = canvas.height; 
	
	actorWidth = actorImg.naturalWidth;
	actorHeight = actorImg.naturalHeight;
	
	// get bg data
	imgData = context.getImageData(0, 0, canvasWidth,canvasHeight);
	
	// place context at start coordinates
	context.setTransform(1,0,0,1, x_pos, y_pos);
	
	// draw actor
	resize();
	drawCanvas();
}


function resize() {
	// check if device in landscape_mode
	if(window.innerHeight <= window.innerWidth) {
		landscape_mode = true;
	} else {
		landscape_mode = false;
	}
	var height = document.getElementById("canvas_space").clientHeight;
	var width = document.getElementById("canvas_space").clientWidth;
	// update canvas size
	context.canvas.height = min(height, bgImg.naturalHeight);
	context.canvas.width = min(width, bgImg.naturalWidth);

	drawCanvas();
	document.querySelector("#text").innerHTML = "window width = " + width + " canvas width " + context.canvas.width;
}

// button functions
function startGame() {
	var elem = document.getElementById("level_selector");
	var level = elem.options[elem.selectedIndex].text;
	bgImg_src = "img/" + level + ".jpg";
	document.getElementById("menu").style.display = 'none';
	document.getElementById("game").style.display = 'block';
	init();
}

function calibrate() {
	doCalibrate = true;
}

function reset() {
	context.setTransform(1,0,0,1, 0, 0);
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	init();
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

window.onresize = function() {resize();}

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

	document.querySelector("#mag_alpha").innerHTML = "alpha = " + alpha;
	document.querySelector("#mag_beta").innerHTML = "beta = " + beta;
	document.querySelector("#mag_gamma").innerHTML = "gamma = " + gamma;
}, true);

function drawCanvas() {

	context.setTransform(1,0,0,1, 0, 0);
	context.clearRect(0,0, context.canvas.width, context.canvas.height);
	context.setTransform(1,0,0,1, 0, 0);
	context.drawImage(bgImg, 0, 0);
	context.setTransform(1,0,0,1, x_pos, y_pos);
	context.drawImage(actorImg, 0, 0);

}

// movement functions

function update(alpha, beta, gamma) {	
	if(paused) {
		return;
	}
	if(landscape_mode) {
		updatePosition(x_pos, y_pos, beta, -gamma);
	} else {
		updatePosition(x_pos, y_pos, gamma, beta);
	}
	
	drawCanvas();
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
						x_pos = x-i+1;
					} else {
						x_pos = x-i;
					}				
				}
				// move to right
				else {
					if(slamsAWall(x+actorWidth+i, y, true)) {
						slammedWall = true;
						x_pos = x+i-1;
					} else {
						x_pos = x+i;
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
						y_pos = y-i+1;
					} else {
						y_pos = y-i;
					}				
				}
				// move down
				else {
					if(slamsAWall(x, y+actorHeight+i, false)) {
						slammedWall = true;
						y_pos = y+i-1;
					} else {
						y_pos = y+i;
					}
				}
			}
		
		}
	}
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

// movement of the background
function updateBackgroundPosition() {
	
}

// other functions
function min(a, b) {
	if(a<b) {
		return a;
	} else {
		return b;
	}
}
