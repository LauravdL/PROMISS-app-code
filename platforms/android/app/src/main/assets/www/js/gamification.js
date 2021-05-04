//globals
var round = 0;
var answer;
var tempScore = 0;
var greenInput = false;
var newInput = true;
var gameToStart = 0;
var pointsWithPairsCondition = 'protein_points in (';

var played_products_condition = ""; //condition to exclude all products played within the game (now only used for game 1)

var bingoValues = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];
var availableValues = ' AND protein_points in (0, 0.5, 1, 1.5, 2)';
var points = 10;

var levelsFlowerGarden = [5, 50, 100, 150, 200, 275, 400, 500, 625, 675, 800, 875, 1050, 1175, 1300, 1350, 1450, 1525, 1650, 1775, 1900, 1975, 2050, 2125, 2200, 2350, 2500, 2650, 2800, 2950, 3100, 3250, 3400, 3550, 3700, 3850, 4000];
var stageFlowerGarden = 0;
var gamesScore = 0;
var newGardenElement = false;
var tempNewGardenElement = true;

var namesMiniGames = ["raad het aantal eiwitpunten", "meer of minder punten?", "kies de producten", "zoek de paren", "eiwitbingo"];


function starScores() {
    var stars = 0;
    var intake = 0;
    var proteins_subtot = 0;
    
    for (i=0; i<dietAdviceItems.length; i++) {
        if (currentTime >= timesAdvices[i]) {
            intake += dietAdviceProteins_taken[i];
            proteins_subtot += dietAdviceProteins[i];
        }
    }
    
    if (intake > 0) {
        if (!(intake - proteins_subtot >= 0 && intake - proteins_subtot < 2)) { //if not in green zone
              if (intake - proteins_subtot == -0.5 || (intake-proteins_subtot >= 2 && intake - proteins_subtot <= 3 )) {
                  stars = 2; //orange
              } else {
                 stars = 1; //red
              }

        } else {
            stars = 3;
        }
    }
    
    document.getElementById("stars").innerHTML = "STARS: " + stars;
}

function score(change) {
    //document.getElementById('score').innerHTML = "SCORE: " + (parseInt(document.getElementById('score').innerHTML.split(' ')[1]) + parseInt(change));
    
    gamesScore += change;
    flowerGarden();
    
    if (levelsFlowerGarden.length != stageFlowerGarden) {
        document.getElementById('score').innerHTML = "Spelpunten: " + gamesScore + "; nog " + (levelsFlowerGarden[stageFlowerGarden] - gamesScore) + " spelpunten om de tuin te verbeteren";
    } else {
        document.getElementById('score').innerHTML = "Spelpunten: " + gamesScore;
        document.getElementById('score').style.textAlign = "right";
    }
    
    saveScore();
    
    writeLog("Huidige score: " + gamesScore);
    
 }

function miniGames(game) {
    switch(game) {
        case 1: //play game 'guess points' -> random product needed
            getRandomProduct(1, played_products_condition);
            break;
        case 2: //play game 'higher/lower'
            getRandomProduct(2);
            break;
        case 3:
            getRandomProduct(3);
            break;
        case 4:
            getRandomProduct(4, " AND " + pointsWithPairsCondition);
            break;
        case 5:
            getRandomProduct(5, played_products_condition + availableValues);
            break;
        default:
            break;
    }
}

function miniGamesFinish(game){
    switch(game){
        case 1:
            playGameGuessPoints();
            break;
        case 2:
            playHighLow();
            break;
        case 3:
            playSelectProducts();
            break;
        case 4:
            playTapThePairs();
            break;
        case 5:
            playBingo();
            break;
        default:
            break;
    }
}

function playGameGuessPoints(chosen_product) {
    //play the game guess points
    $('#game-1').modal({
                show: true,
                backdrop: "static"
            });
			
	screenOpen = true;
    
    document.getElementById('mini-game-1-modal').classList.add('mini-game-background');
    document.getElementById('mini-game-1-title').classList.add('mini-game-title');
    document.getElementById('game-1-content').classList.add('mini-game-bigger-content');
    document.getElementById('mini-game-1-footer').classList.add('mini-game-footer');
    
    document.getElementById('game-1-answer').style.display = "none";
    
    
    if (round >= 1) {
        document.getElementById('game-1-explain').style.display = "none"; 
    } else {
        document.getElementById('game-1-explain').style.display = "block"; 
        document.getElementById('startScreen-1').style.display = "block"; 
        document.getElementById('game1-start').style.display = "block";
    }
    
    if (round < 5) {
        document.getElementById('game-1-status').style = "text-align: right;"
        document.getElementById('game-1-question').style.display = "block";
        document.getElementById('game1-check').style.display = "block";
        document.getElementById('game1-next').style.display = "none";
        document.getElementById('game1-last').style.display = "none";
        document.getElementById('pointsGuess').style.display = "block";
        document.getElementById('game1-finish').style.display = "none";
        
        round += 1;
        document.getElementById('game-1-status').innerHTML = "Ronde: " + round + " van de 5"
        
        document.getElementById('game-1-question').innerHTML = `<p>Hoeveel eiwitpunten is het volgende product waard?</br> <b>${chosen_product[1]} ${chosen_product[2]} (${chosen_product[3]} ${chosen_product[4]}) ${chosen_product[0]}</b></p>`;
        
        document.getElementById('answer1').innerHTML = "0 eiwitpunten";
        
        answer = chosen_product[5];
        
        if (round == 1) {
            document.getElementById('game-1-play').style.display = "none";
            document.getElementById('game1-check').style.display = "none";   
        }
        
    } else {
        document.getElementById('mini-game-1-modal').classList.remove('mini-game-background');
        document.getElementById('mini-game-1-title').classList.remove('mini-game-title');
        document.getElementById('game-1-content').classList.remove('mini-game-bigger-content');
        document.getElementById('mini-game-1-footer').classList.remove('mini-game-footer');
        
        
        if (aanspreekvorm == "formeel") {
            document.getElementById('game-1-status').innerHTML = "Gefeliciteerd, uw score voor dit spel is: " + tempScore + " spelpunten.";
        } else {
            document.getElementById('game-1-status').innerHTML = "Gefeliciteerd, jouw score voor dit spel is: " + tempScore + " spelpunten.";
        }
        document.getElementById('game-1-status').style = "text-align: left;"
        
        document.getElementById('game-1-question').style.display = "none";
        
        played_products_condition = "";
        score(tempScore);
        
        addLog(new Date().toLocaleString('en-US'), 'user', 'mini-game', 'finish', namesMiniGames[0], tempScore);
        
        round = 0;
        tempScore = 0;
        
        document.getElementById('game1-check').style.display = "none";
        document.getElementById('game1-next').style.display = "none";
        document.getElementById('game1-last').style.display = "none";
        document.getElementById('pointsGuess').style.display = "none";
        document.getElementById('game1-finish').style.display = "block";
    }
      
}

