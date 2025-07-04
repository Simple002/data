const express = require('express');
const app = express();
const http = require('http').createServer(app); // ✅ Добавил http
const { Server } = require('socket.io');
const io = new Server(http);

// EJS шаблоны
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
  res.render('index');
});

io.on('connection', (socket) => {
  console.log('🟢 Пользователь подключён');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Пользователь отключён');
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`🚀 Сервер работает на http://localhost:${PORT}`);
});