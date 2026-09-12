# Release 1.5.9 - Ajuste de Arquitetura

## Licenciamento
- Licença é consumida somente na primeira geração de um novo documento.
- Download de documento já salvo não consome licença.
- Documentos anteriores ao marco `licenses_started_at` não entram em Utilizadas.
- Saldo exibido como Contratadas / Utilizadas / Disponíveis.
- Licença nula passa a equivaler a zero, não a ilimitado.

## Fluxos
- "Avaliados" passa a "Aplicação on-line".
- Geração de relatório sai da tela de Aplicação on-line e ganha a área "Relatório Relacional".
- PDI Relacional e PDI Corporativo exigem relatório previamente salvo.
- Listagem dos PDIs é agrupada por CPF, com 1 PDI por relatório.
- PDI Corporativo não consolida outras avaliações do CPF no conteúdo.
- Removido Contexto Complementar do PDI Relacional.
- Removido o campo visível "Tipo de Pessoa Avaliada" do Contexto Operacional do PDI.
- Removida da Biblioteca a área de documentos vinculados aos avaliados.
- Painel Inicial passa a espelhar as opções funcionais do menu lateral.
