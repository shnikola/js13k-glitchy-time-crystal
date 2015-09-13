function Menu() {
  this.active = false;
  this.loading = false;

  this.elem = document.getElementById('menu');
  this.initRoomButtons();

  this.goodTitle = "GLITCHY TIME CRYSTAL";
  this.glitchyTitle = "gГiЂČЖY TiШҘ KЯZꙄЋѦГ";
  this.title = this.goodTitle;
  this.showTitle = false;

  this.crystal = new Crystal();
  this.crystal.alpha = 0;
  this.crystal.glow = 5;
}


Menu.prototype.start = function() {
  var self = this;
  this.active = true;
  requestAnimationFrame(this.animate.bind(this));
  this.fadeInCrystal(1000);
  setTimeout(function() { self.crystal.glareOn = true; }, 1000 + 1000);
  setTimeout(function() { self.showTitle = true; }, 1000 + 4000);
  setTimeout(this.addGlitches.bind(this), 1000 + 5000);
  setTimeout(this.toggleRooms.bind(this, true), 1000 + 5000);
};

Menu.prototype.fadeInCrystal = function(time) {
  var self = this;
  var deltaAlpha = 1000 / (time * 30);
  var fadeIn = function() {
    self.crystal.alpha += deltaAlpha;
    if (self.crystal.alpha < 1) {
      setTimeout(fadeIn, 60);
    }
  };

  fadeIn();
};

Menu.prototype.addGlitches = function() {
  var self = this;
  var i = Math.floor(this.title.length * Math.random());
  this.title = this.title.substr(0, i) + this.glitchyTitle[i] + this.title.substr(i + 1);
  if (Math.random() < 0.8) setTimeout(function() {
    self.title = self.title.substr(0, i) + self.goodTitle[i] + self.title.substr(i + 1);
  }, 500 * Math.random());

  setTimeout(this.addGlitches.bind(this), 500 + 1000 * Math.random());
};

Menu.prototype.drawTitle = function(c) {
  if (!this.showTitle) return;
  c.save();
  c.strokeStyle = this.crystal.color;
  c.shadowColor = "#fff";
  c.shadowBlur = 5;
  c.textAlign = "center";
  c.font = "30px Verdana, sans-serif";
  c.strokeText(this.title, 400, 100);
  document.title = this.title;
  c.restore();
};


Menu.prototype.initRoomButtons = function(bool) {
  var roomElem = this.elem.children[0];
  roomElem.remove();
  for (var i = 0; i < ROOMS.count; i++) {
    var room = roomElem.cloneNode(true);
    room.id = "room-" + i;
    room.children[0].textContent = "Room " + (i+1);
    room.onclick = this.roomClicked.bind(this, i);
    this.elem.appendChild(room);
  }

  this.updateRooms();
};

Menu.prototype.toggleRooms = function(bool) {
  this.elem.style.display = bool ? 'block' : 'none';
};

Menu.prototype.updateRooms = function() {
  for (var i = 0; i < ROOMS.players.length; i++) {
    this.elem.children[i].children[1].textContent = ROOMS.players[i].count + " / " + ROOMS.players[i].max;
    this.elem.children[i].children[2].textContent = ROOMS.players[i].count < ROOMS.players[i].max ? "Join" : "Spectate";
  }
};

Menu.prototype.roomClicked = function(id) {
  this.toggleRooms(false);
  this.loading = true;
  this.crystal.raySpeed = Math.PI / 30;
  this.crystal.rayOn = true;

  setTimeout(this.onRoomClick.bind(this, id), 2000);
};

Menu.prototype.animate = function(timestamp) {
  var self = this;
  FRAMERATE.calculateDelta(timestamp);

  FRAMERATE.fixedStepUpdate(function(timestep) {
    self.crystal.interpolate(timestep);
  });

  if (this.loading) {
    // Crazy loading without cls, find a better place to put it
    this.crystal.draw(GFX.context);
  } else {
    GFX.cls();
    this.crystal.draw(GFX.context);
    this.drawTitle(GFX.context);
  }

  if (this.active) requestAnimationFrame(this.animate.bind(this));
};
