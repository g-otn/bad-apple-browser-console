const { braillefy } = require('img2braille');
const fs = require('fs');

const asciiWidth = 60;
const asciiOpts = {
  dither: false,
  invert: false,
};

(async () => {
  let frameIndex = 1, text = '';
  console.info('Generating braille art...')

  do {
    const result = await braillefy(`./video/frames/frame${(frameIndex++ + '').padStart(4, '0')}.jpeg`, asciiWidth, asciiOpts)
      .catch(() => null);
    
    if (!result) break;
    else text += result + '\n'
  } while (true);

  fs.writeFileSync('public/braille.txt', text);
  console.info('Written ' + frameIndex + ' "braille frames" to file')
})();