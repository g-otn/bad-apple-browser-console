const { braillefy } = require('img2braille');

module.exports = function (
  { index, startFrame, endFrame, asciiWidth, asciiOpts },
  callback
) {
  // Process frames asyncronously via promises
  const promises = [];
  for (let i = startFrame; i <= endFrame; i++) {
    promises.push(
      braillefy(
        `./video/frames/frame${(i + '').padStart(4, '0')}.jpeg`,
        asciiWidth,
        asciiOpts
      )
    );
  }

  Promise.all(promises)
    .then((frames) => {
      callback(
        `worker #${index} finished (pid ${process.pid}). generated ${frames.length} frames (${startFrame}-${endFrame})`,
        frames
      );
    })
    .catch((err) => callback(err));
};
