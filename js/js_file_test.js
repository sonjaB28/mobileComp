
alpha_standard = 0;
beta_standard = 0;
gamma_standard = 0;


// Mobile Usage 

window.addEventListener("deviceorientation", function(event) {
	var alpha = event.alpha;
	var beta = event.beta;
	var gamma = event.gamma;
	

	var actorImg2 = new Image();
	actorImg2.src = "img/iah.jpg";
	var c2 = document.getElementById("canvas");
	context = c2.getContext("2d");
	
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
	
	x_pos += x_dir * 4;
	y_pos += y_dir*4;
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

