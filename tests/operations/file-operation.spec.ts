import {
  doesExist,
  createFile,
  createImage,
  createAudio,
  createVideo,
  TEST_DIRECTORY,
} from "@tests/utils";

import jest from "jest-mock";
import { mkdir, rmdir } from "node:fs/promises";

import { Client } from "@sortql/core";

describe("File Operations", () => {
  let client: Client;
  let spy: jest.SpyInstance;

  beforeEach(async () => {
    client = new Client(TEST_DIRECTORY);
    spy = jest.spyOn(console, "log");

    if (!(await doesExist(TEST_DIRECTORY, ""))) {
      await mkdir(TEST_DIRECTORY, { recursive: true });
    }
  });

  afterEach(async () => {
    spy.mockRestore();

    if (await doesExist(TEST_DIRECTORY, "")) {
      await rmdir(TEST_DIRECTORY, { recursive: true });
    }
  });

  it("should select a file", async () => {
    // Arrange
    const testFile = "test.txt";
    await createFile(TEST_DIRECTORY, testFile);

    // Act
    await client.run(`SELECT 'files' FROM ''`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
    expect(await doesExist(TEST_DIRECTORY, testFile)).toBe(true);
  });

  it("should delete a file", async () => {
    // Arrange
    const testFile = "test.txt";
    await createFile(TEST_DIRECTORY, testFile);

    // Act
    await client.run(`DELETE 'files' FROM ''`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[DELETE]: 1"));
    expect(await doesExist(TEST_DIRECTORY, testFile)).toBe(false);
  });

  it("should move a file", async () => {
    // Arrange
    const testFile = "test.txt";
    await createFile(TEST_DIRECTORY, testFile);

    // Act
    await client.run(`MOVE 'files' FROM '' TO 'moved'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[MOVE]: 1"));
    expect(await doesExist(TEST_DIRECTORY, testFile)).toBe(false);
    expect(await doesExist(TEST_DIRECTORY, "moved/test.txt")).toBe(true);
  });

  it("should copy a file", async () => {
    // Arrange
    const testFile = "test.txt";
    await createFile(TEST_DIRECTORY, testFile);

    // Act
    await client.run(`COPY 'files' FROM '' TO 'copied'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[COPY]: 1"));
    expect(await doesExist(TEST_DIRECTORY, testFile)).toBe(true);
    expect(await doesExist(TEST_DIRECTORY, "copied/test.txt")).toBe(true);
  });

  it("should archive a file", async () => {
    // Arrange
    const testFile = "test.txt";
    await createFile(TEST_DIRECTORY, testFile);

    // Act
    await client.run(`ARCHIVE 'files' FROM '' TO 'archive.zip'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[ARCHIVE]: 1"));
    expect(await doesExist(TEST_DIRECTORY, "archive.zip")).toBe(true);
  });

  it("should unarchive a file", async () => {
    // Arrange
    const testFile = "test.txt";
    await createFile(TEST_DIRECTORY, testFile);

    await client.run(`ARCHIVE 'files' FROM '' TO 'archive.zip'`);

    // Act
    await client.run(`UNARCHIVE 'files' FROM '' TO 'unarchived'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[UNARCHIVE]: 1"));
    expect(await doesExist(TEST_DIRECTORY, "unarchived")).toBe(true);
  });

  it("should convert an image file", async () => {
    // Arrange
    await createImage(TEST_DIRECTORY, "test.png");

    // Act
    await client.run(
      `CONVERT 'files' FROM '' WHERE 'extension' = 'png' TO 'jpg'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[CONVERT]: 1"));
    expect(await doesExist(TEST_DIRECTORY, "test.png")).toBe(true);
    expect(await doesExist(TEST_DIRECTORY, "test.jpg")).toBe(true);
  }, 20000);

  it("should convert an audio file", async () => {
    // Arrange
    await createAudio(TEST_DIRECTORY, "test.mp3");

    // Act
    await client.run(
      `CONVERT 'files' FROM '' WHERE 'extension' = 'mp3' TO 'wav'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[CONVERT]: 1"));
    expect(await doesExist(TEST_DIRECTORY, "test.mp3")).toBe(true);
    expect(await doesExist(TEST_DIRECTORY, "test.wav")).toBe(true);
  }, 20000);

  it("should convert a video file", async () => {
    // Arrange
    await createVideo(TEST_DIRECTORY, "test.mp4");

    // Act
    await client.run(
      `CONVERT 'files' FROM '' WHERE 'extension' = 'mp4' TO 'mov'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[CONVERT]: 1"));
    expect(await doesExist(TEST_DIRECTORY, "test.mp4")).toBe(true);
    expect(await doesExist(TEST_DIRECTORY, "test.mov")).toBe(true);
  }, 20000);
});
