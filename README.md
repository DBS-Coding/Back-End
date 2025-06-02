# HistoTalk - Backend

This project is part of the Capstone Project for 2025 and is focused on building a backend application using Node.js with TypeScript. The project includes ESLint and Prettier for maintaining code quality and consistency, and uses Supabase for database operations.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Sample JSON](#sample-json)
- [License](#license)

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/DBS-Coding/Back-End
   cd Back-End
   ```

2. Install the dependencies:

   ```bash
   bun install
   ```

   This will install both the project dependencies and the development tools, including Prettier, ESLint, TypeScript, and other necessary packages.

3. Set up environment variables:
   - Create a `.env` file based on `.env.example`
   - Add your Supabase credentials and JWT secret

## Usage

To start the application, run the following command:

```bash
bun run start
```

This will start the application using the built `index.js` file.

## Development

During development, you can run the application in watch mode with:

```bash
bun run dev
```

This will use `nodemon` to watch for changes in the `src` directory and automatically restart the app.

For database migrations, use:

```bash
bun run migrate
```

## Scripts

The following NPM scripts are available:

- `bun run start`: Runs the application in production mode.
- `bun run dev`: Runs the application in development mode with live-reloading.
- `bun run build`: Compiles the TypeScript code into JavaScript using `tsc`.
- `bun run lint`: Runs ESLint to lint the code.
- `bun run format`: Formats the code using Prettier.
- `bun run migrate`: Runs Supabase database migrations.

## Dependencies

### Peer Dependencies:
- `typescript@^5.8.3`: The TypeScript version used for compiling the project.

### Development Dependencies:
- `@eslint/js@^9.25.1`: ESLint's default rules
- `eslint@^9.25.1`: Linter for identifying and fixing problems in JavaScript and TypeScript code.
- `eslint-plugin-prettier@^5.2.6`: ESLint plugin to run Prettier as a rule.
- `eslint-config-prettier@^10.1.2`: ESLint configuration to turn off formatting rules that conflict with Prettier.
- `ts-node@^10.9.2`: A TypeScript execution engine for Node.js.
- `nodemon@^3.1.10`: A tool that automatically restarts the server on code changes.
- `tsx@^4.19.3`: A fast and simple way to run TypeScript files.
- `prettier@^3.5.3`: Code formatter for ensuring consistent code style.

### Production Dependencies:
- `@hapi/hapi@^21.4.0`: A powerful and flexible web framework for Node.js.
- `@hapi/joi@^17.1.1`: Schema validation library.
- `@supabase/supabase-js@^2.49.4`: Supabase client library.
- `bcrypt@^6.0.0`: Password hashing library.
- `jsonwebtoken@^9.0.2`: JWT implementation.
- `dotenv@^16.5.0`: Environment variable loader.
- `cors@^2.8.5`: CORS middleware.

## Configuration

### ESLint Configuration
The ESLint configuration is included in the `.eslintrc.json` file. The project uses the recommended ESLint rules and integrates Prettier for formatting.

### Prettier Configuration
The Prettier configuration is defined in the `.prettierrc` file, ensuring consistent code formatting across the project.

### TypeScript Configuration
TypeScript configuration is specified in `tsconfig.json`.

## API Documentation

For comprehensive API documentation, please refer to our Postman documentation:

[![Postman API Documentation](https://img.shields.io/badge/Postman-API_Documentation-orange?style=flat-square)](https://documenter.getpostman.com/view/22804089/2sB2qWJ4qr)

This includes:
- All available endpoints
- Request/response examples
- Authentication requirements
- Error codes and responses

## Sample JSON

The API uses JSON for request and response bodies. Here are some examples:

### Authentication Request
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

### User Registration Response
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "created_at": "2025-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Invalid email format"
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Key improvements made:
1. Added **API Documentation** section with Postman badge/link
2. Added **Sample JSON** section with request/response examples
3. Included all dependencies from your package.json
4. Added migration script documentation
5. Better organized the dependencies section with version numbers
6. Added environment setup instructions
7. Improved overall structure and readability
8. Added TypeScript configuration mention
9. Included specific examples of JSON payloads
