// Variables init
var five = require("johnny-five");
var firebase = require('firebase');
var board = new five.Board();
// Board on Ready function
board.on("ready", function() {
    // RGB LED
    var rgb = new five.Led.RGB([5,6,4]);
    // Proximity Sensors
    var proximity = new five.Proximity({
        controller: "HCSR04",
        pin: 2,
        freq: 900
    });
    // Relay module
    var relay = new five.Relay(10);   
    // Firebase Initialize
    firebase.initializeApp({
        apiKey: "AIzaSyCnCCmWUR9vVDSMxmlcbuEOKGV_jekKEQw",
        authDomain: "iot-arduino-827cb.firebaseapp.com",
        databaseURL: "https://iot-arduino-827cb.firebaseio.com",
        projectId: "iot-arduino-827cb",
        storageBucket: "iot-arduino-827cb.appspot.com",
        messagingSenderId: "971124207623",
    });
    // Firebase references
    var ref   = firebase.database().ref('color');
    var nref  = firebase.database().ref('person');
    var lref  = firebase.database().ref('lights');
    
    // Check on the leds references value
    ref.on('value', function(snapshot) {
        if(snapshot.val() =='red') {
            rgb.color("FF0000");
        } else if (snapshot.val() =='off') {

        }
    });

    // Check on the lights references value
    lref.on('value', function(snapshot) {
        if(snapshot.val() =='on') {
            relay.on();       
            setTimeout(function() {
                nref.push({
                    'type':'relay_on',
                    'message':'Hi, XMAS Light is ON!',
                    'timestamp':firebase.database.ServerValue.TIMESTAMP
                });       
            },1000);      
        } else if (snapshot.val() =='off'){        
            relay.off();                   
            setTimeout(function() {
                nref.push({
                    'type':'relay_off',
                    'message':'Hi, XMAS Light is OFF!',
                    'timestamp':firebase.database.ServerValue.TIMESTAMP
                });       
            },1000);
        }
    });

    // Proximity on Data function    
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
    

    // Proximity on Data Change function
    
    proximity.on("change", function() {
        var cmtr = this.cm;
        var inch = this.in;
        var exct = Math.floor(cmtr);   
        // Detect if the distances below 20cm
        if (exct < 20) {
            ref.set('red');
            rgb.color("FF0000");
            // Set a second for saving data in firebase 
            setTimeout(function() {
                nref.push({
                    'type':'relay_proximity',
                    'message':'Hi, Someone arrived!',
                    'timestamp':firebase.database.ServerValue.TIMESTAMP
                });       
            },1000);            
            // $this.wait(800, function(){
            //     nref.push({
            //         'message':'Hi, someone turn the led to red!',
            //         'timestamp':firebase.database.ServerValue.TIMESTAMP
            //     });
            // });
        //} else if (exct < 100) {
        } else {
            ref.set('blue');
            rgb.color("FFFF00");
        }
    });
    
});

