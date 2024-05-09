let dev = false;
const settings = {settings: {timeSettings: window.electron.preferences.timer}};


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

document.getElementById("quick-open").addEventListener('change', function () {

	console.log(this.files[0].path)

	fileHandling(this.files[0].path);

	//window.electron.savePreferences();
	//console.log(this.files[0])
	/*let obj = {
		"quick_icon": {
			"app_name": [
				"gg"
			]
		}
	};*/


	//let filename = fullPath.replace(/^.*[\\/]/, '');
	//console.log(filename);


	/*window.electron.createFileIconFromPath('aaaaaaaaaaaaa').then(img=>{
		console.log({img})
		//window.elcIcon = img;

		//document.querySelector("#elcIcon").src = img
	});*/

	//console.log({appIcon})

	/*"quick_icon": {
		"app_name": [
			"gg"
		]
	},*/
});

const fileHandling = (fullPath) => {
	let app_names = window.electron.saveQuickIcon(fullPath);

	//console.log(app_icon)

	window.electron.createFileIconFromPath(fullPath).then(imgPath=>{
		//console.log({app_names, imgPath})
		window.iconList(app_names);
	});
}



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
demo.innerHTML = window.electron.preferences.timer.interval + "m 00s";
focusArea.style.backgroundImage = 'url("./assets/imgs/computer-sleep-mode-monitor-screen-symbol-with-a-night-image-svgrepo-com.svg")'
focusArea.style.backgroundSize = '5rem';
focusArea.style.backgroundRepeat = 'no-repeat';
focusArea.style.backgroundPosition = 'center';
focusArea.style.transition = 'background-image 1s';

let worker;
let timerSoundRun;
let playToggle = false;


timeIncrease.onclick = function () {
	if (timerSoundRun) {
		timerSoundRun.pause();
		timerSoundRun.currentTime = 0;
	}
	worker.postMessage({time: 5, timeModifyFound: true});
}

timeDecrease.onclick = function () {
	if (timerSoundRun) {
		timerSoundRun.pause();
		timerSoundRun.currentTime = 0;
	}
	worker.postMessage({time: -5, timeModifyFound: true});
}

//timeModify();

play.onclick = function () {
	playToggle = !playToggle;

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
	let audio = new Audio(src);
	if (window.electron) {
		audio.play();
	}
	return audio;
}

function focusHandle() {
	audioPlay('./assets/sounds/clock-alarm.mp3');
	!dev && window.electron?.undoMinimizeAll()
	demo.style.color = '#0d8c00';
	focusArea.style.backgroundImage = 'url("./assets/imgs/plant-leaf-svgrepo-com.svg")'
}

function restHandle() {
	audioPlay('./assets/sounds/piano.mp3');
	!dev && window.electron?.minimizeCMD()
	demo.style.color = '#a6cca3';
	focusArea.style.backgroundImage = 'url("./assets/imgs/tea-cup-coffee-svgrepo-com.svg")'
}

function timerSound() {
	return audioPlay('./assets/sounds/timer.mp3');
}

let circleProgress = document.getElementsByTagName("circle-progress");
//console.log(circleProgress[0]);

worker = new Worker('js/timer_worker.js', {name: JSON.stringify(settings)});

//worker.postMessage(settings);

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

	if (timer.trim() === '00m 12s') {
		timerSoundRun = timerSound();
	}

	demo.innerHTML = timer;

	//console.log('worker:: ', event.data);

	if (distance === 0) {
		//console.log('distance worker:: ', event.data);
		if (focusToggle) {
			restHandle()
		} else {
			focusHandle()
		}
	}
}
