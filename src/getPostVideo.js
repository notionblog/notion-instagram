const fs = require("fs");
const fetch = require("node-fetch");
const uuidv4 = require("uuid/v4");

const ffmpeg = require("fluent-ffmpeg");

module.exports = async (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const filename = uuidv4();
      const tempfile = await _downloadVideo(url);
      new ffmpeg(`../media/${tempfile}`)
        .aspect("9:16")
        .duration(60)
        .toFormat("mp4")
        .on("error", (err) => {
          console.log("Failed processing");
          fs.unlinkSync(`../media/${tempfile}`);
          reject(err);
        })
        .on("progress", (progress) => {
          console.log(`Processing Video: ${progress.targetSize} KB`);
        })
        .on("end", () => {
          console.log("Proccessing video done");
          fs.unlinkSync(`../media/${tempfile}`);
          resolve(filename);
        })
        .save(`../media/${filename}.mp4`);
    } catch (err) {
      console.log(err);
      reject("error");
    }
  });
};

const _downloadVideo = async (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const tempfile = uuidv4();
      const res = await fetch(url);
      const buffer = await res.buffer();
      fs.writeFile(`../media/${tempfile}`, buffer, () => {
        resolve(tempfile);
      });
    } catch (err) {
      reject(err);
    }
  });
};
