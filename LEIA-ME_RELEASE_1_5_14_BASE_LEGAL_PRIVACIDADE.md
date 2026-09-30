# Release 1.5.14 — Base Legal, Privacidade e Segurança Inicial

Escopo:
- Cria `/termos-de-uso`.
- Cria `/politica-de-privacidade`.
- Adiciona links legais no rodapé da Home.
- Adiciona links legais nas telas públicas de aplicação e conclusão.
- Adiciona aviso legal e checkbox obrigatório no final da aplicação on-line.
- Registra versão e data/hora de ciência em `journey_responses`.

Texto de ciência usado:
> Ao prosseguir, declaro estar ciente de que meus dados serão utilizados para fins de geração de um relatorio de analise relacional usando a metodologia Lifenergy, conforme a Política de Privacidade.

Ordem recomendada no Sandbox:
1. Aplicar o ZIP na raiz do projeto.
2. Rodar a migration SQL no Supabase Sandbox:
   `banco/migrations/RELEASE_1_5_14_LEGAL_PRIVACIDADE_SEGURANCA.sql`
3. Rodar `npm run build`.
4. Commitar e publicar no branch `feature/multiplos-fractais-prototipo`.

Observação:
- Os textos legais são base inicial operacional e devem passar por validação jurídica antes da publicação definitiva em produção.
