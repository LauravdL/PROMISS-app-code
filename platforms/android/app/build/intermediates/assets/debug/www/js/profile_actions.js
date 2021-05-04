var start_date = null;
var end_date = null;
var totalDaysData = 0;
var subDaysData = 0; //days in the future
var totalProteinData = 0;
var subProteinData = 0; //proteins in future
var totalMomentsData = 0;
var subMomentsData = 0; //moments in future
var newMomentInput = false; //er is geen nieuw moment input

function edit_date(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1; //January is 0!

    var yyyy = date.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    } 
    if (mm < 10) {
      mm = '0' + mm;
    } 
    return dd + '-' + mm + '-' + yyyy;
}

function setPreviousProfile() {
    findStartDate();
}

function reset_data(){
    totalDaysData = 0;
    subDaysData = 0;
    totalProteinData = 0;
    subProteinData = 0;
    totalMomentsData = 0;
    subMomentsData = 0;
}

function calc_daysSinceStart() { //days since start + 1
    return Math.ceil((new Date().getTime() - start_date.getTime()) / (1000 * 3600 * 24));
}

function calc_proteinSumTotal() {
    var dailyTotal = 0; //exclude today
    
    for (i=0;i<dietAdviceProteins.length ;i++){ 
        dailyTotal += dietAdviceProteins[i]; 
    }
    
    var subtotal_today = 0;
    //add today until current time
    for (i=0; i<dietAdviceItems.length; i++) {
        if (currentTime >= timesAdvices[i]) {
            subtotal_today += dietAdviceProteins[i];
        }
    }
    //add intake in future
    //subtotal_today += subProteinData;       
    

    return (calc_daysSinceStart() - 1) * dailyTotal + subtotal_today;

 
}

function calc_momentsSumTotal() {

    var subtotal_today = 0;
    //add today until current time
    for (i=0; i<dietAdviceItems.length; i++) {
        if (currentTime >= timesAdvices[i]) {
            subtotal_today += 1;
        }
    } 

    return (calc_daysSinceStart() - 1) * dietAdviceNames.length + subtotal_today;

}

function showProfile() {
    console.log(databaseBusy);
    if (!databaseBusy) { //make sure that database is ready meaning new values are calculated
        console.log('open profile');

        $('#profileScreen').modal({
                    show: true,
                    backdrop: "static"
                });

        screenOpen = true;

        var greeting = ''

        if (aanspreekvorm == 'formeel') {
            if (geslacht == "man") {
                greeting = `<h3> Welkom op uw profielpagina, meneer ${achternaam} </h3>`;
            }
            if (geslacht == "vrouw") {
                greeting = `<h3> Welkom op uw profielpagina, mevrouw ${achternaam} </h3>`;
            }
        }
        if (aanspreekvorm == "informeel") {
            greeting = `<h3> Welkom op je profielpagina, ${voornaam}</h3>`;
        }

        document.getElementById("profileScreen-content-greeting").innerHTML = greeting;
        
        if (aanspreekvorm == "informeel") {
            var dataHTML = `<h4> Jouw gebruiksgegevens</h4>`;
        }
        
        if (aanspreekvorm == "formeel") {
            var dataHTML = `<h4> Uw gebruiksgegevens</h4>`;
        }

        dataHTML += `Startdatum: <i>${edit_date(start_date)}</i> (<i>${calc_daysSinceStart()}</i> dagen sinds de start) </br>
        <br>
        Totaal aantal eiwitpunten: <i>${totalProteinData}</i>, nauwkeurigheid <i>${Math.round(((totalProteinData-subProteinData)/calc_proteinSumTotal())*100)}%</i> </br>
        <br>
        Aantal dagen ingevoerd: <i>${totalDaysData}</i>, nauwkeurigheid <i>${Math.round(((totalDaysData-subDaysData) / calc_daysSinceStart()) * 100)}%</i> </br>
        <br>
        Aantal eetmomenten ingevoerd: <i>${totalMomentsData}</i>, nauwkeurigheid <i>${Math.round(((totalMomentsData-subMomentsData) / calc_momentsSumTotal()) * 100)}%</i>`;




        document.getElementById("profileScreen-content-data").innerHTML = dataHTML;
        
        findAllCompletedAchievements();

        addLog(new Date().toLocaleString('en-US'), 'system', 'profile', 'shown');
    } else {
        console.log('even wachten');
        setTimeout(showProfile, 1000);
    }
}

