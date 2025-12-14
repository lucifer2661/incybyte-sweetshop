# Create .env file for backend
$envContent = @"
DATABASE_URL="postgresql://postgres:password@localhost:5432/sweetshop?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars-long"
PORT=3000
FRONTEND_URL="http://localhost:5173"
"@

$envPath = Join-Path $PSScriptRoot ".env"

if (Test-Path $envPath) {
    Write-Host ".env file already exists. Skipping creation."
} else {
    $envContent | Out-File -FilePath $envPath -Encoding utf8
    Write-Host ".env file created at: $envPath"
    Write-Host ""
    Write-Host "IMPORTANT: Please edit .env and update:"
    Write-Host "  - DATABASE_URL with your PostgreSQL credentials"
    Write-Host "  - JWT_SECRET with a secure random string (at least 32 characters)"
}




