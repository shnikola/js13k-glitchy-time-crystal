function Bullet(o) {
  this.x = o.x;
  this.y = o.y;
  this.vx = o.vx || Math.cos(o.angle) * WEAPONS[o.weapon].speed;
  this.vy = o.vy || Math.sin(o.angle) * WEAPONS[o.weapon].speed;
  this.size = 2;
  this.player = o.player;
  this.weapon = o.weapon;
  this.dead = o.dead;
}

Bullet.prototype.move = function(t) {
  this.x += this.vx * t;
  this.y += this.vy * t;
  if (WORLD.out(this)) this.dead = true;
};

Bullet.prototype.draw = function(c) {
  if (this.dead) return;
  c.fillStyle = "#fff";
  c.fillRect(this.x - 1, this.y - 1 , this.size, this.size);
  c.fillText(this.x.toFixed(2) + ", " + this.y.toFixed(2), this.x, this.y - 10); // debug position
};

Bullet.prototype.toEmit = function() {
  return {x: this.x, y: this.y, vx: this.vx, vy: this.vy, player: this.player, weapon: this.weapon, dead: this.dead };
};

if (typeof exports !== 'undefined') {
  WORLD = require('./world.js').world;
  WEAPONS = require('./weapons.js').weapons;
  exports.bullet = Bullet;
}
