# Release 1.5.0 — PDI + Biblioteca Corporativa Inteligente

## Mudanças principais

- Cria tela separada `PDI`.
- Cria Biblioteca Corporativa Inteligente.
- Remove o botão de PDI da tela `Avaliados`.
- Separa dois tipos de PDI:
  - Desenvolvimento Relacional
  - Desenvolvimento Corporativo
- PDI Corporativo exige somente documentos da empresa:
  - Cultura/valores/princípios
  - Matriz de competências
  - Descrição de cargos/funções
  - Estratégia/metas/prioridades
- Remove exigência de Termo ou Política de uso do PDI.
- Permite contexto operacional do PDI por avaliado, sem tratar isso como documento obrigatório.

## SQL

Executar:

```text
banco/migrations/RELEASE_1_5_0_BIBLIOTECA_CORPORATIVA_PDI.sql
```
