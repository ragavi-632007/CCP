# Rural Minds - Educational Platform for Rural Communities

## Overview

Rural Minds is a full-stack web application built with modern technologies to empower rural communities through digital literacy education. The application provides access to educational modules, government schemes information, community forums, and live data about agriculture and government programs, all available in both English and Tamil languages.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for fast development and optimized builds
- **Internationalization**: react-i18next for English/Tamil language support

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Authentication**: Passport.js with local strategy and bcrypt password hashing
- **Session Management**: Express sessions with PostgreSQL session store

## Key Components

### Authentication System
- JWT-free session-based authentication using Passport.js
- Secure password hashing with bcrypt
- Role-based access control (admin/user roles)
- Protected routes with middleware
- Session persistence in PostgreSQL

### Database Schema
- **Users**: Authentication, profile info, language preferences, admin flags
- **Modules**: Educational content with multilingual support (English/Tamil)
- **User Progress**: Tracking completion and watch time for modules
- **Forum System**: Posts and comments with categorization and likes
- **Feedback**: User feedback collection with ratings and categories
- **Government Schemes**: Information about available government programs

### UI Component System
- Comprehensive component library using shadcn/ui
- Consistent design system with CSS custom properties
- Responsive design with mobile-first approach
- Dark/light theme support through CSS variables
- Accessible components built on Radix UI primitives

### Internationalization
- Complete bilingual support (English/Tamil)
- Context-based language switching
- Persistent language preferences
- Localized content for all user-facing text

## Data Flow

### Client-Server Communication
1. Frontend makes API requests to Express backend
2. TanStack Query manages caching and synchronization
3. Express routes handle business logic and database operations
4. Drizzle ORM translates operations to PostgreSQL queries
5. Response data flows back through the same chain

### Authentication Flow
1. User submits credentials to `/api/login`
2. Passport.js validates against database
3. Session created and stored in PostgreSQL
4. Frontend receives user data and updates auth context
5. Protected routes check authentication status

### Content Management
1. Educational modules stored with multilingual content
2. User progress tracked per module
3. Forum posts and comments with real-time updates
4. Government schemes data fetched from external APIs

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **passport**: Authentication middleware
- **bcryptjs**: Password hashing
- **react-i18next**: Internationalization

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **react-hook-form**: Form handling
- **zod**: Schema validation

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type safety
- **drizzle-kit**: Database migrations
- **eslint/prettier**: Code quality (implied)

## Deployment Strategy

### Production Build
- Vite builds optimized frontend bundle
- esbuild compiles TypeScript backend to ESM
- Static assets served from `dist/public`
- Server runs as Node.js application

### Database Management
- PostgreSQL hosted on Neon (serverless)
- Drizzle Kit handles schema migrations
- Connection pooling for performance
- Environment-based configuration

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `NODE_ENV`: Environment detection
- Development vs production configurations

### Session Storage
- PostgreSQL-backed session store
- Automatic session table creation
- 24-hour session expiration
- Secure cookie configuration

The application is designed to be deployed on platforms like Replit, Vercel, or similar services that support Node.js applications with PostgreSQL databases. The modular architecture allows for easy scaling and maintenance while providing a robust educational platform for rural communities.