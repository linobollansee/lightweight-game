const socket = io();
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let players = {};

socket.on('updatePlayers', (data) => {
  players = data;
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') socket.emit('move', 'up');
  if (e.key === 'ArrowDown') socket.emit('move', 'down');
  if (e.key === 'ArrowLeft') socket.emit('move', 'left');
  if (e.key === 'ArrowRight') socket.emit('move', 'right');
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const id in players) {
    const p = players[id];
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(gameLoop);
}
gameLoop();
