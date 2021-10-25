const { readFile } = require("fs");
const { promisify } = require("util");
var path = require("path");
const appDir = path.dirname(require.main.filename);
const readFileAsync = promisify(readFile);
const igLogin = require("../config/IgLogin");

module.exports = async (files, caption, folder) => {
  const ig = igLogin.getIg();
  return new Promise(async (resolve, reject) => {
    try {
      //Check if there is one image or multiple
      if (files.length === 1) {
        console.log(`files omg: ${JSON.stringify(files[0])}`);
        // Publishing photo
        if (files[0].type == "image") {
          await ig.publish.photo({
            file: await readFileAsync(
              `${appDir}/${folder}/${files[0].file}.jpeg`
            ),
            caption: caption,
          });
        } else if (files[0].type == "video") {
          console.log("---------------videofound-----------------");
          await ig.publish.video({
            video: await readFileAsync(
              `${appDir}/${folder}/${files[0].file}.mp4`
            ),
            coverImage: await readFileAsync(
              `${appDir}/${folder}/${files[0].file}.jpg`
            ),
            caption: caption,
          });
        }
      } else {
        // Publishing Album
        let i = 0;
        const items = [];
        while (i <= files.length - 1) {
          if (files[i].type == "image") {
            const file = await readFileAsync(
              `${appDir}/${folder}/${files[i].file}.jpeg`
            );
            items.push({ file: file });
          } else if (files[i].type == "video") {
            items.push({
              video: await readFileAsync(
                `${appDir}/${folder}/${files[i].file}.mp4`
              ),
              coverImage: await readFileAsync(`${appDir}/videocover.jpg`),
            });
          }

          i++;
        }
        await ig.publish.album({ items: items, caption: caption });
      }

      resolve("post published");
    } catch (err) {
      console.log(err);
      reject(`Failed to publish image: ${err}`);
    }
  });
};
