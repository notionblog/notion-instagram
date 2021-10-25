const fs = require("fs");
const fetch = require("node-fetch");
const uuidv4 = require("uuid/v4");
const path = require("path");
const sharp = require("sharp");
const appDir = path.dirname(require.main.filename);

module.exports = async (imageUrl) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(imageUrl);
      const buffer = Buffer.from(await res.arrayBuffer());
      const filename = uuidv4();
      sharp(buffer)
        .resize(1080, 1080)
        .jpeg({ mozjpeg: true })
        .toFile(`${appDir}/media/${filename}.jpeg`, (err, info) => {
          resolve(filename);
        });
    } catch (err) {
      console.log(err);
      reject("error");
    }
  });
};
