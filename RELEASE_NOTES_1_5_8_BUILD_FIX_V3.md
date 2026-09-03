# Release 1.5.8 — Build Fix V3

Pacote reconstruído a partir da pasta completa do projeto fornecida pelo usuário.

Correções consolidadas:
- preservação dos campos vortex, connectionPoint e fractalCode no formulário público;
- tipagem dos fractais em services/journeys/actions.ts compatível com a matriz Lifenergy;
- edição de Avaliados usando seleção hierárquica Vórtice → Ponto de Conexão → Fractal, sem digitação livre;
- inclusão dos helpers de logomarca no gerador de PDI: getOrganizationLogoMedia, logoDrawingXml, buildLogoHeaderXml e buildHeaderRelsXml;
- manutenção do texto de 15 minutos por fractal ou atividade;
- manutenção da matriz Lifenergy da release 1.5.8 presente na pasta enviada.

Observação: o build final deve ser executado no ambiente local do projeto, que contém as dependências completas.
