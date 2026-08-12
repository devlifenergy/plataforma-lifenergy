# Release 1.3.2 — Motor Canônico de Relatório Lifenergy

## Objetivo

Padronizar a geração do Relatório Lifenergy V1.0 em DOCX para aproximar o resultado do modelo validado no projeto Laudos Lifenergy V2.

## Principais mudanças

- Criação do Motor Canônico de Relatório Lifenergy.
- Novo `report_version`: `lifenergy_v1_0_canonico_1_3_2`.
- Novo Prompt Mestre com regras metodológicas mais rígidas.
- Saída JSON estruturada e normalizada.
- Registro de versão do motor, prompt e template na tabela `generated_reports`.
- Reuso do relatório já gerado: novos cliques baixam o mesmo conteúdo salvo.
- Regeneração permitida apenas para super usuário por meio do parâmetro `?regenerate=1`.
- DOCX com estrutura mais próxima do Relatório Lifenergy de referência.
- Correção do rótulo de aplicação automática no relatório.
- Remoção do botão/cartão de Protótipo 1.2.0 no painel.
- A rota antiga do protótipo redireciona para `/painel`.
- Tela inicial/painel sem linguagem de mockup/protótipo.

## Observação

Relatórios gerados nas versões 1.3.0/1.3.1 permanecem no banco, mas a 1.3.2 gera uma nova versão canônica para o mesmo avaliado na primeira geração após o patch.
