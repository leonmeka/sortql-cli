import { doesExist, createFile, createFolder } from "tests/utils";
import { mkdir, rmdir } from "node:fs/promises";
import path from "path";

import {
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
  spyOn,
  Mock,
} from "bun:test";

import { QueryClient } from "@sortql/core";

const directory = path.join(process.cwd(), "./tests/mock-directory");

describe("File Filters", () => {
  let client: QueryClient;
  let spy: Mock<any>;

  beforeEach(async () => {
    client = new QueryClient(directory);
    spy = spyOn(console, "log");

    if (!(await doesExist(directory, ""))) {
      await mkdir(directory, { recursive: true });
    }
  });

  afterEach(async () => {
    spy.mockRestore();

    if (await doesExist(directory, "")) {
      await rmdir(directory, { recursive: true });
    }
  });

  it("should only select files with names that contain 'test'", async () => {
    // Arrange
    await createFile(directory, "test.txt");
    await createFile(directory, "hello.txt");

    // Act
    await client.run(`SELECT files FROM '' WHERE name = 'test'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select .txt files", async () => {
    // Arrange
    await createFile(directory, "test.txt");
    await createFile(directory, "test.json");
    await createFile(directory, "test.csv");

    // Act
    await client.run(`SELECT files FROM '' WHERE extension = 'txt'`);

    // Assert

    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files which match a given regex", async () => {
    // Arrange
    await createFile(directory, "test.txt");
    await createFile(directory, "test.json");
    await createFile(directory, "test.csv");

    // Act
    await client.run(`SELECT files FROM '' WHERE extension = '(txt|json|csv)'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 3"));
  });

  it("should only select files with a size greater than 1000", async () => {
    // Arrange
    await createFile(directory, "test.txt", "a".repeat(1000));
    await createFile(directory, "test.json", "a".repeat(1001));

    // Act
    await client.run(`SELECT files FROM '' WHERE size > 1000`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files with a size less than 1000", async () => {
    // Arrange
    await createFile(directory, "test.txt", "a".repeat(1000));
    await createFile(directory, "test.json", "a".repeat(999));

    // Act
    await client.run(`SELECT files FROM '' WHERE size < 1000`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files with a size equal to 1000", async () => {
    // Arrange
    await createFile(directory, "test.txt", "a".repeat(1000));
    await createFile(directory, "test.json", "a".repeat(999));

    // Act
    await client.run(`SELECT files FROM '' WHERE size = 1000`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files with a size not equal to 1000", async () => {
    // Arrange
    await createFile(directory, "test.txt", "a".repeat(1000));
    await createFile(directory, "test.json", "a".repeat(999));

    // Act
    await client.run(`SELECT files FROM '' WHERE size != 1000`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files with a size greater than 1000 and less than 1002", async () => {
    // Arrange
    await createFile(directory, "test.txt", "a".repeat(1000));
    await createFile(directory, "test.json", "a".repeat(1001));
    await createFile(directory, "test.csv", "a".repeat(1002));

    // Act
    await client.run(`SELECT files FROM '' WHERE size > 1000 AND size < 1002`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files with a size greater than 1000 or less than 1001", async () => {
    // Arrange
    await createFile(directory, "test.txt", "a".repeat(1000));
    await createFile(directory, "test.json", "a".repeat(1001));

    // Act
    await client.run(`SELECT files FROM '' WHERE size > 1000 OR size < 1001`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select files with a size greater than 1000 and with a name that contains 'hello'", async () => {
    // Arrange
    await createFile(directory, "test.txt", "a".repeat(1000));
    await createFile(directory, "hello.txt", "a".repeat(1001));
    await createFile(directory, "test.json", "a".repeat(1002));

    // Act
    await client.run(
      `SELECT files FROM '' WHERE size > 1000 AND name = 'hello'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files created after 01/01/2024", async () => {
    // Arrange
    await createFile(directory, "test.txt");
    await createFile(directory, "hello.txt");

    // Act
    await client.run(`SELECT files FROM '' WHERE created > '01/01/2024'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select files modified after 01/01/2024", async () => {
    // Arrange
    await createFile(directory, "test.txt");
    await createFile(directory, "hello.txt");

    // Act
    await client.run(`SELECT files FROM '' WHERE modified > '01/01/2024'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select files accessed after 01/01/2024", async () => {
    // Arrange
    await createFile(directory, "test.txt");
    await createFile(directory, "hello.txt");

    // Act
    await client.run(`SELECT files FROM '' WHERE accessed > '01/01/2024'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });
});

describe("Folder Filters", () => {
  let client: QueryClient;
  let spy: Mock<any>;

  beforeEach(async () => {
    client = new QueryClient(directory);
    spy = spyOn(console, "log");

    if (!(await doesExist(directory, ""))) {
      await mkdir(directory, { recursive: true });
    }
  });

  afterEach(async () => {
    spy.mockRestore();

    if (await doesExist(directory, "")) {
      await rmdir(directory, { recursive: true });
    }
  });

  it("should only select folders with names that contain 'test'", async () => {
    // Arrange
    await createFolder(directory, "test");
    await createFolder(directory, "hello");

    // Act
    await client.run(`SELECT folders FROM '' WHERE name = 'test'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select folders which match a given regex", async () => {
    // Arrange
    await createFolder(directory, "test-1");
    await createFolder(directory, "test-2");
    await createFolder(directory, "test-99");
    await createFolder(directory, "hello");

    // Act
    await client.run(`SELECT folders FROM '' WHERE name = 'test-[0-9]'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 3"));
  });
});
