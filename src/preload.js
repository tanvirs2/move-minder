// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcMain, ipcRenderer } = require('electron');

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
    //laragon_app_run: () => ipcRenderer.send('laragon_app_run'),
    ...bridges
});