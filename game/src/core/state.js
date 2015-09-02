State = function() {
  var sprites = [];
  var api = {
    messages: [],
    player: null,
    mybullets: [],
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
      sprites.forEach(function(n) { n.draw(); });
      api.player && api.player.draw();
      api.player && GFX.context.fillText("DEBUG ping time:" + api.player.pingTime(), 10, 10);
      api.player && GFX.context.fillText("DEBUG FPS:" + FRAMERATE.estimatedFps(), 10, 20);
      GFX.context.fillStyle = 'white';
      api.player && GFX.context.fillText("CHATy: press 't' to START yap yap, 'enter' to submit, 'esc' to QUIT yer yappin", 10, 30);

      // draw and decay chat messages
      for (var i = api.messages.length - 1; i >= 0; i--) {
        if (api.messages[i].ttl <= 0){
          api.messages.splice(i, 1);
        }
        else {
          if (api.messages[i].ttl < 100){
            GFX.context.fillStyle = "rgba(255, 255, 255," + api.messages[i].ttl/100 + ")";
          }
          GFX.context.fillText("Player " + api.messages[i].id + ":" + api.messages[i].text, 10, 470 - i*15);
          GFX.context.fillStyle = "rgba(255, 255, 255, 1.0)";
          api.messages[i].ttl--;
        }
      }
    },
    clear: function () {
      sprites.length = 0;
    }
  };
  
  return api;
}