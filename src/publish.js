const { IgApiClient } = require("instagram-private-api");
const { readFile } = require("fs");
const { promisify } = require("util");
var path = require("path");
const appDir = path.dirname(require.main.filename);

const readFileAsync = promisify(readFile);
const ig = new IgApiClient();

module.exports = async (filename, caption) => {
  return new Promise(async (resolve, reject) => {
    try {
      ig.state.generateDevice(process.env.IG_USERNAME);
      await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
      await ig.publish.photo({
        file: await readFileAsync(`${appDir}/output/${filename}.jpeg`),
        caption: caption,
      });
      resolve("post published");
    } catch (err) {
      reject(`Failed to publish image: ${err}`);
    }
  });
};
