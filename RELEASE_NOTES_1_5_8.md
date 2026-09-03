# Release Notes 1.5.8

## Mudanças

- Biblioteca Corporativa Inteligente passa a permitir upload da logomarca da empresa.
- Logomarca da empresa é usada no cabeçalho do Relatório Lifenergy V1 e do PDI Lifenergy.
- Texto do formulário público alterado para 15 minutos por fractal ou atividade.
- Criação de convite passa a escolher a atividade por matriz:
  - Vórtice;
  - Ponto de Conexão;
  - Fractal.
- Atividade deixa de ser digitada livremente pelo aplicador.

## SQL

Executar:

```text
banco/migrations/RELEASE_1_5_8_LOGO_EMPRESA_MATRIZ_FRACTAIS.sql
```

## Matriz canônica revisada

- Fonte: `Tabela de Selecao Lifenergy(1).xlsx`, aba `Tabela`.
- 3 Vórtices, 18 Pontos de Conexão e 80 Fractais/Atividades.
- Sequência e textos preservados literalmente da planilha fornecida pelo usuário.
- Não corrigir, reescrever, padronizar ou reordenar os itens da matriz.
- Esta matriz substitui integralmente a matriz preliminar incluída na primeira geração do pacote 1.5.8.
