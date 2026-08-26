Write-Host ""
Write-Host "==============================================="
Write-Host "Verificacao - Release 1.5.3 PDI"
Write-Host "==============================================="
Write-Host ""

$checks = @(
  @{ Path = "package.json"; Pattern = '"version": "1.5.3"' },
  @{ Path = "app\painel\page.tsx"; Pattern = 'href="/painel/pdi"' },
  @{ Path = "app\painel\pdi\page.tsx"; Pattern = 'Fazer Download' },
  @{ Path = "app\painel\pdi\page.tsx"; Pattern = 'Gerar novo PDI Corporativo' },
  @{ Path = "components\application\GeneratePdiButton.tsx"; Pattern = 'const PDI_BUTTON_VERSION = "1.5.3";' },
  @{ Path = "services\pdi\lifenergyPdiTypes.ts"; Pattern = 'lifenergy_pdi_v3_1_1_5_3' },
  @{ Path = "services\pdi\lifenergyPdiDocx.ts"; Pattern = '4.2 e 4.3 – Pontos Fortes e Oportunidades de Melhoria' },
  @{ Path = "banco\migrations\RELEASE_1_5_3_DOCUMENTOS_CORPORATIVOS_DOWNLOAD_REGERAR.sql"; Pattern = 'file_content_base64' }
)

foreach ($check in $checks) {
  Write-Host ""
  Write-Host "Arquivo: $($check.Path)"
  Select-String -Path $check.Path -Pattern $check.Pattern -SimpleMatch
}

Write-Host ""
Write-Host "Conferencia manual obrigatoria:"
Write-Host "- A coluna Status IA nao deve aparecer na tela PDI."
Write-Host "- O PDI Corporativo deve gerar DOCX com a secao 1 sem bullets e sem secao 2.1."
Write-Host ""
