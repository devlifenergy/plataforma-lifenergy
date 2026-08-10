# Release 1.3.0 — Relatório Lifenergy V1.0 DOCX

## Objetivo

Adicionar geração automatizada do Relatório Lifenergy V1.0 completo em DOCX, preservando a exportação CSV existente.

## Escopo

- Novo botão em `Painel → Avaliados`: **Gerar Relatório DOCX**.
- Botão disponível apenas para avaliações concluídas/exportadas com resposta registrada.
- Nova rota segura:
  - `/api/reports/lifenergy-v1/[responseId]`
- Geração em DOCX sem dependências externas de pacote.
- IA assistida controlada usando `OPENAI_API_KEY` no servidor.
- Relatório salvo em `generated_reports` com snapshot dos dados e conteúdo gerado.
- Download posterior reutiliza o mesmo conteúdo salvo.
- Exportação CSV permanece inalterada.

## Variáveis necessárias

```env
OPENAI_API_KEY=SUA_CHAVE_DA_API_OPENAI
OPENAI_REPORT_MODEL=gpt-5.1
```

`OPENAI_REPORT_MODEL` é opcional. Se não for informado, o sistema usa `gpt-5.1`.

## Banco

Executar no Supabase Sandbox:

```text
banco/migrations/RELEASE_1_3_0_RELATORIOS_LIFENERGY_V1.sql
```

## Observação

Esta release deve ser validada no Sandbox antes de qualquer merge para produção.
