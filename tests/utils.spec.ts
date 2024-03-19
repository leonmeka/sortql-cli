import path from "path";
import { mkdir, exists } from "node:fs/promises";

export const createFile = async (
  directory: string,
  name: string,
  content: string = ""
) => await Bun.write(path.join(directory, name), content);

export const createFolder = async (directory: string, name: string) =>
  await mkdir(path.join(directory, name), { recursive: true });

export const doesExist = async (directory: string, filePath: string) =>
  await exists(path.join(directory, filePath));
