// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcMain, ipcRenderer } = require('electron');
var MicroModal = require('micromodal');

// Fetch the preferences object
const preferences = ipcRenderer.sendSync('getPreferences');

ipcRenderer.send('showPreferences');

// Listen to the `preferencesUpdated` event to be notified when preferences are changed.
ipcRenderer.on('preferencesUpdated', (e, preferences) => {
    console.log('Preferences were updated', preferences);
});
//console.log({preferences});
//MicroModal.init();

const appArray = [
    {
        name: 'laragon',
        logo: 'laragon.png',
    },
    {
        name: 'sourcetree',
        logo: 'sourcetree.png',
    },
    {
        name: 'phpstorm',
        logo: 'phpstorm.png',
    },
    {
        name: 'clock',
        logo: 'clock.png',
    },
    {
        name: 'note',
        logo: 'note.png',
    },
    {
        name: 'AULA',
        logo: 'aula.jpeg',
    }
];

let bridges = appArray.reduce((prev, curr) => {
    let currModify = {[curr.name]: () => ipcRenderer.send(`${curr.name}_app_run`)};
    return {...prev, ...currModify};
} , {});


/*let bridges = appArray.map(item=> {
    console.log(item)
    return {
        [item.name]: () => ipcRenderer.send(`${item.name}_app_run`),
    }
});*/

contextBridge.exposeInMainWorld("electron", {
    //loadExplorer: () => ipcRenderer.send('loadExplorer'),
    //my_send: (channel, payload) => ipcRenderer.send(channel, payload),
    nodeVersionChange: (payload) => ipcRenderer.send('nodeVersionChangeRequest', payload),
    minimizeCMD: (payload) => ipcRenderer.send('minimizeCMD', payload),
    undoMinimizeAll: (payload) => ipcRenderer.send('undoMinimizeAll', payload),
    timeProgress: (payload) => ipcRenderer.send('timeProgress', payload),
    timeSettings: preferences.timer,
    //nodeVersion_List: () => ipcRenderer.send('node-version-list', payload),
    getSettings: () => ipcRenderer.invoke('getSettings'),
    nodeVersionList: () => ipcRenderer.invoke('nodeVersionList'),
    MicroModal: () => MicroModal,
    //laragon_app_run: () => ipcRenderer.send('laragon_app_run'),
    ...bridges
});

/*
window.addEventListener('DOMContentLoaded', () => {
    setInterval(()=>{
        //mainWindow.webContents.send('data-channel', { message: 'Hello from Main!' });
        //let tt = window.electron.getSettings;
        console.log(window.electron.timeProgress)
    }, 1000)

    ipcRenderer.on('data-channel', (event, arg) => {
        alert('ddd')
        console.log(arg); // Output: "Hello from Main!"
    });
});*/
