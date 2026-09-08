$ErrorActionPreference = "Stop"

$checks = @(
  @{ File = "package.json"; Text = '"version": "1.5.9"' },
  @{ File = "components/layout/CompanyShell.tsx"; Text = "Painel Inicial" },
  @{ File = "components/layout/CompanyShell.tsx"; Text = "Aplicadores Autorizados" },
  @{ File = "components/layout/CompanyShell.tsx"; Text = "PDI Corporativo" },
  @{ File = "components/layout/CompanyShell.tsx"; Text = "Biblioteca Corporativa" },
  @{ File = "components/layout/CompanyShell.tsx"; Text = "Biblioteca Técnica" },
  @{ File = "services/reports/lifenergyV1Docx.ts"; Text = "Significado" },
  @{ File = "services/reports/lifenergyV1Types.ts"; Text = "lifenergy_v1_0_canonico_1_5_9" },
  @{ File = "services/pdi/lifenergyPdiTypes.ts"; Text = "lifenergy_pdi_v4_2_1_5_9" },
  @{ File = "banco/migrations/RELEASE_1_5_9_UX_VALIDACOES_LICENCAS_BIBLIOTECA.sql"; Text = "technical_library_documents" },
  @{ File = "banco/migrations/RELEASE_1_5_9_UX_VALIDACOES_LICENCAS_BIBLIOTECA.sql"; Text = "participant_documents" },
  @{ File = "lib/validation.ts"; Text = "isValidCpf" }
)

$failed = $false
foreach ($check in $checks) {
  if (-not (Test-Path $check.File)) {
    Write-Host "FALHA: arquivo ausente $($check.File)" -ForegroundColor Red
    $failed = $true
    continue
  }
  $content = Get-Content $check.File -Raw -Encoding UTF8
  if ($content -notlike "*$($check.Text)*") {
    Write-Host "FALHA: '$($check.Text)' não encontrado em $($check.File)" -ForegroundColor Red
    $failed = $true
  } else {
    Write-Host "OK: $($check.File) -> $($check.Text)" -ForegroundColor Green
  }
}

if ($failed) { exit 1 }
Write-Host "Release 1.5.9: verificações estáticas principais concluídas." -ForegroundColor Green
