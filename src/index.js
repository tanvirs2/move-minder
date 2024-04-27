const { app, BrowserWindow, ipcMain, shell, Menu } = require('electron');
const ElectronPreferences = require('electron-preferences');
const path = require('path');


const subProcess = require('child_process');
const {exec} = require("child_process");


//const CircleProgress = require('js-circle-progress');
//var ProgressBar = require('progressbar.js')

// Create an instance of CircleProgress element
//const cp = CircleProgress();

ipcMain.handle('getSettings', () => {
  return 'abcdef'
})

const nodeVersionListPromise = () => {
  return new Promise((resolve, reject)=>{
    exec('nvm list', (error, stdout, stderr)=>{
      //console.log({stdout})
      /*ipcMain.on("node-version-list", (event, data) => {
        console.log('log:: node-version-list')
      })*/
      resolve(stdout);
    })
  });
};

ipcMain.handle('nodeVersionList', async () => {
  return await nodeVersionListPromise()
})

let minimizeCMD = 'powershell -command "& { $x = New-Object -ComObject Shell.Application; $x.minimizeAll() }"';
let undoMinimizeAll = 'powershell -command "& { $x = New-Object -ComObject Shell.Application; $x.UndoMinimizeAll() }"';

function nodeVersionChangeHandler(data) {
  subProcess.spawn('nvm', [
    "use",
    data.nodeVersionNumber
  ], { shell: true, stdio: 'inherit' })
}




ipcMain.on("nodeVersionChangeRequest", (event, data) => nodeVersionChangeHandler(data))
//ipcMain.on("timeProgress", (event, data) => timeProgress(data))
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


const preferences = new ElectronPreferences({
  config: {
    debounce: 150, // debounce preference save settings event; 0 to disable
  },

  //debug: true,

  // Override default preference BrowserWindow values
  browserWindowOverrides: {
    width: 600,
    height: 400,
  },

  // Create an optional menu bar
  menu: Menu.buildFromTemplate([{
    label: 'File',
    submenu: [
      { role: 'quit' },
      { role: 'rrr' }
    ]
  }]),

  // Provide a custom CSS file, relative to your appPath.
  css: 'src/css/preference-styles.css',

  // Preference file path. Where your preferences are saved (required)
  dataStore: path.join(app.getPath("userData"), 'preferences.json'),


  // Preference default values
  defaults: {
    timer: {
      interval: 30,
      rest: 5,
    }
  },

  // Preference sections visible to the UI
  sections: [
    {
      id: 'timer',
      label: 'Timer',
      icon: 'turtle', // See the list of available icons below
      form: {
        groups: [
          {
            label: 'Time Adjust', // optional
            fields: [
              {
                label: 'Focus Time in minute',
                key: 'interval',
                type: 'number',
                help: 'Set your Focus Time in minute'
              },{
                label: 'Break Time in minute',
                key: 'rest',
                type: 'number',
                help: 'Set your Break Time in minute'
              },
              // ...
            ]
          },
          // ...
        ]
      }
    },
    {
      id: 'quick_icon',
      label: 'Quick Icon',
      icon: 'widget', // See the list of available icons below
      form: {
        groups: [
          {
            label: 'App Name', // optional
            fields: [
              {
                label: 'Add application',
                key: 'app_name',
                type: 'list',
                help: 'Add application to quick start'
              }
              // ...
            ]
          },
          // ...
        ]
      }
    },
    {
      id: 'plugin',
      label: 'Plugin',
      icon: 'preferences', // See the list of available icons below
      form: {
        groups: [
          {
            label: 'Plugin Name', // optional
            fields: [
              {
                label: 'Add Plugin',
                key: 'plugin_name',
                type: 'list',
                help: 'Add Plugin to easy use'
              }
              // ...
            ]
          },
          // ...
        ]
      }
    },

    // ...
  ]
})

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    //icon: __dirname + './assets/imgs/logo/logo.png',
    icon: path.join(__dirname, 'assets/imgs/logo/logo.png'),
    webPreferences: {
      devTools :  true,
      nodeIntegration:  true,
      //contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });


  ipcMain.on("timeProgress", (event, data) => mainWindow.setProgressBar(1-data))

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));


  let filemenu = Menu.buildFromTemplate([{
    label: 'File',
    submenu: [
      {
        label: 'Preferences',
        click: () => {
          preferences.show();
        }
      },
      { role: 'quit', }
    ]
  }])

  let defaultMenu = Menu.getApplicationMenu()
  let newMenu = new Menu();
  defaultMenu.items
      //.filter(x => x.role != 'filemenu')
      .forEach(x => {
        if (x.label === 'File') {

          /*x.submenu = [
            { label: 'aaaa', },
            { label: 'aaaxxxaaaa', },
          ];

          console.log('UUUUu filemenu: ', filemenu, filemenu.items, 'x:', x.submenu.items);*/


          x = filemenu.items[0];
        }


        newMenu.append(x);
      })

  mainWindow.webContents.openDevTools();



  Menu.setApplicationMenu(newMenu)

  //


  //mainWindow.webContents.executeJavaScript(console.log(mainWindow.webContents));

  //console.log({mainWindow: mainWindow.webContents})
  // Open the DevTools.
  /*setTimeout(()=>{
    //mainWindow.webContents.send('data-channel', { message: 'Hello from Main!' });

  }, 3000)*/

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
