const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

let players = {};

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);
  
  // Initialize player
  players[socket.id] = { x: Math.random() * 500, y: Math.random() * 500, color: getRandomColor() };
  io.emit('updatePlayers', players);

  socket.on('move', (dir) => {
    const speed = 5;
    if (players[socket.id]) {
      if (dir === 'up') players[socket.id].y -= speed;
      if (dir === 'down') players[socket.id].y += speed;
      if (dir === 'left') players[socket.id].x -= speed;
      if (dir === 'right') players[socket.id].x += speed;
      io.emit('updatePlayers', players);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    delete players[socket.id];
    io.emit('updatePlayers', players);
  });
});

function getRandomColor() {
  return `hsl(${Math.random() * 360}, 70%, 50%)`;
}

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
