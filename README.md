# Sweet Shop Management System

A production-quality full-stack application for managing a sweet shop inventory, built with Test-Driven Development (TDD) principles, featuring secure authentication, role-based access control, and a modern user interface.

## 🎯 Project Overview

This is an interview-grade kata demonstrating:
- **TDD Discipline**: All backend logic follows Red-Green-Refactor cycle
- **Clean Architecture**: Modular, maintainable codebase
- **Security**: JWT authentication with role-based authorization
- **Modern Stack**: NestJS backend + React frontend
- **Comprehensive Testing**: Unit, integration, and E2E tests

## 🏗️ Architecture

### Backend (NestJS + TypeScript + PostgreSQL)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport.js
- **Testing**: Jest + Supertest
- **API**: RESTful API with validation

### Frontend (React + TypeScript + Vite)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: React Router
- **HTTP Client**: Axios with interceptors
- **Testing**: Vitest + Testing Library

## 📋 Features

### Authentication
- User registration and login
- JWT token-based authentication
- Secure password hashing with bcrypt
- Role-based access control (USER | ADMIN)

### Sweets Management
- Create, read, update, and delete sweets
- Search and filter by name, category, and price range
- Admin-only delete functionality
- Business rule validation (positive prices, non-negative quantities)

### Inventory Management
- Purchase sweets (decreases quantity)
- Restock sweets (admin-only, increases quantity)
- Purchase button disabled when quantity is zero
- Real-time inventory updates

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/sweetshop?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

4. Set up the database:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Run the backend:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional, defaults to `http://localhost:3000`):
```env
VITE_API_URL=http://localhost:3000
```

4. Run the frontend:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🧪 Testing

### Backend Tests

Run all tests:
```bash
cd backend
npm test
```

Run with coverage:
```bash
npm run test:cov
```

Run E2E tests:
```bash
npm run test:e2e
```

### Frontend Tests

Run all tests:
```bash
cd frontend
npm test
```

Run with UI:
```bash
npm run test:ui
```

## 📡 API Endpoints

### Authentication (Public)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Sweets (JWT Protected)
- `POST /api/sweets` - Create a new sweet
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search?name=&category=&minPrice=&maxPrice=` - Search sweets
- `GET /api/sweets/:id` - Get sweet by ID
- `PUT /api/sweets/:id` - Update a sweet
- `DELETE /api/sweets/:id` - Delete a sweet (ADMIN only)

### Inventory (JWT Protected)
- `POST /api/sweets/:id/purchase` - Purchase a sweet
- `POST /api/sweets/:id/restock` - Restock a sweet (ADMIN only)

## 🔒 Business Rules

- Price must be positive
- Quantity cannot be negative
- Purchase fails if quantity is zero
- Only ADMIN users can delete or restock sweets
- JWT required for all protected routes

## 📁 Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── sweets/          # Sweets CRUD module
│   │   ├── inventory/       # Inventory management
│   │   ├── common/          # Shared guards, decorators, filters
│   │   ├── prisma/          # Prisma service and module
│   │   └── main.ts          # Application entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── test/                # E2E tests
│
└── frontend/
    ├── src/
    │   ├── pages/           # Page components
    │   ├── lib/             # API client and utilities
    │   ├── test/            # Test setup
    │   ├── App.tsx          # Main app component
    │   └── main.tsx         # Entry point
    └── public/              # Static assets
```

## 🧪 TDD Approach

This project follows strict TDD principles:

1. **Red**: Write failing tests first
2. **Green**: Implement minimal code to pass tests
3. **Refactor**: Improve code while keeping tests green

All backend services and controllers have comprehensive test coverage, written before implementation.

## 🔐 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- Role-based authorization (RBAC)
- Input validation with class-validator
- CORS configuration
- Protected routes with guards

## 🎨 UI Features

- Modern, responsive design with Tailwind CSS
- Role-aware UI rendering
- Real-time inventory updates
- Search and filtering
- Modal dialogs for CRUD operations
- Disabled states for out-of-stock items
- Loading states and error handling

## 📝 My AI Usage

### Which AI Tools Were Used

This project was developed with the assistance of **ChatGPT** (via Cursor's AI integration) to accelerate development and ensure best practices.

### How They Were Used

1. **Code Generation**: AI assisted in generating boilerplate code for:
   - NestJS module structure (controllers, services, DTOs)
   - React components with TypeScript
   - Test files following TDD patterns
   - Configuration files (Prisma, Tailwind, Vite)

2. **Architecture Guidance**: AI provided recommendations for:
   - Project structure and organization
   - Authentication and authorization patterns
   - API design and RESTful conventions
   - State management with TanStack Query

3. **Best Practices**: AI helped ensure:
   - Proper error handling patterns
   - Security best practices (JWT, password hashing)
   - TypeScript type safety
   - Testing strategies and patterns

4. **Problem Solving**: AI assisted in:
   - Debugging configuration issues
   - Resolving dependency conflicts
   - Understanding framework-specific patterns
   - Implementing complex business logic

### Reflection on Impact

**Positive Impacts:**
- **Speed**: Significantly accelerated development, especially for boilerplate code
- **Quality**: Helped maintain consistency across the codebase
- **Learning**: Provided explanations that enhanced understanding of frameworks
- **Best Practices**: Ensured adherence to industry standards

**Considerations:**
- **Review Required**: All AI-generated code was carefully reviewed and tested
- **Understanding**: Code was not blindly copied; each piece was understood before integration
- **Customization**: AI suggestions were adapted to fit the specific requirements
- **Testing**: All code, regardless of source, was thoroughly tested

**Transparency:**
- All commits that used AI assistance include the co-author tag: `Co-authored-by: ChatGPT <AI@users.noreply.github.com>`
- This README section provides full transparency about AI usage

**Conclusion:**
AI was used as a powerful development assistant, similar to how developers use IDEs, linters, and documentation. It accelerated development while maintaining code quality and understanding. The final codebase represents a collaborative effort between human judgment and AI assistance, with all decisions and implementations ultimately validated through testing and review.

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Run database migrations: `npx prisma migrate deploy`
3. Build: `npm run build`
4. Start: `npm run start:prod`

### Frontend Deployment
1. Set `VITE_API_URL` to production API URL
2. Build: `npm run build`
3. Deploy `dist/` folder to your hosting service

## 📄 License

This project is created as an interview kata and demonstration of TDD practices.

## 👤 Author

Built as a technical interview demonstration showcasing:
- TDD discipline
- Full-stack development
- Clean architecture
- Security best practices
- Modern development workflows

---

**Note**: This is a demonstration project. For production use, ensure:
- Strong JWT secrets
- Database connection pooling
- Rate limiting
- Input sanitization
- Comprehensive error logging
- Monitoring and observability

