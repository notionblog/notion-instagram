const fs = require("fs");
const dir = "./output";
var cron = require("cron").CronJob;
require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();

const generateQuote = require("./src/generateQuote.js");
const publish = require("./src/publish");
const getQuotes = require("./src/getQuotes.js");
const updatePostStatus = require("./src/updatePostStatus");

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
const check = async () => {
  try {
    const quotes = await getQuotes();
    for (i = 0; i < quotes.length; i++) {
      const quote = quotes[i];
      const { Quote, Tags, Schedule } = quote.properties;
      if (Quote.title.length) {
        if (Schedule) {
          const date = new Date(Schedule.date.start);
          const job = new cron(
            `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth()} ${date.getDay()}`,
            async () => {
              await publishPost(quote.id, Quote, Tags);
            },
            null,
            true,
            process.env.TIME_ZONE
          );
          job.start();
        } else {
          await publishPost(quote.id, Quote, Tags);
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const publishPost = async (id, Quote, Tags) => {
  const filename = await generateQuote(Quote.title[0].plain_text);
  const description = `${Quote.title[0].plain_text}\n\n\n ${
    Tags.rich_text.length ? Tags.rich_text[0].plain_text : "#quote"
  }`;
  await publish(filename, description);
  await updatePostStatus(id);
};

// check new posts every 20s
setInterval(async () => {
  console.log("Checking new Posts...");
  await check();
}, 10000);

app.get("/", (req, res) => {
  res.send("The script is running!");
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server is running.");
});
