var comport = 'COM4';
var baud = 57600;

var SerialPort = require('serialport');
var mysql = require('mysql');
var connectiondetails = require('./configs/mysql.js');
console.log(connectiondetails);
var msqlconnection = mysql.createConnection(connectiondetails.config);
msqlconnection.connect();
var port = new SerialPort(comport, {
  parser: SerialPort.parsers.readline('\n'),
  baudRate: baud,
});
port.on('open', function() {
  console.log('Port Opened');
});
port.on('data', function(dline) {
  var status = dline.substring(0, 2);
  if (status == 'OK') {
    var readings = dline.split(' ');
    var node = readings[1];
    var temp = readings[4] / 10;
    var humidity = readings[3] / 2;
    var light = (readings[2]/255) * 100;
    msqlconnection.query('INSERT INTO readings(node, type, reading) VALUES (' + node + ', \'temperature\', ' + temp + ')');
    msqlconnection.query('INSERT INTO readings(node, type, reading) VALUES (' + node + ', \'humidity\', ' + humidity + ')');
    msqlconnection.query('INSERT INTO readings(node, type, reading) VALUES (' + node + ', \'light\', ' + light + ')');
  }
});
