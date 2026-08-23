# Release 1.4.0 — Gerador de PDI Lifenergy

## Objetivo

Criar no Sandbox um novo botão em `Painel → Avaliados` para gerar o PDI — Plano de Desenvolvimento Individual — em DOCX.

## O que esta release adiciona

1. Novo botão `Gerar PDI` ao lado de `Gerar relatório`.
2. Nova rota segura:

```text
/api/pdi/lifenergy/[responseId]
```

3. Nova tabela:

```text
generated_pdis
```

4. Geração de DOCX no padrão do modelo de PDI Lifenergy.
5. Linguagem objetiva e direta.
6. Conexão com o Relatório Lifenergy V1 canônico.
7. Reutilização do PDI salvo em novos cliques.
8. Proteção contra múltiplos cliques no botão.
9. Preservação da regra metodológica: a “Reflexão após essa tarefa” não entra no PDI.

## Arquivos incluídos

```text
package.json
app/painel/entrevistados/page.tsx
components/application/GeneratePdiButton.tsx
app/api/pdi/lifenergy/[responseId]/route.ts
services/pdi/lifenergyPdiTypes.ts
services/pdi/lifenergyPdiData.ts
services/pdi/lifenergyPdiPrompt.ts
services/pdi/lifenergyPdiAI.ts
services/pdi/lifenergyPdiDocx.ts
banco/migrations/RELEASE_1_4_0_GERADOR_PDI_LIFENERGY.sql
RELEASE_NOTES_1_4_0.md
```

## SQL obrigatório

Execute no Supabase Sandbox:

```text
banco/migrations/RELEASE_1_4_0_GERADOR_PDI_LIFENERGY.sql
```

## Variáveis de ambiente

A release usa a mesma chave da OpenAI já configurada:

```env
OPENAI_API_KEY=...
OPENAI_REPORT_MODEL=gpt-5.1
```

Opcionalmente, você pode configurar um modelo específico para PDI:

```env
OPENAI_PDI_MODEL=gpt-5.1
```

Se `OPENAI_PDI_MODEL` não existir, o sistema usa `OPENAI_REPORT_MODEL`.

## Como aplicar no Sandbox

Crie a branch do sprint a partir da versão atual:

```powershell
cd C:\Projetos\lifenergyproject
git checkout main
git pull origin main
git checkout -b feature/gerador-pdi-lifenergy-1-4-0
```

Copie os arquivos deste ZIP por cima do projeto.

Depois execute:

```powershell
rmdir /s /q .next
npm run build
npm run dev
```

## Testes obrigatórios

1. Entrar como empresa.
2. Acessar `Painel → Avaliados`.
3. Confirmar que avaliações concluídas exibem:
   - `Gerar relatório`
   - `Gerar PDI`
4. Clicar em `Gerar PDI`.
5. Confirmar que o botão muda para `Gerando PDI...`.
6. Confirmar que o DOCX baixa.
7. Confirmar que o botão volta para `Gerar PDI`.
8. Abrir o DOCX e conferir as seções:
   - Identificação do colaborador
   - Diagnóstico e análise de perfil
   - Avaliação do colaborador
   - Pontos fortes
   - Oportunidades de melhoria
   - Competências a desenvolver
   - Objetivos de desenvolvimento
   - Apoio e suporte necessário
   - Monitoramento e avaliação
   - Assinaturas e aprovações
9. Confirmar que a linguagem é objetiva e direta.
10. Confirmar que a “Reflexão após essa tarefa” não aparece no PDI.

## Publicação no Sandbox do time

Depois de validar localmente:

```powershell
git add .
git commit -m "Release 1.4.0 - Gerador de PDI Lifenergy"
git push origin feature/gerador-pdi-lifenergy-1-4-0
```

Se o Sandbox do time continuar usando `feature/multiplos-fractais-prototipo`, publique assim:

```powershell
git checkout feature/multiplos-fractais-prototipo
git pull origin feature/multiplos-fractais-prototipo
git merge feature/gerador-pdi-lifenergy-1-4-0
npm run build
git push origin feature/multiplos-fractais-prototipo
```

Não faça merge para produção sem validação do time.
