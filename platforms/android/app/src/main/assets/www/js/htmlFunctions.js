function addButton(id) {
	return `<button type="button" class="add-btn btn btn-secondary" onclick="increase('${id}')">+</button>`;
}

function minusButton(id) {
	return `<button type="button" class="add-btn btn btn-secondary" onclick="decrease('${id}')">-</button>`;
}

function deleteButton(id) {
	return `<button type="button" class="add-btn btn btn-secondary" onclick="deleteProduct('${id}')">X</button>`;
}

function foodButton(id, product, warning) {
    if (warning == undefined) {
        return `<button type="button" class="food-btn btn btn-secondary" onclick="showAlternatives(${id})">${product}</button>`;
    } else {
        return `<button type="button" class="food-btn btn btn-secondary" onclick="showAlternatives(${id})" id="warn">${product}${warning}</button>`;
    }	
}

function selectAlternativeButton(i, type) {
	return `<button type="button" class="select-btn btn btn-secondary" onclick="selectAlternative(${i}, '${type}')">Selecteer vervanging</button>`
}

function addNewOptionsButton(i, type) {
	return `<button type="button" class="new-btn btn btn-secondary" onclick="selectNewOption(${i}, '${type}')">Kies dit product</button>`
}

function typeButton(type, i) {
	return `<button type="button" class="type-btn btn" onclick="showAllType('${type}')">${type}</button>`;
    /* disabled because we have only one color for now (maybe change back later) otherwise the parameters can also be removed
    if (i%4==0 || (i+1)%4==0 || i==0) {
		return `<button type="button" class="type-btn btn btn-dark" onclick="showAllType('${type}')">${type}</button>`;
	}
	else {
		return `<button type="button" class="type-btn btn btn-light" onclick="showAllType('${type}')">${type}</button>`;
	}
    */
}

function measureInput(measure,id) {
    return `<input type='number' value='${measure}' class="measureInput" name='${id}'  id='measureInput${id}' onClick="selectInput('measureInput${id}')"> `;
}

function set_prefMenuHTML(scroll) {
	html = '';
	total_proteins = 0;
	
	html += '<div class="menu_table_wrapper faded_bottom"><div class="menu_table_inside" id="menu_table_inside"><table id="menu_table">';
	for (i=0; i<currentMenu.length; i++) {
		html += '<tr>'
		html += '<td>' + minusButton(currentMenu[i][0]) + '</td>';
		html += '<td>' + currentMenu[i][2];
        
        if (currentMenu[i][4] != "stuks") {
            html += 'x';
        }
        html += '</br>';
        
		html += ' '+ currentMenu[i][4] + '</td>';
		html += '<td>' + addButton(currentMenu[i][0]) + '</td>';
        
        html += '<td> <div class="measure">' + measureInput(currentMenu[i][9], currentMenu[i][0]) + currentMenu[i][3] + '</div></td>';
        
        if (currentMenu[i][8] == 1) {
           html += `<td class="button" id='food${i}'>` + foodButton(currentMenu[i][0], currentMenu[i][1], ' &#9888;') + '</td>'; 
        } else {
            html += `<td class="button" id='food${i}'>` + foodButton(currentMenu[i][0], currentMenu[i][1]) + '</td>';
        }
        
        html += '<td>' + deleteButton(i) + '</td>'
        
       
		html += '</tr>'
		
        total_proteins += roundPoints((parseFloat(currentMenu[i][9])/currentMenu[i][7]) * currentMenu[i][6]);
        
	}
	html += '</table></div></div>'
	html += '<button type="button" class="extra-btn btn btn-primary" onclick="addExtraItem()">Klik hier om een product toe te voegen</button>';
    
	document.getElementById("advice-content").innerHTML = html;
    if (scroll != undefined) {
        document.getElementById('menu_table_inside').scrollTop = scroll;    
    }
    
    currentIntake = total_proteins;
    setProgressBar(total_proteins, 'long');
}

