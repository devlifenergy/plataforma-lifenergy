Write-Host ""
Write-Host "==============================================="
Write-Host "Verificacao - Release 1.5.7"
Write-Host "==============================================="
Write-Host ""

$checks = @(
  @{ Path = "package.json"; Pattern = '"version": "1.5.7"' },
  @{ Path = "services\pdi\lifenergyPdiTypes.ts"; Pattern = 'lifenergy_pdi_v4_0_1_5_7' },
  @{ Path = "services\pdi\lifenergyPdiDocx.ts"; Pattern = 'buildHeaderXml' },
  @{ Path = "services\pdi\lifenergyPdiDocx.ts"; Pattern = 'actionPlanBlock' },
  @{ Path = "services\pdi\lifenergyPdiDocx.ts"; Pattern = '70% – Prática' },
  @{ Path = "components\application\GeneratePdiButton.tsx"; Pattern = 'Gerar um novo PDI Corporativo' },
  @{ Path = "app\painel\pdi\page.tsx"; Pattern = 'Gerar um novo PDI Corporativo' },
  @{ Path = "components\application\CorporateDocumentForm.tsx"; Pattern = 'Selecionar arquivo' },
  @{ Path = "components\application\CorporateDocumentForm.tsx"; Pattern = 'Nenhum arquivo selecionado' },
  @{ Path = "app\painel\biblioteca\page.tsx"; Pattern = 'Selecionar arquivo atualizado' },
  @{ Path = "services\pdi\actions.ts"; Pattern = 'documentTitleForCategory' }
)

foreach ($check in $checks) {
  Write-Host ""
  Write-Host "Arquivo: $($check.Path)"
  Select-String -Path $check.Path -Pattern $check.Pattern -SimpleMatch
}

Write-Host ""
Write-Host "Conferencia manual:"
Write-Host "- Confirmar que nao existe campo 'Nome do documento' na tela Biblioteca."
Write-Host "- Gerar novo PDI Corporativo e conferir o DOCX contra o modelo anexado."
Write-Host ""
