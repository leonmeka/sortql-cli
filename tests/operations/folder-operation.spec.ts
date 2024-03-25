import {
  doesExist,
  createFile,
  createFolder,
  TEST_DIRECTORY,
} from "@tests/utils";
import { mkdir, rmdir } from "node:fs/promises";

import * as jest from "jest-mock";

import { Client } from "@sortql/core";

describe("Folder Operations", () => {
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

  it("should select a folder", async () => {
    // Arrange
    const testFolder = "test-folder";
    await createFolder(TEST_DIRECTORY, testFolder);
    await createFile(TEST_DIRECTORY, `${testFolder}/test.txt`);

    // Act
    await client.run(`SELECT 'folders' FROM ''`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
    expect(await doesExist(TEST_DIRECTORY, testFolder)).toBe(true);
    expect(await doesExist(TEST_DIRECTORY, `${testFolder}/test.txt`)).toBe(
      true
    );
  });

  it("should delete a folder", async () => {
    // Arrange
    const testFolder = "test-folder";
    await createFolder(TEST_DIRECTORY, testFolder);
    await createFile(TEST_DIRECTORY, `${testFolder}/test.txt`);

    // Act
    await client.run(`DELETE 'folders' FROM ''`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[DELETE]: 1"));
    expect(await doesExist(TEST_DIRECTORY, testFolder)).toBe(false);
    expect(await doesExist(TEST_DIRECTORY, `${testFolder}/test.txt`)).toBe(
      false
    );
  });

  it("should move a folder", async () => {
    // Arrange
    const testFolder = "test-folder";
    await createFolder(TEST_DIRECTORY, testFolder);
    await createFile(TEST_DIRECTORY, `${testFolder}/test.txt`);

    // Act
    await client.run(`MOVE 'folders' FROM '' TO 'moved'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[MOVE]: 1"));
    expect(await doesExist(TEST_DIRECTORY, testFolder)).toBe(false);
    expect(await doesExist(TEST_DIRECTORY, "moved/test-folder")).toBe(true);
    expect(await doesExist(TEST_DIRECTORY, "moved/test-folder/test.txt")).toBe(
      true
    );
  });

  it("should copy a folder", async () => {
    // Arrange
    const testFolder = "test-folder";
    await createFolder(TEST_DIRECTORY, testFolder);
    await createFile(TEST_DIRECTORY, `${testFolder}/test.txt`);

    // Act
    await client.run(`COPY 'folders' FROM '' TO 'copied'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[COPY]: 1"));
    expect(await doesExist(TEST_DIRECTORY, testFolder)).toBe(true);
    expect(await doesExist(TEST_DIRECTORY, "copied/test-folder")).toBe(true);
    expect(await doesExist(TEST_DIRECTORY, "copied/test-folder/test.txt")).toBe(
      true
    );
  });

  it("should archive a folder", async () => {
    // Arrange
    const testFolder = "test-folder";
    await createFolder(TEST_DIRECTORY, testFolder);

    // Act
    await client.run(`ARCHIVE 'folders' FROM '' TO 'archive.zip'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[ARCHIVE]: 1"));
    expect(await doesExist(TEST_DIRECTORY, "archive.zip")).toBe(true);
  });
});