function set_alternativesHTML(all_prods, favorites) {   
	alternatives_list = [all_prods, favorites];
    
    html = '';
	
	if (all_prods != "leeg") {
        html += '<div class="menu_table_wrapper faded_bottom"><div class="menu_table_inside">';
        if (favorites.length > 0) {
            if (aanspreekvorm == 'formeel') {
                html += `<h4> Uw top ${favorites.length} favoriete producten: </h4>`
            } else {
                html += `<h4> Jouw top ${favorites.length} favoriete producten: </h4>`
            }

            html += '<table id="new_table_faves" class="alt-tab">';
                for (i=0; i<favorites.length; i++) {
                    html += '<tr id="fave-' + i + '">'

                    amount = ` ${favorites[i][2]} ${favorites[i][4]} (${favorites[i][9]} ${favorites[i][3]})`;
                    
                    //energy products
                    if (favorites[i][8] == 1) {
                       html += '<td class="warn">' + favorites[i][1] + ' &#9888;' + amount + '</td>'; 
                    } else {
                        html += '<td>' + favorites[i][1] + amount + '</td>';
                    } 

                    html += '<td>' + selectAlternativeButton(i, 'fave'); + '</td>';
                    html += '</tr>'
                }
            html += '</table>'
        }
        
        html += '<h4> Alle producten (alfabetisch)</h4>';
        html += '<table id="new_table" class="alt-tab">';
        for (i=0; i<all_prods.length; i++) {
            html += '<tr id="all-' + i + '">'
            
            amount = ` ${all_prods[i][2]} ${all_prods[i][4]} (${all_prods[i][9]} ${all_prods[i][3]})`;
            
            if (all_prods[i][8] == 1) {
                   html += '<td class="warn">' + all_prods[i][1] + ' &#9888;' + amount + '</td>'; 
            } else {
                html += '<td>' + all_prods[i][1] + amount + '</td>';
            }
            
            html += '<td>' + selectAlternativeButton(i, 'all'); + '</td>';
            html += '</tr>'

        }
        html += '</table>'
        html += '</div></div>';
    }
	else {
		html = "<h3> Er zijn geen alternatieven met dezelfde hoeveelheid eiwitpunten gevonden voor dit product.</h3>";
	}
	
	document.getElementById("alternatives").innerHTML = html;
}

function set_newOptionsHTML(all_prods, favorites) {
	html = '';
    html += '<div class="menu_table_wrapper faded_bottom"><div class="menu_table_inside">';
    
    if (favorites.length > 0) {
        if (aanspreekvorm == 'formeel') {
            html += `<h4> Uw top ${favorites.length} favoriete producten: </h4>`
        } else {
            html += `<h4> Jouw top ${favorites.length} favoriete producten: </h4>`
        }

        html += '<table id="new_table_faves" class="alt-tab">';
            for (i=0; i<favorites.length; i++) {
                html += '<tr id="fave-' + i + '">'
                
                //energy products
                if (favorites[i][8] == 1) {
                   html += '<td class="warn">' + favorites[i][1] + ' &#9888; </td>'; 
                } else {
                    html += '<td>' + favorites[i][1] + '</td>';
                }
                
                html += '<td>' + addNewOptionsButton(i, 'fave'); + '</td>';
                html += '</tr>'

            }
        html += '</table>'
    }
    html += '<h4> Alle producten (alfabetisch)</h4>'
    html += '<table id="new_table" class="alt-tab">';
        for (i=0; i<all_prods.length; i++) {
            html += '<tr id="all-' + i + '">'
            
            if (all_prods[i][8] == 1) {
                   html += '<td class="warn">' + all_prods[i][1] + ' &#9888; </td>'; 
                } else {
                    html += '<td>' + all_prods[i][1] + '</td>';
                }
            html += '<td>' + addNewOptionsButton(i, 'all'); + '</td>';
            html += '</tr>'

        }
    html += '</table></div></div>'
    
	new_products = [favorites, all_prods]; //make global

	document.getElementById("alternatives").innerHTML = html;
}

function set_categoriesChoice(types){
	
	html = 'Kies een categorie waaruit u een product wilt selecteren: </br>';
    html += '<div class="menu_table_wrapper faded_bottom"><div class="menu_table_inside">'
	for (i=0;i<types.length;i++){
		html += typeButton(types[i], i);
		if (i%2!=0 && i!=0) { html += '</br>'; }
	}
    html += '</div></div>'
	document.getElementById("alternatives").innerHTML = html;
	document.getElementById("alternatives").style.visibility = 'visible';
}

function statusSlider(index, intake){
	moment = moments[index];
	id =  "status-" + moment;
	
	document.getElementById(id).value = intake;
	document.getElementById(id).style.backgroundImage = setSliderGradient(dietAdviceProteins[index]);
}

function dayButtons() {
	var all_days = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
	var dt = new Date();
	
	var html = '';
	
	dt.setDate(dt.getDate() - 3); //set date to 3 days ago
	
	for (i=0; i<7; i++) {	
		if (i == 3) {
			html += `<button type="button" class="day" id="day${i-3}" onclick=changeDay("${i-3}") disabled>Vandaag </br> ${dt.getDate()}-${dt.getMonth()+1}-${dt.getFullYear()}</button>`
		}
		else {
			html += `<button type="button" class="day" id="day${i-3}" onclick=changeDay("${i-3}")>${all_days[dt.getDay()]} </br> ${dt.getDate()}-${dt.getMonth()+1}-${dt.getFullYear()}</button>`;
		}
		dt.setDate(dt.getDate() + 1)
	}
	
	return html;
}

function changeSliders() {
    all_new = true;
	for (i=0; i<dietAdviceNames.length; i++) {
		if (dietAdviceValues[i] == true) {

            setProgressBar(dietAdviceProteins_taken[i], i);
            all_new = false;
		}
		else {
            setProgressBar('default', i);
		}
	}
    
    if (all_new) {
        newInput = true;
        setDayTotalSlider('default');
    } else {
        setDayTotalSlider();
    }

}

function setProgressBar(intake, index) {
    greenInput = false;
    //console.log(index, intake);
    
    //variables for id's
    var bar = 'bar';
    var barText = 'bar-text'
    var th = 'th';
    var thw = 'thw';
    var thText = 'th-text';
    var index_name = index;
    
    if (index != undefined) {
        if (typeof index != "string") {
            index_name = moments[index];
        }
        
        bar += '-' + index_name;
        barText += '-' + index_name;
        th += '-' + index_name;
        thw += '-' + index_name;
        thText += '-' + index_name;
    } 
    
    if (index == undefined || typeof index == "string"){
        index = dietAdviceNames.indexOf(advies);
    }

    
    //console.log(bar);
    
    if (dietAdviceProteins.indexOf(Math.max(...dietAdviceProteins)) == index) {
        maxPoints = 15;
    } else {
        maxPoints = 10;
    }
    
    //threshold
    var threshold = dietAdviceProteins[index];
    var threshold_percentage = (threshold/maxPoints) * 100;
    
    document.getElementById(thText).innerHTML = threshold;
    document.getElementById(th).style.left = "calc(" + threshold_percentage + "% - 10px)";
    
    if (intake == 'default') {
        if (index_name == 'prod') {
            document.getElementById(thText).innerHTML = '';
            document.getElementById(th).style.left = "";
        }
        
        document.getElementById(bar).style.width = "";
        document.getElementById(barText).innerHTML = "";
        document.getElementById(bar).style.backgroundColor = "#e9ecef";
        document.getElementById(th).style.width = "20px";
        document.getElementById(th).style.backgroundColor = "#C0C0C0";
        document.getElementById(thText).style.color = 'black';
        document.getElementById(thw).style.width = "calc(100%)";
        document.getElementById(thw).style.left = "0px";
    }
    else {
        var intake_percentage = (intake/maxPoints) * 100;
        

        //console.log(intake_percentage, threshold_percentage)

        //intake
        document.getElementById(bar).style.width = "calc(" + intake_percentage + "%)";
        if (aanspreekvorm == 'formeel') {
            document.getElementById(barText).innerHTML = "Uw maaltijd was " + intake + " eiwitpunten waard.";
        } else {
            document.getElementById(barText).innerHTML = "Jouw maaltijd was " + intake + " eiwitpunten waard.";
        }

        //indication about intake compared to threshold
        if (intake != threshold) {
          if (Math.abs(intake - threshold) == 0.5 || intake > threshold) {
              document.getElementById(bar).style.backgroundColor = "#cb8e35";
          } else {
              document.getElementById(bar).style.backgroundColor = "#cb4335";
          }
            
          document.getElementById(th).style.width = "20px";
          document.getElementById(th).style.backgroundColor = "#C0C0C0";
          document.getElementById(thText).style.color = 'black';
          document.getElementById(th).style.left = "calc(" + threshold_percentage + "% - 10px)";
          document.getElementById(thw).style.width = "calc(100% - 10px)";
          document.getElementById(thw).style.left = "5px";
        } else {
            greenInput = true;
          document.getElementById(bar).style.backgroundColor = "#72cb35";
          document.getElementById(th).style.width = "40px";
          document.getElementById(th).style.backgroundColor = "#35cb43";
          document.getElementById(thText).style.color = 'white';
          document.getElementById(th).style.left = "calc(" + threshold_percentage + "% - 20px)";
          document.getElementById(thw).style.width = "calc(100% - 20px)";
          document.getElementById(thw).style.left = "15px";
        }
    }

}

