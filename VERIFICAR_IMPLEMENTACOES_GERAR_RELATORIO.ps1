Write-Host ""
Write-Host "==============================================="
Write-Host "Verificacao - Implementacoes Gerar Relatorio"
Write-Host "==============================================="
Write-Host ""

$root = Get-Location
$patterns = @(
  "GenerateReportButton",
  "Gerando relatório",
  "Gerando relatorio",
  "/api/reports/lifenergy-v1",
  "data-report-button-version"
)

$excluded = @("\node_modules\", "\.next\", "\.git\")

foreach ($pattern in $patterns) {
  Write-Host ""
  Write-Host "Procurando: $pattern"
  Write-Host "-----------------------------------------------"

  Get-ChildItem -Path $root -Recurse -File `
    -Include *.ts,*.tsx,*.js,*.jsx `
    | Where-Object {
        $full = $_.FullName
        -not ($excluded | Where-Object { $full.Contains($_) })
      } `
    | Select-String -Pattern $pattern -SimpleMatch `
    | ForEach-Object {
        $relative = $_.Path.Replace($root.Path + "\", "")
        Write-Host "$relative:$($_.LineNumber): $($_.Line.Trim())"
      }
}

Write-Host ""
Write-Host "Resultado esperado:"
Write-Host "- components\application\GenerateReportButton.tsx deve conter data-report-button-version=""1.3.8""."
Write-Host "- A tela de Avaliados deve importar e usar <GenerateReportButton ... />."
Write-Host "- Nao deve existir outro botao independente com texto 'Gerando relatório...' chamando /api/reports/lifenergy-v1 diretamente."
Write-Host ""
