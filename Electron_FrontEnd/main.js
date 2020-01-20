'use strict';
const {app, BrowserWindow, Menu, dialog} = require('electron');
const path = require('path');
const assert = require('assert');
const electron = require('electron')
const ipc = electron.ipcMain;
const { execFile } = require('child_process');
const fs = require('fs');

const face = require("./face");
const {
	openNewGitHubIssue,
	openUrlMenuItem,
	showAboutWindow,
	aboutMenuItem,
	debugInfo,
	appMenu,
	openSystemPreferences,
	runJS
    } = require('electron-util');
/// const enforceMacosAppLocation = require('./source/enforce-macos-app-location');


var imageLocation = __dirname + "\\Images\\";
var dups = [];
let threshold = 0.9;
let executablePath = "";
var executablePaths = [path.join(__dirname, "../ImageDuplicateFinder/ImageDuplicateFinder/bin/debug/netcoreapp3.1/ImageDuplicateFinder.exe"),
                        path.join(__dirname, "../ImageDuplicateFinder/ImageDuplicateFinder/bin/debug/netcoreapp3.0/ImageDuplicateFinder.exe"),];

const createMenu = () => {
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
            label: "Identification",
            submenu:[
               { label: 'Face Identifier',
                    click: () => {
                        navigateTo(`file:${__dirname}/src/FaceIdentification/FaceId.html`);
                    }
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
    

	const menu = Menu.buildFromTemplate(application_menu);

	Menu.setApplicationMenu(menu);
};

let mainWindow;

function createWindow() {

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        icon: path.join(__dirname, "fav.jpg"),
        webPreferences: {
            nodeIntegration: true
            }
    })
    mainWindow.loadURL(`file:${__dirname}/src/index.html`)
    mainWindow.webContents.once('dom-ready', () => {
        mainWindow.webContents.send('thresholdUpdated', threshold * 100);
        mainWindow.webContents.send('openDialogResult', imageLocation);
    });
    // and load the index.html of the app.
    createMenu();
    
    // Open the DevTools.
    //mainWindow.webContents.openDevTools()
    executablePaths.forEach(p=>{
        console.log("Checking ... " + p);
        if(fs.existsSync(p)){
            executablePath = p;
        }
    })
    
    if (executablePath == "") {
        console.error("Please complie or set the ImageDuplicateFinder path.");
    }
    else{
        console.log("FOUND IT");
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

(async () => {
    app.on('ready', createWindow);
})();


async function processImages() {
  
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

async function showImageDialog() {
    let dialog = await electron.dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] });
    debugger;
    console.log(JSON.stringify(dialog));
    imageLocation = dialog.filePaths[0]+ "\\";//JSON.stringify(dialog) + "\\";
    
    mainWindow.webContents.send('openDialogResult', imageLocation);
}

async function navigateTo(url){
    mainWindow.loadURL(url) 
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