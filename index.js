const fs = require("fs");
const outputDir = "./output";
const imagesDir = "./images";
var cron = require("cron").CronJob;
require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const igLogin = require("./config/IgLogin");

const generatePost = require("./src/generatePost.js");
const publish = require("./src/publish");
const getPosts = require("./src/getPosts.js");
const updatePostStatus = require("./src/updatePostStatus");
const getPostImage = require("./src/getPostImage");

const { IG_USERNAME, IG_PASSWORD, PAGE_LINK, NT_SECRET } = process.env;
let isReady = -1;

if (IG_USERNAME && IG_PASSWORD && PAGE_LINK && NT_SECRET) {
  isReady = 1;

  (async () => {
    await igLogin.login();
  })();

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
  }

  const check = async () => {
    try {
      const posts = await getPosts();

      for (i = 0; i < posts.length; i++) {
        const { id, title, tags, schedule, isScheduled, images } = posts[i];
        if (schedule && (isScheduled === undefined || isScheduled === false)) {
          await updatePostStatus(id, "isScheduled");
          console.log(`${title} - Scheduled - ${JSON.stringify(schedule)}`);
          const date = new Date(
            `${schedule.start_date}T${schedule.start_time}`
          );
          new cron(
            `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth()} ${date.getDay()}`,
            () => {
              try {
                publishPost(id, title, tags, images);
              } catch (err) {
                console.log(err);
              }
            },
            null,
            true,
            schedule.time_zone
          );
        } else if (!schedule) {
          await publishPost(id, title, tags, images);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const publishPost = async (id, title, tags, images) => {
    console.log(`publishing the post -  ${title}`);
    try {
      await updatePostStatus(id, "isPublished");
      const files = [];
      //check if there the user one to add images or  post with text
      if (images && images.length > 0) {
        let i = 0;
        // generate all images
        while (i <= images.length - 1) {
          const filename = await getPostImage(images[i]);
          files.push({ file: filename });
          i++;
        }
      } else {
        const filename = await generatePost(title);
        files.push({ file: filename });
      }
      const caption = `${title}\n\n\n ${tags ? tags : ""}`;
      await publish(files, caption, images.length > 0 ? "images" : "output");
    } catch (err) {
      console.log(err);
    }
  };

  // check new posts every Minute
  setInterval(
    async () => {
      console.log("Checking new Posts...");
      await check();
    },
    process.env.INTERVAL && process.env.INTERVAL > 15000
      ? process.env.INTERVAL
      : 15000
  );
} else {
  console.log(
    "IG_USERNAME, IG_PASSWORD, PAGE_LINK, NT_SECRET are required to run the script"
  );
}

app.get("/", async (req, res) => {
  // const posts = await getPosts();
  // res.json(posts);
  res.send(
    isReady === -1
      ? "IG_USERNAME, IG_PASSWORD, PAGE_LINK, NT_SECRET are required to run the script"
      : "The script is running! "
  );
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server started.");
});
