import { doesExist, createFile, TEST_DIRECTORY } from "../utils";
import { mkdir, rmdir } from "node:fs/promises";

import jest from "jest-mock";

import { Client } from "@sortql/core";

describe("File Filters (non-compound)", () => {
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

  it("should only select files with names that contain 'test'", async () => {
    // Arrange
    await createFile(TEST_DIRECTORY, "test.txt");
    await createFile(TEST_DIRECTORY, "hello.txt");

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'name' LIKE 'test'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files with extensions that contain 'txt'", async () => {
    // Arrange
    await createFile(TEST_DIRECTORY, "test.txt");
    await createFile(TEST_DIRECTORY, "hello.js");

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'extension' = 'txt'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files with sizes that are greater than 100", async () => {
    // Arrange
    await createFile(TEST_DIRECTORY, "test.txt", `${"_".repeat(200)}`);
    await createFile(TEST_DIRECTORY, "hello.txt", `${"_".repeat(50)}`);

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'size' > '100'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files with content 'hello'", async () => {
    // Arrange
    await createFile(TEST_DIRECTORY, "test.txt", "find-me");
    await createFile(TEST_DIRECTORY, "test2.txt", "world");

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'content' = 'find-me'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files with created dates that are greater than 01.01.2021", async () => {
    // Arrange
    await createFile(TEST_DIRECTORY, "test.txt");
    await createFile(TEST_DIRECTORY, "hello.txt");

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'created' > '01.01.2021'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select files with modified dates that are greater than 01.01.2021", async () => {
    // Arrange
    await createFile(TEST_DIRECTORY, "test.txt");
    await createFile(TEST_DIRECTORY, "hello.txt");

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'modified' > '01.01.2021'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select files with accessed dates that are greater than 01.01.2021", async () => {
    // Arrange
    await createFile(TEST_DIRECTORY, "test.txt");
    await createFile(TEST_DIRECTORY, "hello.txt");

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'accessed' > '01.01.2021'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });
});

describe("File Filters (compound)", () => {
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

  it("should only select files with compound 'AND' operator", async () => {
    // Arrange
    await createFile(TEST_DIRECTORY, "test.txt");
    await createFile(TEST_DIRECTORY, "hello.txt");
    await createFile(TEST_DIRECTORY, "test.js");

    // Act
    await client.run(
      `SELECT 'files' FROM '' WHERE 'name' LIKE 'test' AND 'extension' = 'txt'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files with multiple compound 'AND' operators", async () => {
    await createFile(TEST_DIRECTORY, "test.txt", `${"_".repeat(200)}`);
    await createFile(TEST_DIRECTORY, "hello.txt", `${"_".repeat(50)}`);
    await createFile(TEST_DIRECTORY, "test.js", `${"_".repeat(200)}}`);

    // Act
    await client.run(
      `SELECT 'files' FROM '' WHERE 'name' LIKE 'test' AND 'extension' = 'txt' AND 'size' > '100'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files with compound 'OR' operator", async () => {
    // Arrange
    await createFile(TEST_DIRECTORY, "test.txt");
    await createFile(TEST_DIRECTORY, "hello.txt");
    await createFile(TEST_DIRECTORY, "test.js");

    // Act
    await client.run(
      `SELECT 'files' FROM '' WHERE 'name' LIKE 'test' OR 'extension' = 'txt'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 3"));
  });

  it("should only select files with multiple compound 'OR' operators", async () => {
    // Arrange
    await createFile(TEST_DIRECTORY, "test.txt", `${"_".repeat(200)}`);
    await createFile(TEST_DIRECTORY, "hello.txt", `${"_".repeat(50)}`);
    await createFile(TEST_DIRECTORY, "test.js", `${"_".repeat(200)}}`);

    // Act
    await client.run(
      `SELECT 'files' FROM '' WHERE 'name' LIKE 'test' OR 'extension' = 'txt' OR 'size' > '100'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 3"));
  });
});

describe("File Filters (comparative)", () => {
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

  it("should only select files with LIKE operator", async () => {
    // Arrange
    await createFile(TEST_DIRECTORY, "test.txt");
    await createFile(TEST_DIRECTORY, "hello.txt");
    await createFile(TEST_DIRECTORY, "test.js");

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'name' LIKE 'test'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select files with = operator", async () => {
    // Arrange
    await createFile(TEST_DIRECTORY, "test.txt");
    await createFile(TEST_DIRECTORY, "hello.txt");
    await createFile(TEST_DIRECTORY, "test2.js");

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'name' = 'test'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files with != operator", async () => {
    // Arrange
    await createFile(TEST_DIRECTORY, "test.txt");
    await createFile(TEST_DIRECTORY, "hello.txt");
    await createFile(TEST_DIRECTORY, "test.js");

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'name' != 'test'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files with > operator", async () => {
    // Arrange
    await createFile(TEST_DIRECTORY, "test.txt", `${"_".repeat(200)}`);
    await createFile(TEST_DIRECTORY, "hello.txt", `${"_".repeat(50)}`);
    await createFile(TEST_DIRECTORY, "test.js", `${"_".repeat(200)}}`);

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'size' > '100'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select files with < operator", async () => {
    // Arrange
    await createFile(TEST_DIRECTORY, "test.txt", `${"_".repeat(200)}`);
    await createFile(TEST_DIRECTORY, "hello.txt", `${"_".repeat(50)}`);
    await createFile(TEST_DIRECTORY, "test.js", `${"_".repeat(200)}}`);

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'size' < '100'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files with >= operator", async () => {
    // Arrange
    await createFile(TEST_DIRECTORY, "test.txt", `${"_".repeat(200)}`);
    await createFile(TEST_DIRECTORY, "test2.txt", `${"_".repeat(100)}`);
    await createFile(TEST_DIRECTORY, "hello.txt", `${"_".repeat(50)}`);
    await createFile(TEST_DIRECTORY, "test.js", `${"_".repeat(200)}}`);

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'size' >= '100'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 3"));
  });

  it("should only select files with <= operator", async () => {
    // Arrange
    await createFile(TEST_DIRECTORY, "test.txt", `${"_".repeat(200)}`);
    await createFile(TEST_DIRECTORY, "test2.txt", `${"_".repeat(100)}`);
    await createFile(TEST_DIRECTORY, "hello.txt", `${"_".repeat(50)}`);
    await createFile(TEST_DIRECTORY, "test.js", `${"_".repeat(200)}}`);

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'size' <= '100'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });
});
