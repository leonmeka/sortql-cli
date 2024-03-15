import { doesExist, createFile, createFolder } from "tests/utils";
import { mkdir, rmdir } from "node:fs/promises";
import path from "path";

import { QueryClient } from "@sortql/core";

const directory = path.join(process.cwd(), "./tests/mock-directory");

describe("File Operations", () => {
  let client: QueryClient;
  let consoleSpy: jest.SpyInstance;

  beforeEach(async () => {
    client = new QueryClient(directory);
    consoleSpy = jest.spyOn(console, "log");

    if (!(await doesExist(directory, ""))) {
      await mkdir(directory, { recursive: true });
    }
  });

  afterEach(async () => {
    consoleSpy.mockRestore();

    if (await doesExist(directory, "")) {
      await rmdir(directory, { recursive: true });
    }
  });

  it("should select a file", async () => {
    // Arrange
    const testFile = "test.txt";
    await createFile(directory, testFile);

    // Act
    await client.run(`SELECT files FROM ''`);

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[SELECT]: 1")
    );
  });

  it("should delete a file", async () => {
    // Arrange
    const testFile = "test.txt";
    await createFile(directory, testFile);

    // Act
    await client.run(`DELETE files FROM ''`);

    // Assert
    expect(await doesExist(directory, testFile)).toBe(false);
  });

  it("should move a file", async () => {
    // Arrange
    const testFile = "test.txt";
    await createFile(directory, testFile);

    // Act
    await client.run(`MOVE files FROM '' TO 'moved'`);

    // Assert
    expect(await doesExist(directory, testFile)).toBe(false);
    expect(await doesExist(directory, "moved/test.txt")).toBe(true);
  });

  it("should copy a file", async () => {
    // Arrange
    const testFile = "test.txt";
    await createFile(directory, testFile);

    // Act
    await client.run(`COPY files FROM '' TO 'copied'`);

    // Assert
    expect(await doesExist(directory, testFile)).toBe(true);
    expect(await doesExist(directory, "copied/test.txt")).toBe(true);
  });

  it("should archive a file", async () => {
    // Arrange
    const testFile = "test.txt";
    await createFile(directory, testFile);

    // Act
    await client.run(`ARCHIVE files FROM '' TO 'archive.zip'`);

    // Assert
    expect(await doesExist(directory, "archive.zip")).toBe(true);
  });

  it("should unarchive a file", async () => {
    // Arrange
    const testFile = "test.txt";
    await createFile(directory, testFile);

    await client.run(`ARCHIVE files FROM '' TO 'archive.zip'`);

    // Act
    await client.run(`UNARCHIVE files FROM '' TO 'unarchived'`);

    // Assert
    expect(await doesExist(directory, "unarchived")).toBe(true);
  });
});

describe("Folder Operations", () => {
  let client: QueryClient;
  let consoleSpy: jest.SpyInstance;

  beforeEach(async () => {
    client = new QueryClient(directory);
    consoleSpy = jest.spyOn(console, "log");

    if (!(await doesExist(directory, ""))) {
      await mkdir(directory, { recursive: true });
    }
  });

  afterEach(async () => {
    consoleSpy.mockRestore();

    if (await doesExist(directory, "")) {
      await rmdir(directory, { recursive: true });
    }
  });

  it("should select a folder", async () => {
    // Arrange
    const testFolder = "test-folder";
    await createFolder(directory, testFolder);
    await createFile(directory, `${testFolder}/test.txt`);

    // Act
    await client.run(`SELECT folders FROM ''`);

    // Assert
    expect(await doesExist(directory, testFolder)).toBe(true);
    expect(await doesExist(directory, `${testFolder}/test.txt`)).toBe(true);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[SELECT]: 1")
    );
  });

  it("should delete a folder", async () => {
    // Arrange
    const testFolder = "test-folder";
    await createFolder(directory, testFolder);
    await createFile(directory, `${testFolder}/test.txt`);

    // Act
    await client.run(`DELETE folders FROM ''`);

    // Assert
    expect(await doesExist(directory, testFolder)).toBe(false);
    expect(await doesExist(directory, `${testFolder}/test.txt`)).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[DELETE]: 1")
    );
  });

  it("should move a folder", async () => {
    // Arrange
    const testFolder = "test-folder";
    await createFolder(directory, testFolder);
    await createFile(directory, `${testFolder}/test.txt`);

    // Act
    await client.run(`MOVE folders FROM '' TO 'moved'`);

    // Assert
    expect(await doesExist(directory, testFolder)).toBe(false);
    expect(await doesExist(directory, "moved/test-folder")).toBe(true);
    expect(await doesExist(directory, "moved/test-folder/test.txt")).toBe(true);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[MOVE]: 1")
    );
  });

  it("should copy a folder", async () => {
    // Arrange
    const testFolder = "test-folder";
    await createFolder(directory, testFolder);
    await createFile(directory, `${testFolder}/test.txt`);

    // Act
    await client.run(`COPY folders FROM '' TO 'copied'`);

    // Assert
    expect(await doesExist(directory, testFolder)).toBe(true);
    expect(await doesExist(directory, "copied/test-folder")).toBe(true);
    expect(await doesExist(directory, "copied/test-folder/test.txt")).toBe(
      true
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[COPY]: 1")
    );
  });

  it("should archive a folder", async () => {
    // Arrange
    const testFolder = "test-folder";
    await createFolder(directory, testFolder);

    // Act
    await client.run(`ARCHIVE folders FROM '' TO 'archive.zip'`);

    // Assert
    expect(await doesExist(directory, "archive.zip")).toBe(true);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[ARCHIVE]: 1")
    );
  });
});
