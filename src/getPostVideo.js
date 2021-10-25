const fs = require("fs");
const fetch = require("node-fetch");
const uuidv4 = require("uuid/v4");
const rootPath = require("../rootPath");
console.log(rootPath);
const ffmpeg = require("fluent-ffmpeg");

module.exports = async (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const filename = uuidv4();
      const tempfile = await _downloadVideo(url);
      new ffmpeg(`${rootPath}/media/${tempfile}`)
        .aspect("9:16")
        .duration(60)
        .toFormat("mp4")
        .on("error", (err) => {
          console.log("Failed processing:", err);
          fs.unlinkSync(`${rootPath}/media/${tempfile}`);
          reject(err);
        })
        .on("progress", (progress) => {
          console.log(`Processing Video: ${progress.targetSize} KB`);
        })
        .on("end", async () => {
          console.log("Proccessing video done");
          fs.unlinkSync(`${rootPath}/media/${tempfile}`);
          await _getScreenshot(filename);
          resolve(filename);
        })
        .save(`${rootPath}/media/${filename}.mp4`);
    } catch (err) {
      console.log(err);
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
        console.log(buffer);
        resolve(tempfile);
      });
    } catch (err) {
      console.log(">>", err);
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
          //further code
        });
    } catch (err) {
      reject(err);
    }
  });
};
