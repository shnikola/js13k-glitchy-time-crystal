Player = function(o) {
  var x = o.x, 
      y = o.y,
      team = o.team,
      speed = 5,
      moving = true,
      api = {
        draw: function() {
          GFX.context.fillStyle = "rgb(255, 255, 255)";
          GFX.context.fillRect(x, y, 10, 10);
        },
        move: function() {
          moving = false;
          if      (KEYBOARD[65]) { x -= speed; moving = true; console.log("LEFT"); } 
          else if (KEYBOARD[68]) { x += speed; moving = true; }
          if      (KEYBOARD[87]) { y -= speed; moving = true; }
          else if (KEYBOARD[83]) { y += speed; moving = true; }
        },
        state: function() {
          return { x: x, y: y }
        }
        
      };
  return api;
}