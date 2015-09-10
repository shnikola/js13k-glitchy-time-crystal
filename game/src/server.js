log('Hi! This is some game.');

var socketio = require('sandbox-io');

var Player = require('./game/player.js').player;
var Bullet = require('./game/bullet.js').bullet;
var Crate = require('./game/crate.js').crate;
var Utils = require('./core/utils.js').utils;

log('Loaded sandbox-io', socketio);

// TODO: better game managemt
var game = new Game();

socketio.on('connection', function(socket) {
  if (!game.running) game.start();
  log.debug('New connection', socket.id);

  var player = new Player({});
  player.joinGame(game);
  socket.emit('playerInit', player.toEmit());

  socket.on('playerUpdate', function(state) { player.receiveUpdate(state); });

  socket.on('disconnect', function() {
    //game.players[player.id] = null;
    //game.teamSizes[player.team] -= 1;
  });

  socket.on('pong', function(time) {
    player.pingTime = Date.now() - time;
  });

  socket.on('chat_msg', function(msg) {
    socketio.emit('incoming_chat', {
      text: msg,
      id: player.id
    });
  });

  setInterval( function() {
    socket.emit('ping', Date.now());
  }, 1000);

  setInterval( function() {
    socket.emit('ping', Date.now());
  }, 100);

});


// ------ Game State -------

function Game() {
  this.id = 'game' + Math.random();
  this.teamSizes = {a: 0, b: 0};
  this.players = [];
  this.crates = [];
  this.bullets = [];
}

Game.prototype.start = function() {
  this.crates.push(new Crate({x: 300, y: 300}));
  this.running = true;
  setTimeout(this.tic.bind(this), 33);
  setTimeout(this.sendPlayers.bind(this), 100);
};

Game.prototype.tic = function() {
  this.calculateCollisions();
  this.removeDead();
  this.players.forEach(function(x) { if (x) x.move(1000 / 60); });
  this.crates.forEach(function(x) { if (x) x.move(1000 / 60); });
  this.bullets.forEach(function(x) { if (x) x.move(1000 / 60); });

  setTimeout(this.tic.bind(this), 33);
};

Game.prototype.sendPlayers = function() {
  socketio.emit('globalUpdate', {
    players: this.players.map(function(a) { return a.toEmit(); }),
    crates: this.crates.map(function(a) { return a.toEmit(); }),
    bullets: this.bullets.map(function(a) { return a.toEmit(); })
  });
  setTimeout(this.sendPlayers.bind(this), 100);
};

Game.prototype.calculateCollisions = function() {
  var self = this;
  self.bullets.forEach(function(b) {
    self.players.forEach(function(p) {
      if (p && p.id != b.player && Utils.collides(b, p)) { b.dead = true; p.shot(b); }
    });
    self.crates.forEach(function(c) {
      if (Utils.collides(b, c)) {
        b.dead = true; c.shot(b);
      }
    });
  });

  self.players.forEach(function(p) {
    self.crates.forEach(function(c) {
      if (Utils.collides(p, c)) {
        // TODO: fix this
        c.dx = p.dx * p.size / c.size; c.dy = p.dy * p.size / c.size;
        p.dx = 0; p.dy = 0;
      }
    });
  });
};

Game.prototype.removeDead = function() {
  this.bullets = this.bullets.filter(function(x) { return !x.dead; });
};

// ------ Player -------

Player.prototype.joinGame = function(game) {
  this.team = game.teamSizes.a <= game.teamSizes.b ? 'a' : 'b';
  game.teamSizes[this.team] += 1;
  this.id = game.players.length;
  game.players.push(this);
  // Place player
  this.initPosition();
};

Player.prototype.receiveUpdate = function(state) {
  this.dx = this.dx + state.dx;
  this.dy = this.dy + state.dy;
  for (var i = 0; i < state.bullets.length; i++) {
    game.bullets.push(new Bullet(state.bullets[i]));
  }
  this.version = state.version;
};
