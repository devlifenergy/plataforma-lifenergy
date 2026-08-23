Write-Host ""
Write-Host "==============================================="
Write-Host "Verificacao - Release 1.5.0 PDI Biblioteca"
Write-Host "==============================================="
Write-Host ""

$checks = @(
  @{ Path = "package.json"; Pattern = '"version": "1.5.0"' },
  @{ Path = "components\layout\CompanyShell.tsx"; Pattern = 'PDI' },
  @{ Path = "app\painel\pdi\page.tsx"; Pattern = 'Biblioteca Corporativa Inteligente' },
  @{ Path = "services\pdi\corporateKnowledge.ts"; Pattern = 'MANDATORY_CORPORATE_PDI_DOCUMENT_CATEGORIES' },
  @{ Path = "services\pdi\lifenergyPdiTypes.ts"; Pattern = 'lifenergy_pdi_v3_0_1_5_0' },
  @{ Path = "components\application\GeneratePdiButton.tsx"; Pattern = 'const PDI_BUTTON_VERSION = "1.5.0";' },
  @{ Path = "banco\migrations\RELEASE_1_5_0_BIBLIOTECA_CORPORATIVA_PDI.sql"; Pattern = 'organization_documents' }
)

foreach ($check in $checks) {
  Write-Host ""
  Write-Host "Arquivo: $($check.Path)"
  Select-String -Path $check.Path -Pattern $check.Pattern -SimpleMatch
}

Write-Host ""
Write-Host "Conferencia importante:"
Write-Host "- A tela Avaliados nao deve mais ter GeneratePdiButton."
Select-String -Path "app\painel\entrevistados\page.tsx" -Pattern "GeneratePdiButton" -SimpleMatch
Write-Host ""
Write-Host "Se a linha acima nao retornar resultado, a remocao esta correta."
Write-Host ""
