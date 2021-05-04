var WINDOW_SCROLLTOP_BEFORE_MODAL = -1;
$(document).ready(function() {
    //Action when you push 'take now' on notification
	$('#notification .nu-btn').click(function(){
		//console.log("Confirmation by user to take it now!")
		showProteinScreen();
		addLog(new Date().toLocaleString('en-US'), 'user', 'notification', 'response', 'confirmation');
	});

	//Action when you choose 'later' option
	$('#notification .later-btn').click(function(){
		herinnering = true; 
		herinneringsTijd = currentTime + 0.5; //herinnering een half uur later !!AANPASSEN
		addLog(new Date().toLocaleString('en-US'), 'user', 'notification', 'response', 'later');
		screenOpen = false;
	});
	
	//Confirmation on reminder notification
	$('#reminder .nu-btn').click(function(){
		herinnering = false;
		showProteinScreen();
		addLog(new Date().toLocaleString('en-US'), 'user', 'reminder', 'response', 'confirmation');
	});
	
	//'later' in reminder
	$('#reminder .later-btn').click(function(){
		herinnering = true; 
		herinneringsTijd = currentTime + 0.5; //herinnering een half uur later
		addLog(new Date().toLocaleString('en-US'), 'user', 'reminder', 'response', 'later');
		screenOpen = false;
	});
	
	$('#protein-short .done-btn').click(function(){
		//console.log("User ready with input protein")
		index = dietAdviceNames.indexOf(advies);
		dietAdviceValues[index] = true;
		dietAdviceProteins_taken[index] = parseFloat(document.getElementById("points").innerHTML.split(" ")[0]);
		dt = new Date();
		if (!historyOn) {intakeDay = dt.toLocaleDateString('en-US')};
		addLog(dt.toLocaleString('en-US'), 'user', 'protein', 'response', 'confirmation', `${advies}-${dietAdviceProteins_taken[index]}`, intakeDay);
		screenOpen = false;
		setProgressBar(dietAdviceProteins_taken[index], index);
        setDayTotalSlider();
	});

	$('#protein-short .help-btn').click(function(){
		//console.log("We need to go to the advice screen now");
		addLog(new Date().toLocaleString('en-US'), 'user', 'protein', 'response', 'help');
        
        callMealAdvice();
	});
	
	$('#protein-advice .done-btn').click(function(){
		//console.log("User ready with input protein via advice")
		index = dietAdviceNames.indexOf(advies);
		dietAdviceValues[index] = true;
		dietAdviceProteins_taken[index] = currentIntake;
        dietAdviceItems[index] = itemSummary(currentMenu);
		setNumChoices(currentMenu, 0);
        
        //check portion changes in pref menu
        checkPortionChange();
 
		dt = new Date();
		if (!historyOn) {intakeDay = dt.toLocaleDateString('en-US')};
        
        if (checkMenuChange()) {
            addLog(dt.toLocaleString('en-US'), 'user', 'advice', 'response', 'confirmation-changed', `${advies}-${dietAdviceProteins_taken[index]}:${itemSummary(currentMenu)}`, intakeDay);
        } else {
            addLog(dt.toLocaleString('en-US'), 'user', 'advice', 'response', 'confirmation', `${advies}-${dietAdviceProteins_taken[index]}:${itemSummary(currentMenu)}`, intakeDay);
        }
        
		screenOpen = false;
		foodBoxInfo = []; //clear the foodbox
		
        setProgressBar(currentIntake, index);
        setDayTotalSlider();
	});
	
	$('#notification-foodbox .confirm-foodbox-btn').click(function() {
		//console.log("confirm foodbox intake " + currentIntake);
		index = dietAdviceNames.indexOf(advies);
		dietAdviceValues[index] = true;
		dietAdviceProteins_taken[index] = currentIntake;
        dietAdviceItems[index] = itemSummary(foodBoxInfo);
		dt = new Date();
		if (!historyOn) {intakeDay = dt.toLocaleDateString('en-US')};
		addLog(dt.toLocaleString('en-US'), 'user', 'foodbox', 'response', 'confirmation', `${advies}-${dietAdviceProteins_taken[index]}`, intakeDay);
		screenOpen = false;
		foodBoxInfo = []; //clear the foodbox
		
		setProgressBar(currentIntake, index);
        setDayTotalSlider();
        
	});
	
	$('#notification-foodbox .more-foodbox-btn').click(function() {
		//console.log("add more foodbox intake")
		addLog(new Date().toLocaleString('en-US'), 'user', 'foodbox', 'response', 'more');
		showProteinScreenFoodbox();
	});
	
	$('#notification-foodbox .discard-foodbox-btn').click(function() {
		foodBoxChoice();
		addLog(new Date().toLocaleString('en-US'), 'user', 'foodbox', 'response', 'discard'); //right way to log that something is not right?
		
	});
	
	$('#foodbox-protein-short .help-foodbox-btn').click(function() {
		console.log("help with protein intake foodbox")
		addLog(new Date().toLocaleString('en-US'), 'user', 'protein-foodbox', 'response', 'help');
		callMealAdvice(advies);
	});
	
	$('#foodbox-protein-short .done-foodbox-btn').click(function() {
		//console.log("done with registering proteins")
		index = dietAdviceNames.indexOf(advies);
		dietAdviceValues[index] = true;
		dietAdviceProteins_taken[index] = parseFloat(document.getElementById("points-box").innerHTML.split(" ")[0]);
		dt = new Date();
		if (!historyOn) {intakeDay = dt.toLocaleDateString('en-US')};
		addLog(new Date().toLocaleString('en-US'), 'user', 'protein-foodbox', 'response', 'confirmation', `${advies}-${dietAdviceProteins_taken[index]}`, intakeDay);
		foodBoxInfo = []; //clear the foodbox
		screenOpen = false;
		
        setProgressBar(dietAdviceProteins_taken[index], index);
        setDayTotalSlider();
	});
    
    $('#notification-foodbox-unknown .product-foodbox-btn').click(function() {
        foodBoxChoice();
        addLog(new Date().toLocaleString('en-US'), 'user', 'foodbox-unknown', 'response', 'choice');
        
    });
     
    $('#notification-foodbox-unknown .ignore-foodbox-btn').click(function() {
        addLog(new Date().toLocaleString('en-US'), 'user', 'foodbox-unknown', 'response', 'ignore');
        foodBoxInfo = []; //clear foodbox
		screenOpen = false;
    });
    
   $('#notification-foodbox-unknown-choice .choice-foodbox-btn').click(function() {
        checkComplete();
    });
     
    $('#notification-foodbox-unknown-choice .ignore-foodbox-btn').click(function() {
        addLog(new Date().toLocaleString('en-US'), 'user', 'foodbox-choices', 'response', 'ignore');
		screenOpen = false;
    });
    
    $(".modal").on("show.bs.modal", function () {
        if (WINDOW_SCROLLTOP_BEFORE_MODAL == -1) {
            WINDOW_SCROLLTOP_BEFORE_MODAL = $(window).scrollTop();
            $('body').css('top', '-' + $(window).scrollTop());
        }
        $('body').addClass('modal-open');
    });
    
    $(".modal").on("hidden.bs.modal", function () {
        if (!screenOpen) {
            $('body').css('top', 'auto');
            $('body').removeClass('modal-open')
            window.scrollTo(0, WINDOW_SCROLLTOP_BEFORE_MODAL);
            WINDOW_SCROLLTOP_BEFORE_MODAL = -1;
        } else {
            // Het kan zijn dat de modal plugin deze hide-functie aanroept, terwijl er nog een modal open is.
            // Dan moet modal-open OPNIEUW op body worden gezet, omdat de javascript het anders niet meer snapt.
            $('body').addClass('modal-open')
        }
    });
    
    $(window).on('scroll', function(e) {
        if (!$('body').hasClass('modal-open')) {
            var y = $(window).scrollTop() + (parseFloat($(window).height()) / parseFloat(2.5));
            if (y < $('#middag').position().top) {
                $('#ochtenddeel').addClass('active');
                $('#middagdeel').removeClass('active');
                $('#avonddeel').removeClass('active');
            } else if (y < $('#avond').position().top) {
                $('#ochtenddeel').removeClass('active');
                $('#middagdeel').addClass('active');
                $('#avonddeel').removeClass('active');
            } else {
                $('#ochtenddeel').removeClass('active');
                $('#middagdeel').removeClass('active');
                $('#avonddeel').addClass('active');
            }
        }
    });
});

