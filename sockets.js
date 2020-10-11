var socket_io = require ('socket.io');

var messages = [];
var userlist = [];

var io = socket_io ();
var socketApi = {};

socketApi.io = io;

io.on ('connection', onSocketConnection);

function onSocketConnection (socket) {
  console.log ('A user connected. Id = ' + socket.id);
  emitChatHistory ();
  socket.on ('chat message', onChatMessageReceived);
  socket.on ('username', onUsernameChange);
  socket.on ('typing', onUserTypingChange);
  socket.on ('disconnect', onSocketDisconnected);

  function emitChatHistory () {
    socket.emit ('connection messages', messages);
  }

  function onChatMessageReceived (message) {
    messages.push (message);
    socket.broadcast.emit ('chat message', message);
  }

  function onSocketDisconnected () {
    console.log ('A user connected. Id = ' + socket.id);
  }

  function onUserTypingChange (isUserTyping) {
    io.emit ('typing', isUserTyping);
  }

  function onUsernameChange (username) {
    userlist.push (username);
    console.log (username);
  }
}

module.exports = socketApi;
