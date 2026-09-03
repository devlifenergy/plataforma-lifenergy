# Release 1.5.8 — Logomarca da Empresa e Matriz de Fractais

## Escopo

Esta versão complementa a 1.5.7 com três entregas:

1. Biblioteca Corporativa Inteligente permite carregar a logomarca da empresa.
2. A logomarca passa a ser usada no cabeçalho dos relatórios gerados.
3. A criação de convite deixa de ter digitação livre da atividade e passa a usar uma matriz de escolha:
   - Vórtice;
   - Ponto de Conexão;
   - Fractal.

Também altera o texto de boas-vindas do formulário público para 15 minutos por fractal ou atividade.

---

## 1. Logomarca da empresa

Na tela:

```text
Painel → Biblioteca
```

foi adicionada a área:

```text
Logomarca da empresa
```

O usuário pode enviar PNG ou JPG de até 1 MB.

A logomarca fica salva na tabela `organizations` e será usada no cabeçalho dos próximos documentos DOCX gerados:

```text
Relatório Lifenergy V1
PDI Lifenergy
```

## 2. Formulário público

Texto alterado de:

```text
O tempo estimado é de aproximadamente 10 minutos por fractal ou atividade.
```

para:

```text
O tempo estimado é de aproximadamente 15 minutos por fractal ou atividade.
```

## 3. Matriz de Fractais

Foi criado o arquivo:

```text
services/fractals/lifenergyFractalMatrix.ts
```

A criação do convite agora usa seletores encadeados:

```text
Vórtice → Ponto de Conexão → Fractal
```

O aplicador não digita mais livremente o texto da atividade.

O sistema armazena:

```text
vortex
connection_point
fractal_code
activity
```

nas tabelas:

```text
journey_fractals
journey_response_fractals
```

## 4. Versões

```text
package.json: 1.5.8
Relatório Lifenergy V1: lifenergy_v1_0_canonico_1_5_8
PDI Lifenergy: lifenergy_pdi_v4_1_1_5_8
```

## SQL obrigatório

Execute no Supabase Sandbox:

```text
banco/migrations/RELEASE_1_5_8_LOGO_EMPRESA_MATRIZ_FRACTAIS.sql
```

## Como aplicar no Sandbox

```powershell
cd C:\Projetos\lifenergyproject
git checkout feature/multiplos-fractais-prototipo
git pull origin feature/multiplos-fractais-prototipo
```

Copie os arquivos deste ZIP por cima do projeto.

Execute o SQL no Supabase Sandbox.

Depois rode:

```powershell
rmdir /s /q .next
npm run build
```

Se passar:

```powershell
git add .
git commit -m "Release 1.5.8 - Logo da empresa e matriz de fractais"
git push origin feature/multiplos-fractais-prototipo
```

## Testes obrigatórios

### Biblioteca

1. Abrir `Painel → Biblioteca`.
2. Carregar uma logomarca PNG ou JPG.
3. Confirmar mensagem de sucesso.
4. Atualizar a página e confirmar preview da logomarca.

### Relatórios

1. Gerar novo Relatório Lifenergy V1.
2. Confirmar logomarca no cabeçalho do DOCX.
3. Gerar novo PDI.
4. Confirmar logomarca no cabeçalho do DOCX.

### Formulário

1. Criar um convite em `Painel → Avaliados`.
2. Confirmar que a escolha de Fractal agora é feita por Vórtice, Ponto de Conexão e Fractal.
3. Abrir o link público.
4. Confirmar o texto de 15 minutos na tela de boas-vindas.
5. Concluir a avaliação.
