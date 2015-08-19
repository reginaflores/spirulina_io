function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

var data = [];
//day loop
for(var i = 0; i < 5; i++){
	var rgbL;
	var rgbH;

	if(i == 0){
		rgbL = 205;
		rgbH = 255;
	}
	if(i==1){
		rgbL = 153;
		rgbH = 205;
	}
	if(i==2){
		rgbL = 113;
		rgbH = 153;
	}
	if(i==3){
		rgbL = 88;
		rgbH = 113;
	}
	if(i==4){
		rgbL = 70;
		rgbH = 88;
	}

	var plants = [];
	for(var j=0;j<72; j++){
		plants.push({ 
			"id":"#"+String(j+1),
			"RGB": [0, getRandomInt(rgbL,rgbH), 0],	
			"Temp": getRandomInt(27,30),
			"Humidity": Math.round(getRandomArbitrary(0.34, 0.36)*100)/100,
			"pH": Math.round(getRandomArbitrary(3, 5)*100)/100,
			"Col": j%10,
			"Row": Math.floor(j/10.0)
		});
	}

	var entry = {"Day": "7/"+ String(i+1), "Plants":plants};
	// var entry ={day, plants};
	data.push(entry);

}


var url = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(data));
window.open(url, '_blank');
window.focus();