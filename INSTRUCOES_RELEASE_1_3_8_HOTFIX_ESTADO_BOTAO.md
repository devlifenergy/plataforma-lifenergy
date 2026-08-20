# Release 1.3.8 — Hotfix do estado do botão Gerar relatório

## Problema

Na tela `Painel → Avaliados`, na área da Empresa, o relatório é gerado e baixado, mas o botão permanece travado em:

```text
Gerando relatório...
```

## Ajuste técnico

Este hotfix substitui novamente o componente:

```text
components/application/GenerateReportButton.tsx
```

A correção agora faz:

```text
1. fetch da rota do relatório
2. conversão da resposta em Blob
3. liberação visual do botão com flushSync
4. disparo do download somente depois que o botão já voltou ao estado normal
```

Também adiciona um marcador verificável no HTML:

```html
data-report-button-version="1.3.8"
```

## Arquivos incluídos

```text
package.json
components/application/GenerateReportButton.tsx
VERIFICAR_IMPLEMENTACOES_GERAR_RELATORIO.ps1
INSTRUCOES_RELEASE_1_3_8_HOTFIX_ESTADO_BOTAO.md
RELEASE_NOTES_1_3_8.md
```

## SQL

Não precisa executar SQL.

## Como aplicar

Na branch do motor de relatório:

```powershell
cd C:\Projetos\lifenergyproject
git checkout feature/relatorio-lifenergy-v1-engine-1-3-2
```

Copie os arquivos do ZIP por cima do projeto.

Depois execute o verificador:

```powershell
powershell -ExecutionPolicy Bypass -File .\VERIFICAR_IMPLEMENTACOES_GERAR_RELATORIO.ps1
```

O resultado deve mostrar que a tela de Avaliados usa o componente `GenerateReportButton`.

Depois rode:

```powershell
rmdir /s /q .next
npm run build
npm run dev
```

## Teste obrigatório local

1. Entrar como cliente/empresa.
2. Acessar `Painel → Avaliados`.
3. Clicar em `Gerar relatório`.
4. Confirmar que o botão muda para `Gerando relatório...`.
5. Confirmar que o botão volta para `Gerar relatório`.
6. Confirmar que aparece a mensagem `Relatório pronto. Download iniciado.`
7. Confirmar que o DOCX baixa.

## Verificação no navegador depois do deploy

No Sandbox publicado:

```text
F12 → Elements / Elementos
```

Selecione a área do botão e confirme que existe:

```html
data-report-button-version="1.3.8"
```

Se não existir, o deploy não está usando este componente ou existe uma segunda implementação do botão.

## Publicação no Sandbox

```powershell
git add .
git commit -m "Release 1.3.8 - Corrige estado do botao gerar relatorio"
git push origin feature/relatorio-lifenergy-v1-engine-1-3-2

git checkout feature/multiplos-fractais-prototipo
git pull origin feature/multiplos-fractais-prototipo
git merge feature/relatorio-lifenergy-v1-engine-1-3-2
npm run build
git push origin feature/multiplos-fractais-prototipo
```
