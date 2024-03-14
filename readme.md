<p align="center">
  <img src="https://github.com/leonmeka/sortql-cli/assets/15350962/c37fab56-5006-4e4d-84b5-00b2698525b0" alt="angular-logo" width="350px"/>
  <br>
  <em>A file management automation tool with SQL-like syntax.</em>
  <br>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a>
  ·
  <a href="./docs/documentation.md">Documentation</a>
  ·
  <a href="https://github.com/leonmeka/sortql-cli/issues"> 
  Submit an Issue</a>
  <br>
  <br>
</p>

<p align="center">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/%40sortql%2Fsortql-cli">
  <img alt="NPM Downloads" src="https://img.shields.io/npm/dt/%40sortql%2Fsortql-cli">
  <img alt="NPM License" src="https://img.shields.io/npm/l/%40sortql%2Fsortql-cli">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/leonmeka/sortql-cli">
</p>

# About

<b>sortQL</b> is a simple, yet powerful, file management automation tool that allows you to define complex operations using a declarative SQL-like syntax. It's designed to help you automate file and directory operations, such as moving, copying, deleting, and archiving files, based on predefined conditions.

Features include:

- <b>Simple Installation:</b> Install globally using npm, pnpm, bun or yarn, and run from any directory.

- <b>Declarative Syntax:</b> Define complex file and directory operations in a simple, readable .SQL file.

- <b>Watch Mode:</b> Automatically re-run the queries whenever a file or directory is added, removed, or modified.

- <b>Cross-Platform:</b> Works seamlessly across different operating systems, including Windows, macOS, and Linux.

- <b>Open-Source:</b> Fully open-source codebase, allowing you to contribute and modify the source code.

<hr style="border: 1px solid #f0f0f0; margin-top: 2em; margin-bottom: 2em;">

https://github.com/leonmeka/sortql-cli/assets/15350962/7f62b92c-33f2-4f61-ba01-7e287f38f517

Example: Automated workflow for cleaning up the mess on your desktop.

<hr style="border: 1px solid #f0f0f0; margin-top: 2em; margin-bottom: 2em;">

# How it Works

At the heart of <b>sortQL</b> is the queries.sql file, which contains a list of operations to be executed. Each operation is defined in a single line, which specifies the type of operation, the files or directories to be affected, and the conditions that must be met. Users, who are already familiar with SQL, will get the hang of it in no time.

Here's an example of a queries.sql file, which moves files with specific extensions to a different subfolder:

```sql
-- Move documents to a different subfolder
MOVE files FROM '' WHERE extension = '(docx|doc|pdf)' TO 'documents'
MOVE files FROM '' WHERE extension = '(pptx|ppt)' TO 'presentations'
MOVE files FROM '' WHERE extension = '(xlsx|xls)' TO 'spreadsheets'
```

For more information on how to use <b>sortQL</b>, please refer to the [documentation](./docs/documentation.md).

# Quick Start

## Prerequisites

Before you begin, ensure you have installed Node.js:

- [Node.js](https://nodejs.org/en/download/)

This project also depends on the bun runtime. You can install it by running the following command:

```bash
curl -fsSL https://bun.sh/install | bash
```

## Installation

To install <b>sortQL</b>, run the following command:

```bash
npm install -g npx @sortql/sortql-cli
```

This will install <b>sortQL</b> globally on your computer, allowing you to run it from any directory.

## Usage

### 1. Create a queries.sql file

Before running <b>sortQL</b>, you need to create the queries.sql file. In this file, we're going to specify a set of operations to be executed. You can create it anywhere you like: in a project directory, in a subfolder, or even on your desktop.

Here's and example of a queries.sql file:

```sql
-- Example: Selecting all folders and files from the directory
SELECT files FROM ''
```

### 2. Run sortQL

Now that you have the queries.sql file, you can run <b>sortQL</b> from the terminal. Simply run the following command:

```bash
npx sortql
```

### 3. Where is your queries.sql file located?

Upon start, you will be prompted to specify a path to the queries.sql file. Simply enter the full path to the file, or drag and drop the file into the terminal.

```bash
? Where is your queries.sql file located? '/Users/username/Desktop/queries.sql'
```

### 4. Where do you want to run the queries?

Next, you will be prompted to enter a directory where you want to run the queries. This can be any directory on your computer, such as your desktop, documents folder, or a subfolder within a project directory.

```bash
? Where do you want to run the queries? '/Users/username/Desktop/messy-folder'
```

### 5. Want to watch for changes?

Addtionally, you can specify if you want to watch for changes. This will automatically re-run the queries whenever a file or directory is added, removed, or modified.

```bash
? Do you want to watch the directory for changes and rerun queries? (y/N) y
```

> [!NOTE]
> Once you press enter, <b>sortQL</b> will save your configuration in `~/.sortql`. This will allow you to run <b>sortQL</b> without having to specify the path to the queries.sql file and the directory every time you run it. To change the configuration, simply run `npx sortql --config`.

After saving the configuration, <b>sortQL</b> will start running the queries and display the results in the terminal.

### You're all set!

That's it. Feel free to play around with the queries.sql file and see how <b>sortQL</b> behaves. In case you need to stop the process, simply enter <kbd>CTRL</kbd> + <kbd>C</kbd> in the terminal.

# Updating

To update <b>sortQL</b> to the latest version, simply run the following command:

```bash
npm update -g @sortql/sortql-cli
```

# Documentation

For more information on how to use <b>sortQL</b>, please refer to the [documentation](./docs/documentation.md). It provides a detailed overview of the query syntax, supported operations, and properties as well as some examples on how you might use <b>sortQL</b> in your projects.

# Troubleshooting

If you encounter any issues while using <b>sortQL</b>, please create an issue [here](https://github.com/leonmeka/sortql/issues/new).

# Contributing

To contribute to this project, please take a look at the [contributing](contributing.md) guidelines.

# License

<b>sortQL</b> is open-source software licensed under the MIT License. See the [License](LICENSE) file for more information.
