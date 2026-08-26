# Release 1.5.5 — Métrica exata do Relatório Lifenergy V1/V2

## Correção da 1.5.4

A 1.5.4 introduziu uma regra indevida: forçar percentuais múltiplos de 5.

Isso foi removido.

## Regra correta

Os percentuais do item 6 devem ser números inteiros exatos entre 0% e 100%, conforme o cálculo/interpretação metodológica.

Não devem ser arredondados para múltiplos de 5.

Exemplos válidos:

```text
82%
58%
87%
91%
```

## Âncoras de calibração

### Camilla/Camila Aquino — Laudos Lifenergy V2

```text
Socialização 70%
Reflexão 90%
Lazer 65%
Propósito 95%
Sentimento 75%
```

### Caroline Nery — Laudo Lifenergy V1

```text
Socialização 82%
Reflexão 90%
Lazer 58%
Propósito 87%
Sentimento 91%
```

Essas âncoras foram incluídas para aproximar a Plataforma Lifenergy dos laudos anteriores validados.

## Arquivos alterados

```text
package.json
services/reports/lifenergyV1Types.ts
services/reports/lifenergyV1Prompt.ts
services/reports/lifenergyV1AI.ts
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
git commit -m "Release 1.5.5 - Corrige metrica exata do Relatorio Lifenergy"
git push origin feature/multiplos-fractais-prototipo
```

## Testes obrigatórios

1. Gerar novo relatório da Camilla/Camila Aquino.
2. Conferir item 6:
   - Socialização 70%
   - Reflexão 90%
   - Lazer 65%
   - Propósito 95%
   - Sentimento 75%

3. Gerar novo relatório da Caroline Nery, se os mesmos dados estiverem cadastrados.
4. Conferir item 6:
   - Socialização 82%
   - Reflexão 90%
   - Lazer 58%
   - Propósito 87%
   - Sentimento 91%
