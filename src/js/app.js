

//let interval = 22;

//let focus = interval;
//let rest = 5;

//var distance_ = minuteToMillisecond(interval);



//const timeManage = timeManagement(focus, rest);


window.addEventListener('DOMContentLoaded', () => {
	/*window.electron.getSettings().then(a=>{
		console.log(a)
	})*/

	/*window.electron.nodeVersionList().then(a=>{
		console.log(a)
	})*/

	/*ipcRenderer.on('data-channel', (event, arg) => {
		alert('ddd')
		console.log(arg); // Output: "Hello from Main!"
	});*/
});

function minuteToMillisecond(minute) {
	let sixtyMillisecond = 60;
	let oneMinute = sixtyMillisecond * 1000;
	return minute * oneMinute;
}

let focusArea = document.querySelector("#focus-area");
let play = document.querySelector("#play");
let timeIncrease = document.querySelector("#time-increase");
let timeDecrease = document.querySelector("#time-decrease");
let fondo_btn = play.querySelector(".fondo");
let demo = document.getElementById("demo");
focusArea.style.backgroundImage = 'url("./assets/imgs/computer-sleep-mode-monitor-screen-symbol-with-a-night-image-svgrepo-com.svg")'
focusArea.style.backgroundSize = '5rem';
focusArea.style.backgroundRepeat = 'no-repeat';
focusArea.style.backgroundPosition = 'center';
focusArea.style.transition = 'background-image 1s';

let worker;
let timerSoundRun;
let playToggle = false;

const timeModify = (time) => {
	//time-decrease
	//distance = minuteToMillisecond(interval + time);
}

timeIncrease.onclick = function () {
	worker.postMessage({time: 5, timeModifyFound: true});
}

timeDecrease.onclick = function () {
	worker.postMessage({time: -5, timeModifyFound: true});
}

timeModify();

play.onclick = function () {
	playToggle = !playToggle;

	/*if (timerSoundRun && !playToggle) {
		timerSoundRun.pause();
	} else {
		if (timerSoundRun && playToggle) {
			timerSoundRun.play();
		}
	}*/

	if (timerSoundRun) {
		if (playToggle) {
			timerSoundRun.play();
		} else {
			timerSoundRun.pause();
		}
	}

	if (playToggle) {
		fondo_btn.style.background = '#007300';
		focusArea.style.backgroundImage = 'url("./assets/imgs/plant-leaf-svgrepo-com.svg")';
	} else {
		focusArea.style.backgroundImage = 'url("./assets/imgs/computer-sleep-mode-monitor-screen-symbol-with-a-night-image-svgrepo-com.svg")';
		fondo_btn.style.background = '#00d200';
	}
	worker.postMessage({play: playToggle, playKeyFound: true});
	this.classList.toggle('active');
}

function audioPlay(src) {
	var audio = new Audio(src);
	if (window.electron) {
		audio.play();
	}
	return audio;
}

function focusHandle() {
	//var audio = new Audio('./assets/sounds/clock-alarm.mp3');
	/*if (window.electron) {
		audio.play();
	}*/
	audioPlay('./assets/sounds/clock-alarm.mp3');
	window.electron?.undoMinimizeAll()
	demo.style.color = '#0d8c00';
	focusArea.style.backgroundImage = 'url("./assets/imgs/plant-leaf-svgrepo-com.svg")'
}

function restHandle() {
	//var audio = new Audio('./assets/sounds/piano.mp3');
	/*if (window.electron) {
		audio.play();
	}*/
	audioPlay('./assets/sounds/piano.mp3');
	window.electron?.minimizeCMD()
	demo.style.color = '#a6cca3';
	focusArea.style.backgroundImage = 'url("./assets/imgs/tea-cup-coffee-svgrepo-com.svg")'
}

function timerSound() {
	return audioPlay('./assets/sounds/timer.mp3');
}

let circleProgress = document.getElementsByTagName("circle-progress");
//console.log(circleProgress[0]);

worker = new Worker('js/timer_worker.js');

worker.onmessage = function (event) {
	const {timer, focusToggle, distance, focus, rest, interval, timeModify} = event.data;
	if (timeModify) {
		demo.innerHTML = interval;
		return 0;
	}
	let progress_0to1 = distance / minuteToMillisecond(focusToggle ? focus : rest);
	let progress = 100 - Math.round(progress_0to1 * 100);

	//console.log(progress, progress_0to1);

	window.electron?.timeProgress(progress_0to1);

	circleProgress[0].value = progress;
	circleProgress[0].max = 100;

	/*circleProgress[0].textFormat = function (){
		return ''
	};*/

	if (timer.trim() === '00m 12s') {
		timerSoundRun = timerSound();
	}

	demo.innerHTML = timer;

	console.log('worker:: ', event.data);

	if (distance === 0) {
		//console.log('distance worker:: ', event.data);
		if (focusToggle) {
			restHandle()
		} else {
			focusHandle()
		}
	}
}

// Update the count down every 1 second
//setInterval(function() {
	//var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	//var seconds = Math.floor((distance % (1000 * 60)) / 1000);

	//console.log(seconds);

	/*let progress = Math.round((distance / minuteToMillisecond(interval)) * 100);

	circleProgress[0].value = progress;
	circleProgress[0].max = 100;
	circleProgress[0].textFormat = function (){
		//return minutes + "m " + seconds + "s "
		return minutes + "m " + seconds + "s "
	};*/
	/*let demo = document.getElementById("demo");
	demo.innerHTML = minutes + "m " + seconds + "s ";
	distance = distance - 1000;*/

	// If the count down is finished, write some text
	/*if (distance <= 0) {
		if (restAndFocusToggle) {
			demo.style.color = '#0035e8';
			distance = timeManage.restHandle();
		} else {
			demo.style.color = '#109806';
			distance = timeManage.focusHandle();
		}
		restAndFocusToggle = !restAndFocusToggle;

	}*/
//}, 1000);