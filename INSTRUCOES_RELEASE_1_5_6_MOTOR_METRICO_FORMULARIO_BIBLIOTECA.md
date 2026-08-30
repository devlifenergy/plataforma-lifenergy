# Release 1.5.6 — Motor Métrico Canônico, Biblioteca Separada e Ajustes do Formulário

## Escopo da versão

Esta versão concentra os ajustes solicitados para:

1. Relatório Lifenergy V1;
2. autocalibração dos percentuais do relatório comportamental;
3. Biblioteca Corporativa Inteligente em tela separada;
4. geração de convites de Avaliados;
5. formulário público;
6. simplificação do Contexto Operacional do PDI.

---

## 1. Relatório Lifenergy V1 — Motor Métrico Canônico

Foi criado o motor:

```text
services/reports/lifenergyV1MetricEngine.ts
```

O objetivo é reduzir variações indesejadas nos percentuais da tabela de atributos do relatório comportamental.

A lógica aplicada é:

```text
IA interpreta o conteúdo textual.
Sistema calcula os percentuais pelo motor canônico.
DOCX apresenta os percentuais calculados.
```

O motor usa:

```text
1. Assinaturas de respostas;
2. 19 casos canônicos validados;
3. cálculo heurístico por palavras-chave e pesos;
4. hierarquia 3/2/1;
5. recorrência entre fractais;
6. centralidade na síntese;
7. autocalibração por relatórios gerados.
```

A versão do relatório passa a ser:

```text
lifenergy_v1_0_canonico_1_5_6
```

Isso força a geração de novo relatório, evitando reutilizar relatórios antigos com lógica anterior.

---

## 2. Autocalibração

Foi criada a tabela:

```text
lifenergy_metric_calibrations
```

A cada novo Relatório Lifenergy V1 gerado, o sistema salva:

```text
response_signature
attributes_json
metric_engine_version
evidence_json
```

Com isso, novos relatórios ajudam a estabilizar a régua de calibração do Item 5 do relatório comportamental.

---

## 3. Ordem do relatório comportamental

A ordem do Relatório Lifenergy V1 foi alterada.

Antes:

```text
5. Recomendações para desenvolvimento de habilidades
6. Categorização dos padrões de comportamento (0 a 100%)
```

Agora:

```text
5. Categorização dos padrões de comportamento (0 a 100%)
6. Recomendações para desenvolvimento de habilidades
```

A tabela de atributos e a leitura da métrica passam a aparecer antes das recomendações.

---

## 4. Biblioteca Corporativa Inteligente

A Biblioteca Corporativa Inteligente agora é uma tela separada:

```text
/painel/biblioteca
```

Também foi criado item próprio no menu:

```text
Biblioteca
```

Na tabela de documentos avaliados:

```text
- foi removida a coluna Arquivo;
- o campo Documento passa a ser suficiente;
- permanecem as ações Editar, Fazer Download, Atualizar e Arquivar.
```

---

## 5. Tela de Avaliados

A criação do convite agora pede os mesmos dados do passo de identificação do formulário:

```text
Nome completo
E-mail
CPF
Naturalidade
Data de nascimento
Objetivo de participação
Aplicador
Quantidade de fractais
Texto dos fractais
```

O botão:

```text
Criar Convite
```

foi movido para o canto inferior direito, após todos os campos.

---

## 6. Formulário público

Ajustes aplicados:

```text
1. Timer na barra superior para mostrar o tempo de resposta.
2. Tela de boas-vindas integrada ao fluxo do formulário.
3. Passo de identificação pré-preenchido com dados do convite.
4. Texto do passo de cópia alterado para:
   "Escreva o texto acima no quadro abaixo."
5. Instrução destacada:
   "Escreva três respostas espontâneas para a tarefa."
6. Instrução destacada:
   "Releia suas respostas e clique na que você considera de maior importância."
7. Proteção contra perda de conteúdo ao usar botão voltar do navegador.
8. Rascunho local salvo no navegador até a conclusão da avaliação.
```

---

## 7. PDI

A tela PDI foi simplificada.

A Biblioteca sai da tela PDI e passa para tela própria.

O Contexto Operacional do PDI agora mantém apenas campos essenciais:

```text
Tipo de PDI preferencial
Tipo de pessoa avaliada
Cargo atual
Área
Situação atual
Prioridades de desenvolvimento
```

---

## SQL obrigatório

Execute no Supabase Sandbox:

```text
banco/migrations/RELEASE_1_5_6_MOTOR_METRICO_FORMULARIO_BIBLIOTECA.sql
```

Este SQL:

```text
1. adiciona campos de pré-cadastro na tabela journeys;
2. cria a tabela lifenergy_metric_calibrations;
3. atualiza a função get_public_journey_context_v2_by_token.
```

---

## Como aplicar direto no Sandbox

```powershell
cd C:\Projetos\lifenergyproject
git checkout feature/multiplos-fractais-prototipo
git pull origin feature/multiplos-fractais-prototipo
```

Copie os arquivos deste ZIP por cima do projeto.

Depois execute o SQL no Supabase Sandbox:

```text
banco/migrations/RELEASE_1_5_6_MOTOR_METRICO_FORMULARIO_BIBLIOTECA.sql
```

Depois rode:

```powershell
rmdir /s /q .next
npm run build
```

Se passar:

```powershell
git add .
git commit -m "Release 1.5.6 - Motor metrico canonico e ajustes do formulario"
git push origin feature/multiplos-fractais-prototipo
```

---

## Testes obrigatórios

### Relatório Lifenergy V1

1. Gerar novo relatório da Camilla/Camila Aquino.
2. Conferir se o relatório gerado está na versão 1.5.6.
3. Conferir se a ordem ficou:
   - 5. Categorização dos padrões de comportamento;
   - 6. Recomendações para desenvolvimento de habilidades.
4. Conferir os percentuais esperados da Camilla/Camila:
   - Socialização 70%;
   - Reflexão 90%;
   - Lazer 65%;
   - Propósito 95%;
   - Sentimento 75%.

### Biblioteca

1. Abrir `Painel → Biblioteca`.
2. Confirmar que a Biblioteca Corporativa Inteligente está fora do PDI.
3. Confirmar que a tabela não mostra o nome técnico do arquivo.
4. Confirmar que aparecem Documento e Ações.

### Avaliados

1. Abrir `Painel → Avaliados`.
2. Criar convite preenchendo todos os campos novos.
3. Confirmar que o botão Criar Convite fica no canto inferior direito.
4. Abrir o link gerado.

### Formulário público

1. Confirmar timer na barra superior.
2. Confirmar dados pré-preenchidos no passo de identificação.
3. Confirmar textos destacados nos passos de resposta e hierarquia.
4. Preencher parcialmente, usar voltar do navegador e confirmar que o conteúdo não foi perdido.
5. Concluir avaliação.

### PDI

1. Abrir `Painel → PDI`.
2. Confirmar que a Biblioteca não aparece mais dentro do PDI.
3. Confirmar contexto operacional simplificado.


---

## Hotfix SQL incluído

Esta versão do pacote já corrige o erro:

```text
ERROR: 42P13: cannot change return type of existing function
```

O SQL remove a assinatura antiga da função:

```sql
drop function if exists public.get_public_journey_context_v2_by_token(text);
```

e recria a função com os novos campos necessários para pré-preencher o formulário público.
