const fs = require("fs");
const fetch = require("node-fetch");
const uuidv4 = require("uuid/v4");
const rootPath = require("../rootPath");
const ffmpeg = require("fluent-ffmpeg");

module.exports = async (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const filename = uuidv4();
      console.info(`Downloading Video ${url}`);
      const tempfile = await _downloadVideo(url);
      console.info(`-- Started Video processing  --`);
      /*
        Instagram Videos must 1080x1080 size and max 60s in duration
      */
      new ffmpeg(`${rootPath}/media/${tempfile}`)
        .aspect("9:16")
        .duration(60)
        .toFormat("mp4")
        .on("error", (err) => {
          console.error("Failed processing:", err);
          fs.unlinkSync(`${rootPath}/media/${tempfile}`);
          reject(err);
        })
        .on("progress", (progress) => {
          console.info(`   Processing Video: ${progress.targetSize} KB`);
        })
        .on("end", async () => {
          console.info("Proccessing video done");
          fs.unlinkSync(`${rootPath}/media/${tempfile}`);
          await _getScreenshot(filename);
          resolve(filename);
        })
        .save(`${rootPath}/media/${filename}.mp4`);
    } catch (err) {
      console.error(err);
      reject("error");
    }
  });
};

const _downloadVideo = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const tempfile = uuidv4();
      const res = await fetch(url);
      const buffer = await res.buffer();
      fs.writeFile(`${rootPath}/media/${tempfile}`, buffer, () => {
        resolve(tempfile);
      });
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const _getScreenshot = (filename) => {
  return new Promise(async (resolve, reject) => {
    const ffmpeg = require("fluent-ffmpeg");
    try {
      await ffmpeg(`${rootPath}/media/${filename}.mp4`)
        .screenshots({
          count: 1,
          filename: `${filename}.jpg`,
          folder: `${rootPath}/media/`,
          size: "1080x1080",
        })
        .on("end", async function () {
          resolve(filename);
        });
    } catch (err) {
      reject(err);
    }
  });
};
