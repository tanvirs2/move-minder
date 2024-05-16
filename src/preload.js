// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { app, contextBridge, ipcMain, ipcRenderer } = require('electron');
const quotes = require('./assets/quotes/quotes.json');

//console.log(quotes);

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
    document.dispatchEvent(prefUpdatedEvent);
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

/*const appArray = [
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
} , {});*/


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
    //createFileIconFromPath: (payload) => ipcRenderer.send('createFileIconFromPath', payload),
    //timeSettings: preferences.timer,
    preferences: preferences,
    savePreferences: savePreferences,
    saveQuickIcon: saveQuickIcon,
    quotes: quotes.quotes,
    //nodeVersion_List: () => ipcRenderer.send('node-version-list', payload),
    getSettings: () => ipcRenderer.invoke('getSettings'),
    nodeVersionList: () => ipcRenderer.invoke('nodeVersionList'),
    createFileIconFromPath: (payload) => ipcRenderer.invoke('createFileIconFromPath', payload),
    iconRun: (payload) => ipcRenderer.invoke('iconRun', payload),
    //laragon_app_run: () => ipcRenderer.send('laragon_app_run'),
    //...bridges
});

