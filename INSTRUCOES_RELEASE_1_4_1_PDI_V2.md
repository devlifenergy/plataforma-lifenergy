# Release 1.4.1 — PDI V2 com ajustes do feedback

## Objetivo

Evoluir o Gerador de PDI Lifenergy para a versão V2, incorporando o feedback recebido após o teste da 1.4.0.

## Ajustes principais

1. Remove o campo `Objetivo de participação` do PDI.
2. Remove o campo `Objetivo de participação` da análise usada para gerar o PDI.
3. Cria a seção `Objetivo central do PDI`.
4. Cria a seção `Objetivo de carreira / desenvolvimento profissional`.
5. Adiciona metas de médio prazo, até 12 meses.
6. Adiciona direcionamento de longo prazo, 2 a 3 anos.
7. Adiciona plano de ação 70-20-10.
8. Adiciona indicadores SMART e KPIs comportamentais.
9. Deixa o plano mais operacional, com frequência, responsável, recursos e evidência de conclusão.
10. Mantém a linguagem objetiva, direta e alinhada ao Relatório Lifenergy.
11. Mantém a regra: a `Reflexão após essa tarefa` não entra no PDI.

## Arquivos alterados

```text
package.json
components/application/GeneratePdiButton.tsx
services/pdi/lifenergyPdiTypes.ts
services/pdi/lifenergyPdiData.ts
services/pdi/lifenergyPdiPrompt.ts
services/pdi/lifenergyPdiAI.ts
services/pdi/lifenergyPdiDocx.ts
```

## SQL

Não precisa executar SQL novo.

A tabela `generated_pdis` criada na 1.4.0 continua sendo usada.

## Por que o PDI será gerado de novo

A versão do PDI mudou para:

```text
lifenergy_pdi_v2_0_1_4_1
```

Isso evita reutilizar o PDI antigo da 1.4.0.

## Como aplicar no Sandbox

Na branch do sprint:

```powershell
cd C:\Projetos\lifenergyproject
git checkout feature/gerador-pdi-lifenergy-1-4-0
```

Copie os arquivos deste ZIP por cima do projeto.

Depois rode:

```powershell
rmdir /s /q .next
npm run build
npm run dev
```

## Teste obrigatório

1. Entrar como empresa.
2. Acessar `Painel → Avaliados`.
3. Clicar em `Gerar PDI`.
4. Confirmar que o DOCX baixa.
5. Confirmar que o botão volta ao normal após o download.
6. Abrir o DOCX.
7. Confirmar que NÃO existe o campo `Objetivo de participação`.
8. Confirmar que existe `Objetivo central do PDI`.
9. Confirmar que existe `Objetivo de carreira / desenvolvimento profissional`.
10. Confirmar que existem metas de curto, médio e longo prazo.
11. Confirmar que existe Plano de Ação 70-20-10.
12. Confirmar que existem Indicadores SMART / KPIs comportamentais.
13. Confirmar que a `Reflexão após essa tarefa` não aparece.

## Publicação no Sandbox

Depois do teste local:

```powershell
git add .
git commit -m "Release 1.4.1 - PDI V2 com plano 70-20-10 e indicadores SMART"
git push origin feature/gerador-pdi-lifenergy-1-4-0

git checkout feature/multiplos-fractais-prototipo
git pull origin feature/multiplos-fractais-prototipo
git merge feature/gerador-pdi-lifenergy-1-4-0
npm run build
git push origin feature/multiplos-fractais-prototipo
```

Não publicar em produção antes da validação do Sandbox.
