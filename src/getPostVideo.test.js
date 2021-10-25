const getPostVideo = require("./getPostVideo");
const notionClient = require("notion-client");
const api = new notionClient.NotionAPI({ authToken: process.env.NT_TOKEN });

const test = async () => {
  const file = await getPostVideo(
    "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/28461ad3-0ef2-4ea2-80cb-beb9f9531e4d/file_example_MP4_480_1_5MG.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20211025%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211025T020822Z&X-Amz-Expires=3600&X-Amz-Signature=2f14964b52ff90aced61a501b03a533ff6f196aa25beeb20520e5754ffd41023&X-Amz-SignedHeaders=host"
  );
  console.log(file);
};
test();
