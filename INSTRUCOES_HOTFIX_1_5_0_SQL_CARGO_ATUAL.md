# Hotfix 1.5.0 — Correção do SQL do campo Cargo atual

## Problema encontrado

Ao executar o SQL da Release 1.5.0 no Supabase Sandbox, ocorreu erro de sintaxe na linha do campo técnico usado para representar o cargo atual.

## Causa

O nome técnico anterior do campo conflitava com um identificador especial do PostgreSQL.

## Correção aplicada

O campo técnico foi renomeado para:

```text
current_job_title
```

O rótulo exibido para o usuário continua sendo:

```text
Cargo atual
```

## Arquivos corrigidos

```text
banco/migrations/RELEASE_1_5_0_BIBLIOTECA_CORPORATIVA_PDI.sql
app/painel/pdi/page.tsx
services/pdi/actions.ts
services/pdi/corporateKnowledge.ts
services/pdi/lifenergyPdiDocx.ts
```

## O que fazer agora

1. Copie este ZIP por cima do projeto.
2. Execute novamente o SQL corrigido no Supabase Sandbox:

```text
banco/migrations/RELEASE_1_5_0_BIBLIOTECA_CORPORATIVA_PDI.sql
```

Pode executar novamente com segurança. A tabela `organization_documents` pode já ter sido criada antes do erro, mas o SQL corrigido usa `create table if not exists`.

## Depois do SQL

Rode:

```powershell
rmdir /s /q .next
npm run build
npm run dev
```

## Teste obrigatório

1. Entrar como empresa.
2. Abrir `Painel → PDI`.
3. Cadastrar documentos na Biblioteca Corporativa.
4. Preencher o campo `Cargo atual`.
5. Confirmar que o PDI Corporativo libera quando os 4 documentos obrigatórios da empresa estiverem cadastrados.
