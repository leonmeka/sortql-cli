import fs from "fs";
import path from "path";
import { QueryClient } from "@sortql/core";

const directory = path.join(process.cwd(), "./tests/mock-directory");
let client: QueryClient;

const createTestFile = (fileName: string, content = "") => {
  fs.writeFileSync(path.join(directory, fileName), content);
};

const fileExists = (filePath: string) =>
  fs.existsSync(path.join(directory, filePath));

describe("File Operations", () => {
  beforeEach(() => {
    client = new QueryClient(directory);

    if (!fileExists("")) {
      fs.mkdirSync(directory, { recursive: true });
    }
  });

  afterEach(() => {
    if (fileExists("")) {
      fs.rmdirSync(directory, { recursive: true });
    }
  });

  it("should select a file", async () => {
    // Arrange
    const testFileName = "test.txt";
    createTestFile(testFileName);

    // Act
    await client.run(`SELECT * FROM ''`);

    // Assert
    expect(fileExists(testFileName)).toBe(true);
  });

  it("should delete a file", async () => {
    // Arrange
    const testFileName = "test.txt";
    createTestFile(testFileName);

    // Act
    await client.run(`DELETE files FROM ''`);

    // Assert
    expect(fileExists(testFileName)).toBe(false);
  });

  it("should move a file", async () => {
    // Arrange
    const testFileName = "test.txt";
    createTestFile(testFileName);

    // Act
    await client.run(`MOVE files FROM '' TO 'moved'`);

    // Assert
    expect(fileExists(testFileName)).toBe(false);
    expect(fileExists("moved/test.txt")).toBe(true);
  });

  it("should copy a file", async () => {
    // Arrange
    const testFileName = "test.txt";
    createTestFile(testFileName);

    // Act
    await client.run(`COPY files FROM '' TO 'copied'`);

    // Assert
    expect(fileExists(testFileName)).toBe(true);
    expect(fileExists("copied/test.txt")).toBe(true);
  });

  it("should archive a file", async () => {
    // Arrange
    const testFileName = "test.txt";
    createTestFile(testFileName);

    // Act
    await client.run(`ARCHIVE files FROM '' TO 'archive.zip'`);

    // Assert
    expect(fileExists("archive.zip")).toBe(true);
  });

  it("should unarchive a file", async () => {
    // Arrange
    const testFileName = "test.txt";
    createTestFile(testFileName);

    await client.run(`ARCHIVE files FROM '' TO 'archive.zip'`);

    // Act
    await client.run(`UNARCHIVE files FROM '' TO 'unarchived'`);

    // Assert
    expect(fileExists("unarchived")).toBe(true);
  });
});
