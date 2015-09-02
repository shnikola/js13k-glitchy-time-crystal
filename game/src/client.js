(function() {

window.onload = function() {
  chatyInput = document.getElementById('chaty');
};

var ratio = {
  x: 1,
  y: 1
};

var chatting = false;
var connected = false;
SOCKET = {};

MOUSE = {};
KEYBOARD = {};

FRAMERATE = Framerate();
GFX = Graphics();
STATE = State();

init();

function init() {
  controls();
  connect();
  GFX.canvas.style.cursor = 'none';
  requestAnimationFrame(animate);
}

function controls() {
  window.onkeydown = function(e) { KEYBOARD[e.keyCode] = true;};
  window.onkeyup = function(e) {
    KEYBOARD[e.keyCode] = false;
    if(e.keyCode == 84 && document.activeElement != chatyInput) {
      chatyInput.focus();
      chatting = true;
    }
  };
  var setMouse = function(e) {
    MOUSE.x = e.clientX - GFX.canvas.offsetLeft;
    MOUSE.y = e.clientY - GFX.canvas.offsetTop;
    MOUSE.x *= ratio.x;
    MOUSE.y *= ratio.y;
  };
  GFX.canvas.onmousemove = setMouse;
  GFX.canvas.onmousedown = function(e) { setMouse(e); MOUSE.down = true; };
  GFX.canvas.onmouseup = function(e) { setMouse(e); MOUSE.down = false; };
}

function connect() {
  connected = true;
  console.log('Connecting...');
  if (!SOCKET.connected) SOCKET = io(document.location.href);
  
  SOCKET.on('playerInit', function(data) {
    STATE.player = Player(data, true);
    console.log("Player initialized", STATE.player);
  });
  SOCKET.on('globalUpdate', onUpdate);
  SOCKET.on('disconnect', onDisconnect);
  SOCKET.on('ping', function (timestamp) {
    SOCKET.emit('pong', timestamp);
  });
  SOCKET.on('incoming_chat', function(chat) {
    chat.ttl = 300;
    STATE.messages.unshift(chat);
  });

}

function onUpdate(data) {
  STATE.load(data);
}

function onDisconnect() {}

function animate(timestamp) {
  if (FRAMERATE.exceedsFrameRate(timestamp)) {
    requestAnimationFrame(animate);
    return;
  }
  
  FRAMERATE.calculateDelta(timestamp);
  
  // Update delta of time in fixed increments of FRAMERATE.timestep
  FRAMERATE.fixedStepUpdate(function(timestep) {
    STATE.player && !chatting && STATE.player.move(timestep);
  });
  
  STATE.draw();
  STATE.player && SOCKET.emit('playerUpdate', STATE.player.state());
  
  requestAnimationFrame(animate);
}

submitChat = function (e){
  if(e.keyCode == 13){
    SOCKET.emit('chat_msg', document.getElementById('chaty').value);
    chatting = false;
    clearChat();
    chatyInput.blur();
  }
  else if (e.keyCode == 27) {
    chatting = false;
    clearChat();
    chatyInput.blur();
  }
};

clearChat = function (){
  chatyInput.value = '';
};

beginChat = function (){
  chatting = true;
};

})();

