const button = document.getElementById('play');
const player = document.getElementById('player')

const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

const fps = 30, ms = 1000 / fps;
let frames;

const stop = () => {
  window.stopTimer = true;
  button.innerText = 'Play'
  postMessageToPlayer('stopVideo')
}

const play = async () => {
  button.innerText = 'Stop'
  console.clear();

  postMessageToPlayer('playVideo')

  window.stopTimer = false;
  doTimer(frames.length * ms, fps, (steps, count) => {
    if (frames[count]) {
      if (isFirefox && (ms * count % 6000) < ms) { // Firefox console slows down a bit if console isn't cleared once in a while
        console.clear();
      }
      console.log(frames[count])
    } else {
      stop();
    }
  });
};

button.addEventListener('click', e => {
  if (window.stopTimer === undefined || window.stopTimer === true) {
    play();
  } else {
    stop();
  }
});

// Fetch, unzip and load text
const load = () => {
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
          const helpLine = new Array(frames[0].split('\n')[0].length + 1).join('⣿') + '⣿⣿⣿⣿⣿⣿⣿⣿'
          console.clear()
          console.info('%cTweak console width/zoom so that the following line doesn\'t break:', 'font-size: 22pt')
          console.info('%c' + helpLine + '\n', 'color: cyan; ')
        })
    });
  });
}

const postMessageToPlayer = (command, args = '') => {
  player.contentWindow.postMessage('{"event":"command","func":"' + command + '","args":"' + args + '"}', '*');
};

load();