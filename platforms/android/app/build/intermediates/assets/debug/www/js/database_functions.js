//database functions

//variable for being busy (if needed)
var databaseBusy = false;
//variable for checking updates pref menu
var checkingUpdates = false;

//finds the message meeting most of the parameters
function findMostSuitableMessage(type, moment) {
	var moment_nr;
	if (moment < 3) { moment_nr = 0;}
	else if (moment < 6) { moment_nr = 1;}
	else if (moment < 9) {moment_nr = 2;};
	
	var meal;
	if (advies.toLowerCase().search("tussen") != -1) {meal = "tussen";} 
	else {meal = "hoofd";}
	
	//console.log(type, geslacht, aanspreekvorm, moment_nr, meal);
	
	query = `SELECT * FROM messages WHERE type="${type}" AND target_gender="${geslacht}" AND style="${comm_style}" AND form="${aanspreekvorm}" AND (moment="${moment_nr}" OR moment is NULL) AND (target_meal="${meal}" OR target_meal is null)`;
	db.transaction(function(transaction) {
	 transaction.executeSql(query, [ ],
	 function(tx, result) {
	//Success
		if (result.rows.length != 0) {
			//console.log("debugging");
			row = Math.floor(Math.random() * result.rows.length); 
			//console.log(result.rows.item(row).content);
			//console.log(result);
			if (type == "notification") {sendNotification(result.rows.item(row).content, moment);}
			if (type == "reminder") {sendReminder(result.rows.item(row).content);}
		}
		else {
			//console.log("niet gelukt om iets te vinden");
			findMessage(type, moment, moment_nr, meal);
		}
	},
	function(error){
	// Error
		console.log("ERROR1");
	 });
  });
	
}

//using only obligatory parameters
function findMessage(type, moment, moment_nr, meal) {
	query = `SELECT * FROM messages WHERE type="${type}" AND form="${aanspreekvorm}" AND (moment="${moment_nr}" OR moment is NULL) AND (target_meal="${meal}" OR target_meal is null)`;
	db.transaction(function(transaction) {
	 transaction.executeSql(query, [ ],
	 function(tx, result) {
	//Success
		if (result.rows.length != 0) {
			//console.log("debugging");
			row = Math.floor(Math.random() * result.rows.length); 
			//console.log(result.rows.item(row).content);
			//console.log(result);
			if (type == "notification") {sendNotification(result.rows.item(row).content, moment);}
			if (type == "reminder") {sendReminder(result.rows.item(row).content);}
		}
		else {
			//console.log("niet gelukt om iets te vinden");
			findMessage(type, moment, moment_nr, meal);
		}
	},
	function(error){
	// Error
		console.log("ERROR2");
	 });
  });
}

function newPrefMenu(pref, newItems) {
	var values = "";
	for (i=0; i<pref.length; i++) {
		values += "("
		values += pref[i][0];
		values += ", ";
		values += pref[i][1];
		values += ", '";
		values += pref[i][2];
		if (i!=pref.length-1) {values += "'), ";} else {values += "')"}
	}
	
	query = `INSERT INTO pref_menu (ID_product, portions, moment) VALUES ` + values;
	//console.log(query);
	db.transaction(function(transaction) {
	 transaction.executeSql(query, [ ],
	 function(tx, result) {
		 //console.log("successful")
		 if (newItems != undefined) {
             deleteNewAddedPrefs(pref, 0);
         } else {
             databaseBusy = false;
         }
         
		 //console.log(result);
	 },
	 function(error) {
		 console.log("ERROR4");
	 });
  });
}


function createPrefMenu(pref) {
	//console.log(pref);
	databaseBusy = true;
	query = `SELECT * FROM pref_menu`;
	db.transaction(function(transaction) {
	 transaction.executeSql(query, [ ],
	 function(tx, result) {
		 if (result.rows.length == 0) {
			 newPrefMenu(pref);
		 }
		 else {
			 //console.log("there is already a pref menu");
			 
			 checkUpdatesPrefMenu();

		 }
		 
	 },
	 function(error) {
		 console.log("ERROR3");
	 });
  });
}	

