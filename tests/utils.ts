import path from "path";
import { mkdir, writeFile, readFile, stat } from "node:fs/promises";

export const TEST_DIRECTORY = path.join(
  process.cwd(),
  "./tests/.mock-directory"
);
const SAMPLE_PATH = path.join(process.cwd(), "./tests/assets");

const SAMPLE_IMAGE = `${SAMPLE_PATH}/sample.png`;
const SAMPLE_VIDEO = `${SAMPLE_PATH}/sample.mp4`;
const SAMPLE_AUDIO = `${SAMPLE_PATH}/sample.mp3`;

export const createFile = async (
  directory: string,
  name: string,
  content: string = ""
) => await writeFile(path.join(directory, name), content);

const getAsset = async (path: string): Promise<Buffer> => {
  return await readFile(path);
};

export const createImage = async (directory: string, name: string) => {
  const image = await getAsset(SAMPLE_IMAGE);
  await writeFile(path.join(directory, name), image);
};

export const createVideo = async (directory: string, name: string) => {
  const video = await getAsset(SAMPLE_VIDEO);
  await writeFile(path.join(directory, name), video);
};

export const createAudio = async (directory: string, name: string) => {
  const audio = await getAsset(SAMPLE_AUDIO);
  await writeFile(path.join(directory, name), audio);
};

export const createFolder = async (directory: string, name: string) =>
  await mkdir(path.join(directory, name), { recursive: true });

export const doesExist = async (directory: string, filePath: string) => {
  return !!(await stat(path.join(directory, filePath)).catch(() => false));
};