function playHighLow(products) {
    //play the game guess points
    $('#game-2').modal({
                show: true,
                backdrop: "static"
            });
			
	screenOpen = true;
    
    document.getElementById('mini-game-2-modal').classList.add('mini-game-background');
    document.getElementById('mini-game-2-title').classList.add('mini-game-title');
    document.getElementById('game-2-content').classList.add('mini-game-bigger-content');
    document.getElementById('mini-game-2-footer').classList.add('mini-game-footer');
    
    document.getElementById('game-2-answer').style.display = "none";
    
    if (round >= 1) {
        document.getElementById('game-2-explain').style.display = "none"; 
    } else {
       document.getElementById('game-2-explain').style.display = "block";
        if (Math.round(Math.random()) == 0) {
            type = "meeste";
        } else {
            type = "minste"
        }
        document.getElementById('startScreen-2').style.display = "block"; 
        document.getElementById('game2-start').style.display = "block";
    }
    
    if (round < 10) {
        document.getElementById('game-2-status').style = "text-align: right;"
        document.getElementById('game-2-question').style.display = "block";
        document.getElementById('productsGuess').style.display = "block";
        document.getElementById('game2-finish').style.display = "none";
        document.getElementById('game2-next').style.display = "none";
        document.getElementById('game2-last').style.display = "none";
        
        round += 1;
        document.getElementById('game-2-status').innerHTML = "Ronde: " + round + " van de 10"
        
        
        
        document.getElementById('game-2-question').innerHTML = "Welk van onderstaande producten is de <b>" + type + "</b> eiwitpunten waard? </br>" + `${products[0][1]} ${products[0][2]} (${products[0][3]} ${products[0][4]}) ${products[0][0]} </br> ${products[1][1]} ${products[1][2]} (${products[1][3]} ${products[1][4]}) ${products[1][0]}`;
        
        document.getElementById('prod1').style.height = ""; //reset button height
        document.getElementById('prod1').innerHTML = `${products[0][0]}`;
        document.getElementById('prod2').style.height = ""; //reset button height
        document.getElementById('prod2').innerHTML = `${products[1][0]}`;
       
        //make both buttons the same size (if one is bigger)
        setTimeout(function () {
            if (document.getElementById('prod1').offsetHeight > document.getElementById('prod2').offsetHeight) {
                document.getElementById('prod2').style.height = document.getElementById('prod1').offsetHeight
            } else if (document.getElementById('prod1').offsetHeight < document.getElementById('prod2').offsetHeight) {
                document.getElementById('prod1').style.height = document.getElementById('prod2').offsetHeight
            }
        }, 100)
        
        if (round == 1) {
            document.getElementById('game-2-play').style.display = "none";
            document.getElementById('game2-check').style.display = "none";   
        }
        
    } else {
        document.getElementById('mini-game-2-modal').classList.remove('mini-game-background');
        document.getElementById('mini-game-2-title').classList.remove('mini-game-title');
        document.getElementById('game-2-content').classList.remove('mini-game-bigger-content');
        document.getElementById('mini-game-2-footer').classList.remove('mini-game-footer');
        
        if (aanspreekvorm == "formeel") {
            document.getElementById('game-2-status').innerHTML = "Gefeliciteerd, uw score voor dit spel is: " + tempScore + " spelpunten.";
        } else {
            document.getElementById('game-2-status').innerHTML = "Gefeliciteerd, jouw score voor dit spel is: " + tempScore + " spelpunten.";
        }
        document.getElementById('game-2-status').style = "text-align: left;"
        
        document.getElementById('game-2-question').style.display = "none";
        
        score(tempScore);
        
        addLog(new Date().toLocaleString('en-US'), 'user', 'mini-game', 'finish', namesMiniGames[1], tempScore);
        
        round = 0;
        tempScore = 0;
        productsList = [];
        
        document.getElementById('productsGuess').style.display = "none";
        document.getElementById('game2-finish').style.display = "block";
        document.getElementById('game2-next').style.display = "none";
        document.getElementById('game2-last').style.display = "none";
    }
      
}

function playSelectProducts(products) {
    //play the game guess points
    $('#game-3').modal({
                show: true,
                backdrop: "static"
            });
			
	screenOpen = true;
    
    document.getElementById('game-3-content').style.padding = "";

    document.getElementById('mini-game-3-modal').classList.add('mini-game-background');
    document.getElementById('mini-game-3-title').classList.add('mini-game-title');
    document.getElementById('game-3-content').classList.add('mini-game-content');
    document.getElementById('mini-game-3-footer').classList.add('mini-game-footer');
    
    document.getElementById('game-3-status').innerHTML = '';
    document.getElementById('game-3-feedback').style.display = "none";
    
    if (round >= 1) {
        document.getElementById('game-3-explain').style.display = "none"; 
    } else {
       document.getElementById('game-3-explain').style.display = "block";
        document.getElementById('startScreen-3').style.display = "block"; 
        document.getElementById('game3-start').style.display = "block";
    }
    
    document.getElementById('game3-next').style.display = "none";
    document.getElementById('game3-last').style.display = "none";
    
    if (round < 1) {
        document.getElementById('game-3-question').style.display = "block";
        document.getElementById('allProducts').style.display = "block";
        document.getElementById('game3-finish').style.display = "none";
        document.getElementById('game3-check').style.display = "block";
        
        
        
        //document.getElementById('game-3-status').innerHTML = "Ronde: " + round + " van de 1"
        //document.getElementById('game-3-status').style = "text-align: left;"
        rand_num = Math.floor((Math.random() * products.length));
        console.log('testing for game 3 - random num ' + rand_num);
        answer = products[rand_num][5];
        
        document.getElementById('game-3-question').innerHTML = "Welke van de onderstaande producten (1 of meer) bevatten <b>" + answer + "</b> eiwitpunten? (Klik alle producten aan)";
        
        html = '<table>' 
        for (i=0; i<products.length; i++) {
            if (i%2==0 || i==0) {
                html += "<tr>";
            } 
            
            html += `<td><button type="button" id="game-product-${i}" class="game-food-btn food-btn" onClick="clicked(${i})" value=0 style="min-height: 50px">`;
            html += `${products[i][1]} ${products[i][2]} (${products[i][3]} ${products[i][4]}) ${products[i][0]}`;
            html += '</button></td>'
            
            if (i%2!=0) {
                html += "</tr> "
            } 
            
            
            if (i==products.length-1) {
                html += '</table>'
            }
            
            
        }
        
        if (round == 0) {
                document.getElementById('game-3-play').style.display = "none";
                document.getElementById('game3-check').style.display = "none"; 
                document.getElementById('game-3-content').style.padding = "75px";
            } else {
               document.getElementById('game-3-content').style.padding = "40px"; 
            }
            
        round += 1;
        
        console.log(html);
        document.getElementById('allProducts').innerHTML = html;
        
        //make buttons per row equal height
        setTimeout(function(){for (i=0;i<9;i+=2){
            console.log(document.getElementById('game-product-' + i).offsetHeight, document.getElementById('game-product-' + (i+1)).offsetHeight)
            if (document.getElementById('game-product-' + i).offsetHeight > document.getElementById('game-product-' + (i+1)).offsetHeight) {
                document.getElementById('game-product-' + (i+1)).style.height = document.getElementById('game-product-' + i).offsetHeight
            } else if (document.getElementById('game-product-' + i).offsetHeight < document.getElementById('game-product-' + (i+1)).offsetHeight) {
                document.getElementById('game-product-' + i).style.height = document.getElementById('game-product-' + (i+1)).offsetHeight
            }
        }}, 500);
        
        
    } else {
        document.getElementById('game-3-status').style.textAlign = "left";
        if (aanspreekvorm == "formeel") {
            document.getElementById('game-3-status').innerHTML = "Gefeliciteerd, uw score voor dit spel is: " + tempScore + " spelpunten.";
        } else {
            document.getElementById('game-3-status').innerHTML = "Gefeliciteerd, jouw score voor dit spel is: " + tempScore + " spelpunten.";
        }
        
        document.getElementById('game-3-question').style.display = "none";
        document.getElementById('game3-last').style.display = "none";
        
        round = 0;
        productsList = [];
        
        document.getElementById('allProducts').innerHTML = "";
        document.getElementById('allProducts').style.display = "none";
        document.getElementById('game3-check').style.display = "none";
        document.getElementById('game3-finish').style.display = "block";
        document.getElementById('game-3-content').style.padding = "1rem";
        
        score(tempScore);
        
        addLog(new Date().toLocaleString('en-US'), 'user', 'mini-game', 'finish', namesMiniGames[2], tempScore);
        
        tempScore = 0;
        
        document.getElementById('mini-game-3-modal').classList.remove('mini-game-background');
        document.getElementById('mini-game-3-title').classList.remove('mini-game-title');
        document.getElementById('game-3-content').classList.remove('mini-game-content');
        document.getElementById('mini-game-3-footer').classList.remove('mini-game-footer');
    }
    
}