//counter for the findPrefMenu
var counterPref = 0;

function findPrefMenu(moment) {
    if (counterPref == 0 && !checkingUpdates && !databaseBusy) {
        checkUpdatesPrefMenu(moment);
        counterPref += 1;
    }
	
    if(!databaseBusy && !checkingUpdates) {
		
		pref_menu = [];

		
		proteins = [];
        //console.log('testing this thing here');
		//console.log(moment);
        
		
		query = `SELECT ID_product, portions FROM pref_menu WHERE moment="${moment}"`;
        
        //console.log(query);
		
		db.transaction(function(transaction) {
		 transaction.executeSql(query, [ ],
		 function(tx, result) {
			 if (result.rows.length != 0) {
				for (i=0; i<result.rows.length; i++) {
					//console.log("this is testing..");
					//console.log([result.rows.item(i).ID_product, null, result.rows.item(i).portions, null, null, null]);
					new_item = true;
					if (foodBoxInfo != []) {
						for (j=0;j<foodBoxInfo.length;j++) {
							if (foodBoxInfo[j][0] == result.rows.item(i).ID_product) {
									new_item = false;
							}
						}
					}
					if (new_item) {
						pref_menu.push([result.rows.item(i).ID_product, null, null, null, null, null, null, null, null, result.rows.item(i).portions]);
					}
				}
				//add info from foodbox
				if (foodBoxInfo != []) {
					for (i=0;i<foodBoxInfo.length;i++) {
						pref_menu.push([foodBoxInfo[i][0], null, foodBoxInfo[i][1], null, null, null, null, null, null, null]);	
					}
				}
                counterPref = 0;
				prefItemDetails(pref_menu, 0);
			}
			else {
				//console.log("niet gelukt om iets te vinden voor het pref_menu");
			}
		 },
		 function(error) {
			 console.log("ERROR5");
		 });
	  });
	} else {
		setTimeout(function () { findPrefMenu(moment) }, 1000);
	}
}

function prefItemDetails(menu, i) {
	
	if (i < menu.length) {
		query = `SELECT name, portion_type, portion_alt, alt_size, protein_points, protein_size, energy_product FROM protein_products WHERE id=${menu[i][0]}`; //changed
		
		//console.log(query);
		
		db.transaction(function(transaction) {
		 transaction.executeSql(query, [ ],
		 function(tx, result) {
			 if (result.rows.length == 1) {
				menu[i][1] = result.rows.item(0).name;
				//console.log(result.rows.item(0).proteins * menu[i][1]);
                if (menu[i][2] == null) {
                    menu[i][2] = Math.round(((menu[i][9]/result.rows.item(0).protein_size)*result.rows.item(0).alt_size) * 4) / 4; 
                } else {
                    menu[i][9] = result.rows.item(0).protein_size * (menu[i][2] / result.rows.item(0).alt_size);
                }
                 
				menu[i][3] = result.rows.item(0).portion_type;
				menu[i][4] = result.rows.item(0).portion_alt; //changed
                menu[i][5] = result.rows.item(0).alt_size;
                menu[i][6] = result.rows.item(0).protein_points; //changed
                menu[i][7] = result.rows.item(0).protein_size; //changed and new
                menu[i][8] = result.rows.item(0).energy_product; //changed and new
				
				prefItemDetails(menu, i+1);
			}
			else {
				//console.log("niets gevonden of teveel gevonden");
			}
		 },
		 function(error) {
			 console.log("ERROR6");
		 });
	  });
	}
	else {
		//console.log("I am here");
		//console.log(proteins);
		showAdviceScreen(menu);
	}
}

function findType(id) {
	//console.log('looking for the type');
	query = `SELECT type FROM protein_products WHERE ID=${id}`;
	
	db.transaction(function(transaction) {
	 transaction.executeSql(query, [ ],
	 function(tx, result) {
		 if (result.rows.length != 0) {
			searchAllTypeAlternatives(id, result.rows.item(0).type);
		}
		else {
			//console.log("niet gelukt om iets te vinden ");
		}
	 },
	 function(error) {
		 console.log("ERROR7");
	 });
  });
}

