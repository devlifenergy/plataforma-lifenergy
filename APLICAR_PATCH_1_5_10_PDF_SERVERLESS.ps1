$ErrorActionPreference = "Stop"
Write-Host "Aplicando patch PDF serverless da Biblioteca Tecnica..." -ForegroundColor Cyan

npm uninstall pdf-parse
npm install unpdf@^1.8.1

if (Test-Path ".next") {
  Remove-Item -Recurse -Force ".next"
}

npm run build

Write-Host ""
Write-Host "Patch aplicado e build concluido." -ForegroundColor Green
Write-Host "Agora teste localmente antes de publicar no Sandbox." -ForegroundColor Yellow
