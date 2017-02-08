



window.addEventListener("deviceorientation", function(event) {
	var alpha = event.alpha;
	var beta = event.beta;
	var gamma = event.gamma;


	document.querySelector("#mag_alpha").innerHTML = "alpha = " + alpha;
	document.querySelector("#mag_beta").innerHTML = "beta = " + beta;
	document.querySelector("#mag_gamma").innerHTML = "gamma = " + gamma;
}, true);

