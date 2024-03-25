import sharp from "sharp";

import ffmpeg from "fluent-ffmpeg";
import { path } from "@ffmpeg-installer/ffmpeg";
ffmpeg.setFfmpegPath(path);

export async function convertImage(input: string, output: string) {
  await sharp(input).toFile(output);
}

export async function convertAudioOrVideo(input: string, output: string) {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .output(output)
      .on("end", () => {
        resolve(output);
      })
      .on("error", (err) => {
        console.error(`Error: ${err.message}`);
        reject(err);
      })
      .run();
  });
}
