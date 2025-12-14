@echo off
echo ========================================
echo Backend Quick Start Script
echo ========================================
echo.

cd /d "%~dp0"

echo Step 1: Creating .env file...
if not exist .env (
    echo DATABASE_URL="postgresql://postgres:password@localhost:5432/sweetshop?schema=public" > .env
    echo JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars" >> .env
    echo PORT=3000 >> .env
    echo FRONTEND_URL="http://localhost:5173" >> .env
    echo .env file created!
    echo.
    echo IMPORTANT: Edit .env and update DATABASE_URL with your PostgreSQL credentials!
    echo.
    pause
) else (
    echo .env file already exists.
)

echo.
echo Step 2: Checking if database migrations are needed...
if not exist "prisma\migrations" (
    echo Running database migrations...
    call npx prisma migrate dev --name init
    call npx prisma generate
) else (
    echo Migrations already exist. Skipping...
)

echo.
echo Step 3: Starting backend server...
echo Backend will run on http://localhost:3000
echo.
npm run start:dev