function showAlternatives(id) {
	document.getElementById("alternatives").style.visibility = "visible";
	
	//save the product that you want to substitute
	for (i=0;i<currentMenu.length;i++) {
		if (currentMenu[i][0] == id) {
			substProduct = currentMenu[i]
		}
	}
	
	findType(id);
}

function addProtein(addition) {
    var points = "points";
    var barText = "bar-text";
    
    if (addition != undefined) {
        points += '-' + addition;
        barText += '-' + addition;
    }
    
    value = document.getElementById(points).innerHTML;
    value = parseFloat(value.split(" ")[0]) + stepSizePoints;
	if (value > maxPoints) { value = maxPoints} ; 
	document.getElementById(points).innerHTML = value + " punten";
    
    if (aanspreekvorm == 'formeel') {
        document.getElementById(barText).innerHTML = "Uw maaltijd was " + value + " eiwitpunten waard.";
    } else {
        document.getElementById(barText).innerHTML = "Jouw maaltijd was " + value + " eiwitpunten waard.";
    }
    
	
    
    if (addition != undefined) {
        setProgressBar(value, addition);
    } else {
        setProgressBar(value);
    }
};
	
function substractProtein(addition) {
    var points = "points";
    var barText = "bar-text";
    
    if (addition != undefined) {
        points += '-' + addition;
        barText += '-' + addition;
    }
    
	value = document.getElementById(points).innerHTML;
    value = parseFloat(value.split(" ")[0]) - stepSizePoints;
	if (value < 0) { value = 0} ;
	document.getElementById(points).innerHTML = value + " punten";
	if (aanspreekvorm == 'formeel') {
        document.getElementById(barText).innerHTML = "Uw maaltijd was " + value + " eiwitpunten waard.";
    } else {
        document.getElementById(barText).innerHTML = "Jouw maaltijd was " + value + " eiwitpunten waard.";
    }
    
    if (addition != undefined) {
        setProgressBar(value, addition);
    } else {
        setProgressBar(value);
    }
};

