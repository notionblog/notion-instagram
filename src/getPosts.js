const fetch = require("node-fetch");
const notionClient = require("notion-client");
const api = new notionClient.NotionAPI();
const notionUtils = require("notion-utils");

const _imgLink = (src, id) => {
  return `https://www.notion.so/image/${encodeURIComponent(
    src
  )}?table=block&id=${id}&cache=v2`;
};

module.exports = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const blocks = (await api.getPage(process.env.NT_DB)).block;
      const postsIds = Object.keys(blocks).filter((id) => {
        const block = blocks[id];

        if (
          block.value &&
          block.value.type === "page" &&
          block.value.properties &&
          !(
            block.value.properties["@@`t"] &&
            block.value.properties["@@`t"][0][0] === "Yes"
          ) &&
          block.value.properties["_Tle"] &&
          block.value.properties["_Tle"][0][0] === "Yes"
        ) {
          return true;
        }
      });
      let posts = [];
      postsIds.forEach((id) => {
        const properties = blocks[id].value.properties;
        posts.push({
          id: id,
          title: properties["title"] ? properties["title"][0][0] : null,
          tags: properties["^w`s"] ? properties["^w`s"][0][0] : null,
          schedule:
            properties["g@eh"] && properties["g@eh"][0][1]
              ? properties["g@eh"][0][1][0][1]
              : null,
          isScheduled: properties["d{}M"] && properties["d{}M"][0][0] === "Yes",
          image: properties["YXUk"]
            ? _imgLink(properties["YXUk"][0][1][0][1], id)
            : null,
        });
      });

      resolve(posts);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
