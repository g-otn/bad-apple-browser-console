const button = document.getElementById('play'), range = document.getElementById('delay');

let delay = Number(1000 / range.value);
let stopped = true;
let frames;
let timestamp, timeToDisplayFrame, excessTimeToResolve;

const playBraille = async () => {
  // Fetch frames once
  if (!frames) {
    frames = await fetch('braille.txt')
      .then(res => res.text())
      .then(text => text.split('\n\n'));
  }

  stopped = false;
  console.clear();
  
  for (let i = 0; i < frames.length; i++) {
    timestamp = Date.now()
    console.log(frames[i]);
    timeToDisplayFrame = Date.now() - timestamp;
    
    timestamp = Date.now()
    await new Promise(r => setTimeout(r, delay - timeToDisplayFrame - excessTimeToResolve));

    if (stopped) return;

    excessTimeToResolve = Math.max(0, (Date.now() - timestamp) - delay - timeToDisplayFrame);
  }
};

button.addEventListener('click', e => {
  if (stopped) {
    playBraille();
    button.innerText = 'Stop'
  } else {
    stopped = true;
    button.innerText = 'Play'
  }
});

range.addEventListener('input', e => {
  delay = Number(1000 / range.value);
  console.log(Number(delay))
  document.querySelector('.delay span').innerText = range.value
})
document.querySelector('.delay span').innerText = range.value
