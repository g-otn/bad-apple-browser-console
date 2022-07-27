# bad-apple-browser-console

Watch the [Bad Apple!!](https://www.youtube.com/watch?v=FtutLA63Cp8) video through the browser console.

[demo](https://user-images.githubusercontent.com/44736064/181088573-a254b429-5200-42e0-9ffb-178cb32d0d42.mp4)

This project generates and repeatedly logs braille ascii art text through a timer
into the browser console so that it looks like a video.

The braille art was generated using [img2braille](https://github.com/5E7EN/Img2Braille), which received video frame image files extracted from the original video with FFmpeg.

The timer used to properly sync the logging with the video was made by James Edwards in his article "[Creating Accurate Timers in JavaScript](https://www.sitepoint.com/creating-accurate-timers-in-javascript/)".

## Watch it!

Access **https://g-otn.github.io/bad-apple-browser-console/** and follow the steps.

## Watch it locally

You can watch it locally by downloading this repo and serving the [`public/`](public/) folder.
If you have Node.js installed, you can simply do:

```bash
git clone https://github.com/g-otn/bad-apple-browser-console.git
cd bad-apple-browser-console
npx serve public/
```

And then access [`localhost:5000`](http://localhost:5000).

## Generate new video

Requires: Node.js, FFmepg

Although this has not been tested, you could probably generate and play any video that isn't too long, too heavy and doesn't have a too big resolution. To do that, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/g-otn/bad-apple-browser-console.git
cd bad-apple-browser-console
```

2. Put the video file you want to use inside the [`video/`](video/) folder.
3. Rename it to `video.mp4`.
4. Start the npm scripts by running `npm start`
5. After everything is done, you can access [`localhost:5000`](http://localhost:5000) and follow the steps to watch the video.

Note2: You can alter the code/scripts to generate a different resolution, which can also decrease the processing time.
Take a look at the FFmpeg command in the `extract-frames` script in [`package.json`](package.json) and also in the `asciiWidth` variable in the [`generate-braille.js`](generate-braille.js) file.
