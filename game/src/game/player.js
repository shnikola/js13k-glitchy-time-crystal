function Player(o, main) {
  this.main = !!main;
  this.id = o.id;
  this.team = o.team;
  this.color = o.team == 'a' ? '#f00' : '#00f';
  // Attributes
  this.dead = false;
  this.speed = 0.08;
  this.friction = 0.4;
  this.size = 10;
  this.weapon = 1;
  // Input
  this.moving = false;
  this.shooting = false;
  this.shootingBlocked = false;
  // Local State
  this.x = o.x;
  this.y = o.y;
  this.vx = o.vx || 0;
  this.vy = o.vy || 0;
  this.dx = 0;
  this.dy = 0;
  this.angle = 0;
  // Local -> Server state
  this.deltaToSend = { dx: 0, dy: 0, version: 0, bullets: [], changed: false };
  this.deltaHistory = [];
  this.pingTime = 0;
}

Player.prototype.initPosition = function() {
  this.x = WORLD.width * Math.random();
  this.y = WORLD.height * Math.random();
};

Player.prototype.merge = function(o) {
  this.pingTime = o.pingTime;
  this.x = o.x;
  this.y = o.y;
  // Merge deltas that happened in the meantime
  for (var i = o.version + 1; i < this.deltaHistory.length; i++) {
    this.x += this.deltaHistory[i].dx;
    this.y += this.deltaHistory[i].dy;
  }
};

Player.prototype.draw = function(c) {
  // player
  c.fillStyle = this.color;
  c.fillRect(this.x, this.y, this.size, this.size);
  c.fillText(this.x.toFixed(2) + ", " + this.y.toFixed(2), this.x, this.y - 10); // debug position

  if (this.main) {
    // crosshair
    c.lineWidth = 2;
    c.strokeStyle = "#fff";
    c.beginPath();
    c.arc(MOUSE.x, MOUSE.y, 5, 0, Math.PI * 2);
    c.stroke();

    // Weapon
    c.fillRect(this.x + this.size / 2 + this.size * Math.cos(this.angle),
               this.y + this.size / 2 + this.size * Math.sin(this.angle),
               3, 3);
  }
};

Player.prototype.collectInput = function(timestep) {
  this.moving = false;
  this.shooting = false;

  this.dx = 0; this.dy = 0;

  if      (KEYBOARD[65]) { this.dx = -this.speed * timestep; this.moving = true; }
  else if (KEYBOARD[68]) { this.dx =  this.speed * timestep; this.moving = true; }
  if      (KEYBOARD[87]) { this.dy = -this.speed * timestep; this.moving = true; }
  else if (KEYBOARD[83]) { this.dy =  this.speed * timestep; this.moving = true; }

  this.deltaToSend.dx += this.dx;
  this.deltaToSend.dy += this.dy;

  if (MOUSE.down) { this.shoot(); }
  this.angle = Math.atan2(MOUSE.y - this.y, MOUSE.x - this.x);

  if (this.moving || this.shooting) this.deltaToSend.changed = true;
};

Player.prototype.move = function(t) {
  this.x = Math.min(Math.max(0, this.x + this.vx * t + this.dx), WORLD.width);
  this.y = Math.min(Math.max(0, this.y + this.vy * t + this.dy), WORLD.height);
  this.vx *= this.friction;
  this.vy *= this.friction;
  this.dx = 0; this.dy = 0;
};

Player.prototype.shoot = function() {
  if (this.shootingBlocked) return;
  this.shooting = true;
  this.shootingBlocked = true;

  this.deltaToSend.bullets.push({x: this.x, y: this.y, angle: this.angle, weapon: this.weapon, player: this.id});
  var self = this;
  setTimeout(function() { self.shootingBlocked = false; }, 600);
};

Player.prototype.shot = function(b) {
  this.vx += b.vx * b.size / this.size;
  this.vy += b.vy * b.size / this.size;
};

Player.prototype.stateChanged = function() {
  return this.deltaToSend.changed;
};

Player.prototype.prepareDelta = function() {
  var data = this.deltaToSend;
  this.deltaHistory[this.deltaToSend.version] = this.deltaToSend;
  this.deltaToSend = { dx: 0, dy: 0, bullets: [], version: this.deltaToSend.version + 1, changed: false };
  return data;
};

Player.prototype.toEmit = function() {
  return { id: this.id, team: this.team, x: this.x, y: this.y, vx: this.vx, vy: this.vy, pingTime: this.pingTime };
};

if (typeof exports !== 'undefined') {
  WORLD = require('./world.js').world;
  exports.player = Player;
}
