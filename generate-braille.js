const { braillefy } = require('img2braille');
const fs = require('fs');
const cliProgress = require('cli-progress');
const workerFarm = require('worker-farm');

// -----
// Params to modify art

const asciiWidth = 100;
const asciiOpts = {
  dither: false,
  invert: false,
};

// -----

const frameCount = fs.readdirSync('./video/frames').length;
const workers = workerFarm(require.resolve('./child'));

const framesPerWorker = 5;
const bar1 = new cliProgress.SingleBar({ etaBuffer: framesPerWorker * 50 });
const workerCount = Math.ceil(frameCount / framesPerWorker);

console.info(
  `Generating ${frameCount} frames with ${asciiWidth} width through ${workerCount} batches`
);

bar1.start(frameCount, 0);
const allFrames = new Array(frameCount);
for (let i = 0; i < workerCount; i++) {
  const startFrame = i * framesPerWorker + 1;
  const endFrame = Math.min((i + 1) * framesPerWorker, frameCount);

  // Create workers to process multiple frames at once
  workers(
    {
      index: i,
      startFrame,
      endFrame,
      asciiWidth,
      asciiOpts,
    },
    (log, frames) => {
      // console.log(log, bar1.getProgress());
      // Store processed frames in their correct indices to keep order
      for (let j = startFrame - 1, k = 0; j < endFrame; j++, k++) {
        allFrames[j] = frames[k];
      }

      bar1.increment(frames.length);

      // Last worker triggered callback
      if (bar1.getProgress() >= 1) {
        bar1.stop();
      }
    }
  );
}

bar1.on('stop', () => {
  // Kill child processes
  workerFarm.end(workers);

  const text = allFrames.join('\n\n');
  // Replace braille character representing blank ("⠄") with actual blank braille character ("⠀")
  // .replace(/\u2804/gm, '\u2800');

  // Write final file
  fs.writeFileSync('video/braille.txt', text);
  console.info(`Written braille frames into text file`);
});
