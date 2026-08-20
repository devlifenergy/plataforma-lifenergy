# Hotfix 1.3.3 — Correção de build em Aplicadores

## Erro corrigido

```text
Type error: Cannot find name 'Button'.
./app/painel/aplicadores/page.tsx:114:32
```

## Causa

O arquivo `app/painel/aplicadores/page.tsx` usava o componente `<Button>`, mas faltava importar:

```ts
import { Button } from "@/components/ui/Button";
```

## Como aplicar

Copie o arquivo deste pacote:

```text
app/painel/aplicadores/page.tsx
```

para:

```text
C:\Projetos\lifenergyproject\app\painel\aplicadores\page.tsx
```

Depois rode:

```powershell
rmdir /s /q .next
npm run build
```

Se passar, siga com commit/push/merge para Sandbox.
