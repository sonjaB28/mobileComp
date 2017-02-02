

function changeImage(alpha, beta, gamma) {
	var img = new Image();
	img.src = "img/iah.jpg";
	half_width = img.naturalWidth / 2;
	half_height = img.naturalHeight / 2;

	var c = document.getElementById("iahCanvas");
	var context = c.getContext("2d");
	var canvasWidth = 600;
	var canvasHeight = 600; 
		
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	context.translate(valueRange(gamma)*4, valueRange(beta)*4);
	context.drawImage(img, canvasWidth/2 - half_width, canvasHeight/2 - half_height);
}

function valueRange(value) {
	range = 10;
	if(value < -range) {
		return -1;
	} else if(value > range) {
		return 1;
	} else {
		return 0;
	}
}