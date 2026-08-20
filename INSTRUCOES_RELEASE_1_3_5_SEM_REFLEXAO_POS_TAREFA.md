# Release 1.3.5 — Excluir “Reflexão após essa tarefa” do relatório

## Correção de entendimento

A alteração correta NÃO é remover o atributo `Sentimento`.

A alteração correta é:

```text
A análise da “Reflexão após essa tarefa” não deve fazer parte do relatório em nenhuma circunstância.
```

## O que esta release faz

1. Restaura o comportamento anterior dos atributos do item 6:
   - Socialização
   - Reflexão
   - Lazer
   - Propósito
   - Sentimento

2. Remove a `Reflexão após essa tarefa` do fluxo do relatório.

3. O relatório não envia para a IA nem salva no snapshot do relatório os campos:
   - `final_feeling`
   - `finalFeeling`
   - reflexão final
   - “como você está se sentindo após essa tarefa”
   - qualquer equivalente de Reflexão após a tarefa

4. O prompt mestre passa a instruir explicitamente que esse conteúdo deve ser ignorado e não usado para:
   - padrões relacionais;
   - interpretação;
   - sugestões;
   - síntese;
   - recomendações;
   - métricas;
   - leitura da métrica.

5. O atributo `Reflexão` permanece, mas deve ser lido a partir das respostas, hierarquias, justificativas e fractais, nunca da reflexão após a tarefa.

6. O atributo `Sentimento` permanece, voltando ao modelo anterior.

7. A versão do motor foi atualizada para `1.3.5`, forçando nova geração e evitando reaproveitar relatórios salvos pela 1.3.3 ou pela tentativa anterior da 1.3.4.

## Arquivos alterados

```text
package.json
services/reports/lifenergyV1Types.ts
services/reports/lifenergyV1Data.ts
services/reports/lifenergyV1Prompt.ts
services/reports/lifenergyV1AI.ts
services/reports/lifenergyV1Docx.ts
```

## SQL

Não precisa executar SQL novo.

## Como aplicar

Na branch de desenvolvimento do relatório:

```powershell
cd C:\Projetos\lifenergyproject
git checkout feature/relatorio-lifenergy-v1-engine-1-3-2
```

Copie os arquivos deste ZIP por cima do projeto.

Depois rode:

```powershell
rmdir /s /q .next
npm run build
npm run dev
```

## Teste obrigatório

1. Gere um relatório novo.
2. Confirme que o item 6 voltou a apresentar:
   - Socialização
   - Reflexão
   - Lazer
   - Propósito
   - Sentimento
3. Confirme que o relatório não menciona nem analisa a “Reflexão após essa tarefa”.
4. Confirme que a síntese, recomendações e leitura da métrica não usam esse conteúdo.
5. Clique novamente em `Gerar relatório` e confirme que baixa o relatório salvo da versão 1.3.5.

## Publicação no Sandbox

Depois de validar:

```powershell
git add .
git commit -m "Release 1.3.5 - Exclui reflexao pos tarefa do relatorio"
git push origin feature/relatorio-lifenergy-v1-engine-1-3-2

git checkout feature/multiplos-fractais-prototipo
git pull origin feature/multiplos-fractais-prototipo
git merge feature/relatorio-lifenergy-v1-engine-1-3-2
npm run build
git push origin feature/multiplos-fractais-prototipo
```
