const fs = require("fs");
const outputDir = "./output";
const mediaDir = "./media";
const cron = require("cron").CronJob;
require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const igLogin = require("./config/IgLogin");
const generatePost = require("./src/generatePost.js");
const publish = require("./src/publish");
const getPosts = require("./src/getPosts.js");
const updatePostStatus = require("./src/updatePostStatus");
const getPostImage = require("./src/getPostImage");
const getPostVideo = require("./src/getPostVideo");

const { IG_USERNAME, IG_PASSWORD, PAGE_LINK, NT_SECRET } = process.env;
let isReady = -1;

if (IG_USERNAME && IG_PASSWORD && PAGE_LINK && NT_SECRET) {
  isReady = 1;
  // Login to Instagram
  (async () => {
    await igLogin.login();
  })();
  /*
    Creating Media folders:
    Media: Used for videos and images
    Output: Title to images posts
  */
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir);
  }
  /*
    check for available posts
    IsPublished:false
    Publish:true
  */
  const check = async () => {
    try {
      const posts = await getPosts();

      for (i = 0; i < posts.length; i++) {
        const { id, title, tags, schedule, isScheduled, media } = posts[i];
        if (schedule && (isScheduled === undefined || isScheduled === false)) {
          await updatePostStatus(id, "IsScheduled");
          console.info(`${title} - Scheduled - ${JSON.stringify(schedule)}`);
          const date = new Date(schedule.date);
          new cron(
            `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth()} ${date.getDay()}`,
            () => {
              try {
                publishPost(id, title, tags, media);
              } catch (err) {
                console.error(err);
              }
            },
            null,
            true,
            schedule.time_zone,
            null,
            null,
            schedule.offset
          );
        } else if (!schedule) {
          await publishPost(id, title, tags, media);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const publishPost = async (id, title, tags, media) => {
    console.info(`publishing the post -  ${title}`);
    try {
      await updatePostStatus(id, "IsPublished");
      const files = [];
      // check if their is some media files
      if (media && media.length > 0) {
        let i = 0;
        // generate all media
        while (i <= media.length - 1) {
          let filename;
          if (media[i].type == "image") {
            filename = await getPostImage(media[i].link);
          } else if (media[i].type == "video") {
            filename = await getPostVideo(media[i].link);
          }
          files.push({ file: filename, type: media[i].type });

          i++;
        }
      } else {
        // Generate Image from title
        const filename = await generatePost(title);
        files.push({ file: filename, type: "image" });
      }
      console.info(`Publishing: ${JSON.stringify(files)}`);
      const caption = `${title}\n\n\n ${tags ? tags : ""}`;
      await publish(files, caption, media.length > 0 ? "media" : "output");
    } catch (err) {
      console.error(err);
    }
  };

  // check new posts every Minute
  setInterval(
    async () => {
      console.info("Checking new Posts...");
      await check();
    },
    process.env.INTERVAL && process.env.INTERVAL > 15000
      ? process.env.INTERVAL
      : 15000
  );
} else {
  console.warn(
    "IG_USERNAME, IG_PASSWORD, PAGE_LINK, NT_SECRET are required to run the script"
  );
}

app.get("/", async (req, res) => {
  res.send(
    isReady === -1
      ? "IG_USERNAME, IG_PASSWORD, PAGE_LINK, NT_SECRET are required to run the script"
      : "The script is running! "
  );
});

app.listen(process.env.PORT || 3001, () => {
  console.info("Server started.");
});
