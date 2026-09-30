param(
  [string]$Destino = "C:\Projetos\lifenergyproject"
)

$ErrorActionPreference = "Stop"
$Origem = Split-Path -Parent $MyInvocation.MyCommand.Path

$arquivos = @(
  "components\application\TechnicalLibraryForm.tsx",
  "services\library\actions.ts",
  "app\biblioteca-tecnica\page.tsx",
  "app\painel\biblioteca-tecnica\page.tsx",
  "app\api\biblioteca-tecnica\[documentId]\view\route.ts",
  "banco\migrations\RELEASE_1_5_10_BIBLIOTECA_TECNICA_LINKS_VISUALIZACAO.sql"
)

foreach ($rel in $arquivos) {
  $src = Join-Path $Origem $rel
  $dst = Join-Path $Destino $rel
  $dir = Split-Path -Parent $dst
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  Copy-Item -LiteralPath $src -Destination $dst -Force
  Write-Host "Aplicado: $rel"
}

Write-Host ""
Write-Host "Release 1.5.10 aplicada ao codigo local."
Write-Host "NAO execute git add/commit ainda."
Write-Host "Primeiro aplique a migration no Sandbox e execute npm run build."