function searchAllTypeAlternatives(id, type) {
    alternatives = [];
    portion_sub = 0;
    
    currentProduct = [];
	for (i=0; i<currentMenu.length; i++) {
		if (currentMenu[i][0] == id) {
			currentProduct = currentMenu[i];
		}
	}
	   
	total_substitute = (currentProduct[2] * currentProduct[6]); //changed - portion * points

	query = `SELECT * FROM protein_products WHERE ID!='${id}' AND type="${type}" ORDER BY name ASC`; //everything on alfabetic order
    
	db.transaction(function(transaction) {
	 transaction.executeSql(query, [ ],
	 function(tx, result) {
		 if (result.rows.length > 0) {
			for (i=0;i<result.rows.length;i++){	
                
                if (total_substitute > 0) {                    
                    
                    if (result.rows.item(i).protein_points == 0) {
                        portion_sub = currentProduct[2];
                    } else {
                        portion_sub = total_substitute / result.rows.item(i).protein_points;
                        portion_sub = Math.floor(portion_sub * 4 ) / 4; 
                    }
                } else {
                    if (result.rows.item(i).protein_points == 0) {
                        portion_sub = 1;
                    } else {
                        portion_sub = 0;
                    }
                }
                
                if (portion_sub > 0.25) {
                    // at least part a portion of 0.25 and not a too high portion for energy products
                    if (! (result.rows.item(i).energy_product==1 && portion_sub>=3)) {
                        alternatives.push([result.rows.item(i).ID, result.rows.item(i).name, portion_sub * result.rows.item(i).alt_size, result.rows.item(i).portion_type, result.rows.item(i).portion_alt, result.rows.item(i).alt_size, result.rows.item(i).protein_points, result.rows.item(i).protein_size, result.rows.item(i).energy_product, result.rows.item(i).protein_size*portion_sub]); //changed
                    }
                }
                
			}
			searchFavoriteAlternativesType(id, type, alternatives);
		} 
		else {
			//console.log("niet gelukt om iets te vinden ");
		}
	 },
	 function(error) {
		 console.log("ERRORA");
	 });
  });
}

function searchFavoriteAlternativesType(id, type, all_prods) {

	
	total_substitute = (substProduct[2] * substProduct[6]); //changed - portion * points
    
	query = `SELECT * FROM protein_products WHERE ID!=${id} AND type="${type}" AND num_choices > 0 ORDER BY num_choices DESC`;
	alternatives = [];
	
	db.transaction(function(transaction) {
	 transaction.executeSql(query, [ ],
	 function(tx, result) {
         //console.log(result.rows.length);
         if (result.rows.length > 0 && result.rows.length < 5) {
             for(i=0; i<result.rows.length; i++) {
                 
				if (total_substitute > 0) {
                    if (result.rows.item(i).protein_points == 0) {
                        portion_sub = currentProduct[2];
                    } else {
                        portion_sub = total_substitute / result.rows.item(i).protein_points;
                        portion_sub = Math.floor(portion_sub * 4 ) / 4; 
                    }
                } else {
                    if (result.rows.item(i).protein_points == 0) {
                        portion_sub = 1;
                    } else {
                        portion_sub = 0;
                    }
                }
                 
                if (portion_sub > 0.25) {
                    // at least part a portion of 0.25 and not a too high portion for energy products
                    if (! (result.rows.item(i).energy_product == 1 && portion_sub>=3)) {
                        alternatives.push([result.rows.item(i).ID, result.rows.item(i).name, portion_sub * result.rows.item(i).alt_size, result.rows.item(i).portion_type, result.rows.item(i).portion_alt, result.rows.item(i).alt_size, result.rows.item(i).protein_points, result.rows.item(i).protein_size, result.rows.item(i).energy_product, result.rows.item(i).protein_size*portion_sub]); //changed
                    }
                }
			}
             
            if (all_prods.length > 0) {
                set_alternativesHTML(all_prods, alternatives);
            } else {
                set_alternativesHTML("leeg");
            }
		} 
         else if (result.rows.length >= 5) {
            for (i=0;i<5;i++){
                
                if (total_substitute > 0) {
                    portion_sub = total_substitute / result.rows.item(i).protein_points;
                    portion_sub = Math.floor(portion_sub * 4 ) / 4;
                } else {
                    if (result.rows.item(i).protein_points == 0) {
                        portion_sub = 1;
                    } else {
                        portion_sub = 0;
                    }
                }
                
                if (portion_sub > 0.25) {
                    // at least part a portion of 0.25 and not a too high portion for energy products
                    if (! (result.rows.item(i).energy_product == 1 && portion_sub >=3 )) {
                        alternatives.push([result.rows.item(i).ID, result.rows.item(i).name, portion_sub * result.rows.item(i).alt_size, result.rows.item(i).portion_type, result.rows.item(i).portion_alt, result.rows.item(i).alt_size, result.rows.item(i).protein_points, result.rows.item(i).protein_size, result.rows.item(i).energy_product, result.rows.item(i).protein_size]); //changed
                    }
                }
			}
             
            if (all_prods.length > 0) {
                set_alternativesHTML(all_prods, alternatives);
            } else {
                set_alternativesHTML("leeg");
            }
        }
         
		else {
			//console.log("niet gelukt om iets te vinden ");
            if (all_prods.length > 0) {
                set_alternativesHTML(all_prods, alternatives);
            } else {
                set_alternativesHTML("leeg");
            }
            
		}
       
     
         
	 },
	 function(error) {
		 console.log("ERRORB");
	 });
  });
}

