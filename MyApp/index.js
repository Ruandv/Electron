const fs = require('fs');
const testAddon = require('./build/Release/native.node');
var status = 'OUT';

async function pingIbutton() {
	
	var sessionId = testAddon.aquire();
	if(sessionId<1){
		console.error("Invalid Session : " + sessionId.toString());
		return;
	}
	console.log('Reading Tag...');
	var value =  testAddon.getTag();
	var iTimeout = 0;
	while(value =="TMFirst Failed.-1")
	{
		value =  testAddon.getTag();
		console.log(".");
		await sleep(100);
		if(iTimeout ==50){
			setMessage("Please try again.");
			return; 
		}
		iTimeout ++;
	}
	console.log(value);
	console.log('Tag Reading Done...');
	console.log(testAddon.releaseTag());
	setMessage("Your tagnumber is "  + value + "");
	saveData(value);
	
}

function saveData(value){
	fs.appendFileSync(`C:\\temp\\mySerials.log`, value + ',' + status + '\r\n');
}

function setMessage(value){
	console.log(value);
	var data = $('#mySerialNumber');
	data[0].innerHTML = value;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
	 setMessage("Please Scan your tag");
	 pingIbutton();
}


toggleStatus(status);
