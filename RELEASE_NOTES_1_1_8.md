# Release 1.1.8 — Avaliados e Formulário

## Tela de avaliados

- Incluído o campo obrigatório **Atividade** na criação de convites.
- A atividade fica vinculada ao link e pode ser editada enquanto a avaliação não estiver concluída.
- A listagem foi reorganizada visualmente por CPF, sem alterar a lógica principal dos convites.
- Cada link mostra nome do avaliado, aplicador, status e atividade.
- Convites ainda não respondidos aparecem como **CPF ainda não informado**.

## Formulário público

- Cabeçalho atualizado para exibir o passo atual e o total de passos.
- Texto de acompanhamento substituído por “Acompanhe aqui o seu avanço nessa tarefa.”
- Tela visual de Registro da Aplicação removida; data, hora, tipo e aplicador continuam enviados ao banco.
- Instruções revisadas conforme o roteiro aprovado.
- Atividade cadastrada pelo aplicador exibida antes do campo em que o avaliado a copia.
- “Quadro de Registro de Dados” renomeado para “Registro de Dados”.
- Campos renomeados para Primeira, Segunda e Terceira Resposta.
- Escolhas de maior e menor importância separadas em passos distintos.
- Resposta restante destacada automaticamente como **Média importância — 2**.
- Quadro-resumo incluído antes da Reflexão Final, com resposta, importância e justificativa.
- Texto final de agradecimento atualizado.

## Banco de dados

- Adicionada a coluna `activity` à tabela `journeys`.
- Adicionada a função pública `get_public_journey_context_by_token` para disponibilizar atividade e aplicador ao formulário.

## Arquivo de migração

Execute no Supabase SQL Editor:

`banco/migrations/RELEASE_1_1_8_ACTIVITY.sql`

## Ajuste complementar — agrupamento de CPF pendente

- Links ainda não respondidos, sem CPF informado, agora aparecem em um único grupo **CPF ainda não informado**.
- Esse grupo identifica os convites gerados que ainda aguardam preenchimento pelo avaliado.
- Não houve alteração adicional no banco de dados.
