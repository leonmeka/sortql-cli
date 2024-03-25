# sortQL Documentation

This documentation provides a detailed overview of the query syntax, supported operations, and properties, as well as some examples on how you might use **sortQL** in your projects.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Query Syntax](#query-syntax)
   1. [Supported Operations](#supported-operations)
      1. [File Operations](#file-operations)
      2. [Folder Operations](#folder-operations)
   2. [Supported Properties](#supported-properties)
      1. [File Properties](#file-properties)
      2. [Folder Properties](#folder-properties)
3. [Advanced Usage](#advanced-usage)
   1. [Comparative Operators](#comparative-operators)
   2. [Logical Operators](#logical-operators)
   3. [Regular Expressions](#regular-expressions)
4. [Tips and Tricks](#helpful-tips)
   1. [Probing Files and Folders](#probing-files-and-folders)
5. [Examples and Use Cases](#examples-and-use-cases)

## Getting Started

To get started, please refer to our [quick start guide](readme.md). This guide will walk you through the installation process and provide you with a basic understanding of how to use **sortQL**.

## Query Syntax

**sortQL**'s syntax is inspired by SQL and is designed to be intuitive and easy to use. The basic structure of a **sortQL** query is as follows:

```sql
-- This is a comment: The basic structure of a sortQL query
OPERATION '<target>' FROM '<path>' (WHERE '<property>' <operator> '<value>' (AND/OR '<property>' <operator> '<value>')) (TO '<path>')
```

As you might notice, the query is made up of several components. Below is a brief explanation of each component:

- **OPERATION**: The type of operation to be performed (e.g., SELECT, MOVE, COPY, DELETE, ARCHIVE, UNARCHIVE).
- **TARGET**: The type of target (= **'files'** or **'folders'**).
- **FROM**: The source path where the operation will be performed.
- **WHERE**: The condition used to filter files or folders based on specific properties (optional).
- **PROPERTY**: The property to be used for filtering (e.g., name, extension, size, created, modified, accessed).
- **OPERATOR**: The comparison operator used to compare the property with a specific value (e.g., =, !=, >, <, >=, <=, LIKE).
- **AND/OR**: The logical operator to combine multiple conditions (optional).
- **TO**: The destination path used for some operations (e.g., MOVE, COPY, ARCHIVE, UNARCHIVE).

### Supported Operations

Operations are divided into two categories: **file** operations and **folder** operations. Thus, each operation is designed to perform a specific task on files or folders.

**sortQL** supports the following operations:

#### File Operations

- SELECT: Selects files.
  ```sql
  SELECT 'files' FROM ''
  ```
- MOVE: Moves files to a different location.
  ```sql
  MOVE 'files' FROM '' TO 'text-files'
  ```
- COPY: Copies files to a different location.
  ```sql
  COPY 'files' FROM '' TO 'backup'
  ```
- DELETE: Deletes files.
  ```sql
  DELETE 'files' FROM ''
  ```
- ARCHIVE: Archives files to a zip file.
  ```sql
  ARCHIVE 'files' FROM '' TO 'archive.zip'
  ```
- UNARCHIVE: Unarchives files to a different location.
  ```sql
  UNARCHIVE 'files' FROM '' TO 'unarchived'
  ```
- CONVERT: Converts files to a different format. (Supported files: image, audio, video)
  ```sql
  CONVERT 'files' FROM '' TO 'jpg'
  ```

#### Folder Operations

- SELECT: Selects folders.
  ```sql
  SELECT 'folders' FROM ''
  ```
- MOVE: Moves folders to a different location.
  ```sql
  MOVE 'folders' FROM '' TO 'projects'
  ```
- COPY: Copies folders to a different location.
  ```sql
  COPY 'folders' FROM '' TO 'backup'
  ```
- DELETE: Deletes folders.
  ```sql
  DELETE 'folders' FROM ''
  ```
- ARCHIVE: Archives folders to a zip file.
  ```sql
  ARCHIVE 'folders' FROM '' TO 'archive.zip'
  ```

### Supported Properties

**sortQL** supports the following properties for files and folders:

#### File Properties

#### **name**: The name of the file.

> [!NOTE]  
> Allowed values: Any string. Regular expressions are supported.

Example:

```sql
-- Select files with a specific name
SELECT 'files' FROM '' WHERE 'name' = 'example'
```

```sql
-- Select files with a name that matches a pattern
SELECT 'files' FROM '' WHERE 'name' LIKE 'example.*'
```

#### **extension**: The file extension.

> [!NOTE]  
> Allowed values: Any string. Regular expressions are supported.

Example:

```sql
-- Select files with a specific extension
SELECT 'files' FROM '' WHERE 'extension' = 'txt'
```

```sql
-- Select files with extensions 'txt' and 'pdf'
SELECT 'files' FROM '' WHERE 'extension' LIKE '(txt|pdf)'
```

#### **size**: The size of the file in bytes.

> [!NOTE]  
> Allowed values: Any integer. Comparison operators are supported.

Example:

```sql
-- Select files with file size greater than 100000 bytes (= 100KB)
SELECT 'files' FROM '' WHERE 'size' > 100000
```

```sql
-- Select files with file size less than or equal to 1000000 bytes (= 1MB)
SELECT 'files' FROM '' WHERE 'size' <= 1000000
```

#### **content**: The content of the file.

> [!NOTE]
> Allowed values: Any string. Regular expressions are supported.

Example:

```sql
-- Select files with specific content
SELECT 'files' FROM '' WHERE 'content' = 'example'
```

```sql
-- Select files with content that matches a pattern (e.g., 'car', 'cars', 'racecar', 'carpet', etc.)
SELECT 'files' FROM '' WHERE 'content' LIKE '[^,]*car[^,]*'
```

#### **created**: The creation date of the file.

> [!NOTE]  
> Allowed values: Any date string. Comparison operators are supported.

Example:

```sql
-- Select files created after a specific date
SELECT 'files' FROM '' WHERE 'created' > '01.01.2021'
```

```sql
-- Select files created before a specific date
SELECT 'files' FROM '' WHERE 'created' < '01.01.2021'
```

#### **modified**: The last modified date of the file.

> [!NOTE]  
> Allowed values: Any date string. Comparison operators are supported.

Example:

```sql
-- Select files modified after a specific date
SELECT 'files' FROM '' WHERE 'modified' > '01.01.2021'
```

```sql
-- Select files modified before a specific date
SELECT 'files' FROM '' WHERE 'modified' < '01.01.2021'
```

#### **accessed**: The last accessed date of the file.

> [!NOTE]
> Allowed values: Any date string. Comparison operators are supported.

Example:

```sql
-- Select files accessed after a specific date
SELECT 'files' FROM '' WHERE 'accessed' > '01.01.2021'
```

```sql
-- Select files accessed before a specific date
SELECT 'files' FROM '' WHERE 'accessed' < '01.01.2021'
```

#### Folder Properties

#### **name**: The name of the folder.

> [!NOTE]
> Allowed values: Any string. Regular expressions are supported.

Example:

```sql
-- Select folders with a specific name
SELECT 'folders' FROM '' WHERE 'name' = 'example'
```

```sql
-- Select folders with a name that matches a pattern
SELECT 'folders' FROM '' WHERE 'name' LIKE 'project-*'
```

#### **created**: The creation date of the folder.

> [!NOTE]  
> Allowed values: Any date string. Comparison operators are supported.

Example:

```sql
-- Select folders created after a specific date
SELECT 'folders' FROM '' WHERE 'created' > '01.01.2021'
```

```sql
-- Select folders created before a specific date
SELECT 'folders' FROM '' WHERE 'created' < '01.01.2021'
```

#### **modified**: The last modified date of the folder.

> [!NOTE]  
> Allowed values: Any date string. Comparison operators are supported.

Example:

```sql
-- Select folders modified after a specific date
SELECT 'folders' FROM '' WHERE 'modified' > '01.01.2021'
```

```sql
-- Select folders modified before a specific date
SELECT 'folders' FROM '' WHERE 'modified' < '01.01.2021'
```

#### **accessed**: The last accessed date of the folder.

> [!NOTE]
> Allowed values: Any date string. Comparison operators are supported.

Example:

```sql
-- Select folders accessed after a specific date
SELECT 'folders' FROM '' WHERE 'accessed' > '01.01.2021'
```

```sql
-- Select folders accessed before a specific date
SELECT 'folders' FROM '' WHERE 'accessed' < '01.01.2021'
```

## Advanced Usage

**sortQL** supports advanced features such as comparative operators and regular expressions to provide more flexibility and control over file and folder operations.

### Comparative Operators

**sortQL** supports the following comparative operators:

- **LIKE**: Similar to SQL's **LIKE** operator, it allows you to match properties with regex patterns.
- **=**: Equal to.
- **!=**: Not equal to.
- **>**: Greater than.
- **<**: Less than.
- **>=**: Greater than or equal to.
- **<=**: Less than or equal to.

You can use these operators to compare properties with specific values. Below are some examples of using comparative operators:

```sql
-- Select files with file size greater than 100000 bytes (= 100KB)
SELECT 'files' FROM '' WHERE 'size' > 100000
```

```sql
-- Move files created between specific dates to a different location
MOVE 'files' FROM '' WHERE 'created' >= '01.01.2021' AND 'created' <= '31.12.2021' TO 'projects_2021'
```

```sql
-- Delete files with extensions other than 'txt' and 'pdf'
DELETE 'files' FROM '' WHERE 'extension' LIKE '?!(txt|pdf)'
```

### Logical Operators

Additionally, you can combine multiple conditions using the logical operators **AND** and **OR**.

A valid example of using logical operators:

```sql
-- Select big files created after a specific date
SELECT 'files' FROM '' WHERE 'size' > 100000 AND 'created' > '01.01.2021'
```

### Regular Expressions

**sortQL** supports regular expressions for matching file and folder properties. In case you're not familiar with regular expressions, they are a powerful tool for pattern matching and can be used to match complex patterns in strings.

To learn more about regular expressions, you can refer to the [MDN Web Docs](https://developer.mozilla.org/en-US/Web/JavaScript/Guide/Regular_Expressions).

Here's an example of using regular expressions to match files with a specific extension:

```sql
-- Select files with extensions 'txt' and 'pdf'
SELECT 'files' FROM '' WHERE 'extension' LIKE '(txt|pdf)'
```

```sql
-- Select files with names that match a specific pattern
SELECT 'files' FROM '' WHERE 'name' LIKE 'example.*'
```

## Helpful Tips

### Probing Files and Folders

Before actually performing an operation, you can use the **SELECT** operation to probe the files or folders that match specific conditions. This can be useful to verify that the conditions are correct before performing the actual operation. Especially when using complex conditions, probing can help you avoid unintended consequences.

## Examples and Use Cases

Below we list a few examples of how **sortQL** can be used:

### Example 1: Moving Documents to a Different Subfolder

Suppose you have a directory containing various types of files, including documents, presentations, and spreadsheets. You want to move these files to separate subfolders based on their file extensions:

```sql
-- Move documents to a different subfolder
MOVE 'files' FROM '' WHERE 'extension' LIKE '(docx|doc|pdf)' TO 'documents'
MOVE 'files' FROM '' WHERE 'extension' LIKE '(pptx|ppt)' TO 'presentations'
MOVE 'files' FROM '' WHERE 'extension' LIKE '(xlsx|xls)' TO 'spreadsheets'
```

### Example 2: Deleting Files Older Than a Specific Date

You have a directory with a large number of files and want to delete files that are older than a specific date:

```sql
-- Delete files older than a specific date
DELETE 'files' FROM '' WHERE 'created' < '01.01.2021'
```

### Example 3: Archiving Files Based on Size

You have a directory with a large number of files and want to archive files that are larger than 100MB:

```sql
-- Archive files based on size
ARCHIVE 'files' FROM '' WHERE 'size' > 100000000 TO 'archive.zip'
```

### Example 4: Copying Folders Based on Name

You have a directory with several subfolders and want to copy all folders that contain the word "project" in their name to a different location:

```sql
-- Copy folders based on name
COPY 'folders' FROM '' WHERE 'name' LIKE '*project*' TO 'old-projects'
```

### Example 5: Converting MOV Files to MP4

You have a shared directory between Windows and Mac, and you want to convert all MOV files to MP4 for better compatibility:

```sql
-- Convert MOV files to MP4
CONVERT 'files' FROM 'shared' WHERE 'extension' = 'mov' TO 'mp4'
```
