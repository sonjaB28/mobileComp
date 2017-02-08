
x_pos = 5;
y_pos = 5;
alpha_standard = 0;
beta_standard = 0;
gamma_standard = 0;



movement = 6;
range = 2;
doCalibrate = true;
text = "start: ";
// initialize
function isMobile(){
    return navigator.userAgent.match(/(iPhone|iPod|iPad|blackberry|android|Kindle|htc|lg|midp|mmp|mobile|nokia|opera mini|palm|pocket|psp|sgh|smartphone|symbian|treo mini|Playstation Portable|SonyEricsson|Samsung|MobileExplorer|PalmSource|Benq|Windows Phone|Windows Mobile|IEMobile|Windows CE|Nintendo Wii)/i);
}

window.onload = function() {setImages();}

function setImages() {	
	
	actorImg = new Image();
	actorImg.src = "img/iah.jpg";

	var c = document.getElementById("canvas");
	context = c.getContext("2d");
	bgImg = new Image();
	bgImg.src = "img/MrLaba.jpg";
	context.setTransform(1,0,0,1, 0, 0);
	context.drawImage(bgImg, 0, 0);
	
	canvasWidth = c.width;
	canvasHeight = c.height; 
	
	imgData = context.getImageData(0, 0, c.width,c.height);
	
	actorWidth = actorImg.naturalWidth;
	actorHeight = actorImg.naturalHeight;
	
	context.setTransform(1,0,0,1, x_pos, y_pos);
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
	update(0, y_axis, x_axis);	
}, true);




// Mobile Usage 

window.addEventListener("deviceorientation", deviceOrientationChanged(event), true);

function deviceOrientationChanged(e) {
	var event = window.event||e;
	
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
	
}

// other functions

function update(alpha, beta, gamma) {
	
	updatePosition(x_pos, y_pos, gamma, beta);
	
	context.clearRect(0,0,actorWidth, actorHeight);
	context.setTransform(1,0,0,1, x_pos, y_pos);
		
	drawActor();
}

function drawActor() {
	context.drawImage(actorImg, 0, 0);
}

function updatePosition(x, y, gamma, beta) {
	var x_dir = getDirection(gamma);
	var y_dir = getDirection(beta);	
	var probability_for_hit = 50;
	
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

function calibrate() {
	setImages();
	doCalibrate = true;
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