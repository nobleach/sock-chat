var expect = require('chai').expect;
var io = require('socket.io-client');

var socketUrl = 'http://0.0.0.0:5000';

var options = {
  transports: ['websocket'],
  'force new connection': true
}

var chatUser1 = {'name':'Tom'};
var chatUser2 = {'name':'Sally'};
var chatUser3 = {'name':'Dana'};

describe('User', function() {
  it('should be a valid user on our system', function() {

  });

  describe('User Events', function() {
    it('should emit a connected event when a user connects', function () {
      var client1 = io.connect(socketUrl, options); 

      client1.on('connect', function(data) {
        client1.emit('connection name', chatUser1);

        var client2 = io.connect(socketUrl, options);
        client2.on('connect', function(data){
          client2.emit('connection name', chatUser2);
        });

        client2.on('new user', function(usersName){
          expect(usersName).to.equal(chatUser2.name + " has joined.");
          client2.disconnect();
        });
      });

      var numUsers = 0;
      client1.on('new user', function(usersName){
        numUsers += 1;

        if(numUsers === 2){
          usersName.should.equal(chatUser2.name + " has joined.");
          client1.disconnect();
          done();
        }
      });
    });

    it('should emit a disconnect event when a user disconnects', function() {

    });

    it('should emit a "new message" event when user has submitted a new message', function() {

    });

    it('should emit a "user typing" event with username when a user is typing', function() {

    });
  });
});
