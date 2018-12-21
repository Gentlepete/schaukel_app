/* DraftLog 
  What it does
It allows you to re-write a line of your log after being written. Just like post 'updating'. This is the building block for any dynamic element such as progress bars, loading status, animations, checkboxes and so on.
It does that by keeping track of the current lines of code written through the stream, and moving the cursor up to the line of the LogDraft you created previously, and updating its content.
Look in the examples folders to see how easy it is, to create anything. No strict and fixed widgets are given to you. Instead, use your creativity with this tool to create anything you want! Share the results later with an example ;)
Looking for CUTE Unicode chars? Check out Unicute.
How the HECK is that even possible? */
// Setup
const chalk = require('chalk')
require('draftlog').into(console).addLineListener(process.stdin)

// Format and Define Debug Ouput Here
var nodeStr = "Schaukel Experiment Alpha 0.1"
console.log(chalk.dim('*'.repeat(nodeStr.length + 2)))
console.draft(nodeStr)
console.log(chalk.dim('*'.repeat(nodeStr.length + 2)))
console.log();
var portdraft = console.draft();
var streamdraft = console.draft();
console.log();
var pot1draft = console.draft('Potentiometer #1: ');
var pot2draft = console.draft('Potentiometer #2: ');


// Server Setup
var board, socket,
  connected = false;

var express = require('express')
var app = express();
var PORT = 3000;
var http = require('http').Server(app);
var io = require('socket.io')(http, { debug: true });

http.listen(PORT, "localhost", function (err) {
  if (err) throw err;
  // Update Console Draft for Debug
  portdraft(chalk.red('Server listening on *:' + PORT));
});

var jfive = require("johnny-five");
var board = new jfive.Board();

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(express.static('public'));

io.on('connection', function (s) {
  // Saving this for the board on ready callback function
  socket = s;

  // Tracking connection
  connected = true;

  // Update Console Draft for Debug
  streamdraft(chalk.red('Stream connection established to StreamID: ' + socket.id));
});

// io.sockets.on("connect", () => setInterval(() => sendData(socket), 100));

// Code für dummy data wenn kein arduino angeschlossen ist
let dataTarget = 1024;
let i = 0;
let j = [0, 10, 25, 50, 75, 100, 150, 200, 250, 400, 600, 750, 900, 1024, 900, 750, 600, 400, 250, 200, 100, 75, 50, 25, 10, 0];
let k = [1024, 900, 750, 600, 400, 250, 200, 100, 75, 50, 25, 0, 10, 25, 50, 75, 100, 150, 200, 250, 400, 600, 750, 900, 1024];
let l = j.map(function (x) { return x + 100 });

const sendData = async socket => {
  try {
    if (connected) {
      socket.emit('sendData', j[i]);

      // Debug Message
      pot1draft('Potentiometer #1: ', j[i])
      // console.group('sendData')
      // console.log(j[i]);
      // console.groupEnd();

      socket.emit('sendData2', l[i]);

      // Debug Message
      pot2draft('Potentiometer #2: ', l[i])
      // console.group('sendData2')
      // console.log(l[i]);
      // console.groupEnd();
    }
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
  i++;
  if (i == 24) {
    i = 0;
  }
};

// setInterval(function () {

//   if (connected) {
//     socket.emit('sendData', j[i]);
//   }



//   if (connected) {
//     socket.emit('sendData2', l[i]);
//   }

//   i++;
//   if (i == 24) {
//     i = 0;
//   }
// }, 100);



board.on("ready", function () {

  // Create a new `potentiometer` hardware instance.
  var potentiometer1 = new jfive.Sensor({
    pin: "A0",
    freq: 45
  });

  var potentiometer2 = new jfive.Sensor({
    pin: "A1",
    freq: 45
  });

  // Inject the `sensor` hardware into
  // the Repl instance's context;
  // allows direct command line access
  board.repl.inject({
    pot1: potentiometer1
  });

  board.repl.inject({
    pot2: potentiometer2
  });

  // "data" get the current reading from the potentiometer
  potentiometer1.on("data", function () {
    // We send the value when the browser is connected.
    if (connected) {
      socket.emit('sendData', this.value);
      // Debug Message
      pot1draft('Potentiometer #1: ', this.value);
    }
  });

  potentiometer2.on("data", function () {
    // We send the temperature when the browser is connected.
    if (connected) {
      socket.emit('sendData2', this.value);
      // Debug Message
      pot1draft('Potentiometer #2: ', this.value);
    }
  });

});

// References
//
// http://arduino.cc/en/Tutorial/AnalogInput