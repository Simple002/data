const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);

// 📌 Указываем папку с шаблонами
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// 📌 Отдаём шаблон index.ejs при GET /
app.get('/', (req, res) => {
  res.render('index'); // Express ищет views/index.ejs
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

const PORT = 3000;
http.listen(PORT, () => {
  console.log(`🚀 Сервер работает на http://localhost:${PORT}`);
});