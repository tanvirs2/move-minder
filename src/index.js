const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');

const subProcess = require('child_process');
//const CircleProgress = require('js-circle-progress');
//var ProgressBar = require('progressbar.js')

// Create an instance of CircleProgress element
//const cp = CircleProgress();

let minimizeCMD = 'powershell -command "& { $x = New-Object -ComObject Shell.Application; $x.minimizeAll() }"';
let undoMinimizeAll = 'powershell -command "& { $x = New-Object -ComObject Shell.Application; $x.UndoMinimizeAll() }"';

function nodeVersionChangeHandler(data) {
  subProcess.spawn('nvm', [
    "use",
    data.nodeVersionNumber
  ], { shell: true, stdio: 'inherit' })
}

ipcMain.on("nodeVersionChangeRequest", (event, data) => nodeVersionChangeHandler(data))
ipcMain.on("minimizeCMD", (event, data) => subProcess.spawn(minimizeCMD, { shell: true, stdio: 'inherit' }))
ipcMain.on("undoMinimizeAll", (event, data) => subProcess.spawn(undoMinimizeAll, { shell: true, stdio: 'inherit' }))

const appCmdArray = [
  {
    name: 'laragon',
    cmd: 'start "" "%HOMEDRIVE%\\laragon\\laragon.exe"',
  },
  {
    name: 'sourcetree',
    cmd: 'start "" "%LocalAppData%\\SourceTree\\SourceTree.exe"',
  },
  {
    name: 'phpstorm',
    cmd: 'start "" "%ProgramFiles%\\JetBrains\\PhpStorm 2023.2.2\\bin\\phpstorm64.exe"',
  },
  {
    name: 'clock',
    cmd: 'start shell:appsfolder\\Microsoft.WindowsAlarms_8wekyb3d8bbwe!App',
  },
  {
    name: 'note',
    cmd: 'start shell:appsfolder\\Microsoft.MicrosoftStickyNotes_8wekyb3d8bbwe!App',
  },
  {
    name: 'AULA',
    cmd: 'start "" "C:\\Program Files (x86)\\GamingMouse\\AULA F2088 Pro Gaming Keyboard\\ShinetekTools.exe"', //Microsoft.WindowsAlarms_10.1506.19010.0_x64_8wekyb3d8bbwe
  }
];

appCmdArray.forEach(({name, cmd})=>{
  ipcMain.on(`${name}_app_run`, (event, data)=>{
    subProcess.spawn(cmd, { shell: true, stdio: 'inherit' })
  })
})


/*function laragon_app_run() {
  subProcess.spawn('start "" "%HOMEDRIVE%\\laragon\\laragon.exe"', { shell: true, stdio: 'inherit' })
}*/
/*
function sourcetree_app_run() {
  subProcess.spawn('start "" "%LocalAppData%\\SourceTree\\SourceTree.exe"', { shell: true, stdio: 'inherit' })
}*/


//ipcMain.on("button-clicked", (event, data) => console.log(data))
/*ipcMain.on("laragon_app_run", laragon_app_run)
ipcMain.on("sourcetree_app_run", sourcetree_app_run)*/


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
