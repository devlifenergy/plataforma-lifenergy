# Release 1.2.0 — Protótipo visual detalhado de múltiplos fractais

Esta branch/proposta parte da versão operacional 1.1.10 e adiciona uma tela de protótipo visual para validar a funcionalidade de múltiplos fractais por link antes de alterar o banco de dados.

## Decisões aprovadas

- A versão atual continua como produção estável.
- A nova funcionalidade será feita em branch/projeto separado.
- O limite inicial será de até 3 fractais por link.
- A exportação futura deverá sair em uma linha por avaliado.
- O time validará primeiro um protótipo visual antes de qualquer alteração no banco de dados.
- Cada fractal deverá ter sua própria reflexão final.
- O avaliado deverá digitar manualmente a atividade em cada fractal, mantendo a lógica atual.
- A função copiar/colar deverá permanecer bloqueada no campo de digitação da atividade quando o fluxo real for implementado.
- O aplicador deverá escolher a quantidade exata de fractais: 1, 2 ou 3.
- O sistema deverá abrir somente os campos correspondentes à quantidade escolhida.
- Todos os campos de fractal abertos deverão ser obrigatórios.

## O que foi detalhado nesta versão do protótipo

- Nova rota visual: `/painel/prototipo-multiplos-fractais`.
- Seletor visual da quantidade de fractais: 1, 2 ou 3.
- Campos de atividade exibidos dinamicamente conforme a quantidade escolhida.
- Exemplo da visão do aplicador cadastrando a quantidade exata de fractais em um único link.
- Exemplo da visão do avaliado respondendo cada fractal de forma sequencial.
- Indicação clara de que a tarefa deve ser digitada pelo avaliado em cada fractal.
- Quadro de resumo por fractal, com atividade apresentada, atividade digitada, respostas, importâncias, justificativas e reflexão individual.
- Quadro final consolidado antes do envio.
- Exemplo de exportação futura em uma linha por avaliado, com blocos por fractal e campos vazios para fractais não aplicados.

## Banco de dados

Nenhuma migração foi adicionada neste protótipo.

## Arquivos alterados/adicionados

- `app/painel/page.tsx`
- `app/painel/prototipo-multiplos-fractais/page.tsx`
- `package.json`
- `package-lock.json`
- `RELEASE_NOTES_1_2_0_PROTOTIPO.md`
- `INSTRUCOES_BRANCH_1_2_0_PROTOTIPO.md`
