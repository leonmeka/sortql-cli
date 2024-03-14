import fs from "fs";
import path from "path";
import { QueryClient } from "@sortql/core";

const directory = path.join(process.cwd(), "./tests/mock-directory");

describe("QueryClient", () => {
  beforeEach(async () => {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  });

  afterEach(async () => {
    if (fs.existsSync(directory)) {
      fs.rmdirSync(directory, { recursive: true });
    }
  });

  it("should select a file", async () => {
    // Setup
    fs.writeFileSync(path.join(directory, "test.txt"), "Hello World");

    const content = `SELECT * FROM ''`;
    const client = new QueryClient(directory);

    // Act
    await client.run(content);

    // Assert
    expect(fs.existsSync(path.join(directory, "test.txt"))).toBe(true);
  });

  it("should delete a file", async () => {
    // Setup
    fs.writeFileSync(path.join(directory, "test.txt"), "");

    const content = `DELETE files FROM ''`;
    const client = new QueryClient(directory);

    // Act
    await client.run(content);

    // Assert
    expect(fs.existsSync(path.join(directory, "test.txt"))).toBe(false);
  });

  it("should move a file", async () => {
    // Setup
    fs.writeFileSync(path.join(directory, "test.txt"), "");

    const content = `MOVE files FROM '' TO 'moved'`;
    const client = new QueryClient(directory);

    // Act
    await client.run(content);

    // Assert
    expect(fs.existsSync(path.join(directory, "test.txt"))).toBe(false);
    expect(fs.existsSync(path.join(directory, "moved/test.txt"))).toBe(true);
  });

  it("should copy a file", async () => {
    // Setup
    fs.writeFileSync(path.join(directory, "test.txt"), "");

    const content = `COPY files FROM '' TO 'copied'`;
    const client = new QueryClient(directory);

    // Act
    await client.run(content);

    // Assert
    expect(fs.existsSync(path.join(directory, "test.txt"))).toBe(true);
    expect(fs.existsSync(path.join(directory, "copied/test.txt"))).toBe(true);
  });

  it("should archive a file", async () => {
    // Setup
    fs.writeFileSync(path.join(directory, "test.txt"), "");

    const content = `ARCHIVE files FROM '' TO 'archive.zip'`;
    const client = new QueryClient(directory);

    // Act
    await client.run(content);

    // Assert
    expect(fs.existsSync(path.join(directory, "archive.zip"))).toBe(true);
  });

  it("should unarchive a file", async () => {
    // Setup
    fs.writeFileSync(path.join(directory, "test.txt"), "");

    const content = `
    ARCHIVE files FROM '' TO 'archive.zip';
    UNARCHIVE files FROM '' TO 'unarchived'
    `;
    const client = new QueryClient(directory);

    // Act
    await client.run(content);

    // Assert
    expect(fs.existsSync(path.join(directory, "test.txt"))).toBe(true);
  });
});
