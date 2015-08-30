State = function() {
  var sprites = [];
  var api = {
    player: null,
    load: function(d) {
      sprites.length = 0;
      d.players.forEach(function(o) {
        o && sprites.push(Player(o));
      });
    },
    draw: function() {
      GFX.cls();
      api.player && api.player.draw();
      sprites.forEach(function(n) { n.draw(); });
    },
    clear: function () {
      sprites.length = 0;
    }
  };
  
  return api;
}