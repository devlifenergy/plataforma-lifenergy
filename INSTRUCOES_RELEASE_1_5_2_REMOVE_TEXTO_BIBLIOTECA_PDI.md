# Release 1.5.2 — Remoção de texto na Biblioteca Corporativa

## Ajuste solicitado

Na tela:

```text
Painel → PDI → Biblioteca Corporativa Inteligente → Arquivo do documento
```

foi removido o texto:

```text
Ao salvar, a IA lê o arquivo, interpreta o conteúdo e grava um sumário técnico interno no banco de dados. Esse sumário não fica visível para o usuário da empresa.
```

## O que permanece

Permanece apenas a orientação de formatos aceitos:

```text
Formatos aceitos nesta versão: TXT, MD, CSV, JSON e DOCX.
```

## Arquivos alterados

```text
package.json
components/application/CorporateDocumentForm.tsx
```

## SQL

Não precisa executar SQL.

## Como aplicar direto no Sandbox

```powershell
cd C:\Projetos\lifenergyproject
git checkout feature/multiplos-fractais-prototipo
git pull origin feature/multiplos-fractais-prototipo
```

Copie os arquivos deste ZIP por cima do projeto.

Depois rode:

```powershell
rmdir /s /q .next
npm run build
```

Se passar:

```powershell
git add .
git commit -m "Release 1.5.2 - Remove texto explicativo da Biblioteca Corporativa"
git push origin feature/multiplos-fractais-prototipo
```

## Teste

1. Abrir `Painel → PDI`.
2. Ir até `Biblioteca Corporativa Inteligente`.
3. Confirmar que o texto removido não aparece mais abaixo de `Arquivo do documento`.
4. Confirmar que o cadastro de documento continua funcionando.
