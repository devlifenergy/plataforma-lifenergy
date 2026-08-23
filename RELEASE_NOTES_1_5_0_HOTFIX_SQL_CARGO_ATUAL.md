# Hotfix 1.5.0 — SQL do Cargo atual

Corrige erro de sintaxe no SQL da Release 1.5.0.

## Alteração

O campo técnico do cargo atual foi renomeado para:

```text
current_job_title
```

O rótulo funcional continua sendo:

```text
Cargo atual
```

## SQL

Execute novamente:

```text
banco/migrations/RELEASE_1_5_0_BIBLIOTECA_CORPORATIVA_PDI.sql
```
