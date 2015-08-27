log('Hi! This is some game.');

var socketio = require('sandbox-io');
log('Loaded sandbox-io', socketio);

// TODO: better game managemt
var game = new Game();

socketio.on('connection', function(socket) {
  if (!game.running) game.start();
  log.debug('New connection', socket.id);
  
  player = new Player();
  player.joinGame(game)
  
  socket.on('event', function(data){});
  socket.on('disconnect', function(){});
});


// ------ Game State -------

function Game() {
  this.id = 'game' + Math.random();
  this.world = {
    width: 640,
    height: 480
  };

  this.aTeam = [];
  this.bTeam = [];
  this.bullets = [];
}

Game.prototype.start = function() {
  this.running = true;
  setTimeout(this.tic.bind(this), 1000);
}

Game.prototype.tic = function() {
  socketio.emit('update', {
    aTeam: this.aTeam,
    bTeam: this.bTeam,
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
  this.team = game.aTeam.length <= game.bTeam.length ? 'a' : 'b';
  game[this.team + 'Team'].push(this);
  this.x = game.world.width * Math.random();
  this.y = game.world.height * Math.random();
}
