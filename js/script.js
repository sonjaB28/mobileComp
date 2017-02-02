
var x_pos = 0;
var y_pos = 0;
var movement = 4;
var range = 2;

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
	//canvasHeight/2 - half_height
}

function updatePosition(pos, negativeBorder, positiveBorder, orientation) {
	if(pos <= negativeBorder) {
		return negativeBorder - pos;
	} else if(pos >= positiveBorder) {
		return positiveBorder - pos;
	} else {
		return valueRange(orientation)*movement;
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