// main.js

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ffmpegStatic = require('ffmpeg-static');

// const ffmpegPath = 'E:\\node_workspace\\audio-converter\\node_modules\\ffmpeg-static\\ffmpeg.exe';
const ffmpegPath = ffmpegStatic;
console.log("ffmpegPath="+ffmpegPath);
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('convert-audio', (event, filePath) => {
    // Define the output file path
    const outputFilePath = path.join(app.getPath('temp'), 'output.mp3');
    console.log("ipcMain get filePath="+outputFilePath);
    // Perform audio conversion
    ffmpeg(filePath)
      .toFormat('mp3')
      .on('error', (err) => {
        console.error('An error occurred:', err.message);
        event.sender.send('conversion-error', err.message);
      })
      .on('end', () => {
        console.log('Conversion completed successfully');
        event.sender.send('conversion-done', outputFilePath);
      })
      .save(outputFilePath);
  });


