import path from "path";
import { mkdir, writeFile, stat } from "node:fs/promises";

const SAMPLE_IMAGE = "https://via.placeholder.com/150";
const SAMPLE_VIDEO =
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";
const SAMPLE_AUDIO =
  "https://github.com/SergLam/Audio-Sample-files/raw/master/sample.mp3";

export const TEST_DIRECTORY = path.join(
  process.cwd(),
  "./tests/.mock-directory"
);

export const createFile = async (
  directory: string,
  name: string,
  content: string = ""
) => await writeFile(path.join(directory, name), content);

const fetchAsset = async (url: string): Promise<Uint8Array> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }

  return new Uint8Array(await response.arrayBuffer());
};

export const createImage = async (directory: string, name: string) => {
  const image = await fetchAsset(SAMPLE_IMAGE);
  await writeFile(path.join(directory, name), image);
};

export const createVideo = async (directory: string, name: string) => {
  const video = await fetchAsset(SAMPLE_VIDEO);
  await writeFile(path.join(directory, name), video);
};

export const createAudio = async (directory: string, name: string) => {
  const audio = await fetchAsset(SAMPLE_AUDIO);
  await writeFile(path.join(directory, name), audio);
};

export const createFolder = async (directory: string, name: string) =>
  await mkdir(path.join(directory, name), { recursive: true });

export const doesExist = async (directory: string, filePath: string) => {
  return !!(await stat(path.join(directory, filePath)).catch(() => false));
};
