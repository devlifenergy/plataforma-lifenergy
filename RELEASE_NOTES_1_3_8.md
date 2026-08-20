# Release 1.3.8 — Hotfix do botão Gerar relatório

Corrige o estado travado do botão `Gerar relatório`.

## Mudança principal

O botão é liberado visualmente antes do navegador iniciar o download do DOCX.

## Verificação

O componente renderiza:

```html
data-report-button-version="1.3.8"
```

Também foi incluído o script:

```text
VERIFICAR_IMPLEMENTACOES_GERAR_RELATORIO.ps1
```

para encontrar implementações duplicadas do botão ou chamadas diretas para `/api/reports/lifenergy-v1`.
