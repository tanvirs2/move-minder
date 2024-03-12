let interval = 25;
let focus = interval;
let rest = 5;

let dev = false;

if (dev) {
    interval = .2;
    focus = interval;
    rest = .1;
}

const minuteToMillisecond =(minute) => {
    let sixtyMillisecond = 60;
    let oneMinute = sixtyMillisecond * 1000;
    return minute * oneMinute;
};


let distance = minuteToMillisecond(interval);

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

let focusToggle = true;

let play = false;
let intvStart;

self.onmessage = function (event) {
    play = event.data.play;
    let {playKeyFound, timeModifyFound, time} = event.data;

    if (timeModifyFound) {
        timeModify(time);
        self.postMessage({timeModify: true, interval: interval + "m " + addZero(0) + "s "})
    }

    if (playKeyFound) {
        if (play) {
            timeStart();
        } else {
            clearInterval(intvStart);
        }
    }

}

const addZero = (num) => ('0' + num).slice(-2)

function timeStart(){
    intvStart = setInterval(()=>{
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        //('0' + minutes).slice(-2)


        self.postMessage({
            timer: addZero(minutes) + "m " + addZero(seconds) + "s ",
            focusToggle,
            distance,
            focus,
            play,
            interval,
            rest
        });
        //self.postMessage(seconds);

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

