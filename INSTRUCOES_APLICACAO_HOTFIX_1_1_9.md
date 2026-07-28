# Como aplicar o Hotfix 1.1.9

Este pacote contém apenas os arquivos alterados para corrigir o formulário público da versão 1.1.8.

## Importante

O arquivo `app/page.tsx` não está incluído para não sobrescrever a página inicial que foi recuperada localmente.

## Aplicação

1. Feche o servidor local, se estiver rodando.
2. Extraia o conteúdo deste ZIP diretamente sobre a pasta do projeto atual:

   `C:\Projetos\lifenergyproject`

3. Permita substituir os arquivos existentes.
4. Rode:

   `npm install`

   `npm run build`

   `npm run dev`

5. Teste um link público novo ainda não respondido.

## Banco de dados

Não há nova migração de banco nesta versão.
