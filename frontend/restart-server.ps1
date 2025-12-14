# Stop any process on port 5173
$processes = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
if ($processes) {
    $processes | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
    Write-Host "Stopped processes on port 5173"
    Start-Sleep -Seconds 2
}

# Start the dev server
Write-Host "Starting dev server..."
npm run dev

