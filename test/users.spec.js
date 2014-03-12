var expect = require('chai').expect;
var io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:5000';

var options = {
  transports: ['websocket'],
  'force new connection': true
}

var chatUser1 = {'name':'Tom'};
var chatUser2 = {'name':'Sally'};
var chatUser3 = {'name':'Dana'};

describe("Chat Server",function(){
  it('Should broadcast new user to all users', function(done){
    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data){
      client1.emit('connection name', chatUser1);

      var client2 = io.connect(socketURL, options);

      client2.on('connect', function(data){
        client2.emit('connection name', chatUser2);
      });

      client2.on('new user', function(usersName){
        console.log(usersName);
        expect(usersName).to.equal(chatUser2.name + " has joined.");
        client2.disconnect();
      });

    });

    var numUsers = 0;
    client1.on('new user', function(usersName){
      numUsers += 1;

      if(numUsers === 2){
        expect(usersName).to.equal(chatUser2.name + " has joined.");
        client1.disconnect();
        done();
      }
    });
  });
});
