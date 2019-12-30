const ipc = require('electron').ipcRenderer;

document.getElementById("actionButtons").querySelectorAll(".actionButton").forEach(elem => {
    elem.addEventListener("click", function (e) {
        if (e.target && e.target.nodeName == "DIV" && e.target.innerHTML == 'DELETE') {
            ipc.send("removeMarkedItems");
        }

        if (e.target && e.target.nodeName == "DIV" && e.target.innerHTML == 'RESET') {
            console.log("Sending Reset!");
            ipc.send("resetItems");
        }

        if (e.target && e.target.nodeName == "DIV" && e.target.innerHTML == 'BACK') {
            console.log("Go Back to Index!");
            ipc.send("goHome");
        }

    });
});


document.getElementById("parent-list").addEventListener("click", function (e) {
	if (e.target && e.target.nodeName == "DIV" && e.target.innerHTML == 'Is Duplicate') {
		ipc.send("removeItem", { val: e.target.id });
		console.log("List item ", e.target.id.replace("post-", ""), " was clicked!");
	}
});
