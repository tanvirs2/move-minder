let dev;

let interval;
let focus;
let rest;
let distance;
let focusToggle;
let play;
let intvStart;
let intvReminderStart;
let isIntvReminderStart = true;
let workerObject = {};

if (dev) {
    interval = .5;
    focus = interval;
    rest = .25;
}


const init = ({settings}) => {

    const {timeSettings} = settings;

    dev = false;

    interval = timeSettings.interval;
    focus = interval;
    rest = timeSettings.rest;
    distance = 0;
    focusToggle = true;
    play = false;
}

init(JSON.parse(this.name));

const minuteToMillisecond =(minute) => {
    let sixtyMillisecond = 60;
    let oneMinute = sixtyMillisecond * 1000;
    return (minute * oneMinute);
};


distance = minuteToMillisecond(interval);

const timeModify = (time) => {

    const x = () => {
        interval = interval + time;
        distance = minuteToMillisecond(interval);
    }

    if (time > 0) {
        if (interval < 40) {
            x();
        }
    }

    if (time < 0) {
        if (interval > 0) {
            x();
        }
    }

}


self.onmessage = function (event) {
    play = event.data.play;
    let {playKeyFound, timeModifyFound, time} = event.data;

    if (timeModifyFound) {
        timeModify(time);
        //self.postMessage({isIntvReminderStart:'fff', timeModify: true, interval: interval + "m " + addZero(0) + "s "})
    }

    if (playKeyFound) {
        if (play) {
            timeStart();
            clearInterval(intvReminderStart);
            isIntvReminderStart = false;
            console.log(' intvReminderStart clear ')
        } else {
            clearInterval(intvStart);
            isIntvReminderStart = true;
            reminderTimeStart()
        }
    }

}

const addZero = (num) => ('0' + num).slice(-2)

function timeStart(){
    intvStart = setInterval(()=>{
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        //('0' + minutes).slice(-2)

        workerObject = {...workerObject, isIntvReminderStart, timer: addZero(minutes) + "m " + addZero(seconds) + "s ",
            focusToggle,
            distance,
            focus,
            play,
            interval,
            rest};

        self.postMessage(workerObject);

        distance = distance - 1000;

        if (distance < 0) {

            if (focusToggle) {
                distance = minuteToMillisecond(rest);
            } else {
                distance = minuteToMillisecond(focus);
            }

            focusToggle = !focusToggle;
        }
    }, 1000);
}

function reminderTimeStart() {
    console.log('start')
    intvReminderStart = setInterval(()=>{

        console.log('ddddddddd')
        /*
        * As main timer not started so time object not created yet here
        * */
        if (Object.keys(workerObject).length) {
            workerObject = {...workerObject, isIntvReminderStart};

            console.log('start main timer', isIntvReminderStart)

            self.postMessage(workerObject);
        }
    }, 3000);
}

reminderTimeStart();