# Release 1.5.3 — Ajustes do PDI, documentos corporativos e regeneração

## Ajustes implementados

1. Painel central
   - Incluído quadro descritivo de acesso ao PDI, junto dos quadros de Aplicadores e Avaliados.

2. Tela PDI — Biblioteca Corporativa
   - Removida a coluna `Status IA`.
   - A lista passa a ter ações:
     - Editar
     - Fazer Download
     - Atualizar
     - Arquivar
   - Ao atualizar um documento, a tela informa que os PDIs Corporativos já gerados devem ser gerados novamente para refletir o novo contexto.

3. Documentos corporativos
   - Novo armazenamento do arquivo original em base64 para permitir download.
   - Documentos criados antes da 1.5.3 podem não ter arquivo disponível para download; nesse caso, atualize o documento para habilitar download.

4. Regeneração do PDI Corporativo
   - O PDI continua salvo no banco e é baixado sempre da mesma versão salva.
   - Se documentos corporativos forem atualizados depois da geração do PDI Corporativo, a tela mostra a opção `Gerar novo PDI Corporativo`.
   - A regeneração do PDI deixa de ser restrita ao super usuário e passa a ser permitida ao usuário autorizado da empresa.

5. Relatório PDI Corporativo
   - Linguagem orientada ao modelo corporativo revisado.
   - Seção 1 sem bullets.
   - Removida a seção 2.1 de documentos corporativos utilizados.
   - Na seção 4.1, removida a coluna `Descrição` da tabela de atributos.
   - Os itens 4.2 e 4.3 passam a compor uma tabela única de Pontos Fortes e Oportunidades de Melhoria.
   - Competências e objetivos recebem redação mais corporativa, com foco em estratégia, evidência, ciclos de trabalho e resultados observáveis.

## Arquivos alterados

```text
package.json
app/painel/page.tsx
app/painel/pdi/page.tsx
app/api/pdi/lifenergy/[responseId]/route.ts
app/api/pdi/documents/[documentId]/download/route.ts
components/application/CorporateDocumentForm.tsx
components/application/GeneratePdiButton.tsx
services/pdi/actions.ts
services/pdi/corporateDocumentAI.ts
services/pdi/corporateKnowledge.ts
services/pdi/lifenergyPdiTypes.ts
services/pdi/lifenergyPdiPrompt.ts
services/pdi/lifenergyPdiAI.ts
services/pdi/lifenergyPdiData.ts
services/pdi/lifenergyPdiDocx.ts
banco/migrations/RELEASE_1_5_3_DOCUMENTOS_CORPORATIVOS_DOWNLOAD_REGERAR.sql
```

## SQL obrigatório

Execute no Supabase Sandbox:

```text
banco/migrations/RELEASE_1_5_3_DOCUMENTOS_CORPORATIVOS_DOWNLOAD_REGERAR.sql
```

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
git commit -m "Release 1.5.3 - Ajusta PDI e documentos corporativos"
git push origin feature/multiplos-fractais-prototipo
```

## Teste obrigatório

1. Abrir `Painel` e confirmar o novo quadro `PDI`.
2. Abrir `Painel → PDI`.
3. Confirmar que a coluna `Status IA` não aparece.
4. Confirmar que documentos têm opções de Editar, Fazer Download e Atualizar.
5. Atualizar um documento corporativo.
6. Confirmar que a tela informa que o PDI Corporativo precisa ser gerado novamente.
7. Gerar PDI Corporativo.
8. Atualizar um documento corporativo.
9. Confirmar que aparece a opção `Gerar novo PDI Corporativo`.
10. Gerar novo PDI Corporativo.
11. Conferir o DOCX:
    - Seção 1 sem bullets;
    - sem seção 2.1;
    - seção 4.1 sem coluna Descrição;
    - itens 4.2 e 4.3 em tabela;
    - linguagem corporativa.
