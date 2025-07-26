# VS Code Setup Guide for Rural Minds

This guide will help you set up and run the Rural Minds educational platform in VS Code locally.

## Prerequisites

Before setting up the project, ensure you have the following installed:

### Required Software

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **VS Code**
   - Download from: https://code.visualstudio.com/

3. **PostgreSQL** (v14 or higher)
   - Download from: https://www.postgresql.org/download/
   - Or use a cloud service like Neon DB (https://neon.tech/)

### Recommended VS Code Extensions

Install these extensions for the best development experience:

1. **TypeScript and JavaScript Language Features** (built-in)
2. **ES7+ React/Redux/React-Native snippets** (`dsznajder.es7-react-js-snippets`)
3. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
4. **Auto Rename Tag** (`formulahendry.auto-rename-tag`)
5. **Prettier - Code formatter** (`esbenp.prettier-vscode`)
6. **ESLint** (`dbaeumer.vscode-eslint`)
7. **PostgreSQL** (`ms-ossdata.vscode-postgresql`)
8. **Thunder Client** (`rangav.vscode-thunder-client`) - for API testing

## Project Setup

### 1. Clone and Navigate to Project

```bash
# If you have the project files locally, navigate to the project directory
cd path/to/rural-minds-project
```

### 2. Install Dependencies

```bash
# Install all project dependencies
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/rural_minds"

# Session Configuration
SESSION_SECRET="your-super-secret-session-key-here"

# Environment
NODE_ENV="development"

# PostgreSQL Connection (for Drizzle Kit)
PGHOST="localhost"
PGPORT="5432"
PGUSER="your_username"
PGPASSWORD="your_password"
PGDATABASE="rural_minds"
```

### 4. Database Setup

#### Option A: Local PostgreSQL

1. Create a new database:
```bash
createdb rural_minds
```

2. Push the database schema:
```bash
npm run db:push
```

#### Option B: Neon DB (Cloud)

1. Sign up at https://neon.tech/
2. Create a new project
3. Copy the connection string to your `.env` file
4. Run the schema push:
```bash
npm run db:push
```

### 5. VS Code Configuration

Create a `.vscode/settings.json` file for project-specific settings:

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["className\\s*=\\s*['\"]([^'\"]*)['\"]", "([a-zA-Z0-9\\-:]+)"]
  ],
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

Create a `.vscode/launch.json` file for debugging:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Development Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server/index.ts",
      "env": {
        "NODE_ENV": "development"
      },
      "runtimeArgs": ["-r", "tsx/cjs"],
      "console": "integratedTerminal",
      "restart": true,
      "protocol": "inspector"
    }
  ]
}
```

## Running the Application

### Development Mode

1. **Start the development server:**
```bash
npm run dev
```

This command will:
- Start the Express backend on port 5000
- Start the Vite frontend development server
- Enable hot reloading for both frontend and backend

2. **Access the application:**
- Frontend: http://localhost:5000 (served by Express with Vite integration)
- The app will automatically open in your default browser

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run database migrations
npm run db:push

# Generate database types
npm run db:generate

# Run TypeScript checks
npm run type-check
```

## Project Structure

```
rural-minds/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   └── App.tsx         # Main app component
│   └── index.html
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── auth.ts            # Authentication logic
│   ├── storage.ts         # Database operations
│   └── db.ts              # Database connection
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema definitions
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Development Workflow

### 1. Making Changes

- **Frontend changes**: Edit files in `client/src/` - hot reloading will update the browser
- **Backend changes**: Edit files in `server/` - the server will restart automatically
- **Database changes**: Update `shared/schema.ts` and run `npm run db:push`

### 2. Adding New Features

1. **Database changes**: Add new tables/columns to `shared/schema.ts`
2. **Backend**: Add API routes in `server/routes.ts`
3. **Frontend**: Create new pages/components in `client/src/`

### 3. Testing the Application

1. **Register a new user**: Go to `/auth` and create an account
2. **Test modules**: Check video playback and download functionality
3. **Test forum**: Create posts and comments
4. **Test admin**: Login with admin account to access dashboard
5. **Test languages**: Switch between English and Tamil

## Common Issues and Solutions

### 1. Database Connection Issues

**Problem**: `ECONNREFUSED` or database connection errors

**Solution**:
- Ensure PostgreSQL is running
- Check your `.env` file configuration
- Verify database credentials
- For local setup: `brew services start postgresql` (macOS) or `sudo service postgresql start` (Linux)

### 2. Port Already in Use

**Problem**: `Port 5000 is already in use`

**Solution**:
- Kill the process using the port: `lsof -ti:5000 | xargs kill -9`
- Or change the port in `server/index.ts`

### 3. TypeScript Errors

**Problem**: Type errors in VS Code

**Solution**:
- Run `npm run type-check` to see all TypeScript issues
- Ensure all dependencies are installed: `npm install`
- Restart VS Code TypeScript service: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### 4. Tailwind CSS Not Working

**Problem**: Tailwind classes not applying

**Solution**:
- Ensure Tailwind CSS IntelliSense extension is installed
- Check that `tailwind.config.ts` is properly configured
- Restart the development server

## Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

### API Testing
Use Thunder Client extension or Postman to test API endpoints:
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/modules` - Get modules
- `GET /api/schemes` - Get government schemes

### Database Management
Use the PostgreSQL extension in VS Code or a GUI tool like:
- pgAdmin
- DBeaver
- TablePlus

## Troubleshooting

If you encounter any issues:

1. **Check the console logs** in VS Code terminal
2. **Verify environment variables** in `.env` file
3. **Ensure all dependencies are installed**: `npm install`
4. **Clear node_modules and reinstall**: `rm -rf node_modules package-lock.json && npm install`
5. **Check database connection**: Test with `npm run db:push`

For additional help, refer to the project documentation or check the GitHub repository issues.