Write-Host ""
Write-Host "==============================================="
Write-Host "Verificacao - Release 1.5.1 PDI"
Write-Host "==============================================="
Write-Host ""

$checks = @(
  @{ Path = "package.json"; Pattern = '"version": "1.5.1"' },
  @{ Path = "components\application\CorporateDocumentForm.tsx"; Pattern = 'Arquivo do documento *' },
  @{ Path = "components\application\CorporateDocumentForm.tsx"; Pattern = 'Lendo documento com IA...' },
  @{ Path = "services\pdi\corporateDocumentAI.ts"; Pattern = 'generateCorporateDocumentSummary' },
  @{ Path = "components\application\GeneratePdiButton.tsx"; Pattern = 'const PDI_BUTTON_VERSION = "1.5.1";' },
  @{ Path = "app\painel\pdi\page.tsx"; Pattern = 'FieldHelp' },
  @{ Path = "app\painel\pdi\page.tsx"; Pattern = 'Status IA' }
)

foreach ($check in $checks) {
  Write-Host ""
  Write-Host "Arquivo: $($check.Path)"
  Select-String -Path $check.Path -Pattern $check.Pattern -SimpleMatch
}

Write-Host ""
Write-Host "Conferencia manual obrigatoria:"
Write-Host "- A tela PDI nao deve exibir o campo 'Conteúdo do documento para uso da IA'."
Write-Host "- A lista de documentos nao deve exibir o sumario interno."
Write-Host "- Os botoes Gerar PDI Relacional e Gerar PDI Corporativo devem estar alinhados."
Write-Host ""
