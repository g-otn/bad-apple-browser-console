const button = document.getElementById('play');
const playerFrame = document.getElementById('playerFrame');
const body = document.querySelector('body');

const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

const fps = 30,
  msPerFrame = 1000 / fps;
let frames;
let lastCurrentTime;

const isVideoLoadedAndPlaying = (e) => {
  const { event, info } = JSON.parse(e.data);
  lastCurrentTime = info.currentTime;
  return event === 'infoDelivery' && info.currentTime > 0;
};

const stop = () => {
  window.stopTimer = true;
  button.innerText = 'Play';
  body.classList.remove('hide-text');
  window.player.stopVideo();
};

const play = async () => {
  button.innerText = 'Loading video...';
  button.disabled = true;
  body.classList.add('hide-text');
  console.clear();

  const listener = (e) => {
    // Wait for video to start playing
    if (!isVideoLoadedAndPlaying(e)) return;

    removeEventListener('message', listener);

    /**
     * Quick and dirty trick to improve sync between video and console:
     * Play video once for 1s to load start of the video then restart playback.
     * This avoids initial buffering from desyncing video from console
     */
    setTimeout(() => {
      window.player.stopVideo();
    }, 1500);
    setTimeout(() => {
      window.player.playVideo();
      button.disabled = false;
      button.innerText = 'Stop';

      // start printing
      doTimer(frames.length * msPerFrame, fps, (steps, count) => {
        if (frames[count]) {
          if (isFirefox && (msPerFrame * count) % 6000 < msPerFrame) {
            // Firefox console slows down a bit if console isn't cleared once in a while
            console.clear();
          }
          console.log(frames[count]);
        } else {
          stop();
        }
      });
    }, 2000);
  };
  addEventListener('message', listener);

  window.player.playVideo();
  window.stopTimer = false;
};

button.addEventListener('click', (e) => {
  if (window.stopTimer === undefined || window.stopTimer === true) {
    play();
  } else {
    stop();
  }
});

// Fetch, unzip and load text
const load = () => {
  button.innerText = 'Fetching frames...';
  JSZipUtils.getBinaryContent('braille.zip', (err, data) => {
    if (err) throw err;

    button.innerText = 'Unzipping frames...';
    JSZip.loadAsync(data).then((zip) => {
      button.innerText = 'Loading frames...';
      zip
        .file('braille.txt')
        .async('string')
        .then((content) => {
          frames = content.split('\n\n');
          delete frames[frames.length - 1]; // Delete last empty 'frame' created by split command

          button.innerText = 'Play';
          button.disabled = false;

          // Show tip to properly display frames
          const helpLine =
            new Array(frames[0].split('\n')[0].length + 1).join('⣿') +
            '⣿⣿⣿⣿⣿⣿⣿⣿';
          console.clear();
          console.info(
            "%cTweak console width/zoom so that the following line doesn't break:",
            'font-size: 22pt'
          );
          console.info('%c' + helpLine + '\n', 'color: cyan; ');
        });
    });
  });
};

load();

function onYouTubeIframeAPIReady() {
  // Creating a player enables window message events from the embed we can listen to
  window.player = new YT.Player('playerFrame', {
    width: 640,
    height: 360,
    videoId: 'FtutLA63Cp8',
    playerVars: {
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      showinfo: 0,
    },
  });
}
