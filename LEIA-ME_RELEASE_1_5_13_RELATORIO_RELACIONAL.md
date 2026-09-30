# Release 1.5.13 — Relatório Relacional: Recomendações integradas

## Escopo
Este pacote altera apenas o modelo canônico do Relatório Relacional/Lifenergy V1.

## Alterações
1. Remove a seção “Sugestões de desenvolvimento – Fractal X” de dentro de cada fractal no DOCX.
2. Mantém, em cada fractal, apenas a tabela de respostas/padrões e a “Interpretação do Fractal X”.
3. Amplia o item 6 — “Recomendações para desenvolvimento de habilidades”.
4. Adiciona recomendações por habilidade, conectadas aos fractais.
5. Adiciona tabela de tarefas recomendadas para desenvolvimento, também conectadas aos fractais.

## Arquivos alterados
- services/reports/lifenergyV1Types.ts
- services/reports/lifenergyV1Prompt.ts
- services/reports/lifenergyV1AI.ts
- services/reports/lifenergyV1Docx.ts

## Como aplicar
Extraia o ZIP na raiz do projeto e substitua os arquivos.
Depois rode:

```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run build
```

Se o build estiver OK, publique no Sandbox pela branch `feature/multiplos-fractais-prototipo`.
