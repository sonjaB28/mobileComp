// global variables 
var doCalibrate = true;
var paused = false;
var landscape_mode = false;
var finished = false;

// constants
var movement = 4;
var range = 2;
var start_value = 10;
var countdown = 3;
var lionlevel = 2;

//level
var level = new Array();
var levelPreview = new Array();
var currentLevel = 0;
var maxNumberOfLevels = 3;

// preload image data
if (document.images) {
	level[0] = new Image();
	level[1] = new Image();
	level[2] = new Image();

	level[0].src = "img/lab10_5.png";
	level[1].src = "img/lab20_1.png";
	level[2].src = "img/lab_lion.png";
	
	levelPreview[0] = new Image();
	levelPreview[0].src = "img/lab10_5_masked.png";
	levelPreview[1] = new Image();
	levelPreview[1].src = "img/lab20_1_masked.png";
	levelPreview[2] = new Image();
	levelPreview[2].src = "img/lab_lion_masked.png";
	
	actorImg = new Image();
	actorImg.src = "img/fluffball_small.png";
	smallerActorSrc = "img/fluffball_small_small.png";
}

window.onload = function() {	
	currentLevel = 0;
	countDown(); 
};

window.onresize = function() {resize();};
window.addEventListener("orientationchange", function() {
	resize();
}, false);
window.onblur = function(){	
	if(!paused) {		
		pause();
	}
};

function init() {	
	pos_x = start_value;
	pos_y = start_value;
	alpha_standard = 0;
	beta_standard = 0;
	gamma_standard = 0;	
	offset_x = 0;
	offset_y = 0;
	finished = false;
	doCalibrate = true;	
	paused = true;	
	pause();

// load images	
	bgImg = level[currentLevel];
	
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
	resetTimer();
	finished = false;
	pos_x = start_value;
	pos_y = start_value;
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
	var btn = document.getElementById("pause_btn");
	if(paused) {
		startTimer();
		btn.innerHTML = "Pause";
		btn.classList.toggle("ui-icon-play",true);				
		btn.classList.toggle("ui-icon-pause",false);
		paused = false;
	} else {
		if(!finished) {
			stopTimer();
		}	    		
		btn.classList.toggle("ui-icon-play",false);	
		btn.classList.toggle("ui-icon-pause",true);		
		btn.innerHTML = "Unpause";
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

	// finish space reached?
	if(!finished) {
		var i = ((pos_y-2)*canvasWidth+pos_x-2)*4;
		if(imgData.data[i] < 100 & imgData.data[i+1] > 100 & imgData.data[i+2] < 100) {
			finished = true;
			stopTimer();
			var time = getTime();		
			resetTimer();
			alert("You've won!! Your time: " + time);
			
			currentLevel++;							
			if(currentLevel == maxNumberOfLevels) {
				return;
			}
			else if(currentLevel == lionlevel) {
				actorImg.src = smallerActorSrc;
				movement = movement/2;
			}
			countDown();
		}
	}
	
	
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
			if(imgData.data[index] < 50 & imgData.data[index+1] < 50 & imgData.data[index+2] < 50) {
				return true;
			}
		}
	} else {
		for(var q = 0; q < actorWidth; q++) {
			var index = (y*canvasWidth+x+q)*4;
			if(imgData.data[index] < 50 & imgData.data[index+1] < 50 & imgData.data[index+2] < 50) {
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

// countdown
function countDown() {	
	document.getElementById("canvas_space").style.display = "none";
	document.getElementById("entree").style.display = "inherit";
	
	counter = countdown;
	putCounter(counter);
	counter--;
	countTimer = setInterval(function() {
		putCounter(counter);
		counter--;
		if(counter < 0) {
			clearInterval(countTimer);			
			document.getElementById("entree").style.display = "none";
			document.getElementById("canvas_space").style.display = "inherit";
			init();
		}
	},1000);
}
function putCounter(cnt) {
	var can = document.getElementById("preview");
	var cxt = can.getContext("2d");
	
	cxt.setTransform(1,0,0,1, 0, 0);
	cxt.clearRect(0,0, cxt.canvas.width, cxt.canvas.height);
	cxt.drawImage(levelPreview[currentLevel], 0, 0);
	cxt.font = "50px Arial";
	cxt.fillStyle = "black";
	cxt.textAlign = "center";
	cxt.fillText(cnt, can.width/2, (can.height/2+12));
}

// timer functions
runningTime = 0;
var myVar = setInterval(function(){time()},1);

function startTimer() {
	start = new Date();
}
function stopTimer() {
	var now = new Date();
	var current = now.getTime() - start.getTime();
	runningTime += current;
}
function resetTimer() {
	runningTime = 0;
}
function getTime() {
	var sec = Math.floor(runningTime / 1000);
	var mSec = runningTime % 1000;
	return sec + " s " + mSec + " ms";
}

//navigator.wakeLock is the main standby API property.
//request method requests the computer to not enter standby mode. Here "display" indicates that the monitor shouldn't enter standby mode.
navigator.wakeLock.request("display").then(
    function successFunction() {
        // success
    },
    function errorFunction() {
        // error
    }
);

//release() is used to release the lock.
//navigator.wakeLock.release("display");
