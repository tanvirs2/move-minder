// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { app, contextBridge, ipcMain, ipcRenderer } = require('electron');
const quotes = require('./assets/quotes/quotes.json');


const isDev = process.argv[0].includes("WorkStation");


// Fetch the preferences object
const preferences = ipcRenderer.sendSync('getPreferences');

//ipcRenderer.send('showPreferences');

ipcRenderer.on('preferencesUpdated', (e, preferences) => { // Listen to the `preferencesUpdated` event to be notified when preferences are changed.
    //console.log('Preferences were updated', preferences);
    const prefUpdatedEvent = new CustomEvent("prefUpdated", {
        detail: {
            preferences,
        },
    });
    setTimeout(() => {
        document.dispatchEvent(prefUpdatedEvent);
    }, 500);
});


ipcRenderer.on("timer_btns", (e, action)=>{
    //console.log({action})
    const thumbBtnClickEvent = new CustomEvent('thumbBtnClick', {detail: action});
    document.dispatchEvent(thumbBtnClickEvent);
});


const savePreferences = (obj) => {}

const saveQuickIcon = (appPath) => {
    const preferences = ipcRenderer.sendSync('getPreferences');
    let app_names = [appPath, ...preferences.quick_icon.app_name];
    let appSet = new Set(app_names);
    let newPreferences = {
        ...preferences,
        quick_icon: {
            app_name: [
                ...appSet
            ]
        }
    }

    ipcRenderer.sendSync('setPreferences', newPreferences);
    return [...appSet];
}


contextBridge.exposeInMainWorld("electron", {
    //loadExplorer: () => ipcRenderer.send('loadExplorer'),
    //my_send: (channel, payload) => ipcRenderer.send(channel, payload),
    playPauseUIHandler: (payload) => ipcRenderer.send('playPauseUIHandler', payload),
    nodeVersionChange: (payload) => ipcRenderer.send('nodeVersionChangeRequest', payload),
    minimizeCMD: (payload) => ipcRenderer.send('minimizeCMD', payload),
    undoMinimizeAll: (payload) => ipcRenderer.send('undoMinimizeAll', payload),
    timeProgress: (payload) => ipcRenderer.send('timeProgress', payload),
    //createFileIconFromPath: (payload) => ipcRenderer.send('createFileIconFromPath', payload),
    //timeSettings: preferences.timer,
    preferences: preferences,
    isDev: isDev,
    savePreferences: savePreferences,
    saveQuickIcon: saveQuickIcon,
    quotes: quotes.quotes,
    //nodeVersion_List: () => ipcRenderer.send('node-version-list', payload),
    getSettings: () => ipcRenderer.invoke('getSettings'),
    nodeVersionList: () => ipcRenderer.invoke('nodeVersionList'),
    createFileIconFromPath: (payload) => ipcRenderer.invoke('createFileIconFromPath', payload),
    timerRemainStopNotify: (payload) => ipcRenderer.invoke('timerRemainStopNotify', payload),
    iconRun: (payload) => ipcRenderer.invoke('iconRun', payload),
    //laragon_app_run: () => ipcRenderer.send('laragon_app_run'),
    //...bridges
});

