# Release 1.1.10 — Melhorias Operacionais

## Correção adicional — Excluir link pendente

- Corrigida a ação **Excluir link** na tela de Avaliados.
- A exclusão agora usa uma rota dedicada `DELETE /api/journeys/[journeyId]`.
- A rota valida a empresa do usuário logado antes de excluir.
- A exclusão continua permitida somente para links com status `created` ou `link_sent` e sem respostas registradas.
- Após excluir com sucesso, a tela é recarregada para atualizar a lista imediatamente.
- Caso o link já tenha resposta, esteja concluído ou pertença a outra empresa, o sistema exibe mensagem de erro.

## Itens já incluídos nesta release

- Aumento de legibilidade da interface.
- Ajuste da fonte principal para Inter.
- Botão **Criar Convite** com estado `Criando...`.
- Bloqueio contra múltiplos cliques na criação de links.
- Limpeza automática dos campos após criar o link.
- Opção **Excluir link** apenas para links não respondidos.

## Banco de dados

- Não há alteração de banco de dados nesta release.

## Ajuste complementar — legibilidade do formulário público

- Aumentada a legibilidade do formulário público sem alterar a largura dos cards.
- Textos, campos, botões e tabela de resumo receberam escala mais confortável.
- Ajuste aplicado de forma responsiva para preservar o uso em celular.
- Mantida a correção de exclusão de links pendentes.
