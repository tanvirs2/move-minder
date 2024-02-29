/*function testFunc() {
    window.electron.loadExplorer()

    //window.theNameYouWant.send("channel-name", { someData: "Hello" })
}

// index.js
const chgBtn = document.getElementById("myBtn")
chgBtn.onclick = function () {
    replaceText("myText", "no boom...")
    window.electron.my_send("button-clicked", { someData: "Hello" })
}

function replaceText(selector, text) {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
}*/

const node_version = document.querySelector("#node_version");

node_version.addEventListener('change', function (evt) {
    window.electron.nodeVersionChange({ nodeVersionNumber: evt.target.value })
});



/*

const laragon_icon = document.querySelector("#laragon_icon");


laragon_icon.addEventListener('click', function (evt) {
    window.electron.laragon_app_run()
});*/

appArray.forEach(({name, logo}) => {
    const icon = document.querySelector(`#${name}`);
    //console.log(icon);
    icon.addEventListener('click', function (evt) {
        //window.electron.laragon_app_run()
        window.electron[name]()
        //alert('d');
    });
});