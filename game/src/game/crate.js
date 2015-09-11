function Crate(o) {
  this.x = o.x;
  this.y = o.y;
  this.dx = 0;
  this.dy = 0;
  this.vx = o.vx || 0;
  this.vy = o.vy || 0;
  this.friction = 0.5;
  this.size = 30;
}

Crate.prototype.move = function(t) {
  if (this.x < 0) { this.vx = Math.abs(this.vx); }
  if (this.x > WORLD.width - this.size) { this.vx = -Math.abs(this.vx); }
  if (this.y < 0) { this.vy = Math.abs(this.vy); }
  if (this.y > WORLD.height - this.size) { this.vy = -Math.abs(this.vy); }

  this.x += this.vx * t + this.dx;
  this.y += this.vy * t + this.dy;

  this.vx *= this.friction;
  this.vy *= this.friction;
  this.dx = this.dy = 0;
};

Crate.prototype.shot = function(b) {
  this.vx += b.vx * b.size / this.size;
  this.vy += b.vy * b.size / this.size;
};

Crate.prototype.draw = function(c) {
  c.fillStyle = "#fff";
  c.fillRect(this.x, this.y, this.size, this.size);
  c.fillText(this.x.toFixed(2) + ", " + this.y.toFixed(2), this.x, this.y - 10); // debug position
};

Crate.prototype.toClient = function() {
  return { x: this.x, y: this.y, vx: this.vx, vy: this.vy };
};

if (typeof exports !== 'undefined') {
  WORLD = require('./world.js').world;
  exports.crate = Crate;
}