function addExtraItem() {
	query = `SELECT DISTINCT type FROM protein_products ORDER BY type ASC`;
	types = [];
	
	db.transaction(function(transaction) {
	 transaction.executeSql(query, [ ],
	 function(tx, result) {
		 if (result.rows.length != 0) {
			for (i=0;i<result.rows.length;i++){
				types.push(result.rows.item(i).type);
			}
			set_categoriesChoice(types);
		}
		else {
			//console.log("niet gelukt om iets te vinden ");
		}
	 },
	 function(error) {
		 console.log("ERROR9");
	 });
  });
}

function showAllType(type) {
	query = `SELECT * FROM protein_products WHERE type="${type}" ORDER BY name ASC`; //everything on alfabetic order
	alternatives = [];
	
	db.transaction(function(transaction) {
	 transaction.executeSql(query, [ ],
	 function(tx, result) {
		 if (result.rows.length > 0) {
			for (i=0;i<result.rows.length;i++){				
				alternatives.push([result.rows.item(i).ID, result.rows.item(i).name, result.rows.item(i).alt_size, result.rows.item(i).portion_type, result.rows.item(i).portion_alt, result.rows.item(i).alt_size, result.rows.item(i).protein_points, result.rows.item(i).protein_size, result.rows.item(i).energy_product, result.rows.item(i).protein_size]); //changed
			}
			showFavoritesType(type, alternatives);
		} 

         
		else {
			//console.log("niet gelukt om iets te vinden ");
		}
	 },
	 function(error) {
		 console.log("ERROR9");
	 });
  });
}

function showFavoritesType(type, all_prods) {
	query = `SELECT * FROM protein_products WHERE type="${type}" AND num_choices > 0 ORDER BY num_choices DESC`;
	alternatives = [];
	
	db.transaction(function(transaction) {
	 transaction.executeSql(query, [ ],
	 function(tx, result) {
         //console.log(result.rows.length);
         if (result.rows.length > 0 && result.rows.length < 5) {
             for(i=0; i<result.rows.length; i++) {
				alternatives.push([result.rows.item(i).ID, result.rows.item(i).name, result.rows.item(i).alt_size, result.rows.item(i).portion_type, result.rows.item(i).portion_alt, result.rows.item(i).alt_size, result.rows.item(i).protein_points, result.rows.item(i).protein_size, result.rows.item(i).energy_product, result.rows.item(i).protein_size]); //changed
			}
			set_newOptionsHTML(all_prods, alternatives);
		} 
         else if (result.rows.length >= 5) {
            for (i=0;i<5;i++){
                alternatives.push([result.rows.item(i).ID, result.rows.item(i).name, result.rows.item(i).alt_size, result.rows.item(i).portion_type, result.rows.item(i).portion_alt, result.rows.item(i).alt_size, result.rows.item(i).protein_points, result.rows.item(i).protein_size, result.rows.item(i).energy_product, result.rows.item(i).protein_size]); //changed
			}
			set_newOptionsHTML(all_prods, alternatives);
        }
         
		else {
			//console.log("niet gelukt om iets te vinden ");
            set_newOptionsHTML(all_prods, alternatives);
		}
	 },
	 function(error) {
		 console.log("ERROR9a");
	 });
  });
}

