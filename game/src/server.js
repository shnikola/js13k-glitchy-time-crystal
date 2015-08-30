log('Hi! This is some game.');

var socketio = require('sandbox-io');
log('Loaded sandbox-io', socketio);

// TODO: better game managemt
var game = new Game();

socketio.on('connection', function(socket) {
  if (!game.running) game.start();
  log.debug('New connection', socket.id);

  var player = new Player();
  player.joinGame(game);
  socket.emit('playerInit', player);
  
  socket.on('playerUpdate', function(state) { player.update(state); });
  
  socket.on('disconnect', function(){
    game.players[player.id] = null;
  });

  socket.on('pong', function(time) {
    player.pingTime = Date.now() - time;
  });

  setInterval( function () {
    socket.emit('ping', Date.now());
  }, 1000);
});


// ------ Game State -------

function Game() {
  this.id = 'game' + Math.random();
  this.world = {
    width: 640,
    height: 480
  };

  this.players = [];
  this.teamSizes = {a: 0, b: 0};
  this.bullets = [];
}

Game.prototype.start = function() {
  this.running = true;
  setTimeout(this.tic.bind(this), 33);
}

Game.prototype.tic = function() {
  socketio.emit('globalUpdate', {
    players: this.players,
    bullets: this.bullets
  });
  setTimeout(this.tic.bind(this), 33);
}

// ------ Player -------

function Player(socket) {
  this.socket = socket;
  // this.name = 'player' + pCounter++;
  // socket.on('playerInfo', this.onPlayerInfo.bind(this));
  // socket.on('disconnect', this.onExit.bind(this));
}

Player.prototype.joinGame = function(game) {
  this.team = game.teamSizes.a <= game.teamSizes.b ? 'a' : 'b';
  game.teamSizes[this.team] += 1;
  this.id = game.players.length; // Mogu li istovremeno dvojica dobiti isti id?
  game.players.push(this);
  this.x = game.world.width * Math.random();
  this.y = game.world.height * Math.random();
}

Player.prototype.update = function(state) {
  this.x = state.x;
  this.y = state.y;
}