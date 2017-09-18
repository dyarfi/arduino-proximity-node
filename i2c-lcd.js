var five = require("johnny-five"),
    scroll = require('lcd-scrolling');
var board = new five.Board();

board.on("ready", function() {


  var random = Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 4).toUpperCase();

  // Controller: PCF8574A (Generic I2C)
  // Locate the controller chip model number on the chip itself.
  var l = new five.LCD({
    controller: "PCF8574A",
    rows: 2,
    cols: 16
  });
    /*
      l.useChar("heart");
      l.cursor(0, 0).print("hello :heart:");
      //l.blink();
      l.cursor(1, 0).print("Blinking? ");
      l.cursor(1, 11).print("hll wrld! ");  
      l.cursor(0, 10).print(random);
      //l.cursor(0, 10).blink();
    */
        
    scroll.setup({
        lcd: l, /* Required */        
        // Optional parameters defaults 
        // debug: false, - true will enable console.log() 
        // char_length: 16, - Number of characters per line on your LCD 
        // row: 2, - Number of rows on your LCD 
        // firstCharPauseDuration: 4000, - Duration of the pause before your text start scrolling. Value in ms 
        // lastCharPauseDuration: 1000, - Duration to wait before restarting the animation 
        // scrollingDuration: 300, - Time per step (speed of the animation). 
        // full: true - Extend text with white space to be animated out of the screen completely 
    });
    
    l.useChar("heart");
    scroll.line( 0, "#trend1 #trend2 #trend3 :heart:" );
    scroll.line( 1, "Second line here text :heart: :heart: :heart:" );

    //setTimeout(function() {
        //process.exit(0);
    //}, 3000);
});