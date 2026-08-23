Write-Host ""
Write-Host "==============================================="
Write-Host "Verificacao - Release 1.5.2"
Write-Host "==============================================="
Write-Host ""

Select-String -Path package.json -Pattern '"version": "1.5.2"' -SimpleMatch

Write-Host ""
Write-Host "Conferindo se o texto removido ainda existe:"
$result = Select-String -Path components\application\CorporateDocumentForm.tsx -Pattern "Ao salvar, a IA lê o arquivo" -SimpleMatch

if ($result) {
  Write-Host "ATENCAO: texto ainda encontrado."
  $result
} else {
  Write-Host "OK: texto removido."
}

Write-Host ""
Write-Host "Conferindo se o campo Arquivo do documento continua existindo:"
Select-String -Path components\application\CorporateDocumentForm.tsx -Pattern "Arquivo do documento" -SimpleMatch
