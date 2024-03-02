
const minuteToMillisecond =(minute) => {
    let sixtyMillisecond = 60;
    let oneMinute = sixtyMillisecond * 1000;
    return minute * oneMinute;
}

let interval = 22;

let focus = interval;
let rest = 5;

let distance = minuteToMillisecond(interval);

let focusToggle = true;

setInterval(()=>{
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    self.postMessage({
        timer: minutes + "m " + seconds + "s ",
        focusToggle,
        distance,
        focus,
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