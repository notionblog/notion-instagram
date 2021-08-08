const fs = require("fs");
const outputDir = "./output";
const imagesDir = "./images";
var cron = require("cron").CronJob;
require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();

const generatePost = require("./src/generatePost.js");
const publish = require("./src/publish");
const getPosts = require("./src/getPosts.js");
const updatePostStatus = require("./src/updatePostStatus");
const getPostImage = require("./src/getPostImage");

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
          const date = new Date(
            `${schedule.start_date}T${schedule.start_time}`
          );
          const job = new cron(
            `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth()} ${date.getDay()}`,
            async () => {
              try {
                // await publishPost(id, title, tags,image);
              } catch (err) {
                console.log(err);
              }
            },
            null,
            true,
            schedule.time_zone
          );
          job.start();
          await updatePostStatus(id, "isScheduled");
        } else {
          await publishPost(id, title, tags, image);
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const publishPost = async (id, title, tags, image) => {
  let filename;
  if (image) {
    filename = await getPostImage(image);
  } else {
    filename = await generatePost(title);
  }
  const description = `${title}\n\n\n ${tags ? tags : ""}`;
  await publish(filename, description, image ? "images" : "output");
  await updatePostStatus(id, "isPublished");
};

// check new posts every Minute
setInterval(async () => {
  console.log("Checking new Posts...");
  await check();
}, process.env.INTERVAL || 10000);

app.get("/", async (req, res) => {
  const posts = await getPosts();
  // res.json(posts);
  res.send("The script is running!");
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server is running.");
});
