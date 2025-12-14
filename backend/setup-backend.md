# Backend Setup Instructions

## 1. Create .env file

Create a file named `.env` in the `backend` directory with this content:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/sweetshop?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

**Important:** Replace `postgres:password` with your actual PostgreSQL username and password.

## 2. Set up Database

Make sure PostgreSQL is running and create the database:

```sql
CREATE DATABASE sweetshop;
```

## 3. Run Migrations

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

## 4. Start Backend Server

```bash
npm run start:dev
```

The backend will run on http://localhost:3000




