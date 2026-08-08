# Patch 1.2.0 — Correção do envio final com organization_id

Este patch corrige o erro apresentado ao clicar em **Concluir Avaliação**:

```text
null value in column "organization_id" of relation "journey_responses" violates not-null constraint
```

## Causa

A rota de envio sem RPC estava gravando diretamente em `journey_responses`, mas não preenchia a coluna obrigatória `organization_id`.

## Correção

A rota agora busca `organization_id` na tabela `journeys` pelo token do link e inclui esse valor no insert de `journey_responses`.

## Aplicação

1. Extraia este pacote por cima da branch da 1.2.0.
2. Não é necessário executar SQL.
3. Rode:

```powershell
npm run build
npm run dev
```

4. Teste novamente o botão **Concluir Avaliação**.

## Observação

Use preferencialmente um novo link de teste. O link anterior pode ser reutilizado se não tiver sido marcado como concluído.
