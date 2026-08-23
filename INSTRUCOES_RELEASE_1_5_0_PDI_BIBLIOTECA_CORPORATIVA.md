# Release 1.5.0 — Tela de PDI + Biblioteca Corporativa Inteligente

## Objetivo

Criar uma tela separada para PDI e iniciar o modelo de consultoria autogestionada pela empresa contratante.

A tela de Avaliados deixa de ser o local principal de geração do PDI. O PDI passa a ter uma área própria:

```text
Painel → PDI
```

## O que entra nesta release

1. Nova tela separada `PDI` no menu lateral.
2. Biblioteca Corporativa Inteligente.
3. Upload/cadastro de documentos da empresa por categoria.
4. Validador de liberação do PDI Corporativo.
5. Dois tipos de PDI:
   - PDI de Desenvolvimento Relacional
   - PDI de Desenvolvimento Corporativo
6. PDI Relacional não exige documentos corporativos.
7. PDI Corporativo exige somente documentos da empresa.
8. Remoção total da exigência de Termo ou Política de uso do PDI.
9. Contexto operacional do PDI por avaliado, sem tratar isso como documento obrigatório da Biblioteca.
10. PDI Corporativo usa documentos corporativos no prompt da IA.
11. Botão de PDI sai da tela Avaliados e fica na tela própria de PDI.

## Documentos obrigatórios para liberar o PDI Corporativo

Todos são documentos da empresa:

```text
1. Cultura, valores ou princípios da empresa
2. Matriz de competências organizacionais
3. Descrição de cargos e funções
4. Estratégia, metas ou prioridades corporativas
```

Não são obrigatórios:

```text
Termo de uso do PDI
Política de uso do PDI
Documento individual do empregado
Documento individual do avaliado
```

## Observação sobre arquivos DOCX/PDF

Esta versão salva o arquivo como referência e exige o conteúdo textual para a IA.

Arquivos TXT/CSV/MD podem ter o texto extraído automaticamente no navegador. Para DOCX/PDF, cole no campo `Conteúdo do documento para uso da IA` o texto, resumo ou conteúdo extraído que a IA deve considerar.

## Arquivos alterados/incluídos

```text
package.json
components/layout/CompanyShell.tsx
components/application/CorporateDocumentForm.tsx
components/application/GeneratePdiButton.tsx
app/painel/pdi/page.tsx
app/painel/entrevistados/page.tsx
app/api/pdi/lifenergy/[responseId]/route.ts
services/pdi/actions.ts
services/pdi/corporateKnowledge.ts
services/pdi/lifenergyPdiTypes.ts
services/pdi/lifenergyPdiData.ts
services/pdi/lifenergyPdiPrompt.ts
services/pdi/lifenergyPdiAI.ts
services/pdi/lifenergyPdiDocx.ts
banco/migrations/RELEASE_1_5_0_BIBLIOTECA_CORPORATIVA_PDI.sql
```

## SQL obrigatório no Supabase Sandbox

Execute no SQL Editor do Supabase Sandbox:

```text
banco/migrations/RELEASE_1_5_0_BIBLIOTECA_CORPORATIVA_PDI.sql
```

Esse SQL cria:

```text
organization_documents
pdi_contexts
```

E ajusta `generated_pdis` para permitir PDI Relacional e PDI Corporativo para a mesma resposta.

## Como aplicar direto no Sandbox

```powershell
cd C:\Projetos\lifenergyproject
git checkout feature/multiplos-fractais-prototipo
git pull origin feature/multiplos-fractais-prototipo
```

Descompacte o ZIP por cima do projeto e substitua os arquivos.

Depois rode:

```powershell
powershell -ExecutionPolicy Bypass -File .\VERIFICAR_RELEASE_1_5_0_PDI_BIBLIOTECA.ps1
rmdir /s /q .next
npm run build
```

Se passar:

```powershell
git status
git add .
git commit -m "Release 1.5.0 - Tela PDI e Biblioteca Corporativa Inteligente"
git push origin feature/multiplos-fractais-prototipo
```

## Teste obrigatório

1. Executar o SQL no Supabase Sandbox.
2. Entrar como empresa.
3. Confirmar menu `PDI`.
4. Abrir `Painel → PDI`.
5. Confirmar que `Gerar PDI Corporativo` aparece bloqueado enquanto faltam documentos.
6. Cadastrar os quatro documentos obrigatórios da empresa.
7. Confirmar que o PDI Corporativo fica liberado.
8. Gerar PDI Relacional.
9. Gerar PDI Corporativo.
10. Confirmar que a tela Avaliados não possui mais botão de PDI.
11. Confirmar que não existe exigência de Termo ou Política de uso do PDI.
12. Confirmar que documentos individuais do avaliado/empregado não aparecem como obrigatórios.

Não publicar em produção antes da validação do Sandbox.
