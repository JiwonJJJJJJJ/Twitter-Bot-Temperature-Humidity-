const SerialPort=require('serialport');
const Readline=require('@serialport/parser-readline');

const port=new SerialPort('COM3',{});

const fs=require ('fs');
const parser=port.pipe(new Readline({delimiter:'\r\n'}));

const logIntervalMinutes=5;
let lastMoment=new Date();

function tryparseJson(str){
	try{
		JSON.parse(str)
	}catch(e){
		return false;
	}
	return JSON.parse(str)
}

console.log('Initialising..');

port.on('open',function(){
	console.log('open..');

	parser.on('data',function(data){
		const sensorData=tryparseJson(data)
		const moment=new Date();

		if(moment.getTime()-lastMoment.getTime()>logIntervalMinutes*1*1000){
			lastMoment=moment;

			fs.appendFile('log.text',`\n${sensorData.temperature},${sensorData,humidity},${moment}`,function (err){
				if(err)return console.log(err);
				console.log('logged data',moment);
			});
		}
	});
});