function increase(id, menu) {
	//console.log(typeof id);
    if (id[id.length-1] == "p") {
		id = parseInt(id.substring(0, id.length-1));
        //console.log(foodBoxProducts);
        for (i=0; i<foodBoxProducts.length; i++) {
            //console.log(foodBoxProducts[i][0]);
            if (foodBoxProducts[i][0] == id) {
                foodBoxProducts[i][2] += 0.25;
                foodBoxProducts[i][9] = foodBoxProducts[i][2] * foodBoxProducts[i][7];
            }
        }
        selectProduct();
        set_products(foodBoxProducts);
    }
    
	else {
		id = parseInt(id);
		for (i=0; i<currentMenu.length; i++) {
			if (currentMenu[i][0] == id) { 
				currentMenu[i][2] += 0.25;
                currentMenu[i][9] = (currentMenu[i][2] * (currentMenu[i][7]/ currentMenu[i][5])); //change exact measure
            }
		}
		set_prefMenuHTML(document.getElementById('menu_table_inside').scrollTop);
	}
}

function decrease(id) {
	if (id[id.length-1] == "p") {
		id = parseInt(id.substring(0, id.length-1));
        //console.log(foodBoxProducts);
        for (i=0; i<foodBoxProducts.length; i++) {
            //console.log(foodBoxProducts[i][0]);
            if (foodBoxProducts[i][0] == id) {
                if (foodBoxProducts[i][2] >= 0.25) {
                    foodBoxProducts[i][2] -= 0.25;
                    foodBoxProducts[i][9] = foodBoxProducts[i][2] * foodBoxProducts[i][7];
                }
            }
        }
        selectProduct();
        set_products(foodBoxProducts);
    }
    
    else {
	
        for (i=0; i<currentMenu.length; i++) {
            id = parseInt(id);
            if (currentMenu[i][0] == id) { 
                if (currentMenu[i][2] >= 0.25) {
                    currentMenu[i][2] -= 0.25;
                    currentMenu[i][9] = (currentMenu[i][2] * (currentMenu[i][7]/ currentMenu[i][5])); //change exact measure
                }
            }
        }
        set_prefMenuHTML(document.getElementById('menu_table_inside').scrollTop);
    }
}

function deleteProduct(id){
    currentMenu.splice(id, 1);
    set_prefMenuHTML(document.getElementById('menu_table_inside').scrollTop);
}

function selectAlternative(index_a, type) {
	index = currentMenu.indexOf(substProduct); 
    
    if (type == "all") {
        altPref(index, advies, alternatives_list[0][index_a][0], alternatives_list[0][index_a][9]);	
        
        addToCurrentMenu(index, alternatives_list[0][index_a]);
    } else {
        altPref(index, advies, alternatives_list[1][index_a][0], alternatives_list[1][index_a][9]);
	
	   addToCurrentMenu(index, alternatives_list[1][index_a]);
    }
	
	set_prefMenuHTML(document.getElementById('menu_table_inside').scrollTop);
	document.getElementById('alternatives').style.visibility = 'hidden';	
}

