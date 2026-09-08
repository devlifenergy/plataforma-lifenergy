# Release 1.5.9 — Aprimoramentos de UX, validações, PDI e bibliotecas

## Escopo
- Navegação renomeada: Painel Inicial, Aplicadores Autorizados, Biblioteca Corporativa; nova área PDI Corporativo e Biblioteca Técnica.
- PDI Corporativo por CPF, com cargo obrigatório e consolidação de avaliações do mesmo CPF.
- Botões de PDI com maior contraste visual e remoção do texto operacional simplificado.
- Fractais: numeração removida apenas da apresentação, sem alterar o conteúdo canônico; opções sem bullets visíveis.
- Mensagens de download de relatório/PDI desaparecem automaticamente após o início do download.
- Telefone brasileiro, e-mail e CPF com validações reforçadas; Cidade e Estado separados no formulário.
- Logo corporativa com tamanhos Pequeno/Médio/Grande e posições Esquerda/Centro/Direita, aplicada aos relatórios e PDIs.
- Relatório Comportamental: Item 5 passa a usar Atributo, Percentual e Significado com textos canônicos fixos.
- Envio de link de avaliação por e-mail.
- Cadastro de empresa com envio de credenciais e troca obrigatória de senha no primeiro acesso.
- Licenças separadas para Relatório Individual, PDI Relacional e PDI Corporativo.
- Biblioteca Técnica gerenciada pelo super usuário, com conteúdos públicos disponíveis antes do login.
- Biblioteca Corporativa com documentos vinculados ao avaliado/CPF e dicas nos botões de documentos avaliados.

## Banco de dados
Aplicar no Supabase Sandbox:
`banco/migrations/RELEASE_1_5_9_UX_VALIDACOES_LICENCAS_BIBLIOTECA.sql`

## E-mail transacional
Para envio real de e-mails, configurar no Sandbox:
- `RESEND_API_KEY`
- `LIFENERGY_EMAIL_FROM`
- `NEXT_PUBLIC_APP_URL` (recomendado)

Sem essas variáveis, o sistema mantém a operação e informa que o e-mail transacional não está configurado.

## Observação sobre Questionario_Context_PDI_Gestor.docx
O arquivo com esse nome exato não estava disponível no material pesquisável durante esta entrega. O Contexto Operacional foi estruturado com os campos do modelo corporativo disponível (cargo, área, gestor, contexto, situação, desafios, prioridades e direcionamento de carreira). A aderência literal ao questionário nomeado deve ser conferida quando o arquivo canônico estiver disponível.
