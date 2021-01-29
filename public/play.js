const button = document.getElementById('play');

const fps = 30, ms = 1000 / fps;
let frames;

const playBraille = async () => {
  console.clear();
  // i = 0;

  window.stopTimer = false;
  doTimer(frames.length * ms, fps, (steps, count) => {
    if (frames[count]) console.log(frames[count])
    else window.stopTimer = true;
  });
};

button.addEventListener('click', e => {
  if (window.stopTimer === undefined || window.stopTimer === true) {
    playBraille();
    button.innerText = 'Stop'
  } else {
    window.stopTimer = true;
    button.innerText = 'Play'
  }
});

// Fetch, unzip and load text
button.innerText = 'Fetching...'
JSZipUtils.getBinaryContent('braille.zip', (err, data) => {
  if (err) throw err;

  button.innerText = 'Unzipping...'
  JSZip.loadAsync(data).then(zip => {
    button.innerText = 'Loading...'
    zip.file('braille.txt').async('string')
      .then(content => {
        frames = content.split('\n\n')
        delete frames[frames.length - 1] // Delete last empty 'frame' created by split command

        button.innerText = 'Play'
        button.disabled = false

        // Show tip to properly display frames
        const helpLine = new Array(frames[0].split('\n')[0].length + 1).join('⣿') + '⣿⣿'
        console.clear()
        console.info('%cTweak console width/zoom so that the following line doesn\'t break:', 'font-size: 22pt')
        console.info('%c' + helpLine + '\n', 'color: cyan; ')
      })
  });
});