function playTapThePairs(products) {
    //play the game tap the pairs
    $('#game-4').modal({
                show: true,
                backdrop: "static"
    });
			
	screenOpen = true;
    
    document.getElementById('mini-game-4-modal').classList.add('mini-game-large-background');
    document.getElementById('mini-game-4-title').classList.add('mini-game-title');
    document.getElementById('game-4-content').classList.add('mini-game-large-content');
    document.getElementById('mini-game-4-footer').classList.add('mini-game-footer');
    
    document.getElementById('game-4-question').style.display = "block";

    if (round >= 1) {
        document.getElementById('game-4-explain').style.display = "none"; 
    } else {
       document.getElementById('game-4-explain').style.display = "block"; 
        document.getElementById('startScreen-4').style.display = "block"; 
        document.getElementById('game4-start').style.display = "block";
    }
    
    document.getElementById('game4-next').style.display = "none";
    document.getElementById('game4-last').style.display = "none";
    document.getElementById('feedback-game4').style.display = "block";
    
    if (round < 1) {
        document.getElementById('game-4-play').style.display = "none";
        document.getElementById('game4-check').style.display = "none";   
        
        document.getElementById('feedback-game4').innerHTML = "";
        document.getElementById('game-4-question').style.display = "block";
        document.getElementById('allProducts-game4').style.display = "block";
        document.getElementById('game4-finish').style.display = "none";
        //document.getElementById('game4-check').style.display = "block";
        document.getElementById('protein-guess').style.display = "none";   
        document.getElementById('game-4-question').style.display = "block";
    
        //round += 1;
        document.getElementById('game-4-status').innerHTML = "Gevonden paren: " + round + " van de 5"
        document.getElementById('game-4-status').style = "text-align: left;"
        
        document.getElementById('game-4-question').innerHTML = "Selecteer 2 producten die dezelfde hoeveelheid eiwitten bevatten om een paar te vormen.";
        
        html = '<table>' 
        for (i=0; i<products.length; i++) {
            if (i%2==0 || i==0) {
                html += "<tr>";
            } 
            
            html += `<td><button type="button" id="game4-product-${i}" class="food-btn" onClick="clicked(${i}, 4)" value=0 style="min-height: 50px">`;
            html += `${products[i][1]} ${products[i][2]} (${products[i][3]} ${products[i][4]}) ${products[i][0]}`;
            html += '</button></td>'
            
            if (i%2!=0) {
                html += "</tr> "
            } 
            
            
            if (i==products.length-1) {
                html += '</table>'
            }
        }
        
        document.getElementById('allProducts-game4').innerHTML = html;
        
        //make buttons per row equal height and enable interaction with buttons
        setTimeout(function(){for (i=0;i<9;i+=2){
            document.getElementById('game4-product-' + i).disabled = false;
            console.log(document.getElementById('game4-product-' + i).offsetHeight, document.getElementById('game4-product-' + (i+1)).offsetHeight)
            if (document.getElementById('game4-product-' + i).offsetHeight > document.getElementById('game4-product-' + (i+1)).offsetHeight) {
                document.getElementById('game4-product-' + (i+1)).style.height = document.getElementById('game4-product-' + i).offsetHeight
            } else if (document.getElementById('game4-product-' + i).offsetHeight < document.getElementById('game4-product-' + (i+1)).offsetHeight) {
                document.getElementById('game4-product-' + i).style.height = document.getElementById('game4-product-' + (i+1)).offsetHeight
            }
        }}, 500);
        
        
    } else if (round < 5) {
        document.getElementById('game4-check').style.display = "block";
        document.getElementById('game4-next').style.display = "none";
        document.getElementById('protein-guess').style.display = "none";
        document.getElementById('game-4-question').style.display = "block";
        
    } else {
        if (aanspreekvorm == "formeel") {
            document.getElementById('game-4-status').innerHTML = "Gefeliciteerd, uw score voor dit spel is: " + tempScore + " spelpunten.";
        } else {
            document.getElementById('game-4-status').innerHTML = "Gefeliciteerd, jouw score voor dit spel is: " + tempScore + " spelpunten.";
        }
        
        document.getElementById('game-4-question').style.display = "none";
        document.getElementById('game4-last').style.display = "none";
        
        round = 0;
        productsList = [];
        answer = '';
        
        document.getElementById('allProducts-game4').style.display = "none";
        document.getElementById('game4-check').style.display = "none";
        document.getElementById('protein-guess').style.display = "none";
        document.getElementById('game-4-question').style.display = "none";
        document.getElementById('feedback-game4').style.display = "none";
        document.getElementById('game4-finish').style.display = "block";
        
        score(tempScore);
        
        addLog(new Date().toLocaleString('en-US'), 'user', 'mini-game', 'finish', namesMiniGames[3], tempScore);
        
        tempScore = 0;
        
        document.getElementById('mini-game-4-modal').classList.remove('mini-game-large-background');
        document.getElementById('mini-game-4-title').classList.remove('mini-game-title');
        document.getElementById('game-4-content').classList.remove('mini-game-large-content');
        document.getElementById('mini-game-4-footer').classList.remove('mini-game-footer');
    }    
}

