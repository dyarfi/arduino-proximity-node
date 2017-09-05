var five = require("johnny-five");
var firebase = require('firebase');
var board = new five.Board();

var leds = new five.Leds([3, 5, 6]);

board.on("ready", function() {

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

  	var ref   = firebase.database().ref('color');
  	var nref  = firebase.database().ref('person');

  	var rgb = new five.Led.RGB([11,9,10]);

  	var proximity = new five.Proximity({
	    controller: "HCSR04",
	    pin: 7,
	    freq: "700"
  	});
  	
  	// LEDS
  	// Pulse all leds in the object.
  	leds.pulse();



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

    ledRef.once('value', function(snapshot) {
      //console.log(snapshot.val());
      if(snapshot.val() =='red') {
        rgb.color("FF0000");        
      } else if (snapshot.val() =='off'){        

      }
    });

  	proximity.on("data", function() {

	    var cmtr = this.cm;
	    var inch = this.in;
	    var exct = Math.floor(cmtr);

	    //console.log("Proximity: ");
	    //console.log("  cm  : ", cmtr);
	    //console.log("  in  : ", inch);
	    //console.log("-----------------");

  	});

  	proximity.on("change", function() {

	    var cmtr = this.cm;
	    var inch = this.in;
	    var exct = Math.floor(cmtr);
	    
	    if (exct < 20) {
	      ref.set('red');
	      rgb.color("FF0000");
	      setTimeout(function() {
	        nref.push(
	            {
	            'message':'Hi, someone turn the led to red!',
	            'timestamp':firebase.database.ServerValue.TIMESTAMP
	        });       
	      },800);
	    } else {
	      ref.set('blue');
	      rgb.color("FFFF00");
	    }
	    //console.log(exct +" The obstruction has moved.");
	  });
});

