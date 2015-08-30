(function() {

var ratio = {
  x: 1,
  y: 1
};

var connected = false;
var socket = {};
var currentPlayer = null;

MOUSE = {};
KEYBOARD = {};

GFX = Graphics();
STATE = State();

init();

function init() {
  controls();
  connect();
  setTimeout(draw, 10);
  setTimeout(localUpdate, 10);
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
    console.log("Player initialized", data)
    currentPlayer = Player(data);
  });
  socket.on('globalUpdate', onUpdate);
  socket.on('disconnect', onDisconnect);
  // socket.emit('playerInfo', { name: playerName });
}

function onUpdate(data) {
  STATE.load(data)
}

function onDisconnect() {}

function draw() {
  STATE.draw();
  requestAnimationFrame(draw);
}

function localUpdate() {
  if (currentPlayer) {
    currentPlayer.move();
    socket.emit('playerUpdate', currentPlayer.state());
  }
  setTimeout(localUpdate, 33);
}
  
})();

