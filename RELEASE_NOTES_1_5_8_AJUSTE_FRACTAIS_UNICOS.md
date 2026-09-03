# Release 1.5.8 — Ajuste de seleção de Fractais

Ajustes imediatos na seleção dos Fractais de Comportamento:

1. Removida a repetição visual da atividade selecionada após a lista de opções.
2. Um mesmo Fractal de Comportamento não pode ser selecionado mais de uma vez no mesmo link.
3. Fractais já escolhidos em outra posição ficam indisponíveis e identificados como já selecionados.
4. A regra de unicidade também é validada no servidor em `readFractalActivities`, impedindo duplicidade por manipulação do formulário.
5. Regras aplicadas tanto na criação quanto na edição do Avaliado.
