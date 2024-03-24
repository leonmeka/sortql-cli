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

import { Client } from "@sortql/core";

const directory = path.join(process.cwd(), "./tests/mock-directory");

describe("File Filters (non-compound)", () => {
  let client: Client;
  let spy: Mock<any>;

  beforeEach(async () => {
    client = new Client(directory);
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
    await client.run(`SELECT 'files' FROM '' WHERE 'name' LIKE 'test'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files with extensions that contain 'txt'", async () => {
    // Arrange
    await createFile(directory, "test.txt");
    await createFile(directory, "hello.js");

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'extension' = 'txt'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files with sizes that are greater than 100", async () => {
    // Arrange
    await createFile(directory, "test.txt", `${"_".repeat(200)}`);
    await createFile(directory, "hello.txt", `${"_".repeat(50)}`);

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'size' > '100'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files with content 'hello'", async () => {
    // Arrange
    await createFile(directory, "test.txt", "find-me");
    await createFile(directory, "test2.txt", "world");

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'content' = 'find-me'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files with created dates that are greater than 01.01.2021", async () => {
    // Arrange
    await createFile(directory, "test.txt");
    await createFile(directory, "hello.txt");

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'created' > '01.01.2021'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select files with modified dates that are greater than 01.01.2021", async () => {
    // Arrange
    await createFile(directory, "test.txt");
    await createFile(directory, "hello.txt");

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'modified' > '01.01.2021'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select files with accessed dates that are greater than 01.01.2021", async () => {
    // Arrange
    await createFile(directory, "test.txt");
    await createFile(directory, "hello.txt");

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'accessed' > '01.01.2021'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });
});

describe("File Filters (compound)", () => {
  let client: Client;
  let spy: Mock<any>;

  beforeEach(async () => {
    client = new Client(directory);
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

  it("should only select files with compound 'AND' operator", async () => {
    // Arrange
    await createFile(directory, "test.txt");
    await createFile(directory, "hello.txt");
    await createFile(directory, "test.js");

    // Act
    await client.run(
      `SELECT 'files' FROM '' WHERE 'name' LIKE 'test' AND 'extension' = 'txt'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files with multiple compound 'AND' operators", async () => {
    await createFile(directory, "test.txt", `${"_".repeat(200)}`);
    await createFile(directory, "hello.txt", `${"_".repeat(50)}`);
    await createFile(directory, "test.js", `${"_".repeat(200)}}`);

    // Act
    await client.run(
      `SELECT 'files' FROM '' WHERE 'name' LIKE 'test' AND 'extension' = 'txt' AND 'size' > '100'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files with compound 'OR' operator", async () => {
    // Arrange
    await createFile(directory, "test.txt");
    await createFile(directory, "hello.txt");
    await createFile(directory, "test.js");

    // Act
    await client.run(
      `SELECT 'files' FROM '' WHERE 'name' LIKE 'test' OR 'extension' = 'txt'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 3"));
  });

  it("should only select files with multiple compound 'OR' operators", async () => {
    // Arrange
    await createFile(directory, "test.txt", `${"_".repeat(200)}`);
    await createFile(directory, "hello.txt", `${"_".repeat(50)}`);
    await createFile(directory, "test.js", `${"_".repeat(200)}}`);

    // Act
    await client.run(
      `SELECT 'files' FROM '' WHERE 'name' LIKE 'test' OR 'extension' = 'txt' OR 'size' > '100'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 3"));
  });
});

describe("Folder Filters (non-compound)", () => {
  let client: Client;
  let spy: Mock<any>;

  beforeEach(async () => {
    client = new Client(directory);
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
    await client.run(`SELECT 'folders' FROM '' WHERE 'name' LIKE 'test'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select folders with created dates that are greater than 01.01.2021", async () => {
    // Arrange
    await createFolder(directory, "test");
    await createFolder(directory, "hello");

    // Act
    await client.run(`SELECT 'folders' FROM '' WHERE 'created' > '01.01.2021'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select folders with modified dates that are greater than 01.01.2021", async () => {
    // Arrange
    await createFolder(directory, "test");
    await createFolder(directory, "hello");

    // Act
    await client.run(
      `SELECT 'folders' FROM '' WHERE 'modified' > '01.01.2021'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select folders with accessed dates that are greater than 01.01.2021", async () => {
    // Arrange
    await createFolder(directory, "test");
    await createFolder(directory, "hello");

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
  let spy: Mock<any>;

  beforeEach(async () => {
    client = new Client(directory);
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

  it("should only select folders with compound 'AND' operator", async () => {
    // Arrange
    await createFolder(directory, "test");
    await createFolder(directory, "hello");
    await createFolder(directory, "test2");

    // Act
    await client.run(
      `SELECT 'folders' FROM '' WHERE 'name' LIKE 'test' AND 'created' > '01.01.2021'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select folders with multiple compound 'AND' operators", async () => {
    // Arrange
    await createFolder(directory, "test");
    await createFolder(directory, "hello");
    await createFolder(directory, "test2");

    // Act
    await client.run(
      `SELECT 'folders' FROM '' WHERE 'name' LIKE 'test' AND 'created' > '01.01.2021' AND 'modified' > '01.01.2021'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select folders with compound 'OR' operator", async () => {
    // Arrange
    await createFolder(directory, "test");
    await createFolder(directory, "hello");
    await createFolder(directory, "test2");

    // Act
    await client.run(
      `SELECT 'folders' FROM '' WHERE 'name' LIKE 'test' AND 'created' > '01.01.2021' AND 'modified' > '01.01.2021'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select folders with multiple compound 'OR' operators", async () => {
    // Arrange
    await createFolder(directory, "test");
    await createFolder(directory, "hello");
    await createFolder(directory, "test2");

    // Act
    await client.run(
      `SELECT 'folders' FROM '' WHERE 'name' LIKE 'test' OR 'created' > '01.01.2021' OR 'modified' > '01.01.2021'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 3"));
  });
});

describe("File Filters (comparative)", () => {
  let client: Client;
  let spy: Mock<any>;

  beforeEach(async () => {
    client = new Client(directory);
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

  it("should only select files with LIKE operator", async () => {
    // Arrange
    await createFile(directory, "test.txt");
    await createFile(directory, "hello.txt");
    await createFile(directory, "test.js");

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'name' LIKE 'test'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select files with = operator", async () => {
    // Arrange
    await createFile(directory, "test.txt");
    await createFile(directory, "hello.txt");
    await createFile(directory, "test2.js");

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'name' = 'test'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files with != operator", async () => {
    // Arrange
    await createFile(directory, "test.txt");
    await createFile(directory, "hello.txt");
    await createFile(directory, "test.js");

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'name' != 'test'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files with > operator", async () => {
    // Arrange
    await createFile(directory, "test.txt", `${"_".repeat(200)}`);
    await createFile(directory, "hello.txt", `${"_".repeat(50)}`);
    await createFile(directory, "test.js", `${"_".repeat(200)}}`);

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'size' > '100'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select files with < operator", async () => {
    // Arrange
    await createFile(directory, "test.txt", `${"_".repeat(200)}`);
    await createFile(directory, "hello.txt", `${"_".repeat(50)}`);
    await createFile(directory, "test.js", `${"_".repeat(200)}}`);

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'size' < '100'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select files with >= operator", async () => {
    // Arrange
    await createFile(directory, "test.txt", `${"_".repeat(200)}`);
    await createFile(directory, "test2.txt", `${"_".repeat(100)}`);
    await createFile(directory, "hello.txt", `${"_".repeat(50)}`);
    await createFile(directory, "test.js", `${"_".repeat(200)}}`);

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'size' >= '100'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 3"));
  });

  it("should only select files with <= operator", async () => {
    // Arrange
    await createFile(directory, "test.txt", `${"_".repeat(200)}`);
    await createFile(directory, "test2.txt", `${"_".repeat(100)}`);
    await createFile(directory, "hello.txt", `${"_".repeat(50)}`);
    await createFile(directory, "test.js", `${"_".repeat(200)}}`);

    // Act
    await client.run(`SELECT 'files' FROM '' WHERE 'size' <= '100'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });
});

describe("Folder Filters (comparative)", () => {
  let client: Client;
  let spy: Mock<any>;

  beforeEach(async () => {
    client = new Client(directory);
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

  it("should only select folders with LIKE operator", async () => {
    // Arrange
    await createFolder(directory, "test");
    await createFolder(directory, "hello");
    await createFolder(directory, "test2");

    // Act
    await client.run(`SELECT 'folders' FROM '' WHERE 'name' LIKE 'test'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select folders with = operator", async () => {
    // Arrange
    await createFolder(directory, "test");
    await createFolder(directory, "hello");
    await createFolder(directory, "test2");

    // Act
    await client.run(`SELECT 'folders' FROM '' WHERE 'name' = 'test'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 1"));
  });

  it("should only select folders with != operator", async () => {
    // Arrange
    await createFolder(directory, "test");
    await createFolder(directory, "hello");
    await createFolder(directory, "test2");

    // Act
    await client.run(`SELECT 'folders' FROM '' WHERE 'name' != 'test'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 2"));
  });

  it("should only select folders with > operator", async () => {
    // Arrange
    await createFolder(directory, "test");
    await createFolder(directory, "hello");
    await createFolder(directory, "test2");

    // Act
    await client.run(`SELECT 'folders' FROM '' WHERE 'created' > '01.01.2021'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 3"));
  });

  it("should only select folders with < operator", async () => {
    // Arrange
    await createFolder(directory, "test");
    await createFolder(directory, "hello");
    await createFolder(directory, "test2");

    // Act
    await client.run(`SELECT 'folders' FROM '' WHERE 'created' < '01.01.2021'`);

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 0"));
  });

  it("should only select folders with >= operator", async () => {
    // Arrange
    await createFolder(directory, "test");
    await createFolder(directory, "hello");
    await createFolder(directory, "test2");

    // Act
    await client.run(
      `SELECT 'folders' FROM '' WHERE 'created' >= '01.01.2021'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 3"));
  });

  it("should only select folders with <= operator", async () => {
    // Arrange
    await createFolder(directory, "test");
    await createFolder(directory, "hello");
    await createFolder(directory, "test2");

    // Act
    await client.run(
      `SELECT 'folders' FROM '' WHERE 'created' <= '01.01.2021'`
    );

    // Assert
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[SELECT]: 0"));
  });
});
