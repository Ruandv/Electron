const fs = require('fs');


const testAddon = require('./build/Release/native.node');
var status = 'OUT';

//module.exports = testAddon;

function saveData() {
	var data = document.getElementById('mySerialNumber');
	console.log(data.value);
	// console.log(testAddon.hello());
	// console.log(testAddon.addNumbers(1,data.value.length));
	console.log(testAddon.aquire());
	console.log(testAddon.getTag());
	fs.appendFileSync(`C:\\temp\\mySerials.log`, data.value + ',' + status + '\r\n');
}

function toggleStatus(updatedStatus) {
	console.log('Status Updated from ' + status + ' to ' + updatedStatus);
	status = updatedStatus;
	if (updatedStatus == 'IN') {
		$('#clockIn').css('color', 'green');
		$('#clockOut').css('color', 'White');
	} else {
		status = updatedStatus;
		$('#clockIn').css('color', 'white');
		$('#clockOut').css('color', 'Red');
	}
}

$().ready(x => {
	toggleStatus(status);
});
