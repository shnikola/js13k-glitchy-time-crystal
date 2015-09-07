State = function() {
  var sprites = [];
  var api = {
    messages: [],
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
      GFX.context.font = "10px Consolas, monospace";
      sprites.forEach(function(n) { n.draw(GFX.context); });
      api.player && api.player.draw(GFX.context);
      api.player && GFX.context.fillText("DEBUG ping time:" + api.player.pingTime(), 10, 10);
      api.player && GFX.context.fillText("DEBUG FPS:" + FRAMERATE.estimatedFps(), 10, 20);
      CHAT.draw(GFX.context);
    },
    clear: function () {
      sprites.length = 0;
    }
  };
  
  return api;
}