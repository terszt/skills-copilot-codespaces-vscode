// Create web server
var server = http.createServer(app);

// Start web server
server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

// Create socket.io server
var io = require('socket.io')(server);

// Create socket.io event handlers
io.on('connection', function(socket) {
  console.log('Client connected to socket.io server');

  // Listen for client disconnect
  socket.on('disconnect', function() {
    console.log('Client disconnected from socket.io server');
  });
});

// Create serialport
var serialport = require('serialport');
var portName = '/dev/cu.usbmodem1421';
var sp = new serialport.SerialPort(portName, {
  baudRate: 9600,
  parser: serialport.parsers.readline('\n')
});

// Create serialport event handlers
sp.on('open', function() {
  console.log('Serial port opened');
});

// Listen for data
sp.on('data', function(data) {
  console.log('Data received: ' + data);

  // Send data to socket.io clients
  io.emit('data', data);
});

// Listen for errors
sp.on('error', function(err) {
  console.error('Error: ', err.message);
});