function showAchievementsProfile(descriptions, dates, types) {
    console.log(descriptions, dates, types)
    if (aanspreekvorm == "formeel") { var message = '<h4>Uw behaalde prestaties zijn: </h4>'; } 
    if (aanspreekvorm == "informeel") { var message = '<h4>Jouw behaalde prestaties zijn: </h4>'; } 
    
    message += '<div class="badges_list_wrapper faded_bottom"><div class="badges_list_inside" id="badges_list_inside">';
    message += '<table id="badges_table"><tbody>';
    
    for (i=0; i<descriptions.length; i++){
        message += '<tr>';
        message += '<td class="badge_image"><img src="' + imageAchievement(types[i]) + '" height="50%"/></td>';
        message += "<td class='badges_description'><b>" + descriptions[i] + "</b> <i class='date-achievement'>" + edit_date(new Date(dates[i])) + "</i></td></tr>";    
    }
    
    message += '</tbody></table></div></div>'
    
    message += nextAchievements();
    
    document.getElementById("profileScreen-badges").innerHTML = message;
}

function updateProfileValues(){
    //herberekening totaal aantal dagen
    if (start_date == null) {
        start_date = new Date(intakeDay);
    }
    
    if (end_date == null) {
        end_date = new Date(intakeDay);
    }
    
    
    if (new Date(intakeDay) < start_date) {
        start_date = new Date(intakeDay); 
    } else if (new Date(intakeDay) > end_date) {
        end_date = new Date(intakeDay);
    }
    
    totalDaysData = (end_date - start_date) / (1000*60*60*24);
    
    //herberekening totaal aantal dagen in de toekomst
    futureDates = 0;
    if (end_date > new Date()) {
        futureDates = Math.round((end_date - new Date().setHours(0,0,0,0))/ (1000*60*60*24));
    } else {
        futureDates = 0;
        subDaysData = 0;
    }
    
    //bereken data in de toekomst
    dt_temp = new Date();
    datesFuture = '(';
    for (i=1;i<futureDates+1; i++){
        dt_temp.setDate(new Date().getDate() + i);
        datesFuture += '"'
        datesFuture += dt_temp.toLocaleDateString('en-US');
        datesFuture += '"'
        
        if (i == futureDates) {
            datesFuture += ')';
        } else {
            datesFuture += ',';
        }  
    }
    
    //berekening subProteins + verder gaan met updaten profile
    if (futureDates > 0) {
        if (newMomentInput) {
            subMomentsData += 1;
            totalMomentsData += 1;
        }
        
        findFutureIntake(datesFuture);
    } else {
        subProteinData = 0;
        subMomentsData = 0;
        
        if (newMomentInput) {
            totalMomentsData += 1;
        }
        
        //berekening totaal aantal proteins + verdergaan met updaten profile
        queryTotalProteins();
    }
    
    
}

function findFutureIntake(datesFuture) {
    //query voor het vinden van het totaal in de future + verdergaan met berekenen overige onderdelen
    if (!databaseBusy) {
        databaseBusy = true;

        query = `SELECT SUM(total) AS som, COUNT(total) AS aantal FROM day_totals WHERE day IN ` + datesFuture;

        db.transaction(function(transaction) {
         transaction.executeSql(query, [ ],
         function(tx, result) {
            if (result.rows.length == 0) {
                subProteinData = 0;
                databaseBusy = false;
            } else {
                console.log("subProteins: " +  result.rows.item(0).som)
                subProteinData = result.rows.item(0).som;
                subDaysData = result.rows.item(0).aantal;
            }

             databaseBusy = false;
             
             queryTotalProteins();
         },
        function(error) {
             console.log("ERROR FINDING TOTAL SUB PROTEINS");
         });

        });  
} else {setTimeout(function (){findFutureIntake(datesFuture) }, 1000)}
}

function queryTotalProteins() {
     if (!databaseBusy) {
        databaseBusy = true;

        query = `SELECT SUM(total) AS som, COUNT(total) AS aantal FROM day_totals`;

        db.transaction(function(transaction) {
         transaction.executeSql(query, [ ],
         function(tx, result) {
            if (result.rows.length == 0) {
                totalProteinData = 0;
                databaseBusy = false;
            } else {
                console.log("totalProteins: " +  result.rows.item(0).som)
                totalProteinData = result.rows.item(0).som;
                totalDaysData = result.rows.item(0).aantal;
            }

             databaseBusy = false;
             
             if (subDaysData == 0) {
                 subMomentsData = 0;
                 //queryTotalMoments();
             } 
             checkNewAchievement();
         },
        function(error) {
             console.log("ERROR FINDING TOTAL PROTEINS");
         });

        });  
} else {setTimeout(queryTotalProteins, 1000)}
}
    



