const ipc = require('electron').ipcRenderer;

document.getElementById("btnImageFolder").addEventListener("click", _ => { ipc.send("openDialog"); });
document.getElementById("btnProcessImageFolder").addEventListener("click", _ => ipc.send("processImagesClick"));
document.getElementById("thresholdInput").addEventListener("change", (evt) => { ipc.send('updateThreshold', { val: event.target.value / 100 }) });

ipc.on("thresholdUpdated", (evt, val) => {
    document.getElementById("thresholdInput").value = val;
})

ipc.on("openDialogResult", (evt, val) => {
    document.getElementById("imageFolder").value = val;
    document.getElementById('btnProcessImageFolder').disabled = document.getElementById("imageFolder").value.length===0;
})