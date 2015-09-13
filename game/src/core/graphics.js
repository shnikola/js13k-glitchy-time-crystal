Graphics = function() {
  var screen = document.getElementById("screen"),
      canvas = document.getElementById("world"),
      context = canvas.getContext("2d"),

      api = {
        canvas: canvas,
        context: context,
        screen: screen,
        cls: function() {
          context.clearRect(0, 0, canvas.width, canvas.height);
        },
        hideCursor: function() {
          canvas.style.cursor = 'none';
        },
        showCursor: function() {
          canvas.style.cursor = 'inherit';
        },
        rect: function(x, y, w, h) {
          context.fillRect(x, y, w, h);
        },
        circle: function (x, y, r) {
          context.beginPath();
          context.arc(x, y, r, 0, Math.PI * 2);
          context.stroke();
        },

      };

  return api;
};
