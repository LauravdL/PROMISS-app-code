closeScreens = false;

setInterval(checkFoodBox, 5* 60 * 1000); //this is called every 5 minutes and then calls the mainFlow
setInterval(checkNewDay, 120*60*1000); //check every two hours if it is a new day


function mainFlow() {
	
	var now = new Date();
	currentTime = now.getHours() + (now.getMinutes() / 60);
	
	showDaypart();
	
    if (foodBoxInfo == "onbekend") {
        closeAllScreens();
        unknownFoodbox();
        //stop interval to close
		clearInterval(closeScreens);
		closeScreens = false;
		screenOpen = true;
    }
	
	else if (foodBoxInfo.length > 0) {
        
		//console.log("foodbox");
		
		if (! $('#notification-foodbox').hasClass('show')) {
			closeAllScreens();
		}		
		//stop interval to close
		clearInterval(closeScreens);
		closeScreens = false;
		screenOpen = true;
        
		foodBoxProtein(); //check number of protein in foodbox 
		//continues to checkProtein to check the number of needed proteins
		}
	
	if (screenOpen) { 
		//console.log("screenOpen");
		if (!closeScreens) //er is een scherm open en er is nog geen interval om ze te sluiten
			{
				closeScreens = setInterval(closeAllScreens, 15 * 60 * 1000); //sluit alle schermen elke 15 minuten (delay)
			}
	}
	else {
		//console.log("no screen open");
        
        if (!checkDay()) {
            document.getElementById('calendar').innerHTML = dayButtons(); //make sure that the day buttons are correct.
            changeDay(0, true);
        }
         
        
		checkNotification();
			
		checkReminder();
				
		clearInterval(closeScreens);
		closeScreens = false;
		
			
	}
	

		
}; 

/** Every 5 minutes
- foodbox is checked
- the current time variable is changed
- scroll to the right day part on the screen
- the notifications are checked
- the reminders are checked
- At 2 at night the page is refreshed. (between 2-2:15)
**/

//closes all screens if there are any open used to make sure that screens are turned off after some time (and notifications are send again)
function closeAllScreens () { 

	if (screenOpen) {
	
		//console.log("close all screens");
		$('.modal').modal('hide');
		screenOpen = false;
        
        //extra check for problem found with foodbox & closing
        checkingUpdates = false;
        
        addLog(new Date().toLocaleString('en-US'), 'system', '', 'closing screens')
	}
	
}; 

function checkNewDay() {
	old_today = document.getElementById('day0').innerHTML.split('<br> ')[1];
	old_today_split = old_today.split("-")
	old_date = new Date(old_today_split[2], old_today_split[1] - 1, old_today_split[0]);
	now = new Date().setHours(0,0,0,0);
	if (old_date < now) {
		changeDay((now - old_date)/24/60/60/1000 );
		document.getElementById('calendar').innerHTML = dayButtons();
	}
} 


//make a back-up of the database every hour
setInterval( function() {
    if (!databaseBusy) {
        console.log('starting back-up of database');
        window.plugins.sqlDB.copyDbToStorage(dbName, 0, cordova.file.externalDataDirectory, true, success, error);
    } else {
        console.log('wait for database no longer busy');
        setTimeout(function () {window.plugins.sqlDB.copyDbToStorage(dbName, 0, cordova.file.externalDataDirectory, true, success, error)}, 1000)
    }
	;
}, 60 * 60 * 1000 ); 

function success() {
	console.log("Success: back-up database");
}

function error(e) {
	//console.log("Error Code Back up database= "+JSON.stringify(e));

}