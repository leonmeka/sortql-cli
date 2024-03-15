import fs from "fs";
import path from "path";
import { QueryClient } from "@sortql/core";

const directory = path.join(process.cwd(), "./tests/mock-directory");
let client: QueryClient;

const createFile = (name: string, content = "") => {
  fs.writeFileSync(path.join(directory, name), content);
};

const createFolder = (name: string) => {
  fs.mkdirSync(path.join(directory, name), { recursive: true });
};

const exists = (filePath: string) =>
  fs.existsSync(path.join(directory, filePath));

describe("File Operations", () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    client = new QueryClient(directory);

    if (!exists("")) {
      fs.mkdirSync(directory, { recursive: true });
    }

    consoleSpy = jest.spyOn(console, "log");
  });

  afterEach(() => {
    if (exists("")) {
      fs.rmdirSync(directory, { recursive: true });
    }

    consoleSpy.mockRestore();
  });

  it("should select a file", async () => {
    // Arrange
    const testFile = "test.txt";
    createFile(testFile);

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
    createFile(testFile);

    // Act
    await client.run(`DELETE files FROM ''`);

    // Assert
    expect(exists(testFile)).toBe(false);
  });

  it("should move a file", async () => {
    // Arrange
    const testFile = "test.txt";
    createFile(testFile);

    // Act
    await client.run(`MOVE files FROM '' TO 'moved'`);

    // Assert
    expect(exists(testFile)).toBe(false);
    expect(exists("moved/test.txt")).toBe(true);
  });

  it("should copy a file", async () => {
    // Arrange
    const testFile = "test.txt";
    createFile(testFile);

    // Act
    await client.run(`COPY files FROM '' TO 'copied'`);

    // Assert
    expect(exists(testFile)).toBe(true);
    expect(exists("copied/test.txt")).toBe(true);
  });

  it("should archive a file", async () => {
    // Arrange
    const testFile = "test.txt";
    createFile(testFile);

    // Act
    await client.run(`ARCHIVE files FROM '' TO 'archive.zip'`);

    // Assert
    expect(exists("archive.zip")).toBe(true);
  });

  it("should unarchive a file", async () => {
    // Arrange
    const testFile = "test.txt";
    createFile(testFile);

    await client.run(`ARCHIVE files FROM '' TO 'archive.zip'`);

    // Act
    await client.run(`UNARCHIVE files FROM '' TO 'unarchived'`);

    // Assert
    expect(exists("unarchived")).toBe(true);
  });
});

describe("Folder Operations", () => {
  beforeEach(() => {
    client = new QueryClient(directory);

    if (!exists("")) {
      fs.mkdirSync(directory, { recursive: true });
    }
  });

  afterEach(() => {
    if (exists("")) {
      fs.rmdirSync(directory, { recursive: true });
    }
  });

  it("should select a folder", async () => {
    // Arrange
    const testFolder = "test-folder";
    createFolder(testFolder);
    createFile(`${testFolder}/test.txt`);

    // Act
    await client.run(`SELECT folders FROM ''`);

    // Assert
    expect(exists(testFolder)).toBe(true);
    expect(exists(`${testFolder}/test.txt`)).toBe(true);
  });

  it("should delete a folder", async () => {
    // Arrange
    const testFolder = "test-folder";
    createFolder(testFolder);
    createFile(`${testFolder}/test.txt`);

    // Act
    await client.run(`DELETE folders FROM ''`);

    // Assert
    expect(exists(testFolder)).toBe(false);
    expect(exists(`${testFolder}/test.txt`)).toBe(false);
  });

  it("should move a folder", async () => {
    // Arrange
    const testFolder = "test-folder";
    createFolder(testFolder);
    createFile(`${testFolder}/test.txt`);

    // Act
    await client.run(`MOVE folders FROM '' TO 'moved'`);

    // Assert
    expect(exists(testFolder)).toBe(false);
    expect(exists("moved/test-folder")).toBe(true);
    expect(exists("moved/test-folder/test.txt")).toBe(true);
  });

  it("should copy a folder", async () => {
    // Arrange
    const testFolder = "test-folder";
    createFolder(testFolder);
    createFile(`${testFolder}/test.txt`);

    // Act
    await client.run(`COPY folders FROM '' TO 'copied'`);

    // Assert
    expect(exists(testFolder)).toBe(true);
    expect(exists("copied/test-folder")).toBe(true);
    expect(exists("copied/test-folder/test.txt")).toBe(true);
  });

  it("should archive a folder", async () => {
    // Arrange
    const testFolder = "test-folder";
    createFolder(testFolder);

    // Act
    await client.run(`ARCHIVE folders FROM '' TO 'archive.zip'`);

    // Assert
    expect(exists("archive.zip")).toBe(true);
  });
});
