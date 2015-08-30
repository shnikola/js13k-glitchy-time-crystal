Player = function(o, main) {
  var main = !!main,
      id = o.id,
      x = o.x,
      y = o.y,
      angle = 0,
      team = o.team,
      color = o.team == 'a' ? '#f00' : '#00f',
      size = 10,
      speed = 5,
      moving = true,
      api = {
        id: id,
        merge: function(o) {
          //console.log(x, y);
          //console.log(o.x, o.y);
          x = o.x;
          y = o.y;
        },
        draw: function() {
          // player
          GFX.context.fillStyle = color;
          GFX.context.fillRect(x, y, size, size);
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
          
          angle = Math.atan2(MOUSE.y - y, MOUSE.x - x);
          
        },
        state: function() {
          return { x: x, y: y }
        }
        
      };
  return api;
}