document.addEventListener('deviceready', onDeviceReady, false);

var workbook;
var excelIO;

var db = null;


var dbName = "db-example.db";
var excelUrl = "example.xlsx";


function fail(e) {
	//console.log("FileSystem Error");
	console.dir(e);
}

function onDeviceReady() {
	
	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
		//console.log("got main dir",dir);
        
        db = window.sqlitePlugin.openDatabase({name: dbName, location: 'default', createFromLocation: 1});
        
		dir.getFile("log.txt", {create:true}, function(file) {
			//console.log("got the file", file);
			logOb = file;
			
			addLog(new Date().toLocaleString('en-US'), 'system', '', 'App started/refreshed');	
			
			workbook = new GC.Spread.Sheets.Workbook();
			excelIO = new GC.Spread.Excel.IO();

			ImportFile(); 
		});
			
    });

}

function writeLog(str) {
	if(!logOb) return;
	var log = str + " [" + (new Date()) + "]\n";
	//console.log("going to log "+log);
	logOb.createWriter(function(fileWriter) {
		
		fileWriter.seek(fileWriter.length);
		
		var blob = new Blob([log], {type:'text/plain'});
		fileWriter.write(blob);
		//console.log("ok, in theory i worked");
	}, fail);
}
                                     
                                     


/** Import Excel file **/

function ImportFile() {

    var oReq = new XMLHttpRequest();
    oReq.open('get', excelUrl, true);
    oReq.responseType = 'blob';
    oReq.onload = function () {
        var blob = oReq.response;
        excelIO.open(blob, LoadSpread, function (message) {
            //console.log(message);
        });
    };
    oReq.send(null);
}

function stringToTime(timeString) {
	var split = timeString.split(":");
	var hours = parseInt(split[0]);
	var minutes = parseInt(split[1]) / 60;
	return hours + minutes;
}

function setMoments() {
	//for 9 eating moments max
	var skipped = 0
	for (var i = 0; i < 9; i++) {
		if (i < 3) {
			if (timesAdvices[i] < 12) {
				moments.push(i);
			}
			else {
				skipped += 1;
			}
		}
		else if (i < 6) {
			if (timesAdvices[i-skipped] < 18) {
				moments.push(i);
			}
			else {
				skipped += 1;
			}
		}
		else {
			if (timesAdvices.length > i-skipped) {
				moments.push(i);
			}
			else {
				skipped += 1;
			}
		}
	}
}

function setupHTML(){
	//find eat moments used
	setMoments();
	//set HTML
	for (i=0; i<9; i++) {
		if (moments.indexOf(i) != -1) {
			document.getElementById("moment" + i.toString() + "-title").innerHTML = dietAdviceNames[moments.indexOf(i)];			
		}
		else {
			document.getElementById("moment" + i.toString()).style.display = "none";
		}
	}
	
	document.getElementById('calendar').innerHTML = dayButtons();
    
    changeSliders();
    
    setPreviousScore();
    
    setPreviousProfile();
    
    //score(0); //set score to zero ! to be changed to read database save
	
}


/** Load spreadsheet **/

function LoadSpread(json) {
    //console.log('Sheets?', json.sheets);
    jsonData = json;
    workbook.fromJSON(json);

    /** Personal variables participant **/
    participantenID = json.sheets["persoon"].data.dataTable[0][1].value;
	voornaam = json.sheets["persoon"].data.dataTable[1][1].value;
	achternaam = json.sheets["persoon"].data.dataTable[2][1].value;
	geslacht = json.sheets["persoon"].data.dataTable[3][1].value;
	aanspreekvorm = json.sheets["persoon"].data.dataTable[4][1].value;
    comm_style = json.sheets["persoon"].data.dataTable[5][1].value;
	
	/** Diet variables: names, values, times, protein **/
	var i;
	for (i = 1; i < 10; i++) {

		if (json.sheets["dieet"].data.dataTable[i][0].value != null) {

			dietAdviceNames.push(json.sheets["dieet"].data.dataTable[i][0].value);
			dietAdviceValues.push(false);
			timesAdvices.push(stringToTime(json.sheets["dieet"].data.dataTable[i][1].value));
			dietAdviceProteins.push(json.sheets["dieet"].data.dataTable[i][2].value);
			dietAdviceProteins_taken.push(0);
            dietAdviceItems.push([]);
		}
	}
	
	//console.log("this is the length: " + json.sheets["voorbeeldmenu"].data.dataTable[0][5].value);
	pref_menu = [];
	for (var i = 1; i < json.sheets["voorbeeldmenu"].data.dataTable[0][5].value; i++) {
		id = json.sheets["voorbeeldmenu"].data.dataTable[i][0].value;
		portions = json.sheets["voorbeeldmenu"].data.dataTable[i][1].value;
		//portion_type = json.sheets["voorbeeldmenu"].data.dataTable[i][2].value;
		moment = json.sheets["voorbeeldmenu"].data.dataTable[i][2].value;
        
		pref_menu.push([id, portions, moment]);

	}
	
    //make sure that the database is ready, or wait
	if (databaseBusy) {
		setTimeout(function() {createPrefMenu(pref_menu)} , 1000);
	} else {
		createPrefMenu(pref_menu);
	}
    
    if (databaseBusy) {
        setTimeout(getAchThresholds, 1000); 
    } else {
        getAchThresholds();
    }
    
    setupPointsWithPairs(); //neededfor gamification
	 
	setupHTML();
    if (aanspreekvorm == "informeel") {
        informalHTML();
    }
    
	showDaypart(); //scroll to right part of the day
	checkNotification(); //check if a notification is needed	
}

