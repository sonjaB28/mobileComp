var counter = 3;
for(var i=3; i>=0; i--) {
	document.getElementById("countdown").innerHTML = counter;
	setTimeout(function(){}, 1000);
}

setTimeout(function(){ alert("Hello"); }, 1000);