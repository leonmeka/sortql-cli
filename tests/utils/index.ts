import path from "path";
import { mkdir, exists } from "node:fs/promises";

export const createFile = async (
  directory: string,
  name: string,
  content: string = ""
) => await Bun.write(path.join(directory, name), content);

export const createImage = async (directory: string, name: string) => {
  const image = await fetch("https://via.placeholder.com/150");
  const buffer = await image.arrayBuffer();
  const file = new Uint8Array(buffer);

  await Bun.write(path.join(directory, name), file);
};

export const createVideo = async (directory: string, name: string) => {
  const video = await fetch(
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  );
  const buffer = await video.arrayBuffer();
  const file = new Uint8Array(buffer);

  await Bun.write(path.join(directory, name), file);
};

export const createAudio = async (directory: string, name: string) => {
  const audio = await fetch(
    "https://github.com/SergLam/Audio-Sample-files/raw/master/sample.mp3"
  );
  const buffer = await audio.arrayBuffer();
  const file = new Uint8Array(buffer);

  await Bun.write(path.join(directory, name), file);
};

export const createFolder = async (directory: string, name: string) =>
  await mkdir(path.join(directory, name), { recursive: true });

export const doesExist = async (directory: string, filePath: string) =>
  await exists(path.join(directory, filePath));
