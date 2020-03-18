const express = require('express');
const path = require('path');
const http =  require('http');
const socketIO = require('socket.io');

const app = express();
const port = process.env.PORT || 2201;

app.use(express.static(path.join(__dirname, 'dist/angular-socket')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/angular-socket/index.html'));
});

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (data) => {
    socket.join(data.room);

    console.log(data.user + ' joined the room ' + data.room);

    socket.broadcast.to(data.room).emit('new user joined', {user:data.user, message:'has join this room.'});

  });

  socket.on('leave', (data) => {

    console.log(data.user + ' left the room ' + data.room);

    socket.broadcast.to(data.room).emit('left room', {user:data.user, message:'has left this room.'});

    socket.leave(data.room);
  });

  socket.on('message', (data) => {

    io.in(data.room).emit('new message', {user:data.user, message:data.message});

  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
