//achievement thresholds
var daysAchThresholds = [];
var momentsAchThresholds = [];
var proteinAchThresholds = [];

function getAchThresholds() {

    if (!databaseBusy) {
        
        databaseBusy = true;
    
        //select only achievements that are not achieved yet
        query = `SELECT threshold, type FROM achievements WHERE ordering == 0;`; //not include general categories

        db.transaction(function(transaction) {
         transaction.executeSql(query, [ ],
         function(tx, result) {
             for (i=0; i<result.rows.length; i++){
                 switch (result.rows.item(i).type) {
                     case "days":
                         daysAchThresholds.push(result.rows.item(i).threshold);
                         break;
                     case "moments":
                         momentsAchThresholds.push(result.rows.item(i).threshold);
                         break;
                     case "points":
                         proteinAchThresholds.push(result.rows.item(i).threshold);
                         break;
                     default:
                         break;

                 }
             }
             daysAchThresholds.sort((a,b) => a - b);
             momentsAchThresholds.sort((a,b) => a - b);
             proteinAchThresholds.sort((a,b) => a - b);

             databaseBusy = false;
         },
         function(error) {
             console.log("ERROR ACHIEVEMENTS");
         });
      });
    } else {
        setTimeout(getAchThresholds, 1000);
    }
}

function checkNewAchievement() {
    achieved = 0;
    if (aanspreekvorm == "formeel") {
        query = `SELECT id, description_formal, type FROM achievements `;
    } else {
        query = `SELECT id, description_informal, type FROM achievements `;
    }
    where = `WHERE `;
    temp_achieved = 0;
    
    for (i=0; i<daysAchThresholds.length; i++) {
        if (totalDaysData >= daysAchThresholds[i]) {
            console.log('new day achievement!');
            if (achieved > 0) {
                where += "OR ";
            }
            where += `(type="days" AND threshold==${daysAchThresholds[i]}) `
            achieved += 1;
            temp_achieved += 1;
            
        } else {
            break;
        }
    }
    for (i=0;i<temp_achieved; i++) { daysAchThresholds.shift(); }
    
    temp_achieved = 0;
    for (i=0; i<momentsAchThresholds.length; i++) {
        if (totalMomentsData >= momentsAchThresholds[i]) {
            console.log('new moment achievement!');
            if (achieved > 0) {
                where += "OR ";
            }
            where += `(type="moments" AND threshold==${momentsAchThresholds[i]}) `
            achieved += 1;
            temp_achieved += 1;
            
        } else {
            break;
        }
    }
    for (i=0;i<temp_achieved; i++) { momentsAchThresholds.shift(); }
    
    temp_achieved = 0;
    for (i=0; i<proteinAchThresholds.length; i++) { 
        if (totalProteinData >= proteinAchThresholds[i]) {
            console.log('new protein achievement!');
            if (achieved > 0) {
                where += "OR ";
            }
            where += `(type="points" AND threshold==${proteinAchThresholds[i]}) `
            achieved += 1;
            temp_achieved += 1;
            
        } else {
            break;
        }
    }
    for (i=0;i<temp_achieved; i++) { proteinAchThresholds.shift(); }
    
    console.log(query + where);
    if (achieved > 0) {
        searchAchievements(query + where + "ORDER BY threshold");
    } else {
        //closeAllScreens(); //make sure that all screens are closed, in case of a mini game
        $('.modal').modal('hide');
		screenOpen = false;
    }
    
}

function searchAchievements(query) {

    idsAchievements = [];
    descriptionsList = [];
    types = [];
    
    if (!databaseBusy) {
    
        db.transaction(function(transaction) {
            transaction.executeSql(query, [ ],
                function(tx, result) {

                    for (i=0; i<result.rows.length; i++){
                        idsAchievements.push(result.rows.item(i).id);
                        types.push(result.rows.item(i).type);
                        if (aanspreekvorm == "formeel") {
                            descriptionsList.push(result.rows.item(i).description_formal);
                        } else {
                            descriptionsList.push(result.rows.item(i).description_informal);
                        }
                    }

                databaseBusy = false;
                showAchievement(idsAchievements, descriptionsList, types);    
            },
         function(error) {
             console.log("ERROR SEARCH ACHIEVEMENTS");
         });
            });  
    }
}

function updateStatusAchievements(ids) {
    if (!databaseBusy) {
    
        databaseBusy = true;

        where = ' WHERE ';

        for (i=0; i<ids.length; i++){
            if (i == 0) {
                where += 'id == ' + ids[i]
            } else {
                where += ' OR id == ' + ids[i];
            }
        } 
        
        var dateAch = new Date().toLocaleDateString('en-US');
        var ordering = new Date().getTime();

        query = `UPDATE achievements SET date = '${dateAch}',  ordering = '${ordering}'` + where;
        console.log(query);

        db.transaction(function(transaction) {
            transaction.executeSql(query, [ ],
                function(tx, result) {

                console.log('achievement status updated');    
                databaseBusy = false;
            },
             function(error) {
                 console.log("ERROR UPDATE ACHIEVEMENTS");
             });
            }); 
    } else {
        setTimeout(function () {updateStatusAchievements(ids)}, 1000);
    }
}

