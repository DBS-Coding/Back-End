# Capstone Project 2025 - Backend

This project is part of the Capstone Project for 2025 and is focused on building a backend application using Node.js with TypeScript. The project includes ESLint and Prettier for maintaining code quality and consistency.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Configuration](#configuration)
- [License](#license)

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

   This will install both the project dependencies and the development tools, including Prettier, ESLint, TypeScript, and other necessary packages.

## Usage

To start the application, run the following command:

```bash
npm run start
```

This will start the application using the built `index.js` file.

## Development

During development, you can run the application in watch mode with:

```bash
npm run dev
```

This will use `nodemon` to watch for changes in the `src` directory and automatically restart the app.

## Scripts

The following NPM scripts are available:

- `npm run start`: Runs the application in production mode.
- `npm run dev`: Runs the application in development mode with live-reloading.
- `npm run build`: Compiles the TypeScript code into JavaScript using `tsc`.
- `npm run lint`: Runs ESLint to lint the code.
- `npm run format`: Formats the code using Prettier.

## Dependencies

### Peer Dependencies:
- `typescript`: The TypeScript version used for compiling the project.

### Development Dependencies:
- `prettier`: Code formatter for ensuring consistent code style.
- `eslint`: Linter for identifying and fixing problems in JavaScript and TypeScript code.
- `eslint-plugin-prettier`: ESLint plugin to run Prettier as a rule.
- `eslint-config-prettier`: ESLint configuration to turn off formatting rules that conflict with Prettier.
- `ts-node`: A TypeScript execution engine for Node.js.
- `nodemon`: A tool that automatically restarts the server on code changes.
- `tsx`: A fast and simple way to run TypeScript files.

### Production Dependencies:
- `@hapi/hapi`: A powerful and flexible web framework for Node.js.
- `@types/joi`: TypeScript types for Joi, a schema validation library.
- `@types/bun`: TypeScript types for Bun.

## Configuration

### ESLint Configuration
The ESLint configuration is included in the `.eslintrc.json` file. The project uses the recommended ESLint rules and integrates Prettier for formatting.

### Prettier Configuration
The Prettier configuration is defined in the `.prettierrc` file, ensuring consistent code formatting across the project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

### Explanation:
1. **Installation**: This section describes how to set up the project locally.
2. **Usage**: Describes how to run the project, both in development and production modes.
3. **Scripts**: Lists the npm scripts available for running, building, linting, and formatting the project.
4. **Dependencies**: Provides information on the dependencies used, both for development and production.
5. **Configuration**: Mentions where ESLint and Prettier configurations are stored.
6. **License**: Placeholder for any licensing information.