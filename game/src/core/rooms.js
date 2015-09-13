function Rooms() {
  this.count = 6;
  this.games = [];
  this.players = [];
  var roomMax = [4, 6, 6, 8, 8, 10];
  for (var i = 0; i < this.count; i++) {
    this.players.push({count: 0, max: roomMax[i]});
  }
}

Rooms.prototype.load = function(d) {
  this.players = d.players;
};

Rooms.prototype.toClient = function() {
  return { players: this.players };
};

if (typeof exports !== 'undefined') {
  exports.rooms = Rooms;
}