function playBingo(chosen_product) {
    //play the game tap the pairs
    $('#game-5').modal({
                show: true,
                backdrop: "static"
    });
			
	screenOpen = true;
    
    document.getElementById('mini-game-5-modal').classList.add('mini-game-background');
    document.getElementById('mini-game-5-title').classList.add('mini-game-title');
    document.getElementById('game-5-content').classList.add('mini-game-bigger-content');
    document.getElementById('mini-game-5-footer').classList.add('mini-game-footer');
    
    
    document.getElementById('game5-last').style.display = "none";
    
    if (round == 0) {
        document.getElementById('feedback-game5').style.display = "block";
        
        document.getElementById('game-5-question').style.display = "block";
        document.getElementById('game-5-explain').style.display = "block";
        document.getElementById('startScreen-5').style.display = "block";
        document.getElementById('game5-start').style.display = "block";
        document.getElementById('game5-finish').style.display = "none";
        document.getElementById('bingo').style.display = "block";
        document.getElementById('game-5-status').style.textAlign = "right";
        document.getElementById('feedback-game5').innerHTML = "";
        
        document.getElementById('game-5-status').innerHTML = "Resterend aantal punten: " + points;
        
        bingoHTML = '<table>';
        for (i=0;i<9;i++){
            if (i==0 || i%3==0) {
                bingoHTML += "<tr><td><button type='button' id='bingo-" + i + "' class='bingo-btn' onClick='clicked(" + i + ", 5)' value=0 style='min-height: 50px'>" + bingoValues[i] + "</button></td>";
            } else if (i==2 || i==5 || i==8) {
                bingoHTML += "<td><button type='button' id='bingo-" + i + "' class='bingo-btn' onClick='clicked(" + i + ", 5)' value=0 style='min-height: 50px'>" + bingoValues[i] + "</button></td></tr>";       
            } else {
                bingoHTML += "<td><button type='button' id='bingo-" + i + "' class='bingo-btn' onClick='clicked(" + i + ", 5)' value=0 style='min-height: 50px'>" + bingoValues[i] + "</button></td>";
            }
        }
        bingoHTML += "</table>"
        document.getElementById('bingo').innerHTML = bingoHTML; 
        
        document.getElementById('game-5-play').style.display = 'none';
        
        round += 1;
    } if (round == 1) {
        if (points > 0 ) { // you play until you have 0 points or you have bingo
            document.getElementById('game-5-question').innerHTML = `<p>Nieuw bingoproduct: </br><b>${chosen_product[1]} ${chosen_product[2]} (${chosen_product[3]} ${chosen_product[4]}) ${chosen_product[0]}</b></p>`; //commented out temp <button type="button" class="choice-foodbox-btn btn btn-primary" id="game5-next" onClick="checkAnswer('5a')">Volgende product</button> -->
            
            answer = chosen_product[5];
        } else {
            //game over!
            if (aanspreekvorm == "formeel") {
                document.getElementById('game-5-status').innerHTML = "Helaas, u hebt geen punten meer over. Het spel is nu afgelopen." ;
            } else {
                document.getElementById('game-5-status').innerHTML = "Helaas, je hebt geen punten meer over. Het spel is nu afgelopen.";
            }
            gameOverSound.play();
            document.getElementById('game-5-status').style.textAlign = "left";
        
            document.getElementById('game-5-question').style.display = "none";
            document.getElementById('game-5-explain').style.display = "none";
            document.getElementById('bingo').style.display = "none";

            round = 0;
            answer = '';
            played_products_condition = ""; 

            document.getElementById('game5-finish').style.display = "block";
            document.getElementById('feedback-game5').style.display = "none";

            addLog(new Date().toLocaleString('en-US'), 'user', 'mini-game', 'finish', namesMiniGames[4], points);

            points = 10;

            document.getElementById('mini-game-5-modal').classList.remove('mini-game-background');
            document.getElementById('mini-game-5-title').classList.remove('mini-game-title');
            document.getElementById('game-5-content').classList.remove('mini-game-bigger-content');
            document.getElementById('mini-game-5-footer').classList.remove('mini-game-footer');
        }
    } else {
        if (aanspreekvorm == "formeel") {
                document.getElementById('game-5-status').innerHTML = "Bingo! Uw score voor dit spel is: " +points + " spelpunten.";
            } else {
                document.getElementById('game-5-status').innerHTML = "Bingo! Jouw score voor dit spel is: " + points + " spelpunten.";
            }
            bingoSound.play();
            document.getElementById('game-5-status').style.textAlign = "left";
        
            document.getElementById('game-5-question').style.display = "none";
            document.getElementById('game-5-explain').style.display = "none";
            document.getElementById('bingo').style.display = "none";
            document.getElementById('feedback-game5').style.display = "none";

            round = 0;
            answer = '';
            played_products_condition = ""; 

            document.getElementById('game5-finish').style.display = "block";
            document.getElementById('feedback-game5').style.display = "none";
        
            score(points);

            addLog(new Date().toLocaleString('en-US'), 'user', 'mini-game', 'finish', namesMiniGames[4], points);

            points = 10;

            document.getElementById('mini-game-5-modal').classList.remove('mini-game-background');
            document.getElementById('mini-game-5-title').classList.remove('mini-game-title');
            document.getElementById('game-5-content').classList.remove('mini-game-bigger-content');
            document.getElementById('mini-game-5-footer').classList.remove('mini-game-footer');
    }

}


function clicked(id, game) {
    if (game == undefined) {
        id = "game-product-" + id;
    } else if (game == 5) {
        answerI = id;
        id = "bingo-" + id; 
    }
    else {
        id = "game" + game + "-product-" + id;
    }
    
    if (document.getElementById(id).value == 0) {
        document.getElementById(id).style.backgroundColor = '#858483';
        document.getElementById(id).value = 1;
    } else {
        document.getElementById(id).style.backgroundColor = '#e8eef7';
        document.getElementById(id).value = 0;  
    }
    
    if (game == 5) {
        checkAnswer(5, answerI);
    }
}


var productsList = [];

