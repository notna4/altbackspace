const { app, BrowserWindow, Menu, globalShortcut, electron } = require('electron')
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 650, //650
    height: 250, //250
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
    },
    icon: './icon.ico',
    transparent: true,
    frame: false,
  })
  
  // and load the index.html of the app.
  mainWindow.setResizable(false);
  /* mainWindow.loadURL('index.html') */
  mainWindow.loadURL(path.join(__dirname, 'index.html'))
  Menu.setApplicationMenu(null)

  mainWindow.on('blur', () => {
    mainWindow.close();
  }) 
}

/* var AutoLaunch = require('auto-launch'); */



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
/* app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
 */
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
/* app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
}) */

// when app is ready register a global shortcut
// that calls createWindow function 
app.on('ready', () => {
  globalShortcut.register('Alt+Backspace', createWindow)
    //globalShortcut.register('CommandOrControl+X', createWindow)
    /*  let autoLaunch = new AutoLaunch({
      name: 'altbackspace',
      path: app.getPath('exe'),
    });
    autoLaunch.isEnabled().then((isEnabled) => {
      if (!isEnabled) autoLaunch.enable();
    }); */

    /* var launcher = new AutoLaunch({
      name: 'altbackspace',
      path: app.getPath('exe'),
    });
     */
   // launcher.enable();
    
    //minecraftAutoLauncher.disable();
    
    
    /* launcher.isEnabled()
    .then(function(isEnabled){
      if(isEnabled){
          return;
      }
      launcher.enable();
    })
    .catch(function(err){
        // handle error
    }); */
 
})

// do not quit when all windows are closed
// and continue running on background to listen
// for shortcuts
app.on('window-all-closed', (e) => {
  e.preventDefault()
  e.returnValue = false
})

const Store = require('electron-store');

Store.initRenderer();
