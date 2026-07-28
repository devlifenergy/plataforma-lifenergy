# Release 1.1.9 — Hotfix do formulário público

## Objetivo

Corrigir textos, exibição de data e falha de gravação identificados na versão 1.1.8.

## Correções aplicadas

- Ajuste do texto inicial exibido ao abrir o link público do formulário.
- Substituição de “Plataforma Lifenergy” por “Lifenergy Digital” no cabeçalho do formulário público.
- Remoção da frase repetida “Bem-vindo à Plataforma Lifenergy Digital.” na primeira tela do formulário.
- Alteração do campo Data de Nascimento para o formato visual dd/mm/aaaa.
- Conversão da data de nascimento para o formato aceito pelo banco no momento do envio.
- Correção da data de aplicação enviada ao banco, evitando erro de `date/time field value out of range`.
- Ajuste do quadro da Resposta Restante no Passo 7 de 9, exibindo apenas “Resposta Restante — Média Importância”.
- Remoção do texto repetitivo abaixo de Reflexão Final no Passo 9 de 9.
- Proteção adicional na rota de envio para normalizar datas antes de chamar a função do Supabase.

## Banco de dados

Não há nova migração nesta release.

## Validação recomendada

1. Abrir um link público ainda não respondido.
2. Conferir os textos da tela inicial e do cabeçalho.
3. Preencher Data de Nascimento no formato dd/mm/aaaa.
4. Concluir todos os passos do formulário.
5. Enviar a avaliação e confirmar que os dados são salvos sem erro.
6. Reabrir o mesmo link e confirmar que permanece bloqueado após o envio.
