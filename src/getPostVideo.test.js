const getPostVideo = require("./getPostVideo");
const notionClient = require("notion-client");
const api = new notionClient.NotionAPI({ authToken: process.env.NT_TOKEN });

const test = async () => {
  const file = await getPostVideo("0ed65b9b-33e1-4ec0-9540-43de62e1fc53");
  console.log(file);
};
test();
