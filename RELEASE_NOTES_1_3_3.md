# Release 1.3.3 — Ajustes de relatório e proteção de cadastro

## Objetivo

Aplicar os ajustes solicitados pelo time após os testes da versão 1.3.2 no Sandbox.

## Alterações no Relatório Lifenergy V1

1. Título alterado para `RELATORIO LIFENERGY - DESENVOLVIMENTO HUMANO`.
2. Item 4 alterado para `4. Síntese dos padrões relacionais`.
3. Quarta coluna das tabelas alterada para `Padrões relacionais identificados`.
4. Item 6 passa a incluir texto fixo e inalterável explicando os atributos:
   - Socialização
   - Reflexão
   - Lazer
   - Propósito
   - Sentimento
5. Versão do motor alterada para `1.3.3`, forçando nova geração do relatório no novo padrão.

## Alterações no super usuário

1. Cadastro de empresa agora bloqueia múltiplos cliques no botão `Cadastrar Empresa`.
2. Campos do formulário de empresa são limpos após cadastro com sucesso.
3. Tela `Laudos e Exportações` agora mostra preview dos dados que serão baixados, respeitando filtros por empresa, avaliado e período.

## Alterações no cliente

1. Cadastro de aplicador agora bloqueia múltiplos cliques no botão `+ Novo Aplicador`.
2. Campos do formulário de aplicador são limpos após cadastro com sucesso.

## SQL

Não há SQL obrigatório nesta release.
