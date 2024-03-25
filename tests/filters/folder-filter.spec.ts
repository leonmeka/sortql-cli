import { doesExist, createFolder, TEST_DIRECTORY } from "@tests/utils";
import { mkdir, rmdir } from "node:fs/promises";

import * as jest from "jest-mock";

import { Client } from "@sortql/core";

describe("Folder Filters (non-compound)", () => {
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

  it("should only select folders with names that contain 'test'", async () => {
    // Arrange
    await createFolder(TEST_DIRECTORY, "test");
    await createFolder(TEST_DIRECTORY, "hello");

    // Act
    await client.run(`SELECT 'folders' FROM '' WHERE 'name' LIKE 'test'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select folders with created dates that are greater than 01.01.2021", async () => {
    // Arrange
    await createFolder(TEST_DIRECTORY, "test");
    await createFolder(TEST_DIRECTORY, "hello");

    // Act
    await client.run(`SELECT 'folders' FROM '' WHERE 'created' > '01.01.2021'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select folders with modified dates that are greater than 01.01.2021", async () => {
    // Arrange
    await createFolder(TEST_DIRECTORY, "test");
    await createFolder(TEST_DIRECTORY, "hello");

    // Act
    await client.run(
      `SELECT 'folders' FROM '' WHERE 'modified' > '01.01.2021'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select folders with accessed dates that are greater than 01.01.2021", async () => {
    // Arrange
    await createFolder(TEST_DIRECTORY, "test");
    await createFolder(TEST_DIRECTORY, "hello");

    // Act
    await client.run(
      `SELECT 'folders' FROM '' WHERE 'accessed' > '01.01.2021'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });
});

describe("Folder Filters (compound)", () => {
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

  it("should only select folders with compound 'AND' operator", async () => {
    // Arrange
    await createFolder(TEST_DIRECTORY, "test");
    await createFolder(TEST_DIRECTORY, "hello");
    await createFolder(TEST_DIRECTORY, "test2");

    // Act
    await client.run(
      `SELECT 'folders' FROM '' WHERE 'name' LIKE 'test' AND 'created' > '01.01.2021'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select folders with multiple compound 'AND' operators", async () => {
    // Arrange
    await createFolder(TEST_DIRECTORY, "test");
    await createFolder(TEST_DIRECTORY, "hello");
    await createFolder(TEST_DIRECTORY, "test2");

    // Act
    await client.run(
      `SELECT 'folders' FROM '' WHERE 'name' LIKE 'test' AND 'created' > '01.01.2021' AND 'modified' > '01.01.2021'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select folders with compound 'OR' operator", async () => {
    // Arrange
    await createFolder(TEST_DIRECTORY, "test");
    await createFolder(TEST_DIRECTORY, "hello");
    await createFolder(TEST_DIRECTORY, "test2");

    // Act
    await client.run(
      `SELECT 'folders' FROM '' WHERE 'name' LIKE 'test' AND 'created' > '01.01.2021' AND 'modified' > '01.01.2021'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select folders with multiple compound 'OR' operators", async () => {
    // Arrange
    await createFolder(TEST_DIRECTORY, "test");
    await createFolder(TEST_DIRECTORY, "hello");
    await createFolder(TEST_DIRECTORY, "test2");

    // Act
    await client.run(
      `SELECT 'folders' FROM '' WHERE 'name' LIKE 'test' OR 'created' > '01.01.2021' OR 'modified' > '01.01.2021'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 3"));
  });
});

describe("Folder Filters (comparative)", () => {
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

  it("should only select folders with LIKE operator", async () => {
    // Arrange
    await createFolder(TEST_DIRECTORY, "test");
    await createFolder(TEST_DIRECTORY, "hello");
    await createFolder(TEST_DIRECTORY, "test2");

    // Act
    await client.run(`SELECT 'folders' FROM '' WHERE 'name' LIKE 'test'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select folders with = operator", async () => {
    // Arrange
    await createFolder(TEST_DIRECTORY, "test");
    await createFolder(TEST_DIRECTORY, "hello");
    await createFolder(TEST_DIRECTORY, "test2");

    // Act
    await client.run(`SELECT 'folders' FROM '' WHERE 'name' = 'test'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select folders with != operator", async () => {
    // Arrange
    await createFolder(TEST_DIRECTORY, "test");
    await createFolder(TEST_DIRECTORY, "hello");
    await createFolder(TEST_DIRECTORY, "test2");

    // Act
    await client.run(`SELECT 'folders' FROM '' WHERE 'name' != 'test'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select folders with > operator", async () => {
    // Arrange
    await createFolder(TEST_DIRECTORY, "test");
    await createFolder(TEST_DIRECTORY, "hello");
    await createFolder(TEST_DIRECTORY, "test2");

    // Act
    await client.run(`SELECT 'folders' FROM '' WHERE 'created' > '01.01.2021'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 3"));
  });

  it("should only select folders with < operator", async () => {
    // Arrange
    await createFolder(TEST_DIRECTORY, "test");
    await createFolder(TEST_DIRECTORY, "hello");
    await createFolder(TEST_DIRECTORY, "test2");

    // Act
    await client.run(`SELECT 'folders' FROM '' WHERE 'created' < '01.01.2021'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 0"));
  });

  it("should only select folders with >= operator", async () => {
    // Arrange
    await createFolder(TEST_DIRECTORY, "test");
    await createFolder(TEST_DIRECTORY, "hello");
    await createFolder(TEST_DIRECTORY, "test2");

    // Act
    await client.run(
      `SELECT 'folders' FROM '' WHERE 'created' >= '01.01.2021'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 3"));
  });

  it("should only select folders with <= operator", async () => {
    // Arrange
    await createFolder(TEST_DIRECTORY, "test");
    await createFolder(TEST_DIRECTORY, "hello");
    await createFolder(TEST_DIRECTORY, "test2");

    // Act
    await client.run(
      `SELECT 'folders' FROM '' WHERE 'created' <= '01.01.2021'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 0"));
  });
});