function findStartDate() {
    
    console.log("test1", databaseBusy);
    if (!databaseBusy) {
        databaseBusy = true;
    
        reset_data();

        query = `SELECT intakeDay FROM logging WHERE intakeDay != 'null'`;

        db.transaction(function(transaction) {
         transaction.executeSql(query, [ ],
         function(tx, result) {
            if (result.rows.length == 0) {
                //showProfile();
                databaseBusy = false;
            } else {

                for(i=0;i<result.rows.length;i++) {
                    console.log(result.rows.item(i).intakeDay)
                    if (start_date == null) {
                        start_date = new Date(result.rows.item(i).intakeDay);
                    } 

                    if (start_date > new Date(result.rows.item(i).intakeDay)) {
                        start_date = new Date(result.rows.item(i).intakeDay);
                    }

                    if (end_date == null) {
                        end_date = new Date(result.rows.item(i).intakeDay);
                    } 

                    if (end_date < new Date(result.rows.item(i).intakeDay)) {
                        end_date = new Date(result.rows.item(i).intakeDay);
                    }
                }

             //databaseBusy = false;

             findInputData();
            }
         },
        function(error) {
             console.log("ERROR FINDING DATES");
         });

        });  
    } else {
        setTimeout(findStartDate, 1000);
    }
    
}

function findInputData() {
    console.log("test2")
    //if (!databaseBusy) {
        //databaseBusy = true;

        query = `SELECT * FROM day_totals`;

        db.transaction(function(transaction) {
         transaction.executeSql(query, [ ],
         function(tx, result) {
            for(i=0;i<result.rows.length;i++) {
                totalDaysData += 1;
                totalProteinData += result.rows.item(i).total;

                if (new Date(result.rows.item(i).day) > new Date()) {
                    subProteinData += result.rows.item(i).total;
                    subDaysData += 1; //days in the future
                }

            }

             //databaseBusy = false;

             findNumberOfMoments(new Date(start_date));
         },
        function(error) {
             console.log("ERROR FINDING INPUT");
         });

        });  
    //} else {
    //    setTimeout(findInputData, 1000);
    //}
}

function findNumberOfMoments(searching_date) {
    console.log("test3");
    //if (!databaseBusy) {
        console.log(searching_date);
        intakeDay_searching = searching_date.toLocaleDateString('en-US');

        moments_this_day = [];
        moments_future = [];

       // databaseBusy = true;

        query = `SELECT * FROM logging WHERE intakeDay = '${intakeDay_searching}'`;
            db.transaction(function(transaction) {
                transaction.executeSql(query, [ ],
                 function(tx, result) {
                    for (i=0;i<result.rows.length; i++){
                        moment_name = result.rows.item(i).value.split("-")[0]
                        num_moment = dietAdviceNames.indexOf(moment_name)
                        if (moments_this_day.indexOf(num_moment) == -1) {
                            moments_this_day.push(num_moment);
                            if (searching_date > new Date()) {
                                moments_future.push(num_moment);
                                //subProteinData += result.rows.item(i).value.split("-")[1];
                            } else {
                                if (timesAdvices[num_moment] > currentTime && !(searching_date.setHours(0,0,0,0) < new Date().setHours(0,0,0,0))) {
                                    moments_future.push(num_moment);
                                }
                            }
                        }
                    }
                    console.log(moments_this_day.length)
                    totalMomentsData += moments_this_day.length;
                    subMomentsData += moments_future.length;

                    if (end_date.setHours(0,0,0,0) != searching_date.setHours(0,0,0,0)) {
                        databaseBusy = false;
                        findNumberOfMoments(new Date(searching_date.setDate(searching_date.getDate() + 1 )));
                        
                    } else {
                        databaseBusy = false;
                        //showProfile();
                        checkNewAchievement();
                    }

                 },
        function(error) {
             console.log("ERROR FINDING MOMENTS");
         });
            });
  //  } else {
//        setTimeout(function(){findNumberOfMoments(searching_date) }, 1000);
//    }
}
