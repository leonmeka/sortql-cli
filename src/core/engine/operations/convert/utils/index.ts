import sharp from "sharp";
import path from "path";

export async function convertImage(input: string, output: string) {
  await sharp(input).toFile(output);
}

import { exec } from "child_process";

export async function convertAudioOrVideo(input: string, output: string) {
  const format = path.extname(output).slice(1);

  return new Promise((resolve, reject) => {
    const command = `ffmpeg -i "${input}" -y -f ${format} "${output}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      resolve(output);
    });
  });
}
