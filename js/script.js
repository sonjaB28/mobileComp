
var x_pos = 0;
var y_pos = 0;

function changeImage(alpha, beta, gamma) {
	var img = new Image();
	img.src = "img/iah.jpg";
	half_width = img.naturalWidth / 2;
	half_height = img.naturalHeight / 2;

	var c = document.getElementById("iahCanvas");
	var context = c.getContext("2d");
	var canvasWidth = 600;
	var canvasHeight = 600; 
	var movement = 4;
	
	left_border = 0;
	right_border = canvasWidth-half_width;
	upper_border = 0;
	lower_border = canvasHeight-half_height;
	
	
	add_to_x = 0;
	add_to_y = 0;
	if(x_pos >= left_border && x_pos <= right_border) {		
		add_to_x = valueRange(gamma)*movement;
	}
	if(y_pos >= upper_border && y_pos <= lower_border) {
		add_to_y = valueRange(beta)*movement;
	}	
		
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	context.translate(add_to_x, add_to_y);
	context.drawImage(img, 0, 0);
	
	x_pos = x_pos + add_to_x;
	y_pos = y_pos + add_to_y;
	//canvasHeight/2 - half_height
}

function valueRange(value) {
	var range = 2;
	if(value < -range) {
		return -1;
	} else if(value > range) {
		return 1;
	} else {
		return 0;
	}
}