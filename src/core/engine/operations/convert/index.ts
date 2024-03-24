import path from "path";
import chalk from "chalk";

import { Operation } from "@sortql/core/engine/operations";
import { ConvertStatement, Statement } from "@sortql/core/parser/types";
import {
  convertAudioOrVideo,
  convertImage,
} from "@sortql/core/engine/operations/convert/utils";

const IMAGE_FORMATS = ["jpg", "jpeg", "png", "webp", "tiff", "gif"];
const AUDIO_FORMATS = ["mp3", "wav", "flac", "ogg", "aac", "wma"];
const VIDEO_FORMATS = [
  "mp4",
  "webm",
  "mkv",
  "avi",
  "flv",
  "mov",
  "mpeg",
  "wmv",
];
const ALLOWED_FORMATS = [...IMAGE_FORMATS, ...AUDIO_FORMATS, ...VIDEO_FORMATS];

export interface ConversionEngine {
  convert(input: string, output: string): Promise<void>;
}

export class ConvertOperation extends Operation {
  constructor(directory: string, public statement: Statement) {
    super(directory);
    this.validate();
  }

  validate() {
    const { target, from, to } = this.statement as ConvertStatement;

    if (target.value !== "files") {
      throw new SyntaxError(
        `↳ [CONVERT] Invalid target: '${target.value}. Must be 'files'`
      );
    }

    if (from.value === to.value) {
      throw new SyntaxError("↳ [CONVERT] Cannot convert to the same format");
    }

    if (!ALLOWED_FORMATS.includes(to.value.toLocaleLowerCase())) {
      throw new SyntaxError(`↳ [CONVERT] Invalid format: '${to.value}'`);
    }
  }

  async execute() {
    const { to } = this.statement as ConvertStatement;

    const results = await this.filter.apply(this.statement);

    console.log(
      chalk.yellowBright(`↳ [CONVERT]: ${results.length} to ${to.value}`)
    );

    if (results.length === 0) {
      return;
    }

    const promises = results.map(async (filePath) => {
      const filename = path.basename(filePath);
      const folder = path.dirname(filePath);

      const input = path.join(folder, filename);
      const output = path.join(folder, `${filename.split(".")[0]}.${to.value}`);

      const outputFormat = to.value.toLocaleLowerCase();

      if (IMAGE_FORMATS.includes(outputFormat)) {
        return await convertImage(input, output);
      }

      if (
        AUDIO_FORMATS.includes(outputFormat) ||
        VIDEO_FORMATS.includes(outputFormat)
      ) {
        return await convertAudioOrVideo(input, output);
      }
    });

    await Promise.all(promises);
  }
}
