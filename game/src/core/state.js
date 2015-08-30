State = function() {
  var sprites = [];
  var api = {
    load: function(d) {
      sprites.length = 0;
      d.aTeam.forEach(function(o) {
        sprites.push(Player(o));
      });
      d.bTeam.forEach(function(o) {
        sprites.push(Player(o));
      });
    },
    draw: function() {
      GFX.cls();
      sprites.forEach(function(n) { n.draw(); });
    },
    clear: function () {
      sprites.length = 0;
    }
  };
  
  return api;
}