# Lifenergy Platform MVP 1.0
## Sprint 1 - Pacote 2: Autenticação

## Objetivo
Implementar login, logout, callback de autenticação, proteção de rotas e painel inicial da empresa usando Supabase Auth.

## Pré-requisito
Instale o pacote oficial para autenticação server-side:

```bash
npm install @supabase/ssr
```

## Arquivos incluídos
Copie os arquivos deste pacote para a raiz do projeto Next.js, substituindo quando solicitado.

```
app/login/page.tsx
app/auth/callback/route.ts
app/painel/page.tsx
components/layout/CompanyShell.tsx
lib/supabaseClient.ts
lib/supabaseServer.ts
services/auth/actions.ts
middleware.ts
```

## Variáveis de ambiente
Confirme que `.env.local` contém:

```env
NEXT_PUBLIC_SUPABASE_URL=https://sgcycwtdrxutghdnmyle.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_7Bpgy26g4uQTqrvdRA4llQ_xVjWoz22
```

## Como testar
1. Copie os arquivos.
2. Execute:

```bash
npm run dev
```

3. Acesse:

```
http://localhost:3000/login
```

4. Faça login com um usuário criado no Supabase Auth.
5. O sistema deve redirecionar para:

```
/painel
```

## Importante
Para o usuário acessar o painel, ele precisa existir em:

- Supabase Auth
- tabela `profiles`

O campo `profiles.auth_user_id` deve ser igual ao ID do usuário no Supabase Auth.

## Critério de aceite
- Login funciona.
- Usuário autenticado acessa `/painel`.
- Usuário não autenticado é redirecionado para `/login`.
- Logout funciona.
