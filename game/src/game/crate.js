function Crate(o) {
  this.x = o.x;
  this.y = o.y;
  this.prev = {x: o.x, y: o.y};
  this.next = {x: o.nextX, y: o.nextY};
  this.dx = 0;
  this.dy = 0;
  this.vx = o.vx || 0;
  this.vy = o.vy || 0;
  this.friction = 0.7;
  this.size = 22;
  this.interval = 100;
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

Crate.prototype.interpolate = function(t) {
  this.x += (this.next.x - this.prev.x) / (this.interval / t);
  this.y += (this.next.y - this.prev.y) / (this.interval / t);
};

Crate.prototype.shot = function(b) {
  this.vx += b.vx * b.size * 5 / this.size;
  this.vy += b.vy * b.size * 5 / this.size;
};

Crate.prototype.draw = function(c) {
  c.strokeStyle = "#4f34d9";
  c.lineWidth = 1;
  c.strokeRect(this.x, this.y, this.size, this.size);
  c.strokeRect(this.x, this.y, this.size / 3, this.size);
  c.strokeRect(this.x + this.size * 2 / 3, this.y, this.size / 3, this.size);
  c.strokeRect(this.x + this.size / 3, this.y + this.size / 3, this.size / 3, this.size / 3);
  //c.fillText(this.x.toFixed(2) + ", " + this.y.toFixed(2), this.x, this.y - 10); // debug position

};

Crate.prototype.toClient = function() {
  var data = { x: this.prev.x, y: this.prev.y, nextX: this.x, nextY: this.y };
  this.prev.x = this.x; this.prev.y = this.y;
  return data;
};

if (typeof exports !== 'undefined') {
  WORLD = require('./world.js').world;
  exports.crate = Crate;
}
