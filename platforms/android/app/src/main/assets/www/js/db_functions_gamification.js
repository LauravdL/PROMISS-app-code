function getRandomProduct(game, condition) {
    if (!databaseBusy) {
        query = `SELECT * FROM protein_products WHERE name NOT LIKE '%(klik%'`; //not include general categories
    
        if (condition != undefined && condition != []) {
            query += condition;
        }

        console.log("mini game query: " + query);

        db.transaction(function(transaction) {
         transaction.executeSql(query, [ ],
         function(tx, result) {
             if (result.rows.length > 0) {
                 random_i = Math.floor(Math.random() * (result.rows.length));
                 //console.log(result.rows.item(random_i));
                 switch (game) { //.replace("-", "") used to remove - from 'opschep-lepel'
                     case 1:
                         played_products_condition += ' AND name != "' +  result.rows.item(random_i).name + '"';
                         playGameGuessPoints([result.rows.item(random_i).name, result.rows.item(random_i).alt_size, result.rows.item(random_i).portion_alt.replace("-", ""), result.rows.item(random_i).protein_size, result.rows.item(random_i).portion_type, result.rows.item(random_i).protein_points]);
                         break;
                     case 2:
                         tempSave(game, [result.rows.item(random_i).name, result.rows.item(random_i).alt_size, result.rows.item(random_i).portion_alt.replace("-", ""), result.rows.item(random_i).protein_size, result.rows.item(random_i).portion_type, result.rows.item(random_i).protein_points]);
                         break;
                     case 3:
                         tempSave(game, [result.rows.item(random_i).name, result.rows.item(random_i).alt_size, result.rows.item(random_i).portion_alt.replace("-", ""), result.rows.item(random_i).protein_size, result.rows.item(random_i).portion_type, result.rows.item(random_i).protein_points]);
                         break; 
                     case 4:
                         tempSave(game, [result.rows.item(random_i).name, result.rows.item(random_i).alt_size, result.rows.item(random_i).portion_alt.replace("-", ""), result.rows.item(random_i).protein_size, result.rows.item(random_i).portion_type, result.rows.item(random_i).protein_points]);
                         break;
                     case 5:
                         played_products_condition += ' AND name != "' +  result.rows.item(random_i).name + '"';
                         playBingo([result.rows.item(random_i).name, result.rows.item(random_i).alt_size, result.rows.item(random_i).portion_alt.replace("-", ""), result.rows.item(random_i).protein_size, result.rows.item(random_i).portion_type, result.rows.item(random_i).protein_points]);
                         break;
                     default:
                         break;
                 }
             } else {
                 //nothing is found, can be the case when condition is added
                 getRandomProduct(game);
             }


         },
         function(error) {
             console.log("ERRORA", game, condition);
         });
      });
    } else {
        setTimeout(function () { getRandomProduct(game, condition)}, 1000);
    }
	
}


function setPreviousScore() {
    if (!databaseBusy) {
    
        var prevScore = 0;
        
        databaseBusy = true;

        query = "SELECT score FROM scoreSave";

        db.transaction(function(transaction) {
         transaction.executeSql(query, [ ],
         function(tx, result) {
             if (result.rows.length > 0) {
                prevScore = result.rows.item(0).score;
                console.log("prevscore: " + prevScore)
             }
             databaseBusy = false;
             tempNewGardenElement = false; //the element will not be new
             score(prevScore); //set previous score
              
         },
         function(error) {
             console.log("ERRORB");
         });
      });
    } else {
        setTimeout(setPreviousScore, 1000);
    }
}

function saveScore() {
    if (!databaseBusy) {
    
        databaseBusy = true;
        
        query = "UPDATE scoreSave SET score = " + gamesScore;

        db.transaction(function(transaction) {
         transaction.executeSql(query, [ ],
         function(tx, result) {
             console.log('score saved', query);
             databaseBusy = false;
         },
         function(error) {
             console.log("ERRORC");
         });
      });
    } else {
        setTimeout(saveScore, 1000);
    }
}

function setupPointsWithPairs() {                        
    if (!databaseBusy) {
    
        databaseBusy = true;
        
        query = "SELECT * FROM (SELECT protein_points, count(*) as 'num' FROM protein_products GROUP BY protein_points) WHERE num > 1";

        db.transaction(function(transaction) {
         transaction.executeSql(query, [ ],
         function(tx, result) {
             for (i=0; i<result.rows.length;i++){
                pointsWithPairsCondition += `'${result.rows.item(i).protein_points}'`
                 if (i != (result.rows.length - 1)) {
                     pointsWithPairsCondition += ",";
                 }
             }
             pointsWithPairsCondition += ')';
             databaseBusy = false;
         },
         function(error) {
             console.log("ERRORD");
         });
      });
    } else {
        setTimeout(setupPointsWithPairs, 1000);
    }
    
}
