
var x_pos = 0;
var y_pos = 0;
var alpha_standard = 0;
var beta_standard = 0;
var gamma_standard = 0;

var movement = 4;
var range = 2;
var doCalibrate = true;

function deviceOrientationChanged(event) {
	var alpha = event.alpha;
	var beta = event.beta;
	var gamma = event.gamma;
	
	if(doCalibrate == true) {
		alpha_standard = alpha;
		beta_standard = beta;
		gamma_standard = gamma;
		doCalibrate = false;
	}
	
	changeImage(alpha-alpha_standard, beta-beta_standard, gamma-gamma_standard);

	document.querySelector("#mag_alpha").innerHTML = "alpha = " + alpha;
	document.querySelector("#mag_beta").innerHTML = "beta = " + beta;
	document.querySelector("#mag_gamma").innerHTML = "gamma = " + gamma;
	
}

function calibrate() {
	doCalibrate = true;
}

function changeImage(alpha, beta, gamma) {
	var img = new Image();
	img.src = "img/iah.jpg";
	half_width = img.naturalWidth / 2;
	half_height = img.naturalHeight / 2;

	var c = document.getElementById("iahCanvas");
	var context = c.getContext("2d");
	var canvasWidth = 600;
	var canvasHeight = 600; 
	
	left_border = 0;
	right_border = canvasWidth-img.naturalWidth;
	upper_border = 0;
	lower_border = canvasHeight-img.naturalHeight;
	
	
	add_to_x = updatePosition(x_pos, left_border, right_border, gamma);
	add_to_y = updatePosition(y_pos, upper_border, lower_border, beta);	
		
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	context.translate(add_to_x, add_to_y);
	context.drawImage(img, 0, 0);
	
	x_pos = x_pos + add_to_x;
	y_pos = y_pos + add_to_y;
}

function updatePosition(pos, negativeBorder, positiveBorder, orientation) {
	direction = valueRange(orientation);
	if(pos <= (negativeBorder+movement) && direction < 0) {
		return negativeBorder - pos;
	} else if(pos >= (positiveBorder-movement) && direction > 0) {
		return positiveBorder - pos;
	} else {
		return direction*movement;
	}
}

function valueRange(value) {
	if(value < -range) {
		return -1;
	} else if(value > range) {
		return 1;
	} else {
		return 0;
	}
}