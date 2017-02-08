
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
	context2 = c2.getContext("2d");
	context2.translate(15,0);
	context2.drawImage(actorImg2, 0, 0);
	
	document.querySelector("#mag_alpha").innerHTML = "alpha = " + alpha;
	document.querySelector("#mag_beta").innerHTML = "beta = " + beta;
	document.querySelector("#mag_gamma").innerHTML = "gamma = " + gamma;
}, true);