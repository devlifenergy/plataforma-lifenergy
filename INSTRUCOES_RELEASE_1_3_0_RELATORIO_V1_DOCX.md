# Instruções — Release 1.3.0 Relatório Lifenergy V1.0 DOCX

## 1. Branch correta

```powershell
cd C:\Projetos\lifenergyproject
git checkout feature/relatorio-lifenergy-v1-docx
```

Se a branch ainda não existir:

```powershell
git checkout feature/multiplos-fractais-prototipo
git pull origin feature/multiplos-fractais-prototipo
git checkout -b feature/relatorio-lifenergy-v1-docx
```

## 2. Aplicar arquivos

Copie os arquivos deste pacote para o projeto, preservando as pastas.

Arquivos alterados:

```text
app/painel/entrevistados/page.tsx
services/journeys/actions.ts
```

Arquivos novos:

```text
app/api/reports/lifenergy-v1/[responseId]/route.ts
services/reports/lifenergyV1AI.ts
services/reports/lifenergyV1Data.ts
services/reports/lifenergyV1Docx.ts
services/reports/lifenergyV1Prompt.ts
services/reports/lifenergyV1Types.ts
banco/migrations/RELEASE_1_3_0_RELATORIOS_LIFENERGY_V1.sql
```

## 3. Executar SQL no Supabase Sandbox

No Supabase Sandbox:

```text
SQL Editor → New query
```

Execute:

```text
banco/migrations/RELEASE_1_3_0_RELATORIOS_LIFENERGY_V1.sql
```

O retorno esperado é:

```text
release_1_3_0_relatorios_lifenergy_v1_ok
```

## 4. Configurar OpenAI no ambiente local

No arquivo `.env.local` ou `.env.local.sandbox`, adicione:

```env
OPENAI_API_KEY=SUA_CHAVE_DA_API_OPENAI
OPENAI_REPORT_MODEL=gpt-5.1
```

Não use `NEXT_PUBLIC_` para a chave da OpenAI.

## 5. Configurar OpenAI na Vercel Sandbox

No projeto Vercel Sandbox:

```text
Settings → Environment Variables
```

Adicione:

```text
KEY: OPENAI_API_KEY
VALUE: sua chave real da API OpenAI
NOTE: Relatórios Lifenergy Sandbox
```

Opcional:

```text
KEY: OPENAI_REPORT_MODEL
VALUE: gpt-5.1
NOTE: Modelo para Relatório Lifenergy V1.0
```

Marque o ambiente Sandbox usado no projeto.

## 6. Build local

```powershell
rmdir /s /q .next
npm run build
npm run dev
```

## 7. Teste

1. Entre como administrador da empresa.
2. Acesse `Painel → Avaliados`.
3. Use uma avaliação já concluída.
4. Clique em `Gerar Relatório DOCX`.
5. Baixe e abra o arquivo no Word.
6. Clique novamente no botão e confirme que o sistema baixa o mesmo relatório salvo.
7. Teste também links com 2 e 3 fractais.
8. Confirme que a exportação CSV continua funcionando.

## 8. Commit

```powershell
git add .
git commit -m "Release 1.3.0 - Gerador Relatorio Lifenergy V1 DOCX"
git push origin feature/relatorio-lifenergy-v1-docx
```

## 9. Segurança

- Não fazer merge na `main` antes da validação.
- Não usar dados reais nos testes iniciais.
- Não divulgar `OPENAI_API_KEY`.
- O relatório não aparece para o avaliado público.
- O botão fica apenas no painel interno da empresa.