function addToCurrentMenu(index, newProd) {
    replace = true;
    
    for (i=0;i<currentMenu.length;i++){
        if (currentMenu[i][0] == newProd[0] && i != index) {
            //add to portion
            currentMenu[i][2] += newProd[2];
            //add to current exact amount
            currentMenu[i][9] += newProd[9];
            
            replace = false;
        }
    }
    
    if (!replace) {
        //remove the item you have replaced
        currentMenu.splice(index, 1);
    } else {
        //replace item
        currentMenu[index] = newProd;
    }
    
}

function showProteinScreen(moment) {
	$('#protein-short').modal({
                show: true,
                backdrop: "static"
            });
			
	screenOpen = true;
	
	//set value of slider to adviced number of proteins
	if (moment != undefined) {
		advies = dietAdviceNames[moments.indexOf(moment)];
	}
    
    index = dietAdviceNames.indexOf(advies);
	
    if (dietAdviceValues[index]) {
        //use earlier entered points
        newMomentInput = false; 
        proteins = parseFloat(dietAdviceProteins_taken[index]);
    } else {
        //use default number of points
        newMomentInput = true;
        proteins = parseFloat(dietAdviceProteins[index]);
    }
    

    if (aanspreekvorm == 'formeel') {
        document.getElementById('bar-text').innerHTML = "Uw maaltijd was " + proteins + " eiwitpunten waard.";
    } else {
        document.getElementById('bar-text').innerHTML = "Jouw maaltijd was " + proteins + " eiwitpunten waard.";
    }
    document.getElementById('points').innerHTML = proteins + " punten";
    
    setProgressBar(proteins);
	
	addLog(new Date().toLocaleString('en-US'), 'system', 'protein', 'shown');
}

function showAdviceScreen(pref) {
	$('#protein-advice').modal({
                show: true,
                backdrop: "static"
            });
	screenOpen = true;	

	document.getElementById("alternatives").style.visibility = "hidden";
	
	//set pref_menu to global currentMenu
	currentMenu = pref;
    
    //copy current menu
    currentMenu_base = [];
    for (i=0;i<currentMenu.length;i++) {
        currentMenu_base.push(currentMenu[i].slice());
    }
    
	set_prefMenuHTML();
	addLog(new Date().toLocaleString('en-US'), 'system', 'advice', 'shown', null, itemSummary(currentMenu))
}
		
function selectNewOption(i, type) {
    
    if (type == 'fave') {
        document.getElementById('fave-' + i).style.display = "none";
        product = new_products[0][i];
    } else if (type == 'all') {
        document.getElementById('all-' + i).style.display = "none";
        product = new_products[1][i];
    }
    
	//currentMenu.push(product);
    new_prod = true;
    for(i=0; i<currentMenu.length;i++) {
        if (currentMenu[i][0] == product[0]) {
            currentMenu[i][2] += product[2];
            currentMenu[i][9] += product[9];
            new_prod = false;
        }
    }
    if (new_prod) {
        currentMenu.push(product);
    }
    
    
    //console.log('hier moeten we altpref doen voor een nieuw product.')
    addAltPref(advies, product[0], product[9]);
	set_prefMenuHTML(document.getElementById('menu_table_inside').scrollTop = document.getElementById('menu_table_inside').scrollHeight); //scroll to end where new product is added
}

function setBeginMessage(moment) {
	var dagdeel;
	switch (moment) {
		case 0:
			dagdeel = "Goedemorgen";
			break;
		case 3:
			dagdeel = "Goedemiddag";
			break;
		case 6:
			dagdeel = "Goedenavond"
			break;
		default:
			return '';
			break;
	}
	
	if (aanspreekvorm == 'formeel') {
		if (geslacht == "vrouw") { titel = "mevrouw"} 
		if (geslacht == "man") { titel = "meneer"}
		return `${dagdeel} ${titel} ${achternaam}, </br></br>`;
	}
	if (aanspreekvorm == "informeel") {
		return `${dagdeel} ${voornaam}, </br></br>`;
	}
}

//Send notification function - still needs adjustment for right messages
function sendNotification(result, moment) {
	$('#notification').modal({
                show: true,
                backdrop: "static"
            });
    
	screenOpen = true;		
			
	var message = "";
	
	//check for begin new daypart message
	message += setBeginMessage(moment);
	
	//convert message so that variables can be used.
	message += new Function('return `' + result + '`;')();
	document.getElementById("notification-content").innerHTML = message;
	notificationSound.play();
	//console.log('geluidje plek 1');
	navigator.vibrate(3000);
	writeLog("Notification:" + message);
	addLog(new Date().toLocaleString('en-US'), 'system', 'notification', 'shown', message.replace(achternaam, participantenID).replace(voornaam, participantenID));
}

