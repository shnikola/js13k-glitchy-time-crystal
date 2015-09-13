(function() {

SOCKET = {};

MOUSE = {};
KEYBOARD = {};

FRAMERATE = Framerate();
GFX = Graphics();
ROOMS = new Rooms();
STATE = new ClientState();

MENU = new Menu();
CHAT = new Chat();

init();

function init() {
  initConnection();
  initControls();
  // joinRoom(1); // For quick testing, comment out following lines
  MENU.start();
  MENU.onRoomClick = joinRoom;
}

function initConnection() {
  if (!SOCKET.connected) SOCKET = io(document.location.href);

  // Menu
  SOCKET.on('roomsUpdate', function(data) {
    ROOMS.load(data);
    MENU.updateRooms();
  });

  // Game specific stuff
  SOCKET.on('globalUpdate', onUpdate);
  SOCKET.on('disconnect', onDisconnect);
  SOCKET.on('ping', function (timestamp) {
    SOCKET.emit('pong', timestamp);
  });
  SOCKET.on('incomingChat', function(msg) {
    CHAT.pushMessage(msg);
  });

}

function initControls() {
  window.onkeydown = function(e) { KEYBOARD[e.keyCode] = true; };
  window.onkeyup = function(e) {
    KEYBOARD[e.keyCode] = false;
    CHAT.keyup(e);
  };
  var setMouse = function(e) {
    MOUSE.x = e.clientX - GFX.screen.offsetLeft;
    MOUSE.y = e.clientY - GFX.screen.offsetTop;
  };
  GFX.canvas.onmousemove = setMouse;
  GFX.canvas.onmousedown = function(e) { setMouse(e); MOUSE.down = true; };
  GFX.canvas.onmouseup = function(e) { setMouse(e); MOUSE.down = false; };
}

function joinRoom(id) {
  SOCKET.emit('joinRoom', {room: id});

  SOCKET.once('playerJoin', function(data) {
    MENU.active = false;
    GFX.hideCursor();
    STATE.player = new Player(data.player, true);
    CHAT.toggle(true);
    STATE.waiting = data.waiting;
    requestAnimationFrame(animateGame);
  });

  SOCKET.once('spectatorJoin', function(data) {
    MENU.active = false;
    STATE.waiting = data.waiting;
    requestAnimationFrame(animateGame);
  });

  SOCKET.once('gameStart', function() {
    STATE.waiting = false;
  });
}

function onUpdate(data) {
  STATE.load(data);
}

function onDisconnect() {}

function animateGame(timestamp) {
  if (FRAMERATE.exceedsFrameRate(timestamp)) {
    requestAnimationFrame(animateGame);
    return;
  }

  FRAMERATE.calculateDelta(timestamp);

  // Update delta of time in fixed increments of FRAMERATE.timestep
  FRAMERATE.fixedStepUpdate(function(timestep) {
    if (STATE.player) {
      if (!CHAT.chatting) STATE.player.collectInput(timestep);
      STATE.player.move(timestep);
    }
    STATE.players.forEach(function(s) { s.interpolate(timestep); });
    STATE.sprites.forEach(function(s) { s.interpolate(timestep); });
  });

  if (STATE.player && STATE.player.stateChanged()) {
    SOCKET.emit('playerUpdate', STATE.player.prepareDelta());
  }

  STATE.draw();

  requestAnimationFrame(animateGame);
}

})();
