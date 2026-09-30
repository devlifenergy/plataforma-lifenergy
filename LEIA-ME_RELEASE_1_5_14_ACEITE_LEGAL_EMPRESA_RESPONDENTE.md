# Release 1.5.14 — Aceite legal Empresa e Respondente

Escopo:
- Separa os documentos legais:
  - Empresa: Termos de Uso (`/termos-de-uso`)
  - Respondente: Termo de Participação (`/termo-de-participacao`)
  - Geral: Política de Privacidade (`/politica-de-privacidade`)
- Adiciona links legais na tela de login.
- Cria a tela `/aceite-legal` para o primeiro acesso do usuário da empresa.
- Obriga o usuário da empresa a aceitar Termos de Uso e Política de Privacidade antes de acessar o Painel.
- Salva o aceite legal da empresa na tabela `profiles`.
- Mantém o aceite do respondente na tabela `journey_responses`.
- Ajusta o botão final das páginas legais para retornar ao contexto de origem via `returnTo`.

Ordem recomendada no Sandbox:
1. Aplicar o ZIP na raiz do projeto.
2. Executar no Supabase Sandbox:
   `banco/migrations/RELEASE_1_5_14_ACEITE_LEGAL_EMPRESA_RESPONDENTE.sql`
3. Rodar:
   `Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue`
   `npm run build`
4. Commitar e publicar no branch `feature/multiplos-fractais-prototipo`.

Observações:
- Usuários empresa sem aceite serão redirecionados para `/aceite-legal`.
- Super admin não é bloqueado por esta etapa de aceite.
- Registros antigos de respondentes e perfis antigos permanecerão sem aceite legal retroativo.
