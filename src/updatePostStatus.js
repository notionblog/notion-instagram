const fetch = require("node-fetch");

module.exports = (pageId, property) => {
  return new Promise(async (resolve, reject) => {
    try {
      let properties = {};
      properties[property] = { checkbox: true };

      await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
        method: "PATCH",
        body: JSON.stringify({
          properties: properties,
        }),
        headers: {
          "Content-Type": "application/json",
          "Notion-Version": "2021-05-13",
          Authorization: `Bearer ${process.env.NT_SECRET}`,
        },
      });

      resolve("Post Updated");
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};
