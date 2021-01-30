const { braillefy } = require('img2braille');
const fs = require('fs');

const batchSize = 100;

const asciiWidth = 100;
const asciiOpts = {
  dither: false,
  invert: false,
};

(async () => {
  let batchIndex = 0;
  console.info('Generating braille art frames with', asciiWidth, 'ascii width');

  // Braillefy and write to file all frames through batches
  do {
    let text = '', stop = false;
    const promises = [];

    // Create all promises for the current batch
    for (let i = 0; i < batchSize; i++) {
      const frameIndex = batchIndex * batchSize + i + 1;
      console.log('batch', batchIndex, 'frame', frameIndex)

      // It seems most of expensive work is done synchronously anyways
      promises.push(braillefy(`./video/frames/frame${(frameIndex + '').padStart(4, '0')}.jpeg`, asciiWidth, asciiOpts)

      // After the last frame is braillefied, the remaining batch promises will all be rejected and then catched
        .catch(err => { stop = true })); // File not found, no more frames, shouldn't create next batch
    }

    // Concatenate all braillefied frames from current batch
    await Promise.all(promises)
      .then(values => {
        for (let i = 0; i < values.length; i++) {
          // Filter only resolved promises (found frames)
          if (values[i]) text += values[i] + '\n';
          else break;
        }
      });

    // Append concatenated braillefied frames into file, batch per batch
    fs.appendFileSync('video/braille.txt', text);

    // Stop when at least one of the batch promises got rejected
    if (stop) break;

    batchIndex++;
  } while (true);
  console.info('Written braillefied frames to text file');
})();