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

    var lcd = new five.LCD({
        // LCD pin name  RS  EN  DB4 DB5 DB6 DB7
        // Arduino pin # 7    8   9   10  11  12
        pins: [7, 8, 9, 10, 11, 12],       
        backlight: 6,
        rows: 2,
        cols: 16
        // Options:
        // bitMode: 4 or 8, defaults to 4
        // lines: number of lines, defaults to 2
        // dots: matrix dimensions, defaults to "5x8"
    });

        // Tell the LCD you will use these characters:
    lcd.useChar("check");
    lcd.useChar("heart");
    lcd.useChar("duck");

    // Line 1: Hi rmurphey & hgstrp!
    lcd.clear().print("rmurphey, hgstrp");
    lcd.cursor(1, 0);

    // Line 2: I <3 johnny-five
    // lcd.print("I").write(7).print(" johnny-five");
    // can now be written as:
    lcd.print("I :heart: johnny-five");

    this.wait(3000, function() {
        lcd.clear().cursor(0, 0).print("I :check::heart: 2 :duck: :)");
    });

    this.repl.inject({
        lcd: lcd
    });

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
    // Check references value
    ref.on('value', function(snapshot) {
        if(snapshot.val() =='red') {
            rgb.color("FF0000");        
        } else if (snapshot.val() =='off'){        

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
                    'type':'lcd',
                    'message':'Hi, Red LED detected!',
                    'timestamp':firebase.database.ServerValue.TIMESTAMP
                });       
            },1000);            
            // $this.wait(800, function(){
            //     nref.push({
            //         'message':'Hi, someone turn the led to red!',
            //         'timestamp':firebase.database.ServerValue.TIMESTAMP
            //     });
            // });
        } else {
            ref.set('blue');
            rgb.color("FFFF00");
        }
    });
});