function addLog(timestamp, source, type, action, content, value, intake) {
	if (!databaseBusy) {
		query = `INSERT INTO logging (timestamp, source`;
		values = `('${timestamp}', '${source}' `;
		
		if (type != undefined && type != '') {
			query += `, type`
			values += `, '${type}' `
		}
		
		if (action != undefined && action != '') {
			query += `, action`
			values += `, '${action}' `
		}
		
		if (content != undefined && content != '') {
			query += `, content`
			values += `, '${content}' `
		}
		
		if (value != undefined && value != '') {
			query += `, value`
			values += `, '${value}' `
		}
		
		if (intake != undefined && intake != '') {
			query += `, intakeDay`
			values += `, '${intake}' `
		}
		
		values += ')';
		
		query += `) VALUES ${values} `;
		
		console.log(query);
		
		databaseBusy = true;
		db.transaction(function(transaction) {
		 transaction.executeSql(query, [ ],
		 function(tx, result) {
			console.log('added to logging');
			databaseBusy = false;
			//showAllLogs();
		 },
		 function(error) {
			 console.log("ERROR10");
		 });
	  });
	}
	else {
		setTimeout(function (){addLog(timestamp, source, type, action, content, value, intake)}, 1000);
	}
}

//not used, but kept for debugging purposes
function showAllLogs() {
	//console.log('show all logs called');
	query = `SELECT * FROM logging`;
		db.transaction(function(transaction) {
	 transaction.executeSql(query, [ ],
	 function(tx, result) {
		 if (result.rows.length != 0) {
			i=0
			if (result.rows.length > 5) {
				i=result.rows.length-5;
			}

			for (i; i<result.rows.length; i++) {
				//console.log(result.rows.item(i).timestamp, result.rows.item(i).source, result.rows.item(i).type, result.rows.item(i).action, result.rows.item(i).content, result.rows.item(i).value)
			}
		}
	 },
	 function(error) {
		 console.log("ERROR11");
	 });
  });
}

function altPref(index, advies, id_alt, portion) {
    if (!databaseBusy) {
    
        //console.log('altPref is called');
        databaseBusy = true;
        query = `SELECT id_key FROM pref_menu WHERE moment='${advies}'`; //select all keys from the advice moment

        //console.log(query);

        db.transaction(function(transaction) {
         transaction.executeSql(query, [ ],
         function(tx, result) {
             //use the primary key of the 'index'th item and use this to add to the alt pref table
             //console.log(result.rows.item(index).id_key, id_alt, portion);
             addAltPref(result.rows.item(index).id_key, id_alt, portion);
         },
         function(error) {
             console.log("ERROR12");
         });
      });
    } else {
        setTimeout(function() {altPref(index, advies, id_alt, portion)}, 1000);
    }
}

function addAltPref(id_pref, id_alt, portion) {
    if (dietAdviceNames.indexOf(id_pref) >= 0) //it is a name of a moment 
        {
            query = `INSERT INTO pref_alt (id_pref, id_alt, portion) VALUES ('${id_pref}', ${id_alt}, ${portion})`;
        } else {
            query = `INSERT INTO pref_alt (id_pref, id_alt, portion) VALUES (${id_pref}, ${id_alt}, ${portion})`;
        }
    
    //console.log(query);
    
	db.transaction(function(transaction) {
	 transaction.executeSql(query, [ ],
	 function(tx, result) {
		 //console.log('alternative preference added to pref_alt')
		 databaseBusy = false;
	 },
	 function(error) {
		 console.log("ERROR12");
	 });
  });
}