//Send reminder function - still needs adjustment for right messages
function sendReminder(result) {
	$('#reminder').modal({
        show: true,
        backdrop: "static"
    })
	screenOpen = true;
	//message = reminders[t];
	message = new Function('return `' + result + '`;')();
    document.getElementById("reminder-content").textContent = message;
	notificationSound.play();
	//console.log('geluidje plek 2');
	navigator.vibrate(3000);
	writeLog("Reminder:" + message);
	addLog(new Date().toLocaleString('en-US'), 'system', 'reminder', 'shown', message)
}


//Function to check if a notification needs to be send
function checkNotification() {
	//console.log("CheckNot. " +  databaseBusy);
	
	if (!databaseBusy) { //added this statement to make sure that the database is ready before sending a notification
		for (i = 0; i < timesAdvices.length; i++) {
			if (currentTime >= timesAdvices[i] && currentTime < timesAdvices[i+1] && dietAdviceValues[i] == false && herinnering == false) {
				advies = dietAdviceNames[i];
                
				//set today active again
				changeDay(0);	
                
				findMostSuitableMessage("notification", moments[i]);
				//console.log("notification send");
			}
		}
	} else {
		setTimeout(checkNotification, 1000)
	}
}

//Function to check if reminder needs to be send
function checkReminder(){
	for (i = 0; i < timesAdvices.length; i++) {
			if (currentTime >= timesAdvices[i] && currentTime >= herinneringsTijd && currentTime < timesAdvices[i+1] && dietAdviceValues[i] == false && herinnering == true) {
				
				if (dietAdviceNames[i] == advies) {
					//set today active again
					changeDay(0);	
                    
					findMostSuitableMessage("reminder", moments[i]);
					//console.log(currentTime, herinneringsTijd, i);
					//console.log("reminder send");
				}
				else { //het is tijd voor een nieuw onderdeel in het dieet, dus de reminder wordt uitgezet
					herinnering = false;
					checkNotification();
				}
			}
	}
}

//Function to jump to the right moment of the day
function showDaypart() {
	if (currentTime < 12) {
		window.scrollTo(0,$('#ochtend').position().top);
	}
	else if (currentTime < 18) {
		window.scrollTo(0,$('#middag').position().top);
	}
	else {
		window.scrollTo(0,$('#avond').position().top);
	}
}

function checkFoodBox() {
    if (foodBoxInfo != 'onbekend') {
        //console.log('Foodbox is read');
        foodBoxInfo = [];
        foodBoxReading = true;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) { 
                if (this.status == 200) {
               // Action to be performed when the document is read;
               foodBoxReading = false;
               foodBoxInfo = [];
               if (this.responseText != "") {
                //set today active again
                changeDay(0);	

                if (this.responseText == "UNKNOWN") 
                    {
                        foodBoxInfo = 'onbekend';
                    }
                else {
                    //console.log(this.responseText);
                    
                for (i=0; i<this.responseText.split(',').length; i++) {
                    newItem = true;
                    for (j=0; j<foodBoxInfo.length; j++) {
                        if (foodBoxInfo[j][0] == this.responseText.split(',')[i]) {
                            newItem = false;
                            foodBoxInfo[j][1] += 1;
                        } 
                    }
                    if (newItem && this.responseText.split(',')[i] != ''){
                        foodBoxInfo.push([this.responseText.split(',')[i], 1])
                    }


                    //item = [parseInt(this.responseText.split(',')[i].split('-')[0]), parseInt(this.responseText.split(',')[i].split('-')[1])]; 
                    //foodBoxInfo.push(item);
                   }
               }
               }

               //console.log(foodBoxInfo);
               mainFlow();
            } else {
                console.log('connection error');
                mainFlow();
            }
        }};
        xhttp.open("GET", foodBoxURL, true);
        xhttp.send();
    }
}

function checkProtein(proteinTotal, names, numbers, types, closest) {
    if (closest == undefined) {
        //console.log("this defines the closest");
        
        distance = 24;
        closest = 100;
        //find closes eating moment that is not yet filled in
        for (i = 0; i < timesAdvices.length; i++) {
            if (distance > Math.abs(timesAdvices[i] - currentTime) && dietAdviceValues[i] == false) {
                distance = Math.abs(timesAdvices[i] - currentTime);
                closest = i;
            }
        }

        if (closest == 100) //no closer value found
        {
            closest = dietAdviceNames.length - 1; //last value so that it adds to the last meal
        }
    }
    //console.log("closest at this moment is: " + closest)
	
	protein_limit = dietAdviceProteins[closest];
	
	//console.log(protein_limit, proteinTotal);
	
	currentIntake = proteinTotal; //make it global for later use
	
	if (proteinTotal == protein_limit) //number of proteins of foodbox is enough for eatmoment
	{
		sendFoodBoxConfirm(names, closest, numbers, types, 'correct');
	}
	else if (proteinTotal > protein_limit) {
        //too much proteins
		sendFoodBoxConfirm(names, closest, numbers, types, 'high');
	} else {
        //not enough proteins
        sendFoodBoxConfirm(names, closest, numbers, types, 'low');
    }
	
}

