var users = {};

let addUser = (socket) => {
  socket.on('ADD_USER', async (data) => {

    console.log(data);

    socket.userId = data._id;
    socket.userInfo = data;
    users[socket.userId] = socket;
  });
};

let userSendMessenger = (socket) => {
  socket.on('USER_SEND_MESSENGER', (data, receiver) => {
    var message = data.message;
    var receiverId = receiver._id;

    if (!users[receiverId]) return;

    console.log(message);

    users[receiverId].emit('USER_SEND_MESSENGER', {
      message: message,
      receiver: receiver,
      sender: socket.userInfo,
    });
  });
};

let removeUser = (socket) => {
  socket.on('REMOVE_USER', (data) => {
    var userId = data.userId;
    delete users[userId];
    console.log(`User ${userId} disconnected`);
    // console.log("remove success")
  });
};

module.exports = {
  addUser: addUser,
  removeUser: removeUser,
  userSendMessenger: userSendMessenger,
};
