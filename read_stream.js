var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var jfive = require("johnny-five");
//var board = new jfive.Board();

var board, socket,
      connected = false;

app.get('/', function(req, res){
   res.sendFile(__dirname + '/index.html');
  //  res.sendFile(__dirname + '/background.mp4');
});

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(express.static('public'));

// app.use(express.static(path.join(__dirname, 'videos')));

io.on('connection', function(s){
   // Tracking connection
   connected = true;
   // Saving this for the board on ready callback function
   socket = s;
});

    let dataTarget = 1024;
    let i = 0;
    let j = [0, 10, 25, 50, 75, 100, 150, 200, 250, 400, 600, 750, 900, 1024, 900, 750, 600, 400, 250, 200, 100, 75, 50, 25, 10, 0];
    let k = [1024, 900, 750, 600, 400, 250, 200, 100, 75, 50, 25, 0, 10, 25, 50, 75, 100, 150, 200, 250, 400, 600, 750, 900, 1024];
    let l = j.map(function(x){ return x + 100});

    setInterval(function(){

        if(connected) socket.emit('sendData', j[i]);
        

        if(connected) socket.emit('sendData2', k[i]);

        i++;
        if ( i == 24) {
            i = 0;
        }
    }, 100);

// board.on("ready", function() {

//   // Create a new `potentiometer` hardware instance.
//   var potentiometer1 = new jfive.Sensor({
//     pin: "A0",
//     freq: 45
//   });

//   var potentiometer2 = new jfive.Sensor({
//     pin: "A1",
//     freq: 45
//   });

//   // Inject the `sensor` hardware into
//   // the Repl instance's context;
//   // allows direct command line access
//   board.repl.inject({
//     pot1: potentiometer1
//   });

//   board.repl.inject({
//     pot2: potentiometer2
//   });

//   // "data" get the current reading from the potentiometer
//   potentiometer1.on("data", function() {
//     // We send the temperature when the browser is connected.
//     if(connected) socket.emit('sendData', this.value);
//     // console.log("1: "+this.value);
//   });
//   // potentiometer2.on("data", function() {
//   //   // We send the temperature when the browser is connected.
//   //   if(connected) socket.emit('sendData2', this.value);
//   //   // console.log("2: "+this.value);
//   // });

// });

http.listen(3000);



// References
//
// http://arduino.cc/en/Tutorial/AnalogInput