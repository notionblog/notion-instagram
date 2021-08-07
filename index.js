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
    console.log(quotes);
    // const filename = await generateQuote("Hello World!");
    // await publish(
    //   filename,
    //   "Wealth is assets that earn while you sleep.\n\n - Naval Ravikant \n\n\n#quote #quotes #quoteoftheday #motivationalquotes #inspirationalquotes #lifequotes #quotesoflife #motivation #motivational #success #motivationquotes #words #inspiration"
    // );
  } catch (err) {
    console.log(err);
  }
})();
