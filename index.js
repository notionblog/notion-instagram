const fs = require("fs");
const dir = "./output";
require("dotenv").config({ path: "./.env" });
const generateQuote = require("./src/generateQuote.js");
const publish = require("./src/publish");
const getQuotes = require("./src/getQuotes.js");

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
(async () => {
  try {
    const quotes = await getQuotes();
    for (i = 0; i < quotes.length; i++) {
      const quote = quotes[i];
      const { Quote, Tags, Schedule } = quote.properties;
      if (Quote.title.length) {
        const filename = await generateQuote(Quote.title[0].plain_text);
        const description = `${Quote.title[0].plain_text}\n\n\n ${
          Tags.rich_text.length ? Tags.rich_text[0].plain_text : "#quote"
        }`;
        await publish(filename, description);
      }
    }
  } catch (err) {
    console.log(err);
  }
})();

const checkAndPublish = async () => {};
