Write-Host ""
Write-Host "==============================================="
Write-Host "Verificacao - Release 1.5.5 Relatorio"
Write-Host "==============================================="
Write-Host ""

$checks = @(
  @{ Path = "package.json"; Pattern = '"version": "1.5.5"' },
  @{ Path = "services\reports\lifenergyV1Types.ts"; Pattern = 'lifenergy_v1_0_canonico_1_5_5' },
  @{ Path = "services\reports\lifenergyV1Prompt.ts"; Pattern = 'Não force arredondamento para múltiplos de 5' },
  @{ Path = "services\reports\lifenergyV1Prompt.ts"; Pattern = 'Socialização 82%, Reflexão 90%, Lazer 58%, Propósito 87%, Sentimento 91%' },
  @{ Path = "services\reports\lifenergyV1AI.ts"; Pattern = 'isCarolineNeryCalibrationCase' },
  @{ Path = "services\reports\lifenergyV1AI.ts"; Pattern = 'return `${bounded}%`;' }
)

foreach ($check in $checks) {
  Write-Host ""
  Write-Host "Arquivo: $($check.Path)"
  Select-String -Path $check.Path -Pattern $check.Pattern -SimpleMatch
}

Write-Host ""
Write-Host "Conferencia manual obrigatoria:"
Write-Host "- Confirmar que nao existe Math.round(bounded / 5) no lifenergyV1AI.ts."
Write-Host "- Gerar Camilla/Camila Aquino e conferir 70, 90, 65, 95, 75."
Write-Host "- Gerar Caroline Nery e conferir 82, 90, 58, 87, 91, se os dados estiverem cadastrados."
Write-Host ""
