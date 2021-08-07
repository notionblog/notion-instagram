const fs = require("fs");
const { createCanvas } = require("canvas");
const uuidv4 = require("uuid/v4");
var path = require("path");
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

const generateQuotePost = (text) => {
  // instagram post size
  const canvas = createCanvas(1080, 1080);
  const ctx = canvas.getContext("2d");

  ctx.font = "45px Rokkitt";
  ctx.fillStyle = "white";

  const mainText = _formatText(text, ctx.measureText(text).width);
  // draw text
  ctx.fillText(
    mainText,
    canvas.width / 2 - ctx.measureText(mainText).width / 2,
    canvas.height / 2 - 150
  );
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // draw copyright
  ctx.fillText("@_yudax", 900, 1020);
  ctx.font = "20px Rokkitt";
  ctx.textAlign = "right";

  // save the canvas jpg
  const stream = canvas.createJPEGStream({ quality: 0.95 });
  const filename = uuidv4();
  const out = fs.createWriteStream(`${appDir}/output/${filename}.jpeg`);
  stream.pipe(out);
  out.on("finish", () => {
    return filename;
  });
};

module.exports = generateQuotePost;
