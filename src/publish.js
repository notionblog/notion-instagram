const { readFile } = require("fs");
const { promisify } = require("util");
var path = require("path");
const appDir = path.dirname(require.main.filename);
const readFileAsync = promisify(readFile);
const igLogin = require("../config/IgLogin");

module.exports = async (filename, caption, folder) => {
  const ig = igLogin.getIg();
  return new Promise(async (resolve, reject) => {
    try {
      await ig.publish.photo({
        file: await readFileAsync(`${appDir}/${folder}/${filename}.jpeg`),
        caption: caption,
      });
      resolve("post published");
    } catch (err) {
      console.log(err);
      reject(`Failed to publish image: ${err}`);
    }
  });
};
