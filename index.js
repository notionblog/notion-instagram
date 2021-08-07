const generateQuote = require("./src/generateQuote.js");
const fs = require("fs");
const dir = "./output";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

try {
  generateQuote(
    "You have one life. You’re dead for tens of billions of years, and you’re going to be dead for tens of billions of years."
  );
} catch (err) {}
