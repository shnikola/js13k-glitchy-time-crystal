(function() {

var ratio = {
  x: 1,
  y: 1
};

var connected = false;
var socket = {};

MOUSE = {};
KEYBOARD = {};

GFX = Graphics();
STATE = State();

init();

function init() {
  controls();
  connect();
  GFX.canvas.style.cursor = 'none';
//  setTimeout(draw, 10);
}

function controls() {
  window.onkeydown = function(e) { KEYBOARD[e.keyCode] = true; };
  window.onkeyup = function(e) { KEYBOARD[e.keyCode] = false; };
  var setMouse = function(e) {
    MOUSE.x = e.clientX - GFX.canvas.offsetLeft;
    MOUSE.y = e.clientY - GFX.canvas.offsetTop;
    MOUSE.x *= ratio.x;
    MOUSE.y *= ratio.y;
  }
  GFX.canvas.onmousemove = setMouse;
  GFX.canvas.onmousedown = function(e) { setMouse(e); MOUSE.down = true; };
  GFX.canvas.onmouseup = function(e) { setMouse(e); MOUSE.down = false; };
}

function connect() {
  connected = true;
  console.log('Connecting...');
  if (!socket.connected) socket = io(document.location.href);
  
  socket.on('playerInit', function(data) {
    STATE.player = Player(data, true);
    console.log("Player initialized", STATE.player);
  });
  socket.on('globalUpdate', onUpdate);
  socket.on('disconnect', onDisconnect);
  socket.on('ping', function (timestamp) {
    socket.emit('pong', timestamp);
  });
  // socket.emit('playerInfo', { name: playerName });
}

function onUpdate(data) {
  var fresh = (STATE.player.stateVersion() < data.players[STATE.player.id].stateVersion) || STATE.player.stateVersion() == 0
  STATE.load(data);
  if (fresh) {
    STATE.draw();
    STATE.player.move();
    socket.emit('playerUpdate', STATE.player.state());
  } 
}

function onDisconnect() {}

function draw() {
  STATE.draw();
  requestAnimationFrame(draw);
}

})();

