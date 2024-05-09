

function audioPlay(src) {
    var audio = new Audio(src);
    if (window.electron) {
        audio.play();
    }
}

const node_version = document.querySelector("#node_list");

function btnAction(selector, electronActionCallback, eventName = 'click') {
    const selectorElm = document.querySelector(selector);
    selectorElm.addEventListener(eventName, function (evt) {
        audioPlay('./assets/sounds/notifications-sound.mp3');
        electronActionCallback();
    });
}

btnAction("#minimize-btn", window.electron?.minimizeCMD);
btnAction("#maximize-btn", window.electron?.undoMinimizeAll);

node_version.addEventListener('change', function (evt) {
    window.electron.nodeVersionChange({ nodeVersionNumber: evt.target.value })
});


//console.log({timeSettings: window.electron.timeSettings})

window.electron?.nodeVersionList().then(nodes=>{
    let lists = nodes.split("\n").filter(item => !!item);

    let radioBtnList = '';

    lists.forEach(item=>{
        radioBtnList += radioBtn(item);
    })

    node_list.innerHTML = radioBtnList;
})

let node_list = document.querySelector("#node_list");

let radioBtn = (name)=>{

    let active = false;
    if (name.search(/\*/) > 0) {

        active = true;
        name = name.replace(/\(.+/, '');
        name = name.replace('*', '');
    }

    return (
        `<label class="radio-btn">
           <input type="radio" value="${name}" ${active && 'checked'} name="node_version">NodeJS ${name}
         </label>
         <br>`
    );
}


/*
appArray.forEach(({name, logo}) => {
    const icon = document.querySelector(`#${name}`);
    //console.log(icon);
    icon.addEventListener('click', function (evt) {
        //window.electron.laragon_app_run()
        window.electron[name]()
        //alert('d');
    });
});*/
