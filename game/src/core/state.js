State = function() {
  var sprites = [];
  var api = {
    player: null,
    load: function(d) {
      api.player.merge(d.players[api.player.id]); // Merge current state
      d.players[STATE.player.id] = null; // Don't need this, we draw player separately.
      
      sprites.length = 0;
      d.players.forEach(function(o) {
        o && sprites.push(Player(o));
      });
    },
    draw: function() {
      GFX.cls();
      api.player && api.player.draw();
      sprites.forEach(function(n) { n.draw(); });
      api.player && GFX.context.fillText("DEBUG ping time:" + api.player.pingTime(), 10, 10);
    },
    clear: function () {
      sprites.length = 0;
    }
  };
  
  return api;
}