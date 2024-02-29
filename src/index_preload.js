const { contextBridge, ipcMain, ipcRenderer } = require('electron');


let indexBridge = {
    loadExplorer: async ()=>{
        await ipcRenderer.invoke('loadExplorer');
    }
}

contextBridge.exposeInMainWorld("indexBridge", {
    loadExplorer: () => ipcRenderer.send('loadExplorer'),
});