function tempSave(game, prod){
    if (game == 2) {
        productsList.push(prod);
        if (productsList.length != 2) {
            getRandomProduct(2, `AND protein_points BETWEEN ${prod[5] - 1.5} AND ${prod[5] + 1.5} AND protein_points != ${prod[5]} AND name != "${prod[0]}"`); //points within 1.5 range, not equal, not the same
        } else {
            playHighLow(productsList);
        }
    }
    
    if (game == 3) {
        productsList.push(prod);
        if (productsList.length != 10) {
            played_products_condition += ` AND name != "${prod[0]}"`;
            getRandomProduct(3, played_products_condition); //not the same product
        } else {
            played_products_condition = '';
            playSelectProducts(productsList);
        }
    }
    
    if (game == 4) {
        productsList.push(prod);
        if (productsList.length != 10){
            played_products_condition += ` AND name != "${prod[0]}"`;
            if (productsList.length % 2 != 0) {
                //er moet een paar worden gevormd, niet hetzelfde product!
                getRandomProduct(4, ` AND name != "${prod[0]}" AND protein_points == "${prod[5]}"`)
                played_products_condition +=  `AND protein_points != "${prod[5]}"`;
            } else {
                //zorg dat er iets wordt gekozen met een aantal punten dat nog niet gebruikt is
                getRandomProduct(4, played_products_condition + ' AND ' + pointsWithPairsCondition);
            }
        } else {
            played_products_condition = '';
            playTapThePairs(shuffle(productsList));
        }
    }
}

