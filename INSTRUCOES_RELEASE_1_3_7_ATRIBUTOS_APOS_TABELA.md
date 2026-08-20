# Release 1.3.7 — Texto dos atributos após a tabela do item 6

## Ajuste solicitado

No Relatório Lifenergy V1, no item 6, o texto explicativo dos atributos deve vir **após a tabela**, e não antes.

## Antes

```text
6. Categorização dos padrões de comportamento (0 a 100%)
Texto explicativo dos atributos
Tabela de atributos
Leitura da métrica
```

## Agora

```text
6. Categorização dos padrões de comportamento (0 a 100%)
Tabela de atributos
Texto explicativo dos atributos
Leitura da métrica
```

## Observações importantes

1. Esta release não remove nenhum atributo.
2. Mantém os cinco atributos:
   - Socialização
   - Reflexão
   - Lazer
   - Propósito
   - Sentimento
3. Mantém a regra da 1.3.5:
   - a “Reflexão após essa tarefa” não deve ser analisada nem usada no relatório.
4. Não altera a geração por IA.
5. Não altera o banco de dados.
6. Relatórios já salvos podem ser baixados com o novo layout, pois o conteúdo é reutilizado e o DOCX é montado novamente pelo template atualizado.

## Arquivos alterados

```text
package.json
services/reports/lifenergyV1Types.ts
services/reports/lifenergyV1Docx.ts
```

## SQL

Não precisa executar SQL novo.

## Como aplicar

Na branch do motor de relatório:

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

1. Gere ou baixe um relatório.
2. Vá ao item 6.
3. Confirme que a tabela aparece primeiro.
4. Confirme que o texto explicativo dos atributos aparece logo abaixo da tabela.
5. Confirme que a Leitura da métrica aparece depois do texto explicativo.
6. Confirme que o botão Gerar relatório continua liberando após o download.

## Publicação no Sandbox

Depois de validar localmente:

```powershell
git add .
git commit -m "Release 1.3.7 - Move texto dos atributos para apos tabela"
git push origin feature/relatorio-lifenergy-v1-engine-1-3-2

git checkout feature/multiplos-fractais-prototipo
git pull origin feature/multiplos-fractais-prototipo
git merge feature/relatorio-lifenergy-v1-engine-1-3-2
npm run build
git push origin feature/multiplos-fractais-prototipo
```
