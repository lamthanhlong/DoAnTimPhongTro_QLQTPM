const express = require('express');
const app2 = express();
const server = require('http').Server(app2);
const io = require('socket.io')(server);
const client = require('./utils/socket');
const SOCKET_PORT = 5050;
server.listen(SOCKET_PORT);
io.on('connection', (socket) => {
  client.addUser(socket);
  client.userSendMessenger(socket);
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
console.log(`Server Socket is listening in PORT = ${SOCKET_PORT}`);