function checkUpdatesPrefMenu(advies) {
	//console.log("check Updates Pref Menu");
	databaseBusy = true;
    checkingUpdates = true;
	//console.log(databaseBusy);
	
	all_keys = [];
    
    if (advies == undefined) {
        query = `SELECT id_key FROM pref_menu `;
    } else {
        query = `SELECT id_key FROM pref_menu WHERE moment='${advies}'`;
    }
	
	
	db.transaction(function(transaction) {
	 transaction.executeSql(query, [ ],
	 function(tx, result) {
		 for (i=0; i<result.rows.length; i++) {
			 //console.log(databaseBusy);
			 //findPrefAlts(result.rows.item(i).id_key);
			 all_keys.push(result.rows.item(i).id_key);
		 }
		 //databaseBusy = false;
		 findPrefAlts(all_keys, 0);
	 },
	 function(error) {
		 console.log("ERROR13");
	 });
  });	
}

function findPrefAlts(keys, i) {
	//console.log("find Pref Alts ", keys, i);
	if (i<keys.length) {
		//databaseBusy = true;
		query = `SELECT id_alt, count(id_alt) AS count_id, AVG(portion) AS avg_portion FROM pref_alt WHERE id_pref = ${keys[i]} GROUP BY id_alt ORDER BY count_id DESC`;
		
		db.transaction(function(transaction) {
		 transaction.executeSql(query, [ ],
		 function(tx, result) {
			if (result.rows.length > 0) { //alternatives are registered
			//take the one with the highest number of occurrances (first item) and check whether above threshold
				if (result.rows.item(0).count_id >= 3) { //threshold 3 (days)
                    
                    if (Math.round(result.rows.item(0).avg_portion*4)/4 > 0) {
                        updatePrefMenu(keys[i], result.rows.item(0).id_alt, Math.round(result.rows.item(0).avg_portion*4)/4, keys, i);
                    } else {
                        deletePrefMenu(keys[i], result.rows.item(0).id_alt, Math.round(result.rows.item(0).avg_portion*4)/4, keys, i);
                    }	
				}
				else {
					findPrefAlts(keys, i+1); //check next
				}
			} else {
				findPrefAlts(keys, i+1); //check next
			}
		 },
		 function(error) {
			 console.log("ERROR14");
		 });
	  });
	} else {
		findNewPrefs();     
	}
}

function findNewPrefs() {
    newPrefs = []
    
    if (advies != '') {
        
        //console.log('finding new prefs');
        
        query = `SELECT id_alt, count(id_alt) AS count_id, AVG(portion) AS avg_portion FROM pref_alt WHERE id_pref = '${advies}' GROUP BY id_alt ORDER BY count_id DESC`;
        db.transaction(function(transaction) {
         transaction.executeSql(query, [ ],
         function(tx, result) {
            if (result.rows.length > 0) {
                //console.log('result consists of more than one line');
                for (i=0;i<result.rows.length;i++){
                    if (result.rows.item(i).count_id >= 3) {
                        newPrefs.push([result.rows.item(i).id_alt, Math.round(result.rows.item(0).avg_portion*4)/4, advies]);
                    }
                }
                //databaseBusy = false;
                if (newPrefs.length > 0) {
                    newPrefMenu(newPrefs, true);
                } else {
                    databaseBusy = false;
                }
                checkingUpdates = false;
            } else {
                databaseBusy = false;
                checkingUpdates = false;
            }
         },
         function(error) {
             console.log("ERROR14B");
         });
      });
    } else {
        databaseBusy = false;
        checkingUpdates = false;
    }
}

function updatePrefMenu(id_pref, id_alt, portion, keys, i) {
	//console.log('update pref menu');
	
	query = `UPDATE pref_menu SET ID_product = ${id_alt}, portions=${portion} WHERE id_key=${id_pref}`;
	db.transaction(function(transaction) {
	 transaction.executeSql(query, [ ],
	 function(tx, result) {
		deleteOldPreferences(id_pref, keys, i);
	 },
	 function(error) {
		 console.log("ERROR15");
	 });
  });
}
 
