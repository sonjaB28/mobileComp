// src files
actorImg_src = "img/iah.jpg";
bgImg_src = "img/MrLaba.jpg";

// gloabl variables

movement = 6;
range = 2;
doCalibrate = true;

function init() {
	x_pos = 5;
	y_pos = 5;
	alpha_standard = 0;
	beta_standard = 0;
	gamma_standard = 0;
	doCalibrate = true;	
	
	// load images
	actorImg = new Image();
	actorImg.src = actorImg_src;
	
	bgImg = new Image();
	bgImg.src = bgImg_src;
	
	// load canvas
	var canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	
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
}

window.addEventListener("deviceorientation", function(event) {
	var alpha = event.alpha;
	var beta = event.beta;
	var gamma = event.gamma;


	document.querySelector("#mag_alpha").innerHTML = "alpha = " + alpha;
	document.querySelector("#mag_beta").innerHTML = "beta = " + beta;
	document.querySelector("#mag_gamma").innerHTML = "gamma = " + gamma;
}, true);

