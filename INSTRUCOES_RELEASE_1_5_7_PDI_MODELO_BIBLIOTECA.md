# Release 1.5.7 — Ajustes PDI Corporativo e Biblioteca

## Escopo

Esta release complementa a 1.5.6 com três ajustes:

1. PDI Corporativo ajustado para seguir o novo modelo anexado.
2. Botão alterado de `Gerar novo PDI Corporativo` para `Gerar um novo PDI Corporativo`.
3. Biblioteca Corporativa:
   - remove o campo `Nome do documento`;
   - Documento passa a ser identificado automaticamente pela categoria;
   - campo de arquivo passa a usar textos em português.

## PDI Corporativo

O template DOCX foi ajustado para ficar mais próximo do novo modelo de PDI:

```text
SEÇÃO 1 – IDENTIFICAÇÃO DO COLABORADOR / AVALIADO
SEÇÃO 2 – CONTEXTO DO PDI
SEÇÃO 3 – OBJETIVO CENTRAL DO PDI
3.1 – Objetivo de carreira / desenvolvimento profissional
SEÇÃO 4 – DIAGNÓSTICO E ANÁLISE DE PERFIL
4.1 – Avaliação do Colaborador / Avaliado
4.2 e 4.3 – Pontos Fortes e Oportunidades de Melhoria
SEÇÃO 5 – COMPETÊNCIAS A DESENVOLVER
SEÇÃO 6 – OBJETIVOS DE DESENVOLVIMENTO
SEÇÃO 7 – PLANO DE AÇÃO 70-20-10
SEÇÃO 8 – INDICADORES E EVIDÊNCIAS DE EVOLUÇÃO
SEÇÃO 9 – APOIO E SUPORTE NECESSÁRIO
SEÇÃO 10 – MONITORAMENTO E AVALIAÇÃO
SEÇÃO 11 – ASSINATURAS E APROVAÇÕES
```

A Seção 7 passa a apresentar uma subseção por competência, no formato:

```text
Competência 1 – Nome da competência

Dimensão | Ação
70% – Prática
20% – Social
10% – Formal

Frequência · Responsável · Recursos
Evidência de conclusão
```

Também foi incluído cabeçalho no DOCX:

```text
PDI Lifenergy – Nome do avaliado
Plataforma Lifenergy · PDI Lifenergy · Biblioteca Corporativa Inteligente
```

## Biblioteca Corporativa

O formulário não possui mais `Nome do documento`.

Agora a empresa preenche apenas:

```text
Categoria do documento
Arquivo do documento
```

Na tabela, o campo `Documento` passa a exibir a categoria do documento.

## SQL

Não há SQL novo nesta release.

A 1.5.7 depende apenas do SQL da 1.5.6 já aplicado no Sandbox.

## Publicação no Sandbox

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
git commit -m "Release 1.5.7 - Ajusta PDI corporativo e Biblioteca"
git push origin feature/multiplos-fractais-prototipo
```

## Testes obrigatórios

1. Abrir `Painel → Biblioteca`.
2. Confirmar que não existe o campo `Nome do documento`.
3. Confirmar que o campo `Arquivo do documento` está em português:
   - `Selecionar arquivo`;
   - `Nenhum arquivo selecionado`;
   - `Salvar documento na Biblioteca`.
4. Cadastrar novo documento.
5. Atualizar documento e confirmar `Selecionar arquivo atualizado`.
6. Abrir `Painel → PDI`.
7. Confirmar botão `Gerar um novo PDI Corporativo`.
8. Gerar novo PDI Corporativo.
9. Conferir o DOCX:
   - cabeçalho;
   - Seção 7 por competência;
   - tabela Dimensão/Ação;
   - assinatura e declaração final.
