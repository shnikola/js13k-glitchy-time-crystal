Graphics = function() {
  var canvas = document.getElementById("world"),
      context = canvas.getContext("2d"),
      
      api = {
        canvas: canvas,
        context: context,
        cls: function() {
          context.fillStyle = '#000';
          context.clearRect(0, 0, canvas.width, canvas.height);
        },
        rect: function(x, y, w, h) {
          context.fillRect(x, y, w, h);
        }
        
      };
  
  return api;
}