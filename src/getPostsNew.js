const fetch = require("node-fetch");

const _getDbId = (pagelink) => {
  return pagelink.split("/")[3].split("?")[0];
};
const _filters = {
  filter: {
    and: [
      {
        property: "Publish",
        checkbox: {
          equals: true,
        },
      },
      {
        property: "IsPublished",
        checkbox: {
          equals: false,
        },
      },
    ],
  },
};

const _getTags = (tags) => {
  let tagsList = "";
  tags.multi_select.forEach((tag) => {
    tagsList += `${tag.name} `;
  });
  return tagsList;
};

const _getDate = (date) => {
  const split = date.split("+");

  return {
    date: split[0],
    offset: split[1] ? `+${split[1]}` : "+00:00",
  };
};

const _getMedia = (files) => {
  return files
    .map((media) => {
      const mimetype = media.name.slice(-3);
      console.log(mimetype);
      if (["png", "jpg", "jpeg"].includes(mimetype))
        return { type: "image", link: media.file.url };
      else if (["mp4", "mov", "avi", "m4v"].includes(mimetype))
        return { type: "video", link: media.file.url };
    })
    .filter((media) => media != null);
};

module.exports = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await fetch(
        `https://api.notion.com/v1/databases/${_getDbId(
          process.env.PAGE_LINK
        )}/query`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Notion-Version": "2021-05-13",
            Authorization: `Bearer ${process.env.NT_SECRET}`,
          },
          body: JSON.stringify(_filters),
        }
      );
      console.log(data);
      const results = (await data.json()).results;
      console.log(results);
      let posts = [];
      results.forEach((page) => {
        const { Title, Tags, Schedule, IsScheduled, Media } = page.properties;

        posts.push({
          id: page.id,
          title: Title && Title.title[0] ? Title.title[0].plain_text : null,
          tags: Tags && Tags.multi_select ? _getTags(Tags) : null,
          schedule: Schedule ? _getDate(Schedule.date.start) : null,
          isScheduled: IsScheduled ? IsScheduled.checkbox : false,
          media: Media ? _getMedia(Media.files) : [],
        });
      });
      resolve(posts);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
