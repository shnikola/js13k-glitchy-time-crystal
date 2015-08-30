State = function() {
  var timestamp;
  var sprites = [];
  var api = {
    player: null,
    load: function(d) {
      sprites.length = 0;
      d.players.forEach(function(o) {
        o && sprites.push(Player(o));
      });
      timestamp = d.timestamp;
    },
    draw: function() {
      GFX.cls();
      api.player && api.player.draw();
      sprites.forEach(function(n) { n.draw(); });
      GFX.context.fillText("DEBUG ping time:" + (Date.now() - timestamp), 10, 10);
    },
    clear: function () {
      sprites.length = 0;
    }
  };
  
  return api;
}