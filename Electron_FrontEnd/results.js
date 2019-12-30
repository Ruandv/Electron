const ipc = require('electron').ipcRenderer;

document.getElementById("removeItems").addEventListener("click", function (e) {
	if (e.target && e.target.nodeName == "DIV" && e.target.innerHTML == 'DELETE') {
		ipc.send("removeMarkedItems");
	}
});

document.getElementById("parent-list").addEventListener("click", function (e) {
	if (e.target && e.target.nodeName == "DIV" && e.target.innerHTML == 'Is Duplicate') {
		ipc.send("removeItem", { val: e.target.id });
		console.log("List item ", e.target.id.replace("post-", ""), " was clicked!");
	}
});
