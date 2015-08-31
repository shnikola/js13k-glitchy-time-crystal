Player = function(o, main) {
  var main = !!main,
      id = o.id,
      x = o.x,
      y = o.y,
      stateVersion = -1,
      synced = false,
      pingTime = 0,
      angle = 0,
      team = o.team,
      color = o.team == 'a' ? '#f00' : '#00f',
      size = 10,
      speed = 5,
      moving = true,
      shooting = false,
      api = {
        id: id,
        merge: function(o) {
          if (stateVersion == o.stateVersion) {
            x = o.x;
            y = o.y;
            synced = true;
          } else {
            synced = false;
          }
          pingTime = o.pingTime;
        },
        draw: function() {
          // player
          GFX.context.fillStyle = color;
          GFX.context.fillRect(x, y, size, size);
          
          // Shooting
          if (shooting) {
            GFX.context.font = "10px Consolas, monospace";
            GFX.context.fillText("PEW PEW", x, y - 10);
          }
          
          if (main) {
            // crosshair
            GFX.context.lineWidth = 2;
            GFX.context.strokeStyle = "#fff";
            GFX.circle(MOUSE.x, MOUSE.y, 5);
            
            // Weapon
            GFX.context.fillRect(x + size / 2 + size * Math.cos(angle), y + size / 2 + size * Math.sin(angle), 3, 3);
          }
        },
        move: function() {
          moving = false;
          
          if      (KEYBOARD[65]) { x -= speed; moving = true; }
          else if (KEYBOARD[68]) { x += speed; moving = true; }
          if      (KEYBOARD[87]) { y -= speed; moving = true; }
          else if (KEYBOARD[83]) { y += speed; moving = true; }
          
          if (MOUSE.down) { api.shoot(); }
          angle = Math.atan2(MOUSE.y - y, MOUSE.x - x);
          
          if (moving) stateVersion += 1;
        },
        shoot: function() {
          if (shooting) return;
          
          shooting = true;
          setTimeout(function() { shooting = false; }, 600);
        },
        state: function() {
          return { x: x, y: y, version: stateVersion };
        },
        pingTime: function() {
          return pingTime;
        },
        synced: function() {
          return synced;
        }
        
      };
  return api;
}