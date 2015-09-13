function Crystal() {
  this.width = 100;
  this.height = 80;
  this.x = WORLD.width / 2 - this.width / 2;
  this.y = WORLD.height / 2;

  this.glow = 0;
  this.alpha = 1;
  this.color = '#ffc0cb';

  this.rayOn = false;
  this.raySpeed = Math.PI / 300;
  this.rayAngleFrom = 0;
  this.rayAngleTo = Math.PI / 6;

  this.glareOn = false;
  this.glareX = 0;
  this.glareSpeed = 1.2;
}

Crystal.prototype.draw = function(c) {
  c.save();

  // Diamond
  c.globalAlpha = this.alpha;
  c.lineWidth = 1;
  c.fillStyle = "#000";
  c.strokeStyle = this.color;
  c.shadowColor = "#fff";
  c.shadowBlur = this.glow;
  c.beginPath();
  c.moveTo(this.x, this.y);
  c.lineTo(this.x + this.width / 2, this.y - this.height);
  c.lineTo(this.x + this.width, this.y);
  c.lineTo(this.x, this.y);
  c.lineTo(this.x + this.width / 2, this.y + this.height);
  c.lineTo(this.x + this.width, this.y);
  c.stroke();

  // Ray
  if (this.rayOn) {
    c.fillStyle = 'rgba(255,192,203, 0.2)';
    c.shadowBlur = 5;
    c.beginPath();
    c.moveTo(this.x + this.width / 2, this.y);
    c.arc(this.x + this.width / 2, this.y, WORLD.width, this.rayAngleFrom, this.rayAngleTo);
    c.lineTo(this.x + this.width / 2, this.y);
    c.stroke();
    c.fill();
  }

  // Glare
  if (this.glareOn) {
    c.shadowBlur = this.glow;
    c.beginPath();
    c.moveTo(this.x + this.width / 2, this.y - this.height);
    c.lineTo(this.x + this.glareX, this.y);
    c.lineTo(this.x + this.width / 2, this.y + this.height);
    c.stroke();
  }

  c.restore();
};

Crystal.prototype.move = function(t) {
  if (this.glareOn) {
    this.glareX += this.glareSpeed;
    if (this.glareX > this.width) this.glareX = 0;
    if (this.glareX < 0) this.glareX = this.width;
  }

  if (this.rayOn) {
    this.rayAngleFrom += this.raySpeed;
    this.rayAngleTo += this.raySpeed;
  }
};

if (typeof exports !== 'undefined') {
  WORLD = require('./world.js').world;
  exports.crystal = Crystal;
}
