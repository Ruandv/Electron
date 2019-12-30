// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, Tray } = require('electron')
const path = require('path')
const electron = require('electron')
const ipc = electron.ipcMain;
const { execFile } = require('child_process');
const fs = require('fs');

var imageLocation = __dirname + "\\Images\\";
let threshold = 0.9;
var executablePath = "\\ImageDuplicateFinder\\bin\\Debug\\netcoreapp3.1\\ImageDuplicateFinder.exe";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        icon: path.join(__dirname, "fav.jpg")
    })

    mainWindow.webContents.once('dom-ready', () => {
        mainWindow.webContents.send('thresholdUpdated', threshold * 100)
        mainWindow.webContents.send('openDialogResult', imageLocation)
    });
    // and load the index.html of the app.
    mainWindow.loadURL(`file:${__dirname}/src/index.html`)
    // Open the DevTools.
    //mainWindow.webContents.openDevTools()

    executablePath = path.join(__dirname, "../ImageDuplicateFinder/ImageDuplicateFinder/bin/debug/netcoreapp3.1/ImageDuplicateFinder.exe");
    if (!fs.existsSync(executablePath)) {
        console.error("Please complie or set the ImageDuplicateFinder path.");
    }
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        deleteFile(imageLocation, "results.html");
        deleteFile(imageLocation, "results.js");
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
var application_menu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Set Image Folder',
                accelerator: 'F2',
                click: () => {
                    showImageDialog();
                }
            },
            {
                label: 'Process Images',
                accelerator: 'F3',
                click: () => {
                    processImages();
                }
            },
            { type: "separator" },
            {
                label: "Quit",
                accelerator:
                    "ctrl+q",
                click: () => electron.app.quit()
            }
        ]
    },
    {
        label: 'Tools',
        submenu: [
            {
                label: 'Dev Tools',
                accelerator: 'F12',
                click: () => {
                    mainWindow.toggleDevTools();
                }
            }]
    }
];

menu = Menu.buildFromTemplate(application_menu);
Menu.setApplicationMenu(menu);

function processImages() {
    var params = [imageLocation, threshold.toString().replace(".", ",")];
    execFile(executablePath, params, (error, stdout, stderr) => {
        if (error) {
            console.log(error)
        }
        else {
            mainWindow.loadURL('file://' + imageLocation.split("\\").join('/') + 'results.html');
            deleteFile(imageLocation, "ImageArray.json");

            console.log("DONE " + imageLocation.split("\\").join('/') + 'results.html');
        }
    });
}

function deleteFile(fileLocation, fileName) {
    if (fs.existsSync(fileLocation + fileName)) {
        fs.unlink(fileLocation + fileName, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log("File succesfully deleted : " + fileLocation + fileName);
        });
    }
}

function showImageDialog() {
    let dialog = electron.dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] });
    imageLocation = dialog[0] + "\\";
    mainWindow.webContents.send('openDialogResult', imageLocation);
}

ipc.on("doneProcessing", _ => {
    console.log("DoneProcessing");
})

ipc.on("openDialog", () => {
    showImageDialog();
})

ipc.on("updateThreshold", (event, obj) => {
    threshold = obj.val;
    mainWindow.webContents.send('thresholdUpdated', threshold * 100)
})

ipc.on("processImagesClick", () => {
    processImages();
})

var dups = [];
ipc.on("removeItem", (event, obj) => {
    console.log("Remove this item " + obj.val)
    dups.push(obj.val);
})

ipc.on("removeMarkedItems", (event, obj) => {
    console.log("We will now delete all the itmes you marked");
    dups.forEach(x => {
         deleteFile("",x);
        console.log(x);
    })
})

ipc.on("resetItems", _ => {
    console.log('Clear dups');
    dups = [];
})


ipc.on("goHome", _ => {
    mainWindow.loadURL(`file:${__dirname}/src/index.html`)
})