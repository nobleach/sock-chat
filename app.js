var io = require('socket.io').listen(5000);

var users = [
  {name: 'carl'},
  {name: 'earl'},
  {name: 'biff'},
  {name: 'shelly'},
  {name: 'kyle'}
]

io.sockets.on('connection', function (socket) {
  socket.on('connection name',function(user){
    io.sockets.emit('new user', user.name + " has joined.");
  })

});

