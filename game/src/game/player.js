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
      speed = 0.08,
      moving = false,
      shooting = false,
      shootingBlocked = false,
      weapon = 1,
      bullets = [],
      bulletsToSend = [],
      api = {
        id: id,
        merge: function(o) {
          if (stateVersion == o.stateVersion) {
            x = o.x;
            y = o.y;
            bullets = o.bullets;
            synced = true;
          } else {
            synced = false;
          }
          console.log(bullets)
          pingTime = o.pingTime;
        },
        draw: function(c) {
          // player
          c.fillStyle = color;
          c.fillRect(x, y, size, size);
          
          if (main) {
            // crosshair
            c.lineWidth = 2;
            c.strokeStyle = "#fff";
            c.beginPath();
            c.arc(MOUSE.x, MOUSE.y, 5, 0, Math.PI * 2);
            c.stroke();
            
            // Weapon
            c.fillRect(x + size / 2 + size * Math.cos(angle), y + size / 2 + size * Math.sin(angle), 3, 3);
          }
          
          for (var i = 0; i < bullets.length; i++) {
            c.fillStyle = color;
            c.fillRect(bullets[i].x - 1, bullets[i].y - 1 , 2, 2);
          }
        },
        move: function(timestep) {
          moving = false, shooting = false;
          
          if      (KEYBOARD[65]) { x -= speed * timestep; moving = true; }
          else if (KEYBOARD[68]) { x += speed * timestep; moving = true; }
          if      (KEYBOARD[87]) { y -= speed * timestep; moving = true; }
          else if (KEYBOARD[83]) { y += speed * timestep; moving = true; }
          
          if (MOUSE.down) { api.shoot(); }
          angle = Math.atan2(MOUSE.y - y, MOUSE.x - x);
          
          // for (var i = 0; i < bullets.length; i++) {
          //   bullets[i].x += Math.sin(bullets[i].angle) * WEAPONS.list[bullets[i].weapon].speed * timestep;
          //   bullets[i].y += Math.cos(bullets[i].angle) * WEAPONS.list[bullets[i].weapon].speed * timestep;
          // }
          
          if (moving) stateVersion += 1;
        },
        shoot: function() {
          if (shootingBlocked) return;
          
          shooting = true;
          shootingBlocked = true;
          
          bullets.push({x: x, y: y, angle: angle, weapon: weapon, player: id});
          bulletsToSend.push({x: x, y: y, angle: angle, weapon: weapon, player: id});
          setTimeout(function() { shootingBlocked = false; }, 600);
        },
        sendData: function() {
          var data = { x: x, y: y, version: stateVersion, bullets: bulletsToSend };
          bulletsToSend = [];
          return data;
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