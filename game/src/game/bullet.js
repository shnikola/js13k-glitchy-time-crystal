function Bullet(o) {
  this.x = o.x;
  this.y = o.y;
  this.prev = {x: o.x, y: o.y};
  this.next = {x: o.nextX, y: o.nextY};
  this.vx = o.vx || Math.cos(o.angle) * WEAPONS[o.weapon].speed;
  this.vy = o.vy || Math.sin(o.angle) * WEAPONS[o.weapon].speed;
  this.size = 3;
  this.player = o.player;
  this.weapon = o.weapon;
  this.dead = o.dead;
  this.interval = 100;
}

Bullet.prototype.move = function(t) {
  this.x += this.vx * t;
  this.y += this.vy * t;
  if (WORLD.out(this)) this.dead = true;
};

Bullet.prototype.interpolate = function(t) {
  this.x += (this.next.x - this.prev.x) / (this.interval / t);
  this.y += (this.next.y - this.prev.y) / (this.interval / t);
};

Bullet.prototype.draw = function(c) {
  c.fillStyle = "#fff";
  c.fillRect(this.x - 1, this.y - 1 , this.size, this.size);
  //c.fillText(this.x.toFixed(2) + ", " + this.y.toFixed(2), this.x, this.y - 10); // debug position
};

Bullet.prototype.toClient = function() {
  var data = {x: this.prev.x, y: this.prev.y, nextX: this.x, nextY: this.y, player: this.player, weapon: this.weapon, dead: this.dead };
  this.prev.x = this.x; this.prev.y = this.y;
  return data;
};

if (typeof exports !== 'undefined') {
  WORLD = require('./world.js').world;
  WEAPONS = require('./weapons.js').weapons;
  exports.bullet = Bullet;
}
