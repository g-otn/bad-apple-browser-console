/*
James Edwards
June 23, 2010
https://www.sitepoint.com/creating-accurate-timers-in-javascript/
*/
function doTimer(length, resolution, oninstance, oncomplete) {
  var steps = (length / 100) * (resolution / 10),
    speed = length / steps,
    count = 0,
    start = new Date().getTime();

  function instance() {
    if (count++ == steps) {
      oncomplete(steps, count);
    }
    else {
      oninstance(steps, count);

      // Modification: add stop switch
      if (window.stopTimer) return;

      var diff = (new Date().getTime() - start) - (count * speed);
      window.setTimeout(instance, (speed - diff));
    }
  }

  window.setTimeout(instance, speed);
}