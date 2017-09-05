var five = require("johnny-five");
var firebase = require('firebase');
var board = new five.Board();

board.on("ready", function() {
	
	// Set up variables
	/*** RGB LED ***/
	var rgb = new five.Led.RGB([11,9,10]);
	/*** LEDS RGB ***/	
	//var leds = new five.Leds([3, 5, 6]);
	//var led = new five.Led(6);
	
	/*** Proximity Sensors ***/	
  	var proximity = new five.Proximity({
	    controller: "HCSR04",
	    pin: 7,
	    freq: "700"
  	});
  	/*** Firebase Setup Config ***/
  	firebase.initializeApp({
      	apiKey: "AIzaSyCnCCmWUR9vVDSMxmlcbuEOKGV_jekKEQw",
      	authDomain: "iot-arduino-827cb.firebaseapp.com",
      	databaseURL: "https://iot-arduino-827cb.firebaseio.com",
      	projectId: "iot-arduino-827cb",
      	storageBucket: "iot-arduino-827cb.appspot.com",
      	messagingSenderId: "971124207623",
      	//provider: "anonymous",
      	//uid: "41a455a7-388c-4c17-912f-07c5899d4b2a"
  	});

  	// RGB LED
  	var ref   = firebase.database().ref('color');
  	var nref  = firebase.database().ref('person');
	
	// Firebase RGB LEDS array references
  	var ledRed   = firebase.database().ref('leds/red');
  	var ledGreen = firebase.database().ref('leds/green');
  	var ledBlue  = firebase.database().ref('leds/blue');
  	
  	// LEDS
  	// Pulse all leds in the object.
  	//led.on();
  	//led.pulse();
  	//leds.pulse();
  	//leds.off();

    ledGreen.on('value', function(snapshot) {
		if(snapshot.val() == 1) {
        	//leds[0].on();  
      	} else
      	if (snapshot.val() == 0){        
      		//leds[0].off();
      	}
    });  

    ledBlue.on('value', function(snapshot) {
		if(snapshot.val() == 1) {
        	//leds[1].on();  
      	} else
      	if (snapshot.val() == 0){        
      		//leds[1].off();
      	}
    });

  	ledRed.on('value', function(snapshot) {
		if(snapshot.val() == 1) {
        	//leds[2].on();  
      	} else
      	if (snapshot.val() == 0){        
      		//leds[2].off();
      	}
    }); 

  	//ledRed.set('off');
  	//ledGreen.set('off');
  	//ledBlue.set('off');



    //var servo = new five.Servo(2);

    //Add servo to REPL (optional)
    //this.repl.inject({
        //servo: servo,
        //range: [ 0, 180 ]
    //});

    //servo.to(90, 500, 10);

    // Set horn to 45°
    //servo.min();

    //servo.sweep();

    var ledRef = ref;

    ledRef.on('value', function(snapshot) {
      	if(snapshot.val() == 'red') {
        	rgb.color("FF0000");        
      	} else if (snapshot.val() =='blue'){        
      		rgb.color("FFFF00");
      	}
    });

  	proximity.on("data", function() {

        var cmtr = this.cm;
        var inch = this.in;
        var excm = Math.floor(cmtr);
        var exin = Math.floor(inch);

        console.log("Proximity: ");
        console.log("  cm  : ", cmtr + ' ('+excm+')');
        console.log("  in  : ", inch + ' ('+exin+')');
        console.log("-----------------");

  	});

  	proximity.on("change", function() {

	    var cmtr = this.cm;
	    var inch = this.in;
	    var exct = Math.floor(cmtr);
	    
	    if (exct < 20) {
	      ref.set('red');
	      //rgb.color("FF0000");
	      setTimeout(function() {
	        nref.push(
	            {
	            'message':'Hi, someone turn the led to red!',
	            'timestamp':firebase.database.ServerValue.TIMESTAMP
	        });       
	      },800);
	    } else {
	      ref.set('blue');
	      //rgb.color("FFFF00");
	    }
	    //console.log(exct +" The obstruction has moved.");
	  });
});

