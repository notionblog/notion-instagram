const fs = require("fs");
const fetch = require("node-fetch");
const uuidv4 = require("uuid/v4");
const path = require("path");
const appDir = path.dirname(require.main.filename);

module.exports = async (imageUrl) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(imageUrl);
      const filename = uuidv4();
      res.body.pipe(fs.createWriteStream(`${appDir}/images/${filename}.jpeg`));
      resolve(filename);
    } catch (err) {
      console.log(err);
      reject("error");
    }
  });
};
