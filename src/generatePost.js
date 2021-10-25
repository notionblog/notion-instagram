const fs = require("fs");
const { createCanvas } = require("canvas");
const uuidv4 = require("uuid/v4");
const path = require("path");
const appDir = path.dirname(require.main.filename);

const _formatText = (text, textWidth) => {
  const wc = Math.round((550 * text.split(" ").length) / textWidth);
  let formatedText = "";

  text.split(" ").forEach((word, i) => {
    formatedText += word + " ";
    if (i % wc === 0 && i !== 0) {
      formatedText += "\n";
    }
  });
  return formatedText;
};

const generatePost = (text) => {
  return new Promise((resolve, reject) => {
    try {
      // instagram post size
      const canvas = createCanvas(1080, 1080);
      const ctx = canvas.getContext("2d");
      ctx.font = "45px Rokkitt";
      ctx.fillStyle = "white";

      if (text) {
        const mainText = _formatText(text, ctx.measureText(text).width);

        const textActualHeight =
          ctx.measureText(mainText).actualBoundingBoxAscent +
          ctx.measureText(mainText).actualBoundingBoxDescent;

        // draw text
        ctx.fillText(
          mainText,
          canvas.width / 2 - ctx.measureText(mainText).width / 2,
          canvas.height / 2 -
            textActualHeight / 2 +
            ctx.measureText(mainText).actualBoundingBoxAscent
        );
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
      }
      // draw copyright
      ctx.fillText(`@${process.env.IG_USERNAME}`, 900, 1020);
      ctx.font = "20px Rokkitt";
      ctx.textAlign = "right";

      // save the canvas jpg
      const stream = canvas.createJPEGStream({ quality: 0.95 });
      const filename = uuidv4();
      const out = fs.createWriteStream(`${appDir}/output/${filename}.jpeg`);
      stream.pipe(out);
      out.on("finish", () => {
        resolve(filename);
      });
    } catch (err) {
      console.error(err);
      reject("failed to generate the post");
    }
  });
};

module.exports = generatePost;