function setDayTotalSlider(intake) {
    //variables for id's
    var bar = 'bar-total';
    var th = 'th-total';
    var thw = 'thw-total';
    var thText = 'th-text-total';
    var text = 'text-total';
    
    
    threshold = 0;
    currentPoints = 0;

    for (i=0;i<dietAdviceProteins.length;i++){
        threshold += dietAdviceProteins[i];
        currentPoints += dietAdviceProteins_taken[i];
    }

    maxPoints = (5*dietAdviceProteins.length)+10; //for each menu 5 points, but for the peak meal 10 extra

    var intake_percentage = (currentPoints/maxPoints) * 100;
    var threshold_percentage = (threshold/maxPoints) * 100;
    
    //threshold
    document.getElementById(thText).innerHTML = threshold;
    document.getElementById(th).style.left = "calc(" + threshold_percentage + "% - 10px)";
    
    if (intake == 'default') {
        //reset the total bar
        document.getElementById(bar).style.width = "";
        
        if (aanspreekvorm == 'formeel') {
            document.getElementById(text).innerHTML = `Uw dagtotaal is: 0 van de ${threshold} eiwitpunten`;
        } else {
            document.getElementById(text).innerHTML = `Jouw dagtotaal is: 0 van de ${threshold} eiwitpunten`;
        }
        
        document.getElementById(bar).style.backgroundColor = "#e9ecef";
        
        if (threshold % 1 == 0) {
            document.getElementById(th).style.width = "20px";
        } else {
            document.getElementById(th).style.width = "30px";
        }
        
        
        document.getElementById(th).style.backgroundColor = "#C0C0C0";
        document.getElementById(thText).style.color = 'black';
        document.getElementById(thw).style.width = "calc(100%)";
        document.getElementById(thw).style.left = "0px";
    }
    else {
        
        dayTotals(currentPoints);
        
        //console.log(intake_percentage, threshold_percentage)

        //intake
        document.getElementById(bar).style.width = "calc(" + intake_percentage + "%)";
        if (aanspreekvorm == 'formeel') {
            document.getElementById(text).innerHTML = `Uw dagtotaal is: ${currentPoints} van de ${threshold} eiwitpunten`;
        } else {
            document.getElementById(text).innerHTML = `Jouw dagtotaal is: ${currentPoints} van de ${threshold} eiwitpunten`;
        }


        //indication about intake compared to threshold
        if (!(currentPoints - threshold >= 0 && currentPoints - threshold < 2)) { //if not in green zone
          if (currentPoints - threshold == -0.5 || (currentPoints-threshold >= 2 && currentPoints - threshold <= 3 )) {
              document.getElementById(bar).style.backgroundColor = "#cb8e35"; //orange
          } else {
              document.getElementById(bar).style.backgroundColor = "#cb4335"; //red
          }
            
          if (threshold % 1 == 0) {
                document.getElementById(th).style.width = "20px";
          } else {
                document.getElementById(th).style.width = "30px";
          }
          document.getElementById(th).style.backgroundColor = "#C0C0C0"; //white
          document.getElementById(thText).style.color = 'black';
          document.getElementById(thw).style.width = "calc(100% - 10px)";
          document.getElementById(thw).style.left = "5px";
        } else {
          document.getElementById(bar).style.backgroundColor = "#72cb35"; //green
          document.getElementById(th).style.width = "40px";
          document.getElementById(th).style.backgroundColor = "#35cb43";
          document.getElementById(thText).style.color = 'white';
          document.getElementById(th).style.left = "calc(" + threshold_percentage + "% - 20px)";
          document.getElementById(thw).style.width = "calc(100% - 20px)";
          document.getElementById(thw).style.left = "15px";
        }
    }
    
   //disabled starScores(); //calculate number of stars today up until now
    
}

