# Contributing

If you have an idea for a new feature or want to report a bug, please create an issue to discuss it. If you want to contribute code, please follow the workflow below.

## Workflow

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Write tests for your changes
5. Open a pull request
6. Wait for the pull request to be reviewed

Once the pull request has been reviewed, it will be merged into the main branch and the changes will be reflected in the next release.

# Getting Started

To get started with this project, you will need to install the necessary dependencies and run the project in development mode. This guide will walk you through the process.

## Prerequisites

### Node.js

This project requires Node.js to be installed. If you don't have Node.js installed, you can download it from the official website: [nodejs.org](https://nodejs.org/).

## Installation

Next, you will need to clone the repository and install the dependencies.

### Clone the Repository

```bash
git clone [your-fork-url]
```

### Install Dependencies

```bash
cd [project-name]
npm install
```

## Development

Once you have cloned the repository and installed the dependencies, you can start developing by running the following command:

```bash
npm run dev
```

This will start the cli in development mode, allowing you to make changes and see the results in real-time.

## Testing

We're using Jest for testing. To run the tests, simply run the following command:

```bash
npm run test
```

This will run all tests (\*.spec.ts files) and prints the overall test coverage across the codebase. We aim for 100% coverage here.

## Building

To build the project, run the following command:

```bash
npm run build
```
