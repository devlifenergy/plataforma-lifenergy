Write-Host ""
Write-Host "==============================================="
Write-Host "Verificacao - PDI 1.4.1"
Write-Host "==============================================="
Write-Host ""

$checks = @(
  @{ Path = "package.json"; Pattern = '"version": "1.4.1"' },
  @{ Path = "services\pdi\lifenergyPdiTypes.ts"; Pattern = 'lifenergy_pdi_v2_0_1_4_1' },
  @{ Path = "services\pdi\lifenergyPdiDocx.ts"; Pattern = 'SEÇÃO 2 – OBJETIVO CENTRAL DO PDI' },
  @{ Path = "services\pdi\lifenergyPdiDocx.ts"; Pattern = 'SEÇÃO 6 – PLANO DE AÇÃO 70-20-10' },
  @{ Path = "services\pdi\lifenergyPdiDocx.ts"; Pattern = 'SEÇÃO 7 – INDICADORES E EVIDÊNCIAS DE EVOLUÇÃO' },
  @{ Path = "components\application\GeneratePdiButton.tsx"; Pattern = 'const PDI_BUTTON_VERSION = "1.4.1";' }
)

foreach ($check in $checks) {
  Write-Host ""
  Write-Host "Arquivo: $($check.Path)"
  Select-String -Path $check.Path -Pattern $check.Pattern -SimpleMatch
}

Write-Host ""
Write-Host "Conferencia manual obrigatoria:"
Write-Host "- O PDI gerado nao deve conter o campo 'Objetivo de participação'."
Write-Host "- O PDI gerado deve conter Objetivo central do PDI, Plano 70-20-10 e Indicadores SMART."
Write-Host ""