function set_eatMoments() {
    html = '<h5>Eetmomenten: </h5> <div id="moments-intake-list" class="faded_bottom"> ';
    
    for (i=0;i<dietAdviceNames.length;i++){
        
        html += `<button type="button" id="momentBtn${i}" class="moment-btn btn" onclick="eatMomentChoice('${i}')">${dietAdviceNames[i]}</button> <br>`
        /* set back if two colors are wanted
        if (i==0 || i%2==0) {
            html += `<button type="button" id="momentBtn${i}" class="moment-btn btn btn-primary" onclick="eatMomentChoice('${i}')">${dietAdviceNames[i]}</button> <br>`
        } else {
            html += `<button type="button" id="momentBtn${i}" class="moment-btn btn btn-secondary" onclick="eatMomentChoice('${i}')">${dietAdviceNames[i]}</button> <br>`
        }  
        */
    }
    html += "</div>"
    return html;
}

function set_products(products) {
    html = '<table id="foodbox_table">';
		for (i=0; i<products.length; i++) {
			html += '<tr>'
			html += '<td>' + minusButton(products[i][0]+"p") + '</td>';
			html += '<td>' + products[i][2] + ' ';
			html += products[i][4] + '</td>';
			html += '<td>' + addButton(products[i][0]+"p") + '</td>';
            
            if (products[i][8] == 1) {
                html += '<td style="color: red">' + products[i][1] + ' &#9888;' + '</td>';
            } else {
                html += '<td>' + products[i][1] + '</td>';
            }
            
			html += '</tr>'
		}
		html += '</table>'
    
    document.getElementById("foodBoxProducts").innerHTML = html;
}

//function to check if 'go' button is pressed
$(document).on('keyup', ".measureInput", function(event) {
    if (event.keyCode==13) {
        submitMeasureInput(this.name, this.value);
    }
});

function selectInput(id) {
    document.getElementById(id).focus();
    document.getElementById(id).select();
}