function showAchievement(ids, descriptions) {
    $('#achievement').modal({
                    show: true,
                    backdrop: "static"
                });

    screenOpen = true;
    
    achievementSound.play();
    
    var message = "<div style='text-align: center'>"
    
    if (descriptions.length > 1) {
        if (aanspreekvorm == "formeel") {
            message += "<p>Gefeliciteerd! U heeft de volgende prestaties behaald:</p><img src='images/achievement_pilarstar.png' style='float: left;'>"
        } else {
            message += "<p>Gefeliciteerd! Je hebt de volgende prestaties behaald:</p><img src='images/achievement_pilarstar.png' style='float: left;'>"
        }
        message += '<ul style="list-style-type: none">';
        for (i=0; i<descriptions.length; i++) {
            message += '<li><h4>' + descriptions[i] + '</h4></li>'
        }
        message += '</ul>'
    } else {
        if (aanspreekvorm == "formeel") {
            message += "<p>Gefeliciteerd! U heeft de volgende prestatie behaald: </p><img src='" + imageAchievement(types[0]) + "' style='float: left'> <h4 style='padding-top: 10px'>" + descriptions[0] + '</h4>';
        } else {
            message += "<p>Gefeliciteerd! Je hebt de volgende prestatie behaald: </p><img src='" + imageAchievement(types[0]) + "' style='float: left'> <h4 style='padding-top: 10px'>" + descriptions[0] + "</h4>";
        }
    }
    message += "</div>"
    
    document.getElementById('achievement-content').innerHTML = message;
    
    writeLog("Nieuwe achievement notificatie: " + message)
    
    updateStatusAchievements(ids);
}

function findAllCompletedAchievements() {
    descriptionsList = [];
    datesAchievements = [];
    typesAchievements = [];
    
    if (!databaseBusy) {
        databaseBusy = true;
        if (aanspreekvorm == "formeel") {
            query = 'SELECT description_formal, date, type FROM achievements WHERE date NOT null ORDER BY ordering';

            db.transaction(function(transaction) {
            transaction.executeSql(query, [ ],
                function(tx, result) {

                    for (i=0; i<result.rows.length; i++){
                        console.log(console.log(result.rows.item(i).description_formal));
                        descriptionsList.push(result.rows.item(i).description_formal);
                        datesAchievements.push(result.rows.item(i).date);
                        typesAchievements.push(result.rows.item(i).type);
                    }
                
                databaseBusy = false;
                
                console.log(typesAchievements);
                
                showAchievementsProfile(descriptionsList, datesAchievements, typesAchievements); 
            },
         function(error) {
             console.log("ERROR ALL COMPLETED ACHIEVEMENTS");
         });
            }); 
        } else {
            query = 'SELECT description_informal, date, type FROM achievements WHERE date NOT null ORDER BY ordering DESC';

            db.transaction(function(transaction) {
            transaction.executeSql(query, [ ],
                function(tx, result) {

                    for (i=0; i<result.rows.length; i++){
                        console.log(console.log(result.rows.item(i).description_informal));
                        descriptionsList.push(result.rows.item(i).description_informal);
                        datesAchievements.push(result.rows.item(i).date);
                        typesAchievements.push(result.rows.item(i).type);
                    }
                
                databaseBusy = false;
                
                console.log(typesAchievements);
                
                showAchievementsProfile(descriptionsList, datesAchievements, typesAchievements); 
            },
         function(error) {
             console.log("ERROR ALL COMPLETED ACHIEVEMENTS");
         });
            }); 
        }
        
    } else {
        setTimeout(findAllCompletedAchievements, 1000)
    }
}

function nextAchievements() {
    //console.log("Volgende prestaties bij: " + daysAchThresholds[0] + "dagen ingevoerd, " + momentsAchThresholds[0] + "eetmomenten ingevuld, " + proteinAchThresholds[0] + "eiwitpunten ingevoerd.");
    
    var nextAch = 'De volgende prestaties worden behaald bij: <ul>';

    if (proteinAchThresholds.length != 0) { nextAch += "<li>Het invoeren van in totaal " + proteinAchThresholds[0] + " eiwitpunten.</li>"}
    if (daysAchThresholds.length != 0) { nextAch += "<li>Het invoeren op in totaal " + daysAchThresholds[0] + " dagen.</li>" }
    if (momentsAchThresholds.length != 0) { nextAch += "<li>Het invoeren voor in totaal " + momentsAchThresholds[0] + " eetmomenten.</li>"}
   
    nextAch += "</ul>"
    
    return nextAch;
    
}

function imageAchievement(type) {
    switch (type) {
        case "points":
            return "images/achievement_starcrown.png"
            break;
        case "days":
            return "images/achievement_star.png"
            break;
        case "moments":
            return "images/achievement_medal.png"
            break;
        default:
            break;
    }
}

