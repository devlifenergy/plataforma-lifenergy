# Instruções — Release 1.5.9 (Sandbox)

1. Faça backup/commit da versão 1.5.8 validada.
2. Extraia o pacote 1.5.9 na raiz do projeto, sobrescrevendo os arquivos.
3. Execute `npm run build`.
4. Somente se o build passar, execute no Supabase **Sandbox** a migration:
   `banco/migrations/RELEASE_1_5_9_UX_VALIDACOES_LICENCAS_BIBLIOTECA.sql`
5. Configure as variáveis de e-mail no ambiente Sandbox caso queira testar envio real:
   `RESEND_API_KEY`, `LIFENERGY_EMAIL_FROM`, `NEXT_PUBLIC_APP_URL`.
6. Faça commit/push apenas na branch `feature/multiplos-fractais-prototipo`.
7. Não faça merge para `main` nesta etapa.

## Testes mínimos
- Menu e novas abas.
- Aplicador: telefone/e-mail.
- Avaliado: CPF, e-mail, Cidade/Estado e envio do link por e-mail.
- Fractais sem numeração/bullets visíveis e sem duplicidade.
- Relatório V1 Item 5 e logo configurável.
- PDI Relacional e PDI Corporativo; Corporativo exige cargo e agrupa por CPF.
- Limites de licenças.
- Primeiro acesso da nova empresa obriga troca de senha.
- Biblioteca Corporativa: documento vinculado ao avaliado.
- Biblioteca Técnica autenticada e pública.
