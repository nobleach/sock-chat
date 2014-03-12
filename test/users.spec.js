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

  it('Should be able to broadcast messages', function(done){
    var client1, client2, client3;
    var message = 'Hello World';
    var messages = 0;

    var checkMessage = function(client){
      client.on('message', function(msg){
        expect(message).to.equal(msg);
        client.disconnect();
        messages++;
        if(messages === 3){
          done();
        };
      });
    };

    client1 = io.connect(socketURL, options);
    checkMessage(client1);

    client1.on('connect', function(data){
      client2 = io.connect(socketURL, options);
      checkMessage(client2);

      client2.on('connect', function(data){
        client3 = io.connect(socketURL, options);
        checkMessage(client3);

        client3.on('connect', function(data){
          client2.send(message);
        });
      });
    });
  });
});
