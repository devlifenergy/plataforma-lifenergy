# Release 1.1.9 — Ajustes finais no formulário e exportação

## Correções incluídas

- Ajustes finais de texto e fluxo do formulário público.
- Inclusão da instrução para clicar em continuar nas etapas intermediárias.
- Criação da etapa de média importância para a resposta restante.
- Resumo final organizado pela ordem das respostas.
- Correção do CSV de exportação para abertura correta no Excel:
  - declaração explícita de separador `sep=;`;
  - campos sempre entre aspas;
  - remoção de quebras de linha internas;
  - datas e horários sem vírgula para evitar divisão indevida em colunas;
  - linhas geradas com CRLF.
