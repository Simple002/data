const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Раздаём клиентские файлы
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('👤 Пользователь подключился');

  socket.on('set username', (username) => {
    socket.username = username;
    io.emit('user joined', username);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', {
      username: socket.username,
      text: msg
    });
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('user left', socket.username);
      console.log(`❌ ${socket.username} отключился`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});