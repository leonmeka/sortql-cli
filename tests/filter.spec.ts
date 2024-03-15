import fs from "fs";
import path from "path";
import { QueryClient } from "@sortql/core";

const directory = path.join(process.cwd(), "./tests/mock-directory");

const createFile = (name: string, content = "") => {
  fs.writeFileSync(path.join(directory, name), content);
};

const createFolder = (name: string) => {
  fs.mkdirSync(path.join(directory, name), { recursive: true });
};

const exists = (filePath: string) =>
  fs.existsSync(path.join(directory, filePath));

describe("File Filters", () => {
  let consoleSpy: jest.SpyInstance;
  let client: QueryClient;

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

  it("should only select files with names that contain 'test'", async () => {
    // Arrange
    createFile("test.txt");
    createFile("hello.txt");

    // Act
    await client.run(`SELECT files FROM '' WHERE name = 'test'`);

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[SELECT]: 1")
    );
  });

  it("should only select .txt files", async () => {
    // Arrange
    createFile("test.txt");
    createFile("test.json");
    createFile("test.csv");

    // Act
    await client.run(`SELECT files FROM '' WHERE extension = 'txt'`);

    // Assert

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[SELECT]: 1")
    );
  });

  it("should only select files which match a given regex", async () => {
    // Arrange
    createFile("test.txt");
    createFile("test.json");
    createFile("test.csv");

    // Act
    await client.run(`SELECT files FROM '' WHERE extension = '(txt|json|csv)'`);

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[SELECT]: 3")
    );
  });

  it("should only select files with a size greater than 1000", async () => {
    // Arrange
    createFile("test.txt", "a".repeat(1000));
    createFile("test.json", "a".repeat(1001));

    // Act
    await client.run(`SELECT files FROM '' WHERE size > 1000`);

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[SELECT]: 1")
    );
  });

  it("should only select files with a size less than 1000", async () => {
    // Arrange
    createFile("test.txt", "a".repeat(1000));
    createFile("test.json", "a".repeat(999));

    // Act
    await client.run(`SELECT files FROM '' WHERE size < 1000`);

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[SELECT]: 1")
    );
  });

  it("should only select files with a size equal to 1000", async () => {
    // Arrange
    createFile("test.txt", "a".repeat(1000));
    createFile("test.json", "a".repeat(999));

    // Act
    await client.run(`SELECT files FROM '' WHERE size = 1000`);

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[SELECT]: 1")
    );
  });

  it("should only select files with a size not equal to 1000", async () => {
    // Arrange
    createFile("test.txt", "a".repeat(1000));
    createFile("test.json", "a".repeat(999));

    // Act
    await client.run(`SELECT files FROM '' WHERE size != 1000`);

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[SELECT]: 1")
    );
  });

  it("should only select files with a size greater than 1000 and less than 1002", async () => {
    // Arrange
    createFile("test.txt", "a".repeat(1000));
    createFile("test.json", "a".repeat(1001));
    createFile("test.csv", "a".repeat(1002));

    // Act
    await client.run(`SELECT files FROM '' WHERE size > 1000 AND size < 1002`);

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[SELECT]: 1")
    );
  });

  it("should only select files with a size greater than 1000 or less than 1001", async () => {
    // Arrange
    createFile("test.txt", "a".repeat(1000));
    createFile("test.json", "a".repeat(1001));

    // Act
    await client.run(`SELECT files FROM '' WHERE size > 1000 OR size < 1001`);

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[SELECT]: 2")
    );
  });

  it("should only select files with a size greater than 1000 and with a name that contains 'hello'", async () => {
    // Arrange
    createFile("test.txt", "a".repeat(1000));
    createFile("hello.txt", "a".repeat(1001));
    createFile("test.json", "a".repeat(1002));

    // Act
    await client.run(
      `SELECT files FROM '' WHERE size > 1000 AND name = 'hello'`
    );

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[SELECT]: 1")
    );
  });

  it("should only select files created after 01/01/2024", async () => {
    // Arrange
    createFile("test.txt");
    createFile("hello.txt");

    // Act
    await client.run(`SELECT files FROM '' WHERE created > '01/01/2024'`);

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[SELECT]: 2")
    );
  });

  it("should only select files modified after 01/01/2024", async () => {
    // Arrange
    createFile("test.txt");
    createFile("hello.txt");

    // Act
    await client.run(`SELECT files FROM '' WHERE modified > '01/01/2024'`);

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[SELECT]: 2")
    );
  });

  it("should only select files accessed after 01/01/2024", async () => {
    // Arrange
    createFile("test.txt");
    createFile("hello.txt");

    // Act
    await client.run(`SELECT files FROM '' WHERE accessed > '01/01/2024'`);

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[SELECT]: 2")
    );
  });
});

describe("Folder Filters", () => {
  let consoleSpy: jest.SpyInstance;
  let client: QueryClient;

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

  it("should only select folders with names that contain 'test'", async () => {
    // Arrange
    createFolder("test");
    createFolder("hello");

    // Act
    await client.run(`SELECT folders FROM '' WHERE name = 'test'`);

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[SELECT]: 1")
    );
  });

  it("should only select folders which match a given regex", async () => {
    // Arrange
    createFolder("test-1");
    createFolder("test-2");
    createFolder("test-99");
    createFolder("hello");

    // Act
    await client.run(`SELECT folders FROM '' WHERE name = 'test-[0-9]'`);

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[SELECT]: 3")
    );
  });
});
