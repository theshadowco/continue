// Generated by continue

import fs from "fs";
import path from "path";
import { CodeSnippetsCodebaseIndex } from "../indexing/CodeSnippetsIndex";
import { testIde, testLLM } from "../test/fixtures";
import {
  addToTestDir,
  setUpTestDir,
  tearDownTestDir,
  TEST_DIR,
} from "../test/testDir";
import generateRepoMap from "./generateRepoMap";
import { getRepoMapFilePath } from "./paths";

describe.skip("generateRepoMap", () => {
  beforeEach(() => {
    setUpTestDir();
  });

  afterEach(() => {
    tearDownTestDir();
    jest.restoreAllMocks();
  });

  it("should generate a repo map with signatures included", async () => {
    // Arrange
    // Create sample files in the test directory
    addToTestDir([
      ["file1.js", "function foo() {}\nfunction bar() {}"],
      ["subdir/file2.py", "def foo(): pass\ndef bar(): pass"],
    ]);

    // Do not mock testIde.getWorkspaceDirs

    // Mock CodeSnippetsCodebaseIndex.getPathsAndSignatures
    jest
      .spyOn(CodeSnippetsCodebaseIndex, "getPathsAndSignatures")
      .mockImplementation(async (dirs, offset, limit) => {
        // Return test data
        return {
          groupedByUri: {
            [path.join(TEST_DIR, "file1.js")]: [
              "function foo() {}",
              "function bar() {}",
            ],
            [path.join(TEST_DIR, "subdir/file2.py")]: [
              "def foo():",
              "def bar():",
            ],
          },
          hasMoreSnippets: false,
          hasMoreUris: false,
        };
      });

    // Set testLLM properties
    testLLM._contextLength = 2048;
    testLLM.countTokens = jest.fn().mockReturnValue(10);

    // Act
    const repoMapContent = await generateRepoMap(testLLM, testIde, {
      includeSignatures: true,
      outputRelativeUriPaths: true,
    });

    // Assert
    const expectedContent =
      "Below is a repository map. \n" +
      "For each file in the codebase, " +
      "this map contains the name of the file, and the signature for any " +
      "classes, methods, or functions in the file.\n\n" +
      "file1.js:\n" +
      "\tfunction foo() {}\n" +
      "\t...\n" +
      "\tfunction bar() {}\n\n" +
      "subdir/file2.py:\n" +
      "\tdef foo():\n" +
      "\t...\n" +
      "\tdef bar():\n\n";

    expect(repoMapContent).toBe(expectedContent);

    // Also check that the repo map file was created at the correct path
    const repoMapPath = getRepoMapFilePath();
    expect(fs.existsSync(repoMapPath)).toBe(true);

    const fileContent = fs.readFileSync(repoMapPath, "utf8");
    expect(fileContent).toBe(expectedContent);
  });

  it("should generate a repo map without signatures when includeSignatures is false", async () => {
    // Arrange
    // Create sample files in the test directory
    addToTestDir([
      ["file1.js", "function foo() {}\nfunction bar() {}"],
      ["subdir/file2.py", "def foo(): pass\ndef bar(): pass"],
    ]);

    // Do not mock testIde.getWorkspaceDirs

    // Mock CodeSnippetsCodebaseIndex.getPathsAndSignatures
    jest
      .spyOn(CodeSnippetsCodebaseIndex, "getPathsAndSignatures")
      .mockImplementation(async (dirs, offset, limit) => {
        // Return test data
        return {
          groupedByUri: {
            [path.join(TEST_DIR, "file1.js")]: [],
            [path.join(TEST_DIR, "subdir/file2.py")]: [],
          },
          hasMoreSnippets: false,
          hasMoreUris: false,
        };
      });

    // Set testLLM properties
    testLLM._contextLength = 2048;
    testLLM.countTokens = jest.fn().mockReturnValue(10);

    // Act
    const repoMapContent = await generateRepoMap(testLLM, testIde, {
      includeSignatures: false,
      outputRelativeUriPaths: true,
    });

    // Assert
    const expectedContent =
      "Below is a repository map. \n" +
      "For each file in the codebase, " +
      "this map contains the name of the file, and the signature for any " +
      "classes, methods, or functions in the file.\n\n" +
      "file1.js\n" +
      "subdir/file2.py\n";

    expect(repoMapContent).toBe(expectedContent);

    // Also check that the repo map file was created at the correct path
    const repoMapPath = getRepoMapFilePath();
    expect(fs.existsSync(repoMapPath)).toBe(true);

    const fileContent = fs.readFileSync(repoMapPath, "utf8");
    expect(fileContent).toBe(expectedContent);
  });

  it("should handle file read errors gracefully", async () => {
    // Arrange
    // Create sample files in the test directory
    addToTestDir([
      ["file1.js", "function foo() {}\nfunction bar() {}"],
      ["subdir/file2.py", "def foo(): pass\ndef bar(): pass"],
    ]);

    // Do not mock testIde.getWorkspaceDirs

    // Mock CodeSnippetsCodebaseIndex.getPathsAndSignatures
    jest
      .spyOn(CodeSnippetsCodebaseIndex, "getPathsAndSignatures")
      .mockImplementation(async (dirs, offset, limit) => {
        // Return test data
        return {
          groupedByUri: {
            [path.join(TEST_DIR, "file1.js")]: ["function foo() {}"],
            [path.join(TEST_DIR, "subdir/file2.py")]: ["def foo():"],
          },
          hasMoreSnippets: false,
          hasMoreUris: false,
        };
      });

    // Mock fs.promises.readFile to throw an error when reading file1.js
    jest
      .spyOn(fs.promises, "readFile")
      .mockImplementation((filePath, encoding) => {
        if (filePath === path.join(TEST_DIR, "file1.js")) {
          return Promise.reject(new Error("File not found"));
        }
        return fs.promises.readFile(filePath, encoding);
      });

    // Spy on console.error
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Set testLLM properties
    testLLM._contextLength = 2048;
    testLLM.countTokens = jest.fn().mockReturnValue(10);

    // Act
    const repoMapContent = await generateRepoMap(testLLM, testIde, {
      includeSignatures: true,
      outputRelativeUriPaths: true,
    });

    // Assert
    const expectedContent =
      "Below is a repository map. \n" +
      "For each file in the codebase, " +
      "this map contains the name of the file, and the signature for any " +
      "classes, methods, or functions in the file.\n\n" +
      "subdir/file2.py:\n" +
      "\tdef foo():\n\n" +
      "file1.js\n"; // file1.js is added in writeRemainingPaths

    expect(repoMapContent).toBe(expectedContent);

    // Also check that an error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "Failed to read file:\n" +
          `  Path: ${path.join(TEST_DIR, "file1.js")}\n` +
          "  Error: File not found",
      ),
    );

    // Clean up mock
    consoleErrorSpy.mockRestore();
  });
});
