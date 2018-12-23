/* DraftLog 
  What it does
It allows you to re-write a line of your log after being written. Just like post 'updating'. This is the building block for any dynamic element such as progress bars, loading status, animations, checkboxes and so on.
It does that by keeping track of the current lines of code written through the stream, and moving the cursor up to the line of the LogDraft you created previously, and updating its content.
Look in the examples folders to see how easy it is, to create anything. No strict and fixed widgets are given to you. Instead, use your creativity with this tool to create anything you want! Share the results later with an example ;)
Looking for CUTE Unicode chars? Check out Unicute.
How the HECK is that even possible? */
// Setup
const chalk = require('chalk')
require('draftlog').into(console)

// Format and Define Debug Ouput Here
var nodeStr = "Schaukel Experiment Alpha 0.1"
console.log(chalk.dim('*'.repeat(nodeStr.length + 2)))
console.draft(nodeStr)
console.log(chalk.dim('*'.repeat(nodeStr.length + 2)))

console.log();
var errordraft = console.draft();
console.log();
var webservermsgdraft = console.draft(chalk.bold.green('Webserver Status:') + " " + chalk.red(`WebServer not running.`));
console.log();
var browserdraft = console.draft(chalk.bold.green('Browser Status:') + " " + chalk.red("Browser client disconnected from the connection. Open Webserver Url with your Browser"));
console.log();
var debugdraft = console.draft();
console.log()

var pot1draft = console.draft(chalk.inverse('Potentiometer #1:'));
var pot2draft = console.draft(chalk.inverse('Potentiometer #2:'));

// Server Setup
var jfive, board, socket, socketConnected = false;

var ip = require('underscore')
  .chain(require('os').networkInterfaces())
  .values()
  .flatten()
  .find({ family: 'IPv4', internal: true })
  .value()
  .address;

var express = require('express');
var app = express();
var PORT = 3000;
var http = require('http').Server(app);
var io = require('socket.io')(http);
jfive = require("johnny-five");

http.listen(PORT, 'localhost2');

http.on('close', function () {
  // Update Console Draft for Messages
  webservermsgdraft(chalk.bold.green('Webserver Status:') + " " + chalk.red(`WebServer not running.`));
});

http.on('error', function (error) {
  //Update Console Draft for debug messages
  errordraft(chalk.bgRed('Error') + " " + chalk.red(error.code) + " " + chalk.bold.inverse(error.message.split('\n')[0]));

  // If Connection already in Use Close all Server and Try again
  if (error.code === 'EADDRINUSE') {
    // Update Console Draft for Debug Message
    debugdraft(chalk.bold.cyan('***DEBUG***') + " " + chalk.cyan('Close all Server Connection and Try Again.'));
    setTimeout(() => {
      http.close();
      http.listen(PORT, HOST);
    }, 1000);
  }

  //if Server Adress doesnt exists fallback to constant
  if (error.code === 'ENOTFOUND') {
    // Update Console Draft for Debug Message
    debugdraft(chalk.bold.cyan('***DEBUG***') + " " + chalk.cyan('Server Adress doesnt exists fallback to constant. Close all Server Connection and Try Again.'));
    setTimeout(() => {
      http.close();
      http.listen(PORT, ip);
    }, 1000);
  }

});

http.on('listening', function () {
  var host = this.address().address;
  // Update Console Draft for Messages
  webservermsgdraft(chalk.bold.green('Webserver Status:') + " " + chalk.yellow(`WebServer started on the http://${host}:${PORT}`));
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(express.static('public'));

// dummy data
let dataTarget = 1024;
let i = 0;
let j = [0, 10, 25, 50, 75, 100, 150, 200, 250, 400, 600, 750, 900, 1024, 900, 750, 600, 400, 250, 200, 100, 75, 50, 25, 10, 0];
let k = [1024, 900, 750, 600, 400, 250, 200, 100, 75, 50, 25, 0, 10, 25, 50, 75, 100, 150, 200, 250, 400, 600, 750, 900, 1024];
let l = j.map(function (x) { return x + 100 });

const sendData = async socket => {

  try {
    if (socket.connected) {
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
    errordraft(chalk.bgRed(error.code) + error.message);
  }
  i++;
  if (i == 24) {
    i = 0;
  }
};

io.on('connection', function (s) {
  // Saving this for the board on ready callback function
  socket = s;

  browserdraft(chalk.bold.green('Browser Status:') + " " + chalk.yellow('Connection has been established with browser.'));

  socket.on('message', function (event) {
    // Update Console Draft for Messages of successful Connection
    browserdraft(chalk.bold.green('Browser Status:') + " " + chalk.yellow(event.type + " " + event.message));
  });

  // Update Console Draft for Debug Message
  debugdraft(chalk.bold.cyan('***DEBUG***') + " " + chalk.cyan('Stream connection established to StreamID: ' + socket.id));


  // Update Console Draft for Messages because Browser disconnected
  socket.on('disconnect', () => {
    browserdraft(chalk.bold.green('Browser Status:') + " " + chalk.red('Browser client disconnected from the connection.'));
  });




  board = new jfive.Board({
    repl: false,
    debug: false,
  });

  // Check the Board Messages
  board.on("message", function (event) {
    //Update Console Draft for debug messages
    // Check the Board Messages
    this.on("error", function () {
      //Update Console Draft for debug messages
      errordraft(chalk.bgRed(event.type) + " " + chalk.red(event.class) + " " + chalk.bold.inverse(event.message.split('\n')[0]));

      // Update Console Draft for Debug Message
      debugdraft(chalk.bold.cyan('***DEBUG***') + " " + chalk.cyan('No Board Connection. Set Dummy Values for the Pots...'));

      // Set Interval for random Dummy Values
      setInterval(() => sendData(socket), 100);
    });

  });



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
    this.repl.inject({
      pot1: potentiometer1
    });

    this.repl.inject({
      pot2: potentiometer2
    });

    // "data" get the current reading from the potentiometer
    potentiometer1.on("change", function () {
      // We send the value when the browser is connected.
      if (socket.connected) {
        socket.emit('sendData', this.value);
        // Debug Message
        // You can create dynamic variables with eval.
        // eval("dynamic" + i + " = val[i]");
        pot1draft('Potentiometer #1: ', this.value);
      }
    });

    potentiometer2.on("change", function () {
      // We send the temperature when the browser is connected.
      if (socket.connected) {
        socket.emit('sendData2', this.value);
        // Debug Message
        pot2draft('Potentiometer #2: ', this.value);
      }
    });

  });

});

// References
//
// http://arduino.cc/en/Tutorial/AnalogInput