function deletePrefMenu(id_pref, id_alt, portion, keys, i) {
    //delete from the pref menu
    query = `DELETE FROM pref_menu WHERE id_key=${id_pref}`;
	db.transaction(function(transaction) {
	 transaction.executeSql(query, [ ],
	 function(tx, result) {
		deleteOldPreferences(id_pref, keys, i);
	 },
	 function(error) {
		 console.log("ERROR15A");
	 });
  });
}

function deleteOldPreferences(id_pref, keys, i) {
	//console.log('delete old pref')
	query = `DELETE FROM pref_alt WHERE id_pref=${id_pref}`;
	db.transaction(function(transaction) {
	 transaction.executeSql(query, [ ],
	 function(tx, result) {
		//console.log("the whole update for the pref menu is finished");
		//databaseBusy = false;
		findPrefAlts(keys, i+1); //check next
	 },
	 function(error) {
		 console.log("ERROR16");
	 });
  });
}

function setNumChoices(menu, i){
	databaseBusy = true;
	if (i<menu.length){
		id = menu[i][0]
		query = `UPDATE protein_products SET num_choices = num_choices + 1 WHERE ID = ${id}`;
		db.transaction(function(transaction) {
		transaction.executeSql(query, [ ],
		function(tx, result) {
			//console.log('num_choices updated');
			setNumChoices(menu, i+1);
		 },
		 function(error) {
			 console.log("ERROR17");
		 });
	  });
	}
	else {
		databaseBusy = false;
	}
}

function foodBoxProtein(advies) {
    if (!databaseBusy) {
        intake = 0;
        names = [];
        where = ``;
        numbers = [];
        types = [];

        for (i=0;i<foodBoxInfo.length;i++){
            where += `ID=${foodBoxInfo[i][0]}`
            if(i!=foodBoxInfo.length -1) {
                where += ` OR `;
            }
            numbers.push(foodBoxInfo[i][1]);
        }
        query = `SELECT id, name, portion_alt, protein_points, alt_size FROM protein_products WHERE ${where}`; //changed
        //console.log(query);
        db.transaction(function(transaction) {
         transaction.executeSql(query, [ ],
         function(tx, result) {
            for(i=0;i<result.rows.length;i++) {
                for (j=0; j<foodBoxInfo.length; j++) {
                    //console.log(foodBoxInfo[j][0], result.rows.item(i).ID)
                    if (foodBoxInfo[j][0] == result.rows.item(i).ID) {
                        intake += roundPoints((foodBoxInfo[j][1] / result.rows.item(i).alt_size) * result.rows.item(i).protein_points); //changed
                        //console.log('this is added to intake. total is now ' + intake);
                        names.push(result.rows.item(i).name);
                        types.push(result.rows.item(i).portion_alt);
                    }
                }	
            }
             databaseBusy = false; 
             checkProtein(intake, names, numbers, types, advies);
         },
         function(error) {
             console.log("ERROR18");
         });
        });
    } else {
        setTimeout(function () {foodBoxProtein(advies)}, 1000);
    }
}


function findProteinsInHistory(day) {
    
    databaseBusy = true;
    
	var timestamps = [];
	dietAdviceValues = [];
	dietAdviceProteins_taken = [];
    dietAdviceItems = [];
    
    items = '';
	
	for (i=0; i<dietAdviceNames.length; i++) {
		timestamps.push('');
		dietAdviceValues.push(false);
		dietAdviceProteins_taken.push(0);
        dietAdviceItems.push([]);
	}
	
	query = `SELECT timestamp, value FROM logging WHERE intakeDay = '${day}'`;
	//console.log(query);
	db.transaction(function(transaction) {
	 transaction.executeSql(query, [ ],
	 function(tx, result) {
		for(i=0;i<result.rows.length;i++) {
            //console.log(result.rows.item(i).value);
            intakeInfo = result.rows.item(i).value.split(":")[0]; //only the information about the intake
            if (result.rows.item(i).value.split(":")[1] != undefined) {
                items = result.rows.item(i).value.split(":")[1].split(',');
            }
            
			moment = intakeInfo.split('-')[0];
			protein = intakeInfo.split('-')[1];
			
            //console.log(moment);
			index = dietAdviceNames.indexOf(moment);
			
			if (!dietAdviceValues[index]) {
				dietAdviceValues[index] = true;
				dietAdviceProteins_taken[index] = parseFloat(protein);
                if (items !='') {dietAdviceItems[index] = items;}
				timestamps[index] = result.rows.item(i).timestamp;
			}
			else {
				d1 = new Date (timestamps[index]);
				d2 = new Date (result.rows.item(i).timestamp);
				if (d1 < d2) { //if current result is the newest
					dietAdviceProteins_taken[index] = parseFloat(protein);
                    if (items !='') {dietAdviceItems[index] = items;}
					timestamps[index] = result.rows.item(i).timestamp;
				}
			}
		}
		databaseBusy = false;
		changeSliders();
	 },
	 function(error) {
		 console.log("ERROR19");
	 });
	});
}


