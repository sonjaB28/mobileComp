
runningTime = 0;
var myVar = setInterval(function(){time()},1);

function startTimer() {
	var start = new Date();
}
function stopTimer() {
	var now = new Date();
	var time = now.getTime() - start.getTime();
	runningTime += time;
}
function resetTimer() {
	runningTime = 0;
}
function getTime() {
	var sec = Math.floor(runningTime / 1000);
	var mSec = runningTime % 1000;
	return sec + ":" + mSec;
}