function checkAnswer(game, answerI){
    switch(game) {
        case 1:
            answerPlayer = parseFloat(document.getElementById('answer1').innerHTML.split(' ')[0])
            if (answerPlayer == answer) {
                console.log('Exactly right!');
                
                //set answer text
                if (aanspreekvorm == "formeel") {
                    document.getElementById('game-1-answer').innerHTML = "<h4 style='text-align:center'>Antwoord: " + answerPlayer + " eiwitpunten</h4>" + "<p>Uw antwoord is juist!</p>";
                } else {
                    document.getElementById('game-1-answer').innerHTML = "<h4 style='text-align:center'>Antwoord: " + answerPlayer + " eiwitpunten</h4>" + "<p>Jouw antwoord is juist!</p>";
                }
                document.getElementById('game-1-answer').style.color = "green";
                rightSound.play();
                
                tempScore += 2;
            } else if (Math.abs(answerPlayer - answer) == 0.5) {
                tempScore += 1;
                console.log('Almost correct answer!');
                
                //set answer text
                if (aanspreekvorm == "formeel") {
                    document.getElementById('game-1-answer').innerHTML = "<h4 style='text-align:center'>Antwoord: " + answerPlayer + " eiwitpunten</h4>" + "<p>Uw antwoord is bijna goed! Het juiste antwoord was: " + answer + " eiwitpunten </p>";
                } else {
                    document.getElementById('game-1-answer').innerHTML = "<h4 style='text-align:center'>Antwoord: " + answerPlayer + " eiwitpunten</h4>" + "<p>Jouw antwoord is bijna goed! Het juiste antwoord was: " + answer + " eiwitpunten </p>";
                }
                document.getElementById('game-1-answer').style.color = "orange";
                rightSound.play();
                
            } else {
                console.log('Wrong answer :(');
                
                //set answer text
                if (aanspreekvorm == "formeel") {
                    document.getElementById('game-1-answer').innerHTML = "<h4 style='text-align:center'>Antwoord: " + answerPlayer + " eiwitpunten</h4>" + "<p>Uw antwoord is fout. Het juiste antwoord was: " + answer + " eiwitpunten </p>";
                } else {
                    document.getElementById('game-1-answer').innerHTML = "<h4 style='text-align:center'>Antwoord: " + answerPlayer + " eiwitpunten</h4>" + "<p>Jouw antwoord is fout. Het juiste antwoord was: " + answer + " eiwitpunten </p>";
                }
                document.getElementById('game-1-answer').style.color = "red";
                wrongSound.play();
            }
            
            document.getElementById('game-1-answer').style.display = "block";
            document.getElementById('game1-check').style.display = "none";
            
            if (round < 5) {
                document.getElementById('game1-next').style.display = "block";
            } else {
                document.getElementById('game1-last').style.display = "block";
            }
            
            document.getElementById('pointsGuess').style.display = "none";
            
            //miniGames(1);
            break;
        case 2:
            if (type == "meeste") {
                if (answerI == 0) {
                    if (productsList[0][5] > productsList[1][5]) {
                        console.log("Right answer");
                        tempScore += 1 //answer correct
                        
                        //set answer text
                        if (aanspreekvorm == "formeel") {
                            document.getElementById('game-2-answer').innerHTML = "<h4 style='text-align:center'>Antwoord: " + productsList[0][0] + "</h4>" + "<p>Uw antwoord is juist!</p><p>" + productsList[0][0] + " = " + productsList[0][5] + " eiwitpunten<br> " + productsList[1][0] + " = " + productsList[1][5] + " eiwitpunten</p>";
                        } else {
                            document.getElementById('game-2-answer').innerHTML = "<h4 style='text-align:center'>Antwoord: " + productsList[0][0] + "</h4>" + "<p>Jouw antwoord is juist!</p><p>"+ productsList[0][0] + " = " + productsList[0][5] + " eiwitpunten<br> " + productsList[1][0] + " = " + productsList[1][5] + " eiwitpunten</p>";
                        }
                        document.getElementById('game-2-answer').style.color = "green";
                        rightSound.play();
                    } else {
                        //set answer text
                        if (aanspreekvorm == "formeel") {
                            document.getElementById('game-2-answer').innerHTML = "<h4 style='text-align:center'>Antwoord: " + productsList[0][0] + "</h4>" + "<p>Uw antwoord is fout. </p><p>"+ productsList[0][0] + " = " + productsList[0][5] + " eiwitpunten<br> " + productsList[1][0] + " = " + productsList[1][5] + " eiwitpunten</p>";
                        } else {
                            document.getElementById('game-2-answer').innerHTML = "<h4 style='text-align:center'>Antwoord: " + productsList[0][0] + "</h4>" + "<p>Jouw antwoord is fout.</p><p>" + productsList[0][0] + " = " + productsList[0][5] + " eiwitpunten<br> " + productsList[1][0] + " = " + productsList[1][5] + " eiwitpunten</p>";
                        }
                        document.getElementById('game-2-answer').style.color = "red";
                        wrongSound.play();
                    }
                } else {
                    if (productsList[1][5] > productsList[0][5]) {
                        console.log("Right answer");
                        tempScore += 1 //answer correct
                        
                        //set answer text
                        if (aanspreekvorm == "formeel") {
                            document.getElementById('game-2-answer').innerHTML = "<h4 style='text-align:center'>Antwoord: " + productsList[1][0] + "</h4>" + "<p>Uw antwoord is juist!</p><p>" + productsList[0][0] + " = " + productsList[0][5] + " eiwitpunten<br> " + productsList[1][0] + " = " + productsList[1][5] + " eiwitpunten</p>";
                        } else {
                            document.getElementById('game-2-answer').innerHTML = "<h4 style='text-align:center'>Antwoord: " + productsList[1][0] + "</h4>" + "<p>Jouw antwoord is juist!</p><p>" + productsList[0][0] + " = " + productsList[0][5] + " eiwitpunten<br> " + productsList[1][0] + " = " + productsList[1][5] + " eiwitpunten</p>";
                        }
                        document.getElementById('game-2-answer').style.color = "green";
                        rightSound.play();
                    } else {
                        //set answer text
                        if (aanspreekvorm == "formeel") {
                            document.getElementById('game-2-answer').innerHTML = "<h4 style='text-align:center'>Antwoord: " + productsList[1][0] + "</h4>" + "<p>Uw antwoord is fout. </p><p>"  + productsList[0][0] + " = " + productsList[0][5] + " eiwitpunten<br> " + productsList[1][0] + " = " + productsList[1][5] + " eiwitpunten</p>";
                        } else {
                            document.getElementById('game-2-answer').innerHTML = "<h4 style='text-align:center'>Antwoord: " + productsList[1][0] + "</h4>" + "<p>Jouw antwoord is fout.</p><p>" + productsList[0][0] + " = " + productsList[0][5] + " eiwitpunten<br> " + productsList[1][0] + " = " + productsList[1][5] + " eiwitpunten</p>";
                        }
                        document.getElementById('game-2-answer').style.color = "red";
                        wrongSound.play();
                    }
                }
            } 
            if (type == "minste") {
                if (answerI == 0) {
                    if (productsList[0][5] < productsList[1][5]) {
                        console.log("Right answer");
                        tempScore += 1 //answer correct
                        
                        //set answer text
                        if (aanspreekvorm == "formeel") {
                            document.getElementById('game-2-answer').innerHTML = "<h4 style='text-align:center'>Antwoord: " + productsList[0][0] + "</h4>" + "<p>Uw antwoord is juist!</p><p>" + productsList[0][0] + " = " + productsList[0][5] + " eiwitpunten<br> " + productsList[1][0] + " = " + productsList[1][5] + " eiwitpunten</p>";
                        } else {
                            document.getElementById('game-2-answer').innerHTML = "<h4 style='text-align:center'>Antwoord: " + productsList[0][0] + "</h4>" + "<p>Jouw antwoord is juist!</p><p>" + productsList[0][0] + " = " + productsList[0][5] + " eiwitpunten<br> " + productsList[1][0] + " = " + productsList[1][5] + " eiwitpunten</p>";
                        }
                        document.getElementById('game-2-answer').style.color = "green";
                        rightSound.play();
                    } else {
                        //set answer text
                        if (aanspreekvorm == "formeel") {
                            document.getElementById('game-2-answer').innerHTML = "<h4 style='text-align:center'>Antwoord: " + productsList[0][0] + "</h4>" + "<p>Uw antwoord is fout.</p><p>" + productsList[0][0] + " = " + productsList[0][5] + " eiwitpunten<br> " + productsList[1][0] + " = " + productsList[1][5] + " eiwitpunten</p>";
                        } else {
                            document.getElementById('game-2-answer').innerHTML = "<h4 style='text-align:center'>Antwoord: " + productsList[0][0] + "</h4>" + "<p>Jouw antwoord is fout.</p><p>" + productsList[0][0] + " = " + productsList[0][5] + " eiwitpunten<br> " + productsList[1][0] + " = " + productsList[1][5] + " eiwitpunten</p>";
                        }
                        document.getElementById('game-2-answer').style.color = "red";
                        wrongSound.play();
                    }
                } else {
                    if (productsList[1][5] < productsList[0][5]) {
                        console.log("Right answer");
                        tempScore += 1 //answer correct
                        
                        //set answer text
                        if (aanspreekvorm == "formeel") {
                            document.getElementById('game-2-answer').innerHTML = "<h4 style='text-align:center'>Antwoord: " + productsList[1][0] + "</h4>" + "<p>Uw antwoord is juist!</p><p>" + productsList[0][0] + " = " + productsList[0][5] + " eiwitpunten<br> " + productsList[1][0] + " = " + productsList[1][5] + " eiwitpunten</p>";
                        } else {
                            document.getElementById('game-2-answer').innerHTML = "<h4 style='text-align:center'>Antwoord: " + productsList[1][0] + "</h4>" + "<p>Jouw antwoord is juist!</p><p>" + productsList[0][0] + " = " + productsList[0][5] + " eiwitpunten<br> " + productsList[1][0] + " = " + productsList[1][5] + " eiwitpunten</p>";
                        }
                        document.getElementById('game-2-answer').style.color = "green";
                        rightSound.play();
                    } else {
                        //set answer text
                        if (aanspreekvorm == "formeel") {
                            document.getElementById('game-2-answer').innerHTML = "<h4 style='text-align:center'>Antwoord: " + productsList[1][0] + "</h4>" + "<p>Uw antwoord is fout.</p><p>" + productsList[0][0] + " = " + productsList[0][5] + " eiwitpunten<br> " + productsList[1][0] + " = " + productsList[1][5] + " eiwitpunten</p>";
                        } else {
                            document.getElementById('game-2-answer').innerHTML = "<h4 style='text-align:center'>Antwoord: " + productsList[1][0] + "</h4>" + "<p>Jouw antwoord is fout.</p><p>" + productsList[0][0] + " = " + productsList[0][5] + " eiwitpunten<br> " + productsList[1][0] + " = " + productsList[1][5] + " eiwitpunten</p>";
                        }
                        document.getElementById('game-2-answer').style.color = "red";
                        wrongSound.play();
                    }
                }
            }
            productsList = [];
            
            document.getElementById('game-2-answer').style.display = "block";
            document.getElementById('productsGuess').style.display = "none";
            
            if (round < 10) {
                document.getElementById('game2-next').style.display = "block";
            } else {
                document.getElementById('game2-last').style.display = "block";
            }
            
            //miniGames(2);
            break;
        case 3:
            tempScore += 10;
            for (i=0;i<10;i++) {
                if (document.getElementById('game-product-' + i).value == 1) {
                    if (answer != productsList[i][5]) {
                        tempScore -= 1;
                        console.log("klopt niet dat je dit hebt aangeklikt: " + i);
                        document.getElementById('game-product-' + i).style.color = "red";
                        document.getElementById('game-product-' + i).innerHTML = document.getElementById('game-product-' + i).innerHTML + "<br><i> " + productsList[i][5] + " eiwitpunten.</i>"
                    } else {
                        document.getElementById('game-product-' + i).style.color = "green";
                        document.getElementById('game-product-' + i).innerHTML = "<b>" + document.getElementById('game-product-' + i).innerHTML + "</b>"
                    }
                } else {
                   if (answer == productsList[i][5]) {
                        tempScore -= 1;
                        console.log("deze had je moeten aanklikken: "  + i);
                        document.getElementById('game-product-' + i).style.color = "red";
                        document.getElementById('game-product-' + i).innerHTML = "<b>" + document.getElementById('game-product-' + i).innerHTML + "</b>"
                        //document.getElementById('game-product-' + i).innerHTML = document.getElementById('game-product-' + i).innerHTML + "<i> " + productsList[i][5] + " eiwitpunten.</i>"
                    }  else {
                        document.getElementById('game-product-' + i).style.color = "green";
                        document.getElementById('game-product-' + i).style.opacity = 0.5;
                        document.getElementById('game-product-' + i).innerHTML = document.getElementById('game-product-' + i).innerHTML + "<br><i> " + productsList[i][5] + " eiwitpunten.</i>"
                    }
                } 
                
                document.getElementById('game-product-' + i).disabled = true;
            }
            
            
            
            //right sound if at least half of the answers are correct, wrong sound otherwise
            if (tempScore >= 5) {
                rightSound.play();
            } else {
                wrongSound.play();
            }
            document.getElementById('game3-last').style.display = "block";
            document.getElementById('game3-check').style.display = "none";
            document.getElementById('game-3-feedback').style.display = "block";
            document.getElementById('game-3-question').innerHTML = "Welke van de onderstaande producten bevatten <b>" + answer + "</b> eiwitpunten?"
            document.getElementById('game-3-explain').style.display = "none";
            
            productsList = [];
            //miniGames(3);
            break;
        case '4a':
            //check if pair is correct
            pair = [];
            
            for (i=0;i<10;i++) {
                if (document.getElementById('game4-product-' + i).value == 1) {
                    pair.push(productsList[i]);
                }
            }
            if (pair.length < 2) {
                document.getElementById('feedback-game4').innerHTML = "Er zijn niet genoeg producten geselecteerd.";
                document.getElementById('feedback-game4').style.color = "orange";
            } else if (pair.length > 2) {
                document.getElementById('feedback-game4').innerHTML = "Er zijn teveel producten geselecteerd.";
                document.getElementById('feedback-game4').style.color = "orange";
            } else {
                if (pair[0][5] == pair[1][5]) {
                    document.getElementById('feedback-game4').innerHTML = "Er is een juist paar gevormd!";
                    document.getElementById('feedback-game4').style.color = "green";
                    rightSound.play();
                    tempScore += 1;
                    round += 1;
                    document.getElementById('game-4-status').innerHTML = "Gevonden paren: " + round + " van de 5"
                    answer = pair[0][5];
                    document.getElementById('answer-game4').innerHTML = '0 eiwitpunten';
                    document.getElementById('protein-guess').style.display = "block";
                    document.getElementById('game-4-question').style.display = "none";
                    document.getElementById('game4-check').style.display = "none";
                    document.getElementById('game4-next').style.display = "block";
                    
                    for (i=0;i<10;i++) {
                        if (document.getElementById('game4-product-' + i).value == 1) {
                            document.getElementById('game4-product-' + i).value = 2;
                            //document.getElementById('game4-product-' + i).disabled = true;
                        }
                    }
                    $('#allProducts-game4').find('input, textarea, button, select').attr('disabled', true);
                    
                } else {
                    document.getElementById('feedback-game4').innerHTML = "Het gevormde paar is onjuist.";
                    document.getElementById('feedback-game4').style.color = "red";
                    wrongSound.play()
                }
            }            
            break;
        case '4b':
            //check if proteins is correct
            if (parseFloat(document.getElementById('answer-game4').innerHTML.split(' ')[0]) == answer) {
                document.getElementById('feedback-game4').innerHTML = "Het antwoord is juist.";
                document.getElementById('feedback-game4').style.color = "green";
                rightSound.play();
                tempScore += 1;
            } else {
                document.getElementById('feedback-game4').innerHTML = "Het antwoord is fout. Het juiste antwoord was " + answer + " eiwitpunten";
                document.getElementById('feedback-game4').style.color = "red";
                wrongSound.play();
            }
            
            $('#allProducts-game4').find('input, textarea, button, select').attr('disabled', false);
            for (i=0;i<10;i++){
                if (document.getElementById('game4-product-' + i).value == 2) {
                    document.getElementById('game4-product-' + i).style.backgroundColor = 'green';
                    document.getElementById('game4-product-' + i).disabled = true;
                }
            }
            
            if (round == 5) {
                document.getElementById('game4-last').style.display = "block";
                document.getElementById('game4-next').style.display = "none";
            } else {
                playTapThePairs(productsList);    
            }
            break;
        case 5: //check if right number is clicked
            console.log(answerI, answer);
            if (bingoValues[answerI] == answer) {
                document.getElementById('feedback-game5').style.color = "green";
                document.getElementById('feedback-game5').innerHTML = "Het antwoord is juist.";
                rightSound.play();
                document.getElementById('bingo-' + answerI).disabled = true;
            } else {
                document.getElementById('feedback-game5').innerHTML = "Het antwoord is fout. Het juiste antwoord was " + answer + " eiwitpunten voor " +            document.getElementById('game-5-question').innerHTML.split('<b>')[1].split('</b>')[0];
                document.getElementById('feedback-game5').style.color = "red";
                wrongSound.play();
                document.getElementById('bingo-' + answerI).style.backgroundColor = '#e8eef7';
                document.getElementById('bingo-' + answerI).value = 0;
                points -= 1;
            }
            
            if (checkBingo()) {
                round += 1;
                console.log('bingo!');
            } else {
                checkAvailableValuesBingo();
            }
            
            document.getElementById('game-5-status').innerHTML = "Resterend aantal punten: " + points;
            
            if (points > 0) {
                miniGames(5);
            } else {
                for (i=0; i<bingoValues.length; i++) {
                    document.getElementById('bingo-' + i).disabled = true;
                }
                document.getElementById('game5-last').style.display = "block";
            }
            
            break;
            
        /*case '5a': //'volgende product check'
            if (checkSkip()){
                document.getElementById('feedback-game5').style.color = "green";
                document.getElementById('feedback-game5').innerHTML = "Correct overgeslagen.";
                rightSound.play();
            } else {
                document.getElementById('feedback-game5').innerHTML = "Onterecht overgeslagen. Het juiste antwoord was " + answer + " eiwitpunten";
                document.getElementById('feedback-game5').style.color = "red";
                wrongSound.play();
                points -= 1;
            }
            miniGames(5); */
            
    }
}