function sendFoodBoxConfirm(names, closest, numbers, types, state) {
    //console.log(numbers);
    
	$('#notification-foodbox').modal({
                show: true,
                backdrop: "static"
            });
	screenOpen = true;		
			
	products = ""; 
	for (i=0;i<names.length;i++){
		products += '<i>';
        
        products += numbers[i] + ' ' + types[i] + ' ';
        
        products += names[i] + "</i>";
        
		if (i<names.length-1) { 
            products += " en ";
        }
	}
	
	advies = dietAdviceNames[closest]; //zet advies op het moment waarvoor de foodbox is
    
    if (state == 'correct') {
        if (aanspreekvorm == "formeel") {
            var message = `De foodbox heeft geregistreerd dat u ${products} heeft gegeten als ${advies}. Klopt dit? Hiermee heeft u precies genoeg eiwitpunten binnen gekregen!`;
        } else {
            var message = `De foodbox heeft geregistreerd dat je ${products} hebt gegeten als ${advies}. Klopt dit? Hiermee heb je precies genoeg eiwitpunten binnen gekregen!`;
        }
        document.getElementById("confirm-foodbox").className = "confirm-foodbox-btn btn btn-primary";
        document.getElementById("more-foodbox").className = "more-foodbox-btn btn btn-secondary";
    } else if (state == 'low') {
        if (aanspreekvorm == 'formeel') {
            var message = `De foodbox heeft geregistreerd dat u ${products} heeft gegeten als ${advies}. Klopt dit? Wanneer u nog meer hebt gegeten kunt u op <i>Aanvullen</i> drukken om dit in te voeren`;
        } else {
            var message = `De foodbox heeft geregistreerd dat je ${products} hebt gegeten als ${advies}. Klopt dit? Wanneer je nog meer hebt gegeten kun je op <i>Aanvullen</i> drukken om dit in te voeren`;
        }
        document.getElementById("confirm-foodbox").className = "confirm-foodbox-btn btn btn-secondary";
        document.getElementById("more-foodbox").className = "more-foodbox-btn btn btn-primary";
    } else if (state == 'high') {
        if (aanspreekvorm == 'formeel') {
            var message = `De foodbox heeft geregistreerd dat u ${products} heeft gegeten als ${advies}. Klopt dit? Wanneer u nog meer hebt gegeten kunt u op <i>Aanvullen</i> drukken om dit in te voeren`;
        } else {
            var message = `De foodbox heeft geregistreerd dat je ${products} heeft gegeten als ${advies}. Klopt dit? Wanneer je nog meer hebt gegeten kun je op <i>Aanvullen</i> drukken om dit in te voeren`;
        }
        document.getElementById("confirm-foodbox").className = "confirm-foodbox-btn btn btn-secondary";
        document.getElementById("more-foodbox").className = "more-foodbox-btn btn btn-primary";
    }

	
	document.getElementById("notification-foodbox-content").innerHTML = message;
	notificationSound.play();
	//console.log('geluidje plek 3');
	navigator.vibrate(3000);
	writeLog("Foodbox:" + message);
	addLog(new Date().toLocaleString('en-US'), 'system', 'notification-foodbox', 'shown', message);
}

function showProteinScreenFoodbox() {
	$('#foodbox-protein-short').modal({
                show: true,
                backdrop: "static"
            });
			
	screenOpen = true;
	
    
   if (aanspreekvorm == 'formeel') {
        document.getElementById("bar-text-box").innerHTML = "Uw maaltijd was " + currentIntake + " eiwitpunten waard.";
    } else {
        document.getElementById("bar-text-box").innerHTML = "Jouw maaltijd was " + currentIntake + " eiwitpunten waard.";
    }
    document.getElementById('points-box').innerHTML = currentIntake + " punten";
    
    setProgressBar(currentIntake, 'box');
	
	addLog(new Date().toLocaleString('en-US'), 'system', 'protein-foodbox', 'shown')
}

