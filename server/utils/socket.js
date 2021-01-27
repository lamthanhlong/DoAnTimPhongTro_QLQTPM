var users = {};

let addUser = (socket) => {
  socket.on('ADD_USER', async (data) => {

    socket.userId = data._id;
    socket.userInfo = data;
    users[socket.userId] = socket;
  });
};

let userSendMessenger = (socket) => {
  socket.on('USER_SEND_MESSENGER', (data, receiverId) => {
    var message = data.message;
    var receiverId = receiverId;

    if (!users[receiverId]) 
      return;
    users[receiverId].emit('USER_SEND_MESSENGER', {
      message: message,
      sender: socket.userInfo,
    });
  });
};

let removeUser = (socket) => {
  socket.on('REMOVE_USER', (data) => {
    var userId = data.userId;
    delete users[userId];
    delete socket[userId];
    console.log(`User ${userId} disconnected`);
    // console.log("remove success")
  });
};

module.exports = {
  addUser: addUser,
  removeUser: removeUser,
  userSendMessenger: userSendMessenger,
};
