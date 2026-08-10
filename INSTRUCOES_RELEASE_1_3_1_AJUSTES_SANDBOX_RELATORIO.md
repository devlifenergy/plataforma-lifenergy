# Instruções — Release 1.3.1 Ajustes Sandbox e Relatório

## Branch recomendada

Aplique este pacote na branch da Release 1.3.0/1.3.1, não na main.

```powershell
cd C:\Projetos\lifenergyproject
git checkout feature/relatorio-lifenergy-v1-docx
```

Se a branch ainda não existir localmente:

```powershell
git checkout feature/multiplos-fractais-prototipo
git pull origin feature/multiplos-fractais-prototipo
git checkout -b feature/relatorio-lifenergy-v1-docx
```

## Aplicação

Copie os arquivos deste pacote por cima do projeto.

## SQL

Esta release não exige SQL novo.

## Ambiente

Confirme que o Sandbox possui:

```env
OPENAI_API_KEY=...
OPENAI_REPORT_MODEL=gpt-5.1
```

## Build local

```powershell
rmdir /s /q .next
npm run build
npm run dev
```

## Testes obrigatórios

1. Formulário com 1 fractal.
2. Formulário com 2 fractais.
3. Formulário com 3 fractais.
4. Conferir que não aparece mais o resumo final consolidado.
5. Clicar várias vezes em "Concluir Avaliação" e confirmar que o botão bloqueia.
6. Em Painel → Avaliados, confirmar que links concluídos não mostram "Abrir link" nem "Copiar link".
7. Confirmar que o botão aparece como "Gerar relatório".
8. Clicar várias vezes em "Gerar relatório" e confirmar que o botão bloqueia.
9. Confirmar que a tela Laudos aparece apenas para super usuário.
10. Testar exportação com filtros por empresa, avaliado e período.
11. Gerar relatório DOCX e comparar com o modelo anexado.

## Observação sobre relatórios já gerados

Relatórios gerados com o modelo anterior serão regenerados automaticamente quando o conteúdo salvo não estiver compatível com o novo schema.

Para forçar uma regeneração manual de um relatório específico, use:

```text
/api/reports/lifenergy-v1/ID_DA_RESPOSTA?regenerate=1
```
