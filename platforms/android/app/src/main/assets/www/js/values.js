//Dietary advices at 7 different timepoints//
var dietAdviceNames = [];
var dietAdviceValues = [];

//Times for the advices
var timesAdvices = [];

//Proteins for the advices and taken proteins
var dietAdviceProteins = [];
var dietAdviceProteins_taken = [];
var dietAdviceItems = []; //items eaten

//moments is used to translate the dietAdvices to the screen
var moments = [];

//current advice = global
//current menu = global
var advies = "";
var currentMenu = [];
var currentMenu_base = []; //base copy of each current menu
//current alternatives global
var alternatives_list = [];
//current product to substitute global
var substProduct = [];
//current intake protein (before submission) in maaltijdsamensteller global
var currentIntake = [];
//all current possible new product
var new_products = [];

//Extra items
var numExtraItems = 10;
var extraItems = []
for (i = 0; i < numExtraItems; i++) {
	extraItems.push(0);
}

//Initial current time
var now = new Date();
var currentTime = now.getHours() + (now.getMinutes() / 60);

//Variable for reminders
var herinnering = false;
var herinneringsTijd = 0;

//Global boolean for open screen (pop-up)
var screenOpen = false;

//Notification sound
var notificationSound = new Audio('sounds/notification.wav');
//gamification sounds
var rightSound = new Audio('sounds/right.mp3');
var wrongSound = new Audio('sounds/wrong.wav');
//achievement sounds
var achievementSound = new Audio('sounds/achievement.wav');
var bingoSound = new Audio('sounds/bingo.wav');
var gameOverSound = new Audio('sounds/gameover.wav');

//FoodBox
var foodBoxURL = "http://192.168.4.1/latest" //'test.txt' //'http://192.168.4.1/latest'; //URL for foodbox request global
var foodBoxReading = false; //global switch for busy foodbox
var foodBoxInfo = []; //information from the foodbox global
var foodBoxProducts = []; //global for foodbox products when manual adding after unknown
//var foodBoxProducts_selected = []; //global for selected products

//global personal variables
var participantenID;
var geslacht;
var aanspreekvorm;
var voornaam;
var achternaam;
var comm_style;

//global variable for history date
var intakeDay;
var historyOn = false;

//globals for protein points (discussed with dietist)
var maxPoints = 10;
var stepSizePoints = 0.5;
