const fetch = require("node-fetch");

module.exports = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const posts = await (
        await fetch(
          `https://api.notion.com/v1/databases/${process.env.NT_DB}/query`,
          {
            method: "POST",
            body: JSON.stringify({
              filter: {
                property: "Publish",
                checkbox: {
                  equals: false,
                },
              },
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NT_SECRET}`,
            },
          }
        )
      ).json();
      resolve(posts["results"] ? posts["results"] : []);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
