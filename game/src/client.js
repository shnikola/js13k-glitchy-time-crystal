(function() {

var canvas = document.getElementById("world");
var context = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 480;

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(fn){ setTimeout(fn, 33); };

var connected = false;
var socket = {};

var players = [];

init();

function init() {
  connect();
  setTimeout(tic, 10);
}

function connect() {
  connected = true;
  console.log('connecting');
  if (!socket.connected) socket = io(document.location.href);
  socket.on('update', onUpdate);
  socket.on('config', onConfig);
  socket.on('disconnect', onDisconnect);
  // socket.emit('playerInfo', { name: playerName });
}


function onUpdate(data) {
  players = [];
  players = players.concat(data.aTeam);
  players = players.concat(data.bTeam);
}

function onConfig() {}
function onDisconnect() {}

function tic() {
  console.log(players)
  for (var i = 0; i < players.length; i++) {
    drawPlayer(players[i]);
  }
  window.requestAnimationFrame(tic);
}

function drawPlayer(sprite) {
  console.log(sprite)
  context.fillStyle = "rgb(255, 255, 255)";
  context.fillRect(sprite.x, sprite.y, 10, 10);
}

  
})();

