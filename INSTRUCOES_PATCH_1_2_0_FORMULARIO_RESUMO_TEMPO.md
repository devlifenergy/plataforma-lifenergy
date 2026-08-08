# Patch 1.2.0 — Formulário, revisão final e tempo

Este patch corrige três pontos do teste da versão 1.2.0:

1. Ao clicar em **Continuar** ou **Voltar**, o formulário retorna automaticamente para o início do card.
2. A tela de **Resumo final da sua tarefa** apresenta uma instrução clara para revisar respostas, importâncias, justificativas e reflexões, usando **Voltar** para alterações antes de concluir.
3. O campo `initial_time` passa a ser enviado no formato `HH:mm:ss` e a função do banco converte o valor para `time`, corrigindo o erro:

```text
column "initial_time" is of type time without time zone but expression is of type text
```

## Aplicação

1. Extraia o ZIP por cima da branch `feature/multiplos-fractais-prototipo`.
2. No Supabase SQL Editor, execute apenas o arquivo:

```text
banco/migrations/RELEASE_1_2_0_PATCH_FORMULARIO_RESUMO_TEMPO.sql
```

3. Depois rode:

```powershell
npm run build
npm run dev
```

## Observação

Este patch não remove nem altera tabelas antigas usadas pela versão estável 1.1.10.
