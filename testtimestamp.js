var fs = require('fs');
var http = require('http');

function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}

function sha256(stringToSign, secretKey) {
var CryptoJS = require("crypto-js");
  var hex = CryptoJS.HmacSHA256(stringToSign, secretKey);
  return hex.toString(CryptoJS.enc.Base64);
} 

function timestamp() {
    var date = new Date();
    var y = date.getUTCFullYear().toString();
    var m = (date.getUTCMonth() + 1).toString();
    var d = date.getUTCDate().toString();
    var h = date.getUTCHours().toString();
    var min = date.getUTCMinutes().toString();
    var s = date.getUTCSeconds().toString();

    if(m.length < 2) { m = "0" + m; }
    if(d.length < 2) { d = "0" + d; }
    if(h.length < 2) { h = "0" + h; }
    if(min.length < 2) { min = "0" + min; }
    if(s.length < 2) { s = "0" + s}

    var date = y + "-" + m + "-" + d;
    var time = h + ":" + min + ":" + s;
    return date + "T" + time + "Z";
}

function showTimeStamp(barcode,mytimestamp) {

    var finalUrl =  "http://www.peopletrends.fr/util/echo.php?t=" + mytimestamp;
    return finalUrl;
}



var barcode;
var url;
readline = require('readline');

var config = JSON.parse(fs.readFileSync("eanconfig.json", "utf8"));
var EANmainJSONObj = { };
var req;


var rd = readline.createInterface({
    input: fs.createReadStream(config.inputfile),
    output: process.stdout,
    terminal: false
});


callback = function(response) {
  var str = ''
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    console.log(str);
	sleepFor(1000);
  });
}

// starts reading the data_line file line by line
rd.on('line', function(line) {

barcode=line;

if(barcode.length == 12)
	barcode="0"+barcode;
else if(barcode.length == 11) 
	barcode="00"+barcode;
else if(barcode.length == 10)
	barcode="000"+barcode;
else if(barcode.length == 9)
	barcode="0000"+barcode;
else if(barcode.length == 8)
	barcode="00000"+barcode;
else if(barcode.length == 7)
	barcode="000000"+barcode;
else if(barcode.length == 13)
	barcode=barcode;

var mytimestamp=timestamp();
url = showTimeStamp(barcode,mytimestamp);

req = http.request(url, callback);
req.end();




});

