function Crystal() {
  this.width = 100;
  this.height = 80;
  this.x = WORLD.width / 2 - this.width / 2;
  this.y = WORLD.height / 2 - this.height / 2;
  this.rayOn = true;
  this.raySpeed = Math.PI / 300;
  this.rayAngleFrom = 0;
  this.rayAngleTo = Math.PI / 6;
  this.glareX = 0;
  this.glareSpeed = 1.2;
}

Crystal.prototype.draw = function(c) {
  // Diamond
  c.lineWidth = 1;
  c.fillStyle = "#000";
  c.strokeStyle = 'rgb(255,192,203)';
  c.shadowColor = "#fff";
  c.shadowBlur = 5;
  c.beginPath();
  c.moveTo(this.x, this.y);
  c.lineTo(this.x + this.width / 2, this.y - this.height);
  c.lineTo(this.x + this.width, this.y);
  c.lineTo(this.x, this.y);
  c.lineTo(this.x + this.width / 2, this.y + this.height);
  c.lineTo(this.x + this.width, this.y);
  c.stroke();

  // Ray
  c.fillStyle = 'rgba(255,192,203, 0.2)';
  c.shadowBlur = 5;
  c.beginPath();
  c.moveTo(this.x + this.width / 2, this.y);
  c.arc(this.x + this.width / 2, this.y, WORLD.width, this.rayAngleFrom, this.rayAngleTo);
  c.lineTo(this.x + this.width / 2, this.y);
  c.stroke();
  c.fill();

  // Glare
  c.beginPath();
  c.moveTo(this.x + this.width / 2, this.y - this.height);
  c.lineTo(this.x + this.glareX, this.y);
  c.lineTo(this.x + this.width / 2, this.y + this.height);
  c.stroke();
  c.shadowBlur = 0;
};

Crystal.prototype.move = function(t) {
  this.glareX += this.glareSpeed;
  if (this.glareX > this.width) this.glareX = 0;
  if (this.glareX < 0) this.glareX = this.width;

  this.rayAngleFrom += this.raySpeed;
  this.rayAngleTo += this.raySpeed;

};

if (typeof exports !== 'undefined') {
  WORLD = require('./world.js').world;
  exports.crystal = Crystal;
}