function foodBoxChoice() {
    products = [];
    
    databaseBusy = true;
	query = `SELECT * FROM protein_products WHERE foodBox == 1 ORDER BY name ASC`;
	//console.log(query);
	db.transaction(function(transaction) {
	 transaction.executeSql(query, [ ],
	 function(tx, result) {
		//still to program - this is done for debugging
         for (i=0; i<result.rows.length; i++) {
             //console.log(result.rows.item(i).name);
             products.push([result.rows.item(i).ID, result.rows.item(i).name, 0, result.rows.item(i).portion_type, result.rows.item(i).portion_alt, result.rows.item(i).alt_size, result.rows.item(i).protein_points, result.rows.item(i).protein_size, result.rows.item(i).energy_product, 0]);
         }
         databaseBusy = false;
         showFoodBoxProducts(products);
	 },
	 function(error) {
		 console.log("ERROR20");
	 });
	});
}

function deleteNewAddedPrefs(pref, i){
    //console.log(pref);
    
    if (i<pref.length) {
        //console.log('delete old extra pref')
        query = `DELETE FROM pref_alt WHERE id_alt=${pref[i][0]} AND id_pref='${pref[i][2]}'`;
        //console.log(query);
        db.transaction(function(transaction) {
         transaction.executeSql(query, [ ],
         function(tx, result) {
            //console.log("this is deleted");
            deleteNewAddedPrefs(pref, i+1);
         },
         function(error) {
             console.log("ERROR21");
         });
      });
    } else {
        databaseBusy = false;
    }

}

function dayTotals(total) {
    if (!databaseBusy) {
        databaseBusy = true;
    
        if (!historyOn) {intakeDay = dt.toLocaleDateString('en-US')};

        query = `SELECT * FROM day_totals WHERE day = '${intakeDay}'`;
        //console.log(query);
        db.transaction(function(transaction) {
            transaction.executeSql(query, [ ],
             function(tx, result) {
                if (result.rows.length == 0) {
                    addNewDayTotal(total);
                }
                else {
                    updateDayTotal(total);
                }
             },
             function(error) {
                 console.log("ERROR22");
            });
        });
    } else {
        setTimeout(function (){ dayTotals(total)}, 1000);
    }
}
                   
function addNewDayTotal(total) {
    query = `INSERT INTO day_totals VALUES ('${intakeDay}', ${total})`;
    //console.log(query);
    db.transaction(function(transaction) {
        transaction.executeSql(query, [ ],
         function(tx, result) {
            //console.log('new day total added');
            databaseBusy = false;
            //findStartDate(); //refresh counters -> calculate data for profile and achievements
            show_miniGameChoice();
         },
         function(error) {
             console.log("ERROR23");
        });
    });
}
                   
function updateDayTotal(total) {
    query = `UPDATE day_totals SET total = ${total} WHERE day = '${intakeDay}'`;
    
    writeLog(`Update protein total - New total: ${total} - Date: ${intakeDay}`);
    
    //console.log(query);
    db.transaction(function(transaction) {
        transaction.executeSql(query, [ ],
         function(tx, result) {
            //console.log('day total updated');
            databaseBusy = false;
            //findStartDate(); //refresh counters -> calculate data for profile and achievements
            show_miniGameChoice();
         },
         function(error) {
             console.log("ERROR24");
        });
    });
}