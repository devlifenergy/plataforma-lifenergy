Write-Host ""
Write-Host "==============================================="
Write-Host "Verificacao - Release 1.5.6"
Write-Host "==============================================="
Write-Host ""

$checks = @(
  @{ Path = "package.json"; Pattern = '"version": "1.5.6"' },
  @{ Path = "services\reports\lifenergyV1Types.ts"; Pattern = 'lifenergy_v1_0_canonico_1_5_6' },
  @{ Path = "services\reports\lifenergyV1MetricEngine.ts"; Pattern = 'lifenergy_metric_engine_v1_0_19_casos' },
  @{ Path = "services\reports\lifenergyV1Docx.ts"; Pattern = 'heading1("5. Categorização dos padrões de comportamento (0 a 100%)")' },
  @{ Path = "services\reports\lifenergyV1Docx.ts"; Pattern = 'heading1("6. Recomendações para desenvolvimento de habilidades")' },
  @{ Path = "components\layout\CompanyShell.tsx"; Pattern = 'href: "/painel/biblioteca"' },
  @{ Path = "app\painel\biblioteca\page.tsx"; Pattern = 'Biblioteca Corporativa Inteligente' },
  @{ Path = "components\application\CreateJourneyForm.tsx"; Pattern = 'Objetivo de participação *' },
  @{ Path = "components\lifenergy\PublicLifenergyForm.tsx"; Pattern = 'Tempo de resposta:' },
  @{ Path = "components\lifenergy\PublicLifenergyForm.tsx"; Pattern = 'Escreva o texto acima no quadro abaixo.' },
  @{ Path = "banco\migrations\RELEASE_1_5_6_MOTOR_METRICO_FORMULARIO_BIBLIOTECA.sql"; Pattern = 'lifenergy_metric_calibrations' }
)

foreach ($check in $checks) {
  Write-Host ""
  Write-Host "Arquivo: $($check.Path)"
  Select-String -Path $check.Path -Pattern $check.Pattern -SimpleMatch
}

Write-Host ""
Write-Host "Conferencia manual obrigatoria:"
Write-Host "- Executar SQL da 1.5.6 no Supabase Sandbox."
Write-Host "- Rodar npm run build."
Write-Host "- Gerar novo Relatorio Lifenergy V1 e conferir ordem dos itens 5 e 6."
Write-Host ""
