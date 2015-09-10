Utils = {
  collides: function(o1, o2) {
    if (!o1 || !o2) return false;
    return !(
      (o1.y + (o1.size || o1.height) < o2.y) ||
      (o1.y > o2.y + (o2.size || o2.height)) ||
      (o1.x + (o1.size || o1.width) < o2.x) ||
      (o1.x > o2.x + (o2.size || o2.width))
    );
  },
};

if (typeof exports !== 'undefined') {
  exports.utils = Utils;
}
