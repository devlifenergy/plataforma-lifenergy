Write-Host ""
Write-Host "==============================================="
Write-Host "Verificacao - Release 1.5.8"
Write-Host "==============================================="
Write-Host ""

$checks = @(
  @{ Path = "package.json"; Pattern = '"version": "1.5.8"' },
  @{ Path = "components\application\CompanyLogoForm.tsx"; Pattern = 'Selecionar logomarca' },
  @{ Path = "app\painel\biblioteca\page.tsx"; Pattern = 'Logomarca da empresa' },
  @{ Path = "services\reports\lifenergyV1Types.ts"; Pattern = 'lifenergy_v1_0_canonico_1_5_8' },
  @{ Path = "services\reports\lifenergyV1Docx.ts"; Pattern = 'company_logo' },
  @{ Path = "services\pdi\lifenergyPdiTypes.ts"; Pattern = 'lifenergy_pdi_v4_1_1_5_8' },
  @{ Path = "services\pdi\lifenergyPdiDocx.ts"; Pattern = 'company_logo' },
  @{ Path = "services\fractals\lifenergyFractalMatrix.ts"; Pattern = 'Relacionamento consigo' },
  @{ Path = "components\application\CreateJourneyForm.tsx"; Pattern = 'Ponto de Conexão' },
  @{ Path = "components\lifenergy\PublicLifenergyForm.tsx"; Pattern = '15 minutos por fractal ou atividade' },
  @{ Path = "services\journeys\actions.ts"; Pattern = 'findFractalMatrixItem' },
  @{ Path = "banco\migrations\RELEASE_1_5_8_LOGO_EMPRESA_MATRIZ_FRACTAIS.sql"; Pattern = 'logo_content_base64' }
)

foreach ($check in $checks) {
  Write-Host ""
  Write-Host "Arquivo: $($check.Path)"
  Select-String -Path $check.Path -Pattern $check.Pattern -SimpleMatch
}

Write-Host ""
Write-Host "Conferencia manual obrigatoria:"
Write-Host "- Executar SQL da 1.5.8 no Supabase Sandbox."
Write-Host "- Rodar npm run build."
Write-Host "- Testar upload da logomarca e gerar novo DOCX."
Write-Host "- Criar convite usando matriz Vortice, Ponto de Conexao e Fractal."
Write-Host ""
