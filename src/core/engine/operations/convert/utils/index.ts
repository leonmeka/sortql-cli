import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import path from "path";

export async function convertImage(input: string, output: string) {
  await sharp(input).toFile(output);
}

export async function convertAudioOrVideo(input: string, output: string) {
  const format = path.extname(output).slice(1);

  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .output(output)
      .toFormat(format)
      .on("end", () => {
        resolve(output);
      })
      .on("error", (err) => {
        reject(err);
      })
      .run();
  });
}
