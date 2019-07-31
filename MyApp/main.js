const { app, BrowserWindow } = require('electron');
var fs = require('fs');

require('electron-reload')(__dirname);
let win;
function createWindow() {
	win = new BrowserWindow({
		width: 800,
		height: 600,
		title: app.getName() + ' (' + app.getVersion() + ')',
		webPreferences: {
			nodeIntegration: true
		}
	});
	win.loadURL(`file://${__dirname}/index.html`);

	win.on('closed', () => {
		saveData(new Date().toDateString());
		win = null;
	});

	win.on('click', saveData);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		createWindow();
	}
});

function saveData(content) {
	try {
		fs.appendFileSync('C:\\logs\\myfile.txt', content + '\r\n', 'utf-8');
	} catch (e) {
		alert('Failed to save the file !');
	}
}
