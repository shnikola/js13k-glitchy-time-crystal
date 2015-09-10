WORLD = {
  width: 800 - 10,
  height: 480 - 10,
  out: function(o) {
    return o.x < 0 || o.x > WORLD.width || o.y < 0 || o.y > WORLD.height;
  }
};

if (typeof exports !== 'undefined') {
  exports.world = WORLD;
}
