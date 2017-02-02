

function changeImage(alpha, beta, gamma) {
	var img = new Image();
	img.src = "img/iah.jpg";
	half_width = img.naturalWidth / 2;
	half_height = img.naturalHeight / 2;

	var c = document.getElementById("iahCanvas");
	var context = c.getContext("2d");
	var canvasWidth = 600;
	var canvasHeight = 600;
	
	var x_pos = canvasWidth/2 - half_width;
	var y_pos = canvasHeight/2 - half_height;	
	
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	context.drawImage(img, updatePosition(x_pos,gamme), updatePosition(y_pos,beta));
}

function updatePosition(position, value) {
	var movement = 4;
	return position + valueRange(value) * movement;
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