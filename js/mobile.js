// src files
actorImg_src = "img/iah.jpg";
bgImg_src = "img/MrLaba.jpg";

// gloabl variables

movement = 6;
range = 2;
doCalibrate = true;



window.addEventListener("deviceorientation", deviceOrientationChanged(event), true);

function deviceOrientationChanged(event) {
	var alpha = event.alpha;
	var beta = event.beta;
	var gamma = event.gamma;


	document.querySelector("#mag_alpha").innerHTML = "alpha = " + alpha;
	document.querySelector("#mag_beta").innerHTML = "beta = " + beta;
	document.querySelector("#mag_gamma").innerHTML = "gamma = " + gamma;
}