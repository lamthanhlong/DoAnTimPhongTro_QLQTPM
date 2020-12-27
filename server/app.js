const express = require('express');
const morgan = require('morgan'); // log request
require('express-async-errors'); // handle async errors
const cors = require('cors'); // allow access from another web server

const app = express();
//Socket Declare
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const client = require('./utils/socket');
//Socket Handle
io.on('connection', (socket) => {
  client.addUser(socket);
  client.userSendMessenger(socket);
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
  console.log('Socket.io is Running');
});
// hide log when testing
if(!process.env.IS_TEST){
  app.use(morgan('dev'));
}
app.use(cors());
app.use(express.json());

// Hello
app.get('/', function (req, res) {
  res.end('Hello from The Best Solution backend!');
});

// Routes
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/user', require('./routes/user.route'));
app.use('/api/motel', require('./routes/motel.route'));
app.use('/api/rating', require('./routes/rating.route'));
//app.use('/api/conversation', require('./routes/conversation.route'));
// Error Handlers
app.use(function (req, res, next) {
  res.status(404).send({
    error_message: 'Endpoint not found!',
  });
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send({
    error_message: 'Something broke!',
  });
});
// Listening
if (!process.env.IS_BUILD) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, function () {a
    console.log(
      `The Best Solution backend api is running at http://localhost:${PORT}`
    );
  });
}

// Export for testing
module.exports = app; 