function checkDay(){
    return (document.getElementById('day0').innerHTML.split(' ')[2].split('-')[0] == new Date().getDate() && document.getElementById('day0').innerHTML.split(' ')[2].split('-')[1] == new Date().getMonth());
}


function changeDay(id, newDay) {
	id = parseInt(id);
	
	if (!document.getElementById('day'+id).disabled || newDay != undefined) {
	
		dt = new Date();
		if (id != 0) { 
			historyOn = true;
			dt.setDate(dt.getDate() + id);
			
		}
		else { historyOn = false; }
		
		intakeDay = dt.toLocaleDateString('en-US');
		//console.log(dt, dt.toLocaleDateString('en-US'));
		
		for (i=-3; i<4; i++) {
			document.getElementById('day'+i).disabled = false;
		}
		document.getElementById('day'+id).disabled = true;
		
		//console.log("Er is geklikt op: " + id);
		
        newInput = false;
		findProteinsInHistory(intakeDay);
	}
}

function unknownFoodbox(state) {
	
	$('#notification-foodbox-unknown').modal({
        show: true,
        backdrop: "static"
    });
	screenOpen = true;		
	
    if (aanspreekvorm == "formeel") {
        var message = "Het lijkt erop dat u iets uit de foodbox heeft gepakt. Welk product was dit?";
    } else {
        var message = "Het lijkt erop dat je iets uit de foodbox hebt gepakt. Welk product was dit?";
    }
    
	document.getElementById("notification-foodbox-unknown-content").innerHTML = message;
	notificationSound.play();
	navigator.vibrate(3000);
    writeLog('Foodbox: unknown');
	addLog(new Date().toLocaleString('en-US'), 'system', 'notification-foodbox', 'shown', message);
}

function showFoodBoxProducts(products) {
    //console.log(products);
    
    $('#notification-foodbox-unknown-choice').modal({
                show: true,
                backdrop: "static"
            });
	screenOpen = true;	
    
    document.getElementById("moments-intake").innerHTML = set_eatMoments();
    set_products(products);
    
    //console.log('this');
    foodBoxProducts = products; //make it global
    foodBoxProducts_selected = [];
    
    for (i=0; i<foodBoxProducts.length; i++) {
        foodBoxProducts_selected.push(foodBoxProducts[i].slice());
    }
    
    advies = ''; //reset advice
    currentIntake = 0; //reset intake
    
    setProgressBar('default', 'prod');
    document.getElementById("foodBoxChosen").innerHTML = '';
    addLog(new Date().toLocaleString('en-US'), 'system', 'foodbox-choices', 'shown')
}

function eatMomentChoice(index) {
    index = parseInt(index);
    advies = dietAdviceNames[index];
    setProgressBar(currentIntake, 'prod');
    
    for(i=0; i<dietAdviceNames.length; i++) {
        id = 'momentBtn' + i;
        if (i != index) {
            document.getElementById(id).style.opacity = '0.5';
        } else {
            document.getElementById(id).style.opacity = '1';
        }
    } 
}

function selectProduct() {
    //console.log(foodBoxProducts_selected);

    foodBoxInfo = [];
    currentIntake = 0;
    if (aanspreekvorm == 'formeel') {
        html = '<h5>Producten uit de foodbox die u heeft gegeten: </h5> <ul>'
    } else {
        html = '<h5>Producten uit de foodbox die je hebt gegeten: </h5> <ul>'
    }
            
    for (i=0; i<foodBoxProducts.length;i++) {
        if (foodBoxProducts[i][2] > 0) {
            html += `<li>${foodBoxProducts[i][2]} ${foodBoxProducts[i][4]} ${foodBoxProducts[i][1]} </li>`;
            currentIntake += roundPoints((foodBoxProducts[i][2] / foodBoxProducts[i][5]) * foodBoxProducts[i][6]);
            foodBoxInfo.push([foodBoxProducts[i][0], foodBoxProducts[i][2]]);
        }
        
    }
    html += '</ul>';
    
    document.getElementById("foodBoxChosen").innerHTML = html;
    
    if (advies != '') {
        setProgressBar(currentIntake, 'prod');
    } else {
        if (dietAdviceProteins.indexOf(Math.max(...dietAdviceProteins)) == dietAdviceNames.indexOf(advies)) {
            maxPoints = 15;
        } else {
            maxPoints = 10;
        }
        
        document.getElementById('bar-prod').style.width = 'calc(' + ((currentIntake/maxPoints)*100) + "%)";
        if (aanspreekvorm == 'formeel') {
            document.getElementById('bar-text-prod').innerHTML = "Uw maaltijd was " + currentIntake + " eiwitpunten waard.";
        } else {
            document.getElementById('bar-text-prod').innerHTML = "Jouw maaltijd was " + currentIntake + " eiwitpunten waard.";
        }
        document.getElementById('bar-prod').style.backgroundColor = '#6c757d';
    }
    
    
}

