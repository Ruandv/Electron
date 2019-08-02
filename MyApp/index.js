const fs = require('fs');
const myNative = require("./build/release/native")
function saveData() {
    var data = document.getElementById("mySerialNumber");
    console.log(data.value);
    myNative.hello(function(arg) { "CallBack from Hello : " +  console.log(arg);});
    console.log("Add Numbers 12+1 : " + myNative.addNumbers(12,1));
    console.log("Multiply Numbers 4*2 : " + myNative.multiply(4,2));
	fs.appendFileSync(`C:\\temp\\mySerials.log`, data.value + "\r\n");
}
