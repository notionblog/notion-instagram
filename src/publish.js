const { IgApiClient } = require("instagram-private-api");
const { readFile } = require("fs");
const { promisify } = require("util");
var path = require("path");
const appDir = path.dirname(require.main.filename);

const readFileAsync = promisify(readFile);
const ig = new IgApiClient();
ig.state.generateDevice(process.env.IG_USERNAME);

module.exports = async (filename, caption) => {
  try {
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    await ig.publish.photo({
      file: await readFileAsync(`${appDir}/output/${filename}.jpeg`),
      caption: caption,
    });
  } catch (err) {
    console.log("Failed to publish image: ", err);
  }
};
