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
      const { id, title, tags, schedule, isScheduled, image } = posts[i];
      if (title) {
        if (schedule && (isScheduled === undefined || isScheduled === false)) {
          await updatePostStatus(id, "isScheduled");
          console.log(`${title} - Scheduled`);
          const date = new Date(
            `${schedule.start_date}T${schedule.start_time}`
          );
          new cron(
            `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth()} ${date.getDay()}`,
            () => {
              try {
                publishPost(id, title, tags, image);
              } catch (err) {
                console.log(err);
              }
            },
            null,
            true,
            schedule.time_zone
          );
        } else if (schedule) {
          await publishPost(id, title, tags, image);
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const publishPost = async (id, title, tags, image) => {
  console.log(`publishing the post -  ${title}`);
  try {
    let filename;
    if (image) {
      filename = await getPostImage(image);
    } else {
      filename = await generatePost(title);
    }
    const description = `${title}\n\n\n ${tags ? tags : ""}`;
    await publish(filename, description, image ? "images" : "output");
    await updatePostStatus(id, "isPublished");
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

app.get("/", async (req, res) => {
  // const posts = await getPosts();
  // res.json(posts);
  res.send("The script is running!");
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server is running.");
});