function checkComplete() {
    document.getElementById('warning').innerHTML = '';
    
    if (advies == '') {
        if (aanspreekvorm == 'formeel') {
            document.getElementById('warning').innerHTML += "U heeft geen eetmoment gekozen voor uw invoer.";
        } else {
            document.getElementById('warning').innerHTML += "Je hebt geen eetmoment gekozen voor je invoer.";
        }
    } 
    if (currentIntake == 0) {
         if (aanspreekvorm == 'formeel') {
             document.getElementById('warning').innerHTML += "U heeft geen producten gekozen.";
         } else {
             document.getElementById('warning').innerHTML += "Je heeft geen producten gekozen.";
         }
    } 
    
    if (currentIntake != 0 && advies != '') {
        $('#notification-foodbox-unknown-choice').modal('hide');
        dt = new Date();
        if (!historyOn) {intakeDay = dt.toLocaleDateString('en-US')};
        addLog(new Date().toLocaleString('en-US'), 'user', 'foodbox-choices', 'response', 'confirmation', `${advies}-${currentIntake}:${itemSummary(foodBoxProducts)}`, intakeDay);
        foodBoxProtein(dietAdviceNames.indexOf(advies));
    }
}

function roundPoints(points) {
    if (points % stepSizePoints == 0) {
        return points;
    } else {
        return Math.round((points + 0.25) * 2) / 2;
    }
}

function submitMeasureInput(id, value) {
    id = parseInt(id);
    for (i=0; i<currentMenu.length; i++) {
        if (currentMenu[i][0] == id) {
            currentMenu[i][2] = Math.round(((value/currentMenu[i][7]) * currentMenu[i][5] )* 4) / 4;
            currentMenu[i][9] = value;
        }
    }
    set_prefMenuHTML(document.getElementById('menu_table_inside').scrollTop);
}

function checkPortionChange() {
    //new
    var isFound = false;
    console.log("testing portion change")
    
    for (i=0;i<currentMenu_base.length;i++) {
        for (j=0;j<currentMenu.length;j++){
            if (currentMenu_base[i][0] == currentMenu[j][0]) {
                isFound = true;
               // console.log('testing here 1');
                if (currentMenu_base[i][9] != currentMenu[j][9]) {
                    altPref(i, advies, currentMenu[j][0], currentMenu[j][9]);
                    //console.log('testing here 2');
                }
            }
        }
        //new
        if (!isFound) {
            console.log(currentMenu_base[i][0] + " is verwijderd")
            altPref(i, advies, currentMenu_base[i][0], 0);
        }
        //new
        isFound = false;
    }
}


function checkMenuChange() {
    changes = false;
    
    if (currentMenu_base.length != currentMenu.length) {
        changes =true;
    } else {
        for (i=0;i<currentMenu_base.length;i++) {
            if (currentMenu[i][0] != currentMenu_base[i][0] || currentMenu[i][9] != currentMenu_base[i][9]) {
                changes = true;
            }
        }
    }
    
    return changes;
}

function itemSummary(menu) {
    summary = [];
    for (i=0; i<menu.length; i++){
        if (menu[i][2] == undefined) {
            summary.push(`${menu[i][0]}-${menu[i][1]}`);
        } else {
            summary.push(`${menu[i][0]}-${menu[i][9]}`);
        }
    }
    return summary
}

function setPreviousMenu(index){
    menu = [];
    for(i=0; i<dietAdviceItems[index].length;i++){
        itemInfo = dietAdviceItems[index][i].split("-");
        menu.push([itemInfo[0], null, null, null, null, null, null, null, null, parseFloat(itemInfo[1])]);
    } 
    if (!databaseBusy) {prefItemDetails(menu, 0); }
    else { setTimeout(function () { prefItemDetails(menu, 0) }, 1000)}
}

function callMealAdvice(moment){
    if (Number.isInteger(moment)) { 
        advies = dietAdviceNames[moments.indexOf(moment)]
    }
    
    //console.log(advies);
    
    index = dietAdviceNames.indexOf(advies);
    
    //console.log(index, dietAdviceItems[index]);
    
    if (dietAdviceItems[index].length != 0) {
        setPreviousMenu(index);//use previous menu
        newMomentInput = false;
    }
    else {
        findPrefMenu(advies);  //use the pref menu
        newMomentInput = true;
    }
}
