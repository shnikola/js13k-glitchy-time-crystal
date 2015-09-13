function ClientState() {
  this.sprites = [];
  this.players = [];
  this.crystal = new Crystal();
  this.crystal.glareOn = true;
}

ClientState.prototype.load = function(d) {
  this.sprites = [];

  for (var i = 0; i < d.players.length; i++) {
    var id = d.players[i].id;
    if (this.player && id == this.player.id) {
      this.player.merge(d.players[i]);
    } else if (this.players[id]) {
      this.players[id].merge(d.players[i]);
    } else {
      this.players[id] = new Player(d.players[i]);
    }
    // Maybe push them into sprites?
  }

  for (i = 0; i < d.bullets.length; i++) {
    this.sprites.push(new Bullet(d.bullets[i]));
  }

  for (i = 0; i < d.crates.length; i++) {
    this.sprites.push(new Crate(d.crates[i]));
  }
  this.sprites.push(this.crystal);
};

ClientState.prototype.draw = function() {
  GFX.cls();
  this.sprites.forEach(function(s) { s.draw(GFX.context); });
  this.players.forEach(function(s) { s.draw(GFX.context); });
  if (this.player) this.player.draw(GFX.context);
  GFX.context.font = "10px Consolas, monospace";
  if (this.player) GFX.context.fillText("DEBUG ping time:" + this.player.pingTime, 10, 10);
  if (this.player) GFX.context.fillText("DEBUG FPS:" + FRAMERATE.estimatedFps(), 10, 20);

  if (this.waiting) {
    this.drawMessage(GFX.context, "Waiting for other players...");
  } else if (!this.player) {
    this.drawMessage(GFX.context, "Spectator mode");
  }

  CHAT.draw(GFX.context);
};

ClientState.prototype.drawMessage = function(c, msg) {
  c.save();
  c.fillStyle = "#666";
  c.textAlign = "center";
  c.font = "15px Consolas, monospace";
  c.fillText(msg, 400, 30);
  c.restore();
};
