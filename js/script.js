

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
	context.translate(Math.sign(gamma)*4, 0);
	context.drawImage(img, canvasWidth/2 - half_width, canvasHeight/2 - half_height);
}

function printValue(sliderID, textbox) {
	var x = document.getElementById(textbox);
	var y = document.getElementById(sliderID);
	x.value = y.value;
}