function informalHTML() {
    document.getElementById('welcome1').innerHTML = "Geef aan wat je vanmorgen hebt gegeten en gedronken.";
    document.getElementById('welcome2').innerHTML = "Geef aan wat je vanmiddag hebt gegeten en gedronken.";
    document.getElementById('welcome3').innerHTML = "Geef aan wat je vanavond hebt gegeten en gedronken."
    
    document.getElementById('protein-short-text').innerHTML = "Geef hieronder aan hoeveel eiwitpunten je maaltijd waard was. De standaardwaarde die je ziet is het aantal dat je zou moeten innemen. Heb je hieraan voldaan? Dan klik je op <i>Bevestig inname</i>. Maar je kunt ook het aantal eiwitten aanpassen met behulp van de plus- en minknoppen. Indien je niet weet hoeveel eiwitpunten je hebt ingenomen, of hulp wilt bij het samenstellen van je maaltijd, kies je voor <i>Maaltijd samenstellen</i>.";
    
    document.getElementById('protein-advice-text').innerHTML = "Hieronder zie je een voorbeeldmenu met de juiste hoeveelheid eiwitten voor dit eetmoment. Let op dat je naast dit advies <b>geen</b> andere eiwitproducten eet. </br> Energierijke producten zijn herkenbaar aan een &#9888;-teken. Neem van deze producten liever niet meer dan 1 tot 3 porties per dag (afhankelijk van of het een dagelijks product is zoals olie of een extraatje, zoals een koek of gebak).";
    
    document.getElementById('foodbox-short-text').innerHTML = "Geef hieronder aan hoeveel eiwitten je naast het product/de producten uit de foodbox heeft ingenomen. Let op, geef het totale aantal punten dat je maaltijd waard was aan, inclusief het product/de producten uit de foodbox. Je ziet hieronder het aantal punten dat je op dit moment al hebt ingenomen, op basis van de gegevens uit de foodbox. Je kunt dit aanpassen met behulp van de plus- en minknoppen. Heb je het juiste aantal punten geselecteerd? Klik dan op <i>Bevestig inname</i>. Indien je niet weet hoeveel eiwitpunten je hebt ingenomen, of hulp wilt bij het samenstellen van je maaltijd, kies je voor <i>Maaltijd samenstellen</i>.";
    
    document.getElementById('foodbox-choice-text').innerHTML = "Geef hieronder aan welke producten je uit de foodbox hebt gegeten en bij welk eetmoment deze horen. In de linkerkolom kun je klikken op het eetmoment waarbij je inname hoort. In de rechterkolom kun je het product/de producten die je uit de foodbox hebt gegeten invoeren. Je ziet daarnaast een lijstje verschijnen met alle producten die je hebt geselecteerd. ";
    
    document.getElementById('calender-text').innerHTML = "Wil je invoeren voor een andere dag deze week? Klik dan hieronder op die dag."
    
    document.getElementById('game-1-explain').innerHTML = "Welkom bij het spel 'raad het aantal eiwitpunten'! Raad telkens bij het gegeven product hoeveel eiwitpunten dit waard is. Selecteer het juiste aantal punten door gebruik te maken van de + en - knop. Druk vervolgens op 'controleer antwoord'. Je ziet dan of jouw antwoord correct is. Om door te gaan druk je op 'volgende ronde'. 1 spel bestaat uit 5 raadbeurten. Voor elk goed antwoord krijg je 2 punten, zit je 0.5 eiwitpunten naast het goede antwoord dan krijg je 1 punt. Succes! Druk op 'Start het spel' om te beginnen."
    
    document.getElementById('game-2-explain').innerHTML = "Welkom bij het spel 'meer of minder punten?'! Je krijgt steeds een vraag waarop je antwoord moet geven. Je hebt telkens de keuze uit 2 producten als antwoord. 1 spel bestaat uit 10 raadbeurten. Voor elk goed antwoord krijg je 1 punt. Succes! Druk op 'Start het spel' om te beginnen.";
    
    document.getElementById('game-3-explain').innerHTML = "Welkom bij het spel 'kies de producten'! Je krijgt de opdracht om uit 10 producten alle producten te selecteren (door erop te drukken) die een bepaald aantal eiwitpunten waard zijn. Dit kan één product zijn, maar het kunnen er ook meer zijn. Wanneer je alle producten hebt geselecteerd, druk je op 'controleer antwoord'. Je krijgt 10 punten voor dit spel, voor elk fout antwoord gaat daar 1 punt vanaf. Succes! Druk op 'Start het spel' om te beginnen.";
    
    document.getElementById('game-4-explain').innerHTML = "Welkom bij het spel 'zoek de paren'! Je krijgt 10 producten te zien, waarin je 5 paren moet zoeken van producten met evenveel eiwitpunten. Vorm een paar door 2 producten aan te klikken. Als je 2 producten hebt aangeklikt, klik je op 'controleer paar' en zie je of het goed was. Vervolgens wordt je gevraagd hoeveel punten de producten waard zijn (apart) en druk je op 'controleer antwoord' om te zien of het goed is. Daarna kun je het volgende paar selecteren. Als het door jou gevormde paar niet klopt, kun je nog een keer op een van de producten klikken om deze niet langer te selecteren. Voor elk gevonden paar krijg je 1 punt. Als je ook het aantal punten voor een paar goed raadt, krijg je daar 1 extra punt voor. Succes! Druk op 'Start het spel' om te beginnen.";
    
    document.getElementById('game-5-explain').innerHTML = " Welkom bij het spel 'eiwitbingo'! Je ziet zometeen een bingokaart met eiwitpunten. Elke beurt komt er een product te staan, waarbij je het juiste aantal eiwitpunten moet aanklikken op jouw bingokaart. Aan het begin van het spel heb je 10 punten. Wanneer je het verkeerde aantal eiwitpunten kiest, wordt hier 1 punt vanaf getrokken. Wanneer je alle vakjes correct hebt afgevinkt, heb je bingo en krijgt je het resterende aantal punten. Heb je geen punten meer over? Dan bent je 'game over'. Succes! Druk op 'Start het spel' om te beginnen.";
    
    document.getElementById('game-3-feedback').innerHTML = "Je ziet nu de juiste antwoorden. Jouw antwoorden zijn donkergrijs. Producten die je terecht niet hebt aangeklikt zijn lichter gemaakt, producten die aangeklikt moeten zijn, zijn dikgedrukt."
}