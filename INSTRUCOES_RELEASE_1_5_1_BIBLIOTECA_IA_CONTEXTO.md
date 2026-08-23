# Release 1.5.1 — Ajustes da tela PDI e Biblioteca Corporativa com IA

## Ajustes solicitados

1. Remover da tela da empresa o campo:
   `Conteúdo do documento para uso da IA`.

2. O sumário para uso da IA deve ser gerado automaticamente no momento em que o documento é carregado.

3. O sumário técnico gerado pela IA deve ser salvo no banco de dados, mas não deve ficar visível para o usuário no ambiente da empresa.

4. Alinhar os botões:
   - Gerar PDI Relacional
   - Gerar PDI Corporativo

5. Na área `Contexto operacional do PDI`, cada campo passa a ter:
   - texto explicativo;
   - exemplo de preenchimento.

## Como ficou

### Biblioteca Corporativa

A empresa informa apenas:

```text
Categoria do documento
Nome do documento
Arquivo do documento
```

Ao salvar, o sistema:

```text
1. Lê o arquivo enviado.
2. Extrai o texto quando possível.
3. Envia o conteúdo para a IA.
4. A IA interpreta o documento.
5. O sistema grava no banco um sumário técnico interno.
6. O sumário não aparece na tela da empresa.
```

Formatos aceitos nesta versão:

```text
TXT
MD
CSV
JSON
DOCX
```

PDF ainda não é lido automaticamente nesta versão.

### Contexto operacional do PDI

Cada campo agora tem orientação e exemplo para reduzir dúvidas no preenchimento.

### Botões

Os botões de geração de PDI foram padronizados em grade com largura uniforme.

## Arquivos alterados

```text
package.json
app/painel/pdi/page.tsx
components/application/CorporateDocumentForm.tsx
components/application/GeneratePdiButton.tsx
services/pdi/actions.ts
services/pdi/corporateDocumentAI.ts
banco/migrations/RELEASE_1_5_0_BIBLIOTECA_CORPORATIVA_PDI.sql
```

## SQL

Não é obrigatório executar SQL novo se a migração 1.5.0 já foi aplicada.

O SQL incluído foi ajustado apenas para instalações novas, atualizando o comentário técnico do campo `content_text`.

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
git commit -m "Release 1.5.1 - Ajusta Biblioteca Corporativa e contexto do PDI"
git push origin feature/multiplos-fractais-prototipo
```

## Teste obrigatório

1. Entrar como empresa.
2. Abrir `Painel → PDI`.
3. Confirmar que não existe mais o campo `Conteúdo do documento para uso da IA`.
4. Cadastrar documento com arquivo DOCX ou TXT.
5. Confirmar que o documento é salvo.
6. Confirmar que a lista mostra apenas status de IA, sem exibir o sumário.
7. Confirmar alinhamento dos botões de PDI.
8. Abrir `Contexto operacional do PDI`.
9. Confirmar que todos os campos têm texto explicativo e exemplo.
10. Gerar PDI Relacional e Corporativo.
