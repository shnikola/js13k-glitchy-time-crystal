Framerate = function() {
  var timestep = 1000 / 60, // how much time simulated on each update
      delta = 0, // Time between 2 last draws
      lastFrameTime = 0,
      fps = 60,
      lastFpsUpdate = 0,
      framesThisSecond = 0,
      minFrameDelay = 0, // For throttling frame rate, set to 1000 / maxFrameRate

      api = {
        calculateDelta: function(timestamp) {
          delta += timestamp - lastFrameTime;
          lastFrameTime = timestamp;

          // Estimate Framerate
          if (timestamp > lastFpsUpdate + 1000) {
            fps = 0.25 * framesThisSecond + 0.75 * fps;
            lastFpsUpdate = timestamp;
            framesThisSecond = 0;
          }
          framesThisSecond++;
        },

        fixedStepUpdate: function(update) {
          var numUpdateSteps = 0;
          while (delta >= timestep) {
            delta -= timestep;
            update(timestep);
            if (++numUpdateSteps >= 240) {
              console.log("FRAMERATE PANIC");
              break;
            }
          }
        },

        exceedsFrameRate: function(timestamp) {
          return timestamp < lastFrameTime + minFrameDelay;
        },

        estimatedFps: function() {
          return Math.round(fps);
        }
      };
  return api;
};
