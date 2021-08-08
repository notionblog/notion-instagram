const fs = require("fs");
const dir = "./output";
var cron = require("cron").CronJob;
require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();

const generatePost = require("./src/generatePost.js");
const publish = require("./src/publish");
const getPosts = require("./src/getPosts.js");
const updatePostStatus = require("./src/updatePostStatus");

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
const check = async () => {
  try {
    const posts = await getPosts();
    console.log(posts);
    for (i = 0; i < posts.length; i++) {
      const { id, title, tags, schedule, image } = posts[i];
      if (title) {
        if (schedule) {
          const date = new Date(
            `${schedule.start_date}T${schedule.start_time}`
          );
          const job = new cron(
            `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth()} ${date.getDay()}`,
            async () => {
              await publishPost(id, title, tags);
            },
            null,
            true,
            schedule.time_zone
          );
          job.start();
        } else {
          await publishPost(id, title, tags);
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const publishPost = async (id, title, tags) => {
  const filename = await generatePost(title);
  const description = `${title}\n\n\n ${tags.length ? tags : ""}`;
  await publish(filename, description);
  await updatePostStatus(id);
};

// check new posts every Minute
setInterval(async () => {
  console.log("Checking new Posts...");
  await check();
}, process.env.INTERVAL || 10000);

app.get("/", async (req, res) => {
  const posts = await getPosts();
  res.json(posts);
  // res.send("The script is running!");
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server is running.");
});
