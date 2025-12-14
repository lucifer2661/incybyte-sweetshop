# Quick Start Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Setup Steps

### 1. Database Setup
```bash
# Create PostgreSQL database
createdb sweetshop

# Or using psql:
psql -U postgres
CREATE DATABASE sweetshop;
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy and edit .env file
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npx prisma migrate dev --name init
npx prisma generate

# Start backend (runs on http://localhost:3000)
npm run start:dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Optional: Create .env file
echo "VITE_API_URL=http://localhost:3000" > .env

# Start frontend (runs on http://localhost:5173)
npm run dev
```

### 4. Access the Application
- Open http://localhost:5173 in your browser
- Register a new account
- Login and start managing sweets!

## Creating an Admin User

To create an admin user, you can either:

1. **Via Prisma Studio:**
```bash
cd backend
npx prisma studio
# Navigate to User table and change role to ADMIN
```

2. **Via SQL:**
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## Running Tests

### Backend Tests
```bash
cd backend
npm test              # Unit tests
npm run test:cov      # With coverage
npm run test:e2e      # E2E tests
```

### Frontend Tests
```bash
cd frontend
npm test              # Run tests
npm run test:ui       # With UI
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in backend/.env
- Verify database exists

### Port Conflicts
- Backend default: 3000 (change in .env)
- Frontend default: 5173 (change in vite.config.ts)

### CORS Issues
- Ensure FRONTEND_URL in backend/.env matches frontend URL
- Check browser console for CORS errors

### JWT Issues
- Ensure JWT_SECRET is set in backend/.env
- Clear localStorage if tokens are invalid