function checkBingo() {
    for (i=0;i<9;i++){
        if (document.getElementById('bingo-' + i).value != 1) {
            return false;
        }
    }
    return true;
}

function checkAvailableValuesBingo() {
    temp_values = [];
    availableValues = 'AND protein_points IN (';
    for (i=0;i<9;i++){
        if (document.getElementById('bingo-' + i).value != 1) {
            if (temp_values.indexOf(parseFloat(document.getElementById('bingo-' + i).innerHTML)) < 0) {
                if (temp_values.length != 0) {
                    availableValues += ", "
                }
                temp_values.push(parseFloat(document.getElementById('bingo-' + i).innerHTML))
                availableValues += parseFloat(document.getElementById('bingo-' + i).innerHTML);
                
            }
        }
    }
    availableValues += ')';
    
}
            
function checkSkip() {
    for (i=0;i<9;i++){
        if (document.getElementById('bingo-' + i).value == 0) { // unclicked button
            if (bingoValues[i] == answer) { //possible right answer
                return false;
            }
        }
    }
    return true;
}

function substractAnswer(id) {
    if (parseFloat(document.getElementById(id).innerHTML) > 0) {
        document.getElementById(id).innerHTML = parseFloat(document.getElementById(id).innerHTML) - 0.5 + " eiwitpunten"; 
    }
}

function addAnswer(id) {
    document.getElementById(id).innerHTML = parseFloat(document.getElementById(id).innerHTML) + 0.5 + " eiwitpunten"; 
}

function flowerGarden() {
    if (gamesScore >= levelsFlowerGarden[stageFlowerGarden]) {
        stageFlowerGarden += 1;
        //showGardenImprovement();
        if (tempNewGardenElement) {
            newGardenElement = true;
        }
        
        
            if (stageFlowerGarden == 2) {
                document.getElementById('flowers').style.bottom = "110px";
            }
        
            if (stageFlowerGarden == 9) {
                document.getElementById('flowers').style.bottom = "97px";
            } 

            if (stageFlowerGarden == 33) {
                document.getElementById('flowers').style.bottom = "85px";
            }


            if (stageFlowerGarden < 4) {
                 document.getElementById("flower_garden").innerHTML = '<img src="images/flower_garden/flower_stage' + stageFlowerGarden + '.png"  />'
            } else {
                 document.getElementById("flower_garden").innerHTML = '<img src="images/flower_garden/flower_stage' + stageFlowerGarden + '.png" width="100%" />'
            }
        
    }   
    
    if (gamesScore >= levelsFlowerGarden[stageFlowerGarden]) { flowerGarden() } else {
        tempNewGardenElement = true;
    }
   
}


function show_miniGameChoice() {
    console.log(greenInput, newInput)
    if (greenInput && newInput) {
        gameToStart = Math.floor((Math.random() * 5) + 1);
        
        $('#miniGameChoice').modal({
                show: true,
                backdrop: "static"
            });
			
        screenOpen = true;
        
        resetGame(gameToStart);
        
        if (aanspreekvorm == "formeel") {
            document.getElementById("mini-game-choice-content").innerHTML = "Goed zo! U heeft genoeg eiwitpunten ingevoerd voor dit eetmoment. U mag daarom een mini-game spelen. Speelt u mee een spelletje '" + namesMiniGames[gameToStart-1] + "'?";
        } else {
            document.getElementById("mini-game-choice-content").innerHTML = "Goed zo! Je hebt genoeg eiwitpunten ingevoerd voor dit eetmoment. Je mag daarom een mini-game spelen. Speel je mee een spelletje '" + namesMiniGames[gameToStart-1] + "'?";
        }
        
    } 
    
    // als er een nieuwe input is gedaan, en dus niet ingelezen uit de database; update profiel
    else if (newInput) {
        updateProfileValues();
    }
    
    newInput = true; //reset

}

function showGardenImprovement() {
    $('#garden-modal').modal({
                    show: true,
                    backdrop: "static"
                });

    screenOpen = true;
    
    achievementSound.play();
    
    addLog(new Date().toLocaleString('en-US'), 'system', 'notification-garden', 'shown', 'garden improved, level: ' + stageFlowerGarden);
    
    if (levelsFlowerGarden.length != 0){
        if (aanspreekvorm == "formeel") {
            var message = "<h4>Gefeliciteerd!</h4> Door " + gamesScore + " spelpunten te verdienen met het spelen van mini-games, heeft u uw tuin verder verbeterd! Verdien nog " + (levelsFlowerGarden[stageFlowerGarden] - gamesScore) + " spelpunten om uw tuin verder te verbeteren."
        } else {
            var message = "<h4>Gefeliciteerd!</h4> Door " + gamesScore + " spelpunten te verdienen met het spelen van mini-games, heb je jouw tuin verder verbeterd! Verdien nog " + (levelsFlowerGarden[stageFlowerGarden] - gamesScore) + " spelpunten om je tuin verder te verbeteren."
        }
    } else {
        if (aanspreekvorm == "formeel") {
            var message = "<h4>Gefeliciteerd!</h4> Uw tuin is volledig verbeterd!"
        } else {
            var message = "<h4>Gefeliciteerd!</h4> Je tuin is volledig verbeterd!"
        }
    }
    
    document.getElementById('garden-modal-content').innerHTML = message;
    newGardenElement = false;
}

function closeMiniGame() {
    if (newGardenElement) {
        showGardenImprovement(); //show improvement message
    } else {
        //findStartDate(); //start updating profile information and check achievements
        // update profiel
    
        updateProfileValues();
        
    }
}

function resetGame(game) {
    round = 0;
    tempScore = 0;
    
    switch (game){
        case 1:
            played_products_condition = "";
            break;
        case 2:
            productsList = [];
            break;
        case 3: 
            productsList = [];
            break;
        case 4:
            productsList = [];
            answer = '';
            break;
        case 5:
            answer = '';
            points = 10;
            played_products_condition = "";
        default:
            break;
    }
}

function skipGame(g) {
    addLog(new Date().toLocaleString('en-US'), 'user', 'mini-game', 'skip', namesMiniGames[g-1]);
    closeAllScreens();
    // update profiel
    
    console.log('start test here')
    updateProfileValues();
    
    //findStartDate();
}

function playGames(g) {
    addLog(new Date().toLocaleString('en-US'), 'user', 'mini-game', 'start', namesMiniGames[g-1]);
    miniGames(g);
}

function closeExplanation(game) {
    switch (game) {
        case 1:
            document.getElementById('startScreen-1').style.display = "none"; 
            document.getElementById('game-1-play').style.display = "block"; 
            document.getElementById('game1-check').style.display = "block";
            document.getElementById('game1-start').style.display = "none";
            break;
        case 2:
            document.getElementById('startScreen-2').style.display = "none"; 
            document.getElementById('game-2-play').style.display = "block";
            document.getElementById('game2-start').style.display = "none";
            break;
         case 3:
            document.getElementById('startScreen-3').style.display = "none"; 
            document.getElementById('game-3-play').style.display = "block"; 
            document.getElementById('game3-check').style.display = "block";
            document.getElementById('game3-start').style.display = "none";
            document.getElementById('game-3-content').style.padding = "40px";
            break;  
        case 4: 
            document.getElementById('startScreen-4').style.display = "none"; 
            document.getElementById('game-4-play').style.display = "block";
            document.getElementById('game4-start').style.display = "none";
            document.getElementById('game4-check').style.display = "block";
            break;
        case 5:
            document.getElementById('startScreen-5').style.display = "none"; 
            document.getElementById('game-5-play').style.display = "block";
            document.getElementById('game5-start').style.display = "none";
        default:
            break;
    }
}

//function found on internet
function shuffle(arra1) {
    var ctr = arra1.length, temp, index;

// While there are elements in the array
    while (ctr > 0) {
// Pick a random index
        index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
        ctr--;
// And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}