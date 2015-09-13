log('Hi! This is some game.');

var socketio = require('sandbox-io');

var Rooms = require('./core/rooms.js').rooms;
var Player = require('./game/player.js').player;
var Crystal = require('./game/crystal.js').crystal;
var Bullet = require('./game/bullet.js').bullet;
var Crate = require('./game/crate.js').crate;
var Utils = require('./core/utils.js').utils;

log('Loaded sandbox-io', socketio);

var rooms = new Rooms();

socketio.on('connection', function(socket) {
  log.debug('New connection', socket.id);

  setInterval(function() {
    socket.emit('roomsUpdate', rooms.toClient());
  }, 3000);

  socket.on('joinRoom', function(data) {
    var id = data.room;
    var game = rooms.games[id] = rooms.games[id] || new Game(id);
    if (rooms.players[id].count < rooms.players[id].max) {
      game.joinPlayer(socket);
      rooms.players[id].count++;
    } else {
      game.joinSpectator(socket);
    }

    if (!game.running && rooms.players[id].count > 1) game.start();
  });
});


// ------ Game State -------

function Game(roomId) {
  this.id = 'game' + Math.random();
  this.roomId = roomId;
  this.teamSizes = {a: 0, b: 0};
  this.players = [];
  this.crystal = new Crystal();
  this.crates = [];
  this.bullets = [];
}



Game.prototype.joinPlayer = function(socket) {
  var self = this;
  var id = this.players.length;
  var team = this.teamSizes.a <= this.teamSizes.b ? 'a' : 'b';
  var player = new Player({id: id, team: team});
  this.players.push(player);
  this.teamSizes[player.team] += 1;

  player.initPosition();
  socket.join("room-" + this.roomId);
  socket.emit('playerJoin', { waiting: !this.running, player: player.toClient()});

  socket.on('playerUpdate', function(state) {
    player.version = state.version;
    player.dx = player.dx + state.dx;
    player.dy = player.dy + state.dy;
    for (var i = 0; i < state.bullets.length; i++) {
      self.bullets.push(new Bullet(state.bullets[i]));
    }
  });

  socket.on('disconnect', function() {
    //game.players[player.id] = null;
    //game.teamSizes[player.team] -= 1;
  });

  socket.on('chatMsg', function(msg) {
    socketio.to("room-" + self.roomId).emit('incomingChat', {
      id: player.id,
      text: msg
    });
  });

  setInterval( function() {
    socket.emit('ping', Date.now());
  }, 1000);
  socket.on('pong', function(time) {
    player.pingTime = Date.now() - time;
  });

};

Game.prototype.joinSpectator = function(socket) {
  socket.join("room-" + this.roomId);
  socket.emit('spectatorJoin', { waiting: !this.running });
};

Game.prototype.start = function() {
  this.crates.push(new Crate({x: 300, y: 300}));
  this.running = true;
  socketio.to("room-" + this.roomId).emit('gameStart');
  setTimeout(this.tic.bind(this), 33);
};

Game.prototype.tic = function() {
  this.calculateCollisions();
  this.removeDead();
  this.players.forEach(function(x) { if (x) x.move(1000 / 60); });
  this.crates.forEach(function(x) { if (x) x.move(1000 / 60); });
  this.bullets.forEach(function(x) { if (x) x.move(1000 / 60); });

  this.sendToClients();
  setTimeout(this.tic.bind(this), 33);
};

Game.prototype.sendToClients = function() {
  socketio.to("room-" + this.roomId).emit('globalUpdate', {
    players: this.players.map(function(a) { return a.toClient(); }),
    crates: this.crates.map(function(a) { return a.toClient(); }),
    bullets: this.bullets.map(function(a) { return a.toClient(); })
  });
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
