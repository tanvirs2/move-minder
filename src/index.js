const { app, BrowserWindow, ipcMain, shell, Menu, nativeImage } = require('electron');
const ElectronPreferences = require('electron-preferences');
const path = require('path');
const fs = require("fs/promises");
const AutoLaunch = require('auto-launch');


const subProcess = require('child_process');
const {exec} = require("child_process");
const fs_noPromise = require("fs");
const { Notification } = require('electron')

const thisObj = {
  thumbBtns: {
    play: true
  }
};

const timerRemainStopNotify = ()=>{
  const NOTIFICATION_TITLE = 'Your timer is not Running'
  const NOTIFICATION_BODY = 'For boost your productivity and make health better you have to obey rules'

  new Notification({
    title: NOTIFICATION_TITLE,
    body: NOTIFICATION_BODY,
    icon: 'https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg?    auto=compress&cs=tinysrgb&dpr=1&w=500',
    silent: true
  }).show()
}

let autoLauncher = new AutoLaunch({
  name: "MoveMinder"
});


const isDevelopment = !app.isPackaged;

/*console.log({isPackaged: app.isPackaged});
console.log({isDevelopment})
console.log(path.parse(app.getPath('exe')).dir + '\\assets\\imgs\\icons\\')*/

// Checking if autoLaunch is enabled, if not then enabling it.

if (!isDevelopment) {
  autoLauncher.isEnabled().then(function(isEnabled) {
    console.log({isEnabled})
    if (isEnabled) return;
    autoLauncher.enable();
  }).catch(function (err) {
    throw err;
  });
}



//console.log({getPath: app.getPath('exe')});
//console.log({getPath: path.parse(app.getPath('exe')).dir});
//console.log({getPath: path.join(path.parse(app.getPath('exe')).dir, 'dependencies', 'cleaner.py')});


//const CircleProgress = require('js-circle-progress');
//var ProgressBar = require('progressbar.js')

// Create an instance of CircleProgress element
//const cp = CircleProgress();

const appDir = path.parse(app.getPath('exe')).dir;

if (!isDevelopment) {
  if (!fs_noPromise.existsSync(appDir + '/icons')) {
    console.log('not found');
    fs.mkdir(appDir + '/icons');
  };
}


ipcMain.handle('getSettings', () => {
  return 'abcdef'
})

const createFileIconFromPath = async (fileFullPath) => {
  //console.log({filename})
  //fs.writeFileSync(__dirname + `/images/img-${filePath}.png`, fileIcon.toPNG())
  //await fs.unlink(tempFile); // delete temp file
  let iconsPath = "";
  //console.log({isDevelopment})
  if (isDevelopment) {
    iconsPath = __dirname + '/assets/imgs/icons/';
  } else {
    iconsPath = appDir + '/icons/';
  }
  var filename = path.parse(fileFullPath).base;
  const image = await app.getFileIcon(fileFullPath, {size: 'large'}); // get file icon of temp file
  const tempFile = path.join(iconsPath, filename+'.png');
  await fs.writeFile(tempFile, image.toPNG()); // create empty temp file
  return tempFile;
};

const iconRun = (fileFullPath) => {

  (async() => {
    const stat = await fs.lstat(fileFullPath);
    if (stat.isFile()) {
      exec(`"${fileFullPath}"`)
    } else if (stat.isDirectory()) {

      exec(`start "" "${fileFullPath}"`, (error, stdout, stderr)=>{
        //console.log({error, stdout, stderr});
      });
    }

  })().catch(console.error)


};

ipcMain.handle("createFileIconFromPath", (event, fullPath) => createFileIconFromPath(fullPath))
ipcMain.handle("timerRemainStopNotify", () => timerRemainStopNotify())
ipcMain.handle("iconRun", (event, fullPath) => iconRun(fullPath))


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


ipcMain.on('playPauseUIHandler', (event, isPlay)=> updateButtonIcon(!isPlay));
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

  //C:\Users\tanvi\AppData\Roaming\My Work Station!
  // Preference file path. Where your preferences are saved (required)
  dataStore: path.join(app.getPath("userData"), 'preferences.json'),


  // Preference default values
  defaults: {
    general: {
      title: "💖 My Work Station!",
      path: {
        isPackaged: app.isPackaged,
        getPath1: app.getPath('exe'),
        getPath2: path.parse(app.getPath('exe')).dir,
        getPath3: path.join(path.parse(app.getPath('exe')).dir, 'dependencies', 'cleaner.py'),
      },
    },
    plugin: {
      "selectPlugin": "quote"
    },
    timer: {
      interval: 30,
      rest: 5,
    },
    quick_icon: {
      app_name: []
    },
    holiday: {
      date_string: `21-02, Feb, Wed, "Shaheed Day"
    |26-02, Feb, Mon, "Shab e-Barat</span>"
    |17-03, Mar, Sun, "National Mourning Day"
    |26-03, Mar, Tue, "Independence Day"
    |05-04, Apr, Fri, "Jumatul Bidah</span>"
    |10-04, Apr, Wed, "Eid ul-Fitr Holiday"
    |11-04, Apr, Thu, "Eid ul-Fitr"
    |12-04, Apr, Fri, "Eid ul-Fitr Holiday"
    |14-04, Apr, Sun, "Bengali New Year"
    |01-05, May, Wed, "May Day"
    |22-05, May, Wed, "Buddha Purnima"
    |16-06, Jun, Sun, "Eid ul-Adha Holiday"
    |17-06, Jun, Mon, "Eid ul-Adha"
    |18-06, Jun, Tue, "Eid ul-Adha Holiday"
    |17-07, Jul, Wed, "Ashura"
    |15-08, Aug, Thu, "National Mourning Day"
    |26-08, Aug, Mon, "Shuba Janmashtami"
    |16-09, Sep, Mon, "Eid-e-Milad un-Nabi"
    |13-10, Oct, Sun, "Vijaya Dashami"
    |16-12, Dec, Mon, "Victory Day"
    |25-12, Dec, Wed, "Christmas Day"`
    }
  },

  // Preference sections visible to the UI
  sections: [
    {
      id: 'general',
      label: 'General',
      icon: 'home-52', // See the list of available icons below
      form: {
        groups: [
          {
            label: 'Title', // optional
            fields: [
              {
                label: 'Set title',
                key: 'title',
                type: 'text'
              }
            ]
          },
        ]
      }
    },
    {
      id: 'timer',
      label: 'Timer',
      icon: 'bell-53', // See the list of available icons below
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
      id: 'holiday',
      label: 'Holidays',
      icon: 'grid-45', // See the list of available icons below
      form: {
        groups: [
          {
            label: 'Date List', // optional
            fields: [
              {
                label: 'Add Date',
                key: 'date_string',
                type: 'text',
                help: 'Example: (Format Day-Month) 01-05 | 25-12 | ...'
              }
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
            label: 'Select Plugin',
            fields: [
              {
                key: 'selectPlugin',
                type: "radio",
                options: [
                  {label: "Quotes - Change your Life !", value: 'quote'},
                  {label: "NVM (Node Version Manager)", value: 'nvm'}
                ],
                help: 'Select plugin that show in your Interface'
              }
            ],
          },
          {
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
        ]
      }
    }

    // ...
  ]
})

let mainWindow;

function thumbBtnsSpawner(play) {

  const iconSimpler = icon => nativeImage.createFromPath(path.join(__dirname, `assets/imgs/logo/${icon}`))

  let playObj = {
    tooltip: 'Timer start',
    icon: iconSimpler('play.png'),
    click() {
      //thisObj.thumbBtns.play = !thisObj.thumbBtns.play
      mainWindow.webContents.send('timer_btns', {action: 'pause'});
      updateButtonIcon(false)
    }
  };

  let pauseObj = {
    tooltip: 'Timer pause',
    icon: iconSimpler('pause.png'),
    click() {
      mainWindow.webContents.send('timer_btns', {action: 'play'});
      updateButtonIcon(true)
    }
  };

  let dynamicBtn = play ? playObj : pauseObj;

  return [
    {
      tooltip: 'Timer reset',
      icon: iconSimpler('reset.png'),
      click() {
        mainWindow.webContents.send('timer_btns', {action: 'reset'});
      }
    },
    {
      tooltip: '-5',
      icon: iconSimpler('fast-forward-rev.png'),
      click() {
        mainWindow.webContents.send('timer_btns', {action: 'fast-forward-rev'});
      }
    },
    {
      ...dynamicBtn
    },
    {
      tooltip: '+5',
      icon: iconSimpler('fast-forward.png'),
      click() {
        mainWindow.webContents.send('timer_btns', {action: 'fast-forward'});
      }
    },
    {
      tooltip: 'Timer reset',
      icon: iconSimpler('stop.png'),
      click() {
        mainWindow.webContents.send('timer_btns', {action: 'reset'});
      }
    }
  ];
}

function updateButtonIcon(isPlay) {
  mainWindow.setThumbarButtons(
      thumbBtnsSpawner(isPlay)
  );
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true,
    //icon: __dirname + './assets/imgs/logo/logo.png',
    icon: path.join(__dirname, 'assets/imgs/logo/logo.png'),
    webPreferences: {
      devTools : !!isDevelopment,
      nodeIntegration:  true,
      //contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });


  ipcMain.on("timeProgress", (event, data) => mainWindow.setProgressBar(1-data))



  updateButtonIcon(true);



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
