const electron = require('electron');
const { app, BrowserWindow } = electron;
require('electron-reload')(__dirname);

// Disable error dialogs by overriding
const dialog = electron.dialog;
dialog.showErrorBox = function (title, content) {
    console.log(`${title}\n${content}`);
};

const path = require('path');
const electronProcess = require('./process');

electronProcess.processMessage();

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1400,
        height: 800,

        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('src/screen/index.html');

}

app.whenReady().then(async () => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
