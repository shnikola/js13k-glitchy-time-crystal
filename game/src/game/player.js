function Player(o, main) {
  this.main = !!main;
  this.id = o.id;
  this.team = o.team;
  this.color = o.team == 'a' ? '#a03034' : '#fff';

  // Attributes
  this.dead = false;
  this.speed = 1.5;
  this.friction = 0.4;
  this.size = 12;
  this.weapon = 1;

  // Input
  this.moving = false;
  this.shooting = false;
  this.shootingDelayed = false;
  this.shootingBlocked = false;

  // Local State
  this.x = o.x;
  this.y = o.y;
  this.vx = o.vx || 0;
  this.vy = o.vy || 0;
  this.dx = 0;
  this.dy = 0;
  this.angle = 0;
  this.legPos = 0;

  // Local -> Server state
  this.deltaToSend = { dx: 0, dy: 0, version: 0, bullets: [], changed: false };
  this.deltaHistory = [];
  this.pingTime = 0;
}

Player.prototype.initPosition = function() {
  this.x = 50 + (WORLD.width - 50) * Math.random();
  this.y = 50 + (WORLD.height - 50)* Math.random();
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
  c.fillStyle = c.strokeStyle = this.color;
  c.lineWidth = 1;

  var leftLeg = 5 + Math.sin(this.legPos) * 2, rightLeg = 5 - Math.sin(this.legPos) * 2;
  c.beginPath();
  c.moveTo(this.x, this.y);
  c.lineTo(this.x + this.size, this.y);
  c.lineTo(this.x + this.size, this.y + this.size + rightLeg);
  c.lineTo(this.x + this.size * 3 / 4, this.y + this.size + rightLeg);
  c.lineTo(this.x + this.size * 3 / 4, this.y + this.size);
  c.lineTo(this.x + this.size * 1 / 4, this.y + this.size);
  c.lineTo(this.x + this.size * 1 / 4, this.y + this.size + leftLeg);
  c.lineTo(this.x, this.y + this.size + leftLeg);
  c.closePath();
  c.stroke();

  c.fillRect(this.x + this.size / 3 - 1, this.y + this.size / 4, 1, 1);
  c.fillRect(this.x + this.size * 2 / 3, this.y + this.size / 4, 1, 1);

  //c.fillText(this.x.toFixed(2) + ", " + this.y.toFixed(2), this.x, this.y - 10); // debug position

  if (this.main) {
    // crosshair
    c.lineWidth = 2;

    c.beginPath();
    c.arc(MOUSE.x, MOUSE.y, 5, 0, Math.PI * 2);
    c.stroke();

    // Weapon
    c.fillRect(this.x - 2 + this.size / 2 + this.size * Math.cos(this.angle),
               this.y - 2 + this.size / 2 + this.size * Math.sin(this.angle),
               3, 3);
  }
};

Player.prototype.collectInput = function(timestep) {
  // moving
  this.moving = false;

  if      (KEYBOARD[65]) { this.dx = -this.speed; this.moving = true; }
  else if (KEYBOARD[68]) { this.dx = this.speed; this.moving = true; }
  if      (KEYBOARD[87]) { this.dy = -this.speed; this.moving = true; }
  else if (KEYBOARD[83]) { this.dy = this.speed; this.moving = true; }

  this.deltaToSend.dx += this.dx;
  this.deltaToSend.dy += this.dy;

  // shooting
  this.shooting = false;

  if (MOUSE.down && !this.shootingBlocked && !this.shootingDelayed) {
    this.deltaToSend.bullets.push(
      {x: this.x, y: this.y, angle: this.angle, weapon: this.weapon, player: this.id}
    );
    this.shooting = true;
    this.shootingBlocked = !WEAPONS[this.weapon].automatic;
    this.shootingDelayed = true;
    var self = this;
    setTimeout(function() { self.shootingDelayed = false; }, WEAPONS[this.weapon].delay);
  } else if (!MOUSE.down) {
    this.shootingBlocked = false;
  }

  // crosshair
  this.angle = Math.atan2(MOUSE.y - this.y, MOUSE.x - this.x);

  if (this.moving || this.shooting) this.deltaToSend.changed = true;
};

Player.prototype.move = function(t) {
  this.x = Math.min(Math.max(0, this.x + this.vx * t + this.dx), WORLD.width);
  this.y = Math.min(Math.max(0, this.y + this.vy * t + this.dy), WORLD.height);
  this.vx *= this.friction;
  this.vy *= this.friction;
  this.dx = 0; this.dy = 0;

  this.legPos += Math.PI / 20;
};

Player.prototype.shot = function(b) {
  this.vx += 5 * b.vx * b.size / this.size;
  this.vy += 5 * b.vy * b.size / this.size;
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

Player.prototype.toClient = function() {
  return {
    id: this.id, team: this.team,
    x: this.x, y: this.y, vx: this.vx, vy: this.vy,
    pingTime: this.pingTime, version: this.version
  };
};

if (typeof exports !== 'undefined') {
  WORLD = require('./world.js').world;
  WEAPONS = require('./world.js').weapons;
  exports.player = Player;
}
