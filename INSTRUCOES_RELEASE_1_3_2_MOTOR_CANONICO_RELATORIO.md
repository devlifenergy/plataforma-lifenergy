# Instruções — Release 1.3.2 Motor Canônico de Relatório Lifenergy

## Antes de aplicar

Trabalhe apenas na branch de desenvolvimento/sandbox:

```powershell
cd C:\Projetos\lifenergyproject
git checkout feature/relatorio-lifenergy-v1-engine-1-3-2
```

Caso ainda não tenha criado a branch:

```powershell
cd C:\Projetos\lifenergyproject
git checkout feature/relatorio-lifenergy-v1-docx
git pull origin feature/relatorio-lifenergy-v1-docx
git checkout -b feature/relatorio-lifenergy-v1-engine-1-3-2
```

## Aplicação dos arquivos

Copie os arquivos deste pacote por cima do projeto.

Arquivos principais:

```text
package.json
app/painel/page.tsx
app/painel/prototipo-multiplos-fractais/page.tsx
components/application/GenerateReportButton.tsx
components/layout/CompanyShell.tsx
app/api/reports/lifenergy-v1/[responseId]/route.ts
services/reports/lifenergyV1AI.ts
services/reports/lifenergyV1Docx.ts
services/reports/lifenergyV1Prompt.ts
services/reports/lifenergyV1Types.ts
banco/migrations/RELEASE_1_3_2_MOTOR_CANONICO_RELATORIO.sql
```

## SQL obrigatório

No Supabase Sandbox, execute:

```text
banco/migrations/RELEASE_1_3_2_MOTOR_CANONICO_RELATORIO.sql
```

Esse SQL adiciona campos de rastreabilidade metodológica em `generated_reports`:

```text
engine_version
prompt_version
template_version
```

## Build local

Depois de aplicar:

```powershell
rmdir /s /q .next
npm run build
npm run dev
```

## Testes mínimos

1. Entrar como administrador de empresa.
2. Confirmar que o painel não mostra mais Protótipo 1.2.0.
3. Confirmar que cliente não vê Laudos/Exportações.
4. Entrar como super usuário.
5. Confirmar que super usuário vê Empresas e Laudos.
6. Gerar relatório de 1 fractal.
7. Clicar novamente em Gerar relatório e confirmar que baixa o mesmo relatório salvo.
8. Gerar relatório de 2 fractais.
9. Gerar relatório de 3 fractais.
10. Confirmar que a exportação CSV/Excel continua funcionando.

## Publicação no Sandbox

Depois do build local aprovado:

```powershell
git add .
git commit -m "Release 1.3.2 - Motor canonico de relatorio Lifenergy"
git push origin feature/relatorio-lifenergy-v1-engine-1-3-2
```

Se o Sandbox da Vercel estiver rastreando `feature/multiplos-fractais-prototipo`, faça o merge para essa branch somente depois do teste local:

```powershell
git checkout feature/multiplos-fractais-prototipo
git pull origin feature/multiplos-fractais-prototipo
git merge feature/relatorio-lifenergy-v1-engine-1-3-2
npm run build
git push origin feature/multiplos-fractais-prototipo
```

Não faça merge na `main`.
