# Instruções — Branch 1.2.0 Protótipo Detalhado

## Objetivo

Validar visualmente a funcionalidade de múltiplos fractais por link, sem alterar o banco de dados.

## Decisão operacional do protótipo

O aplicador não deixará campos de fractais em branco. Em vez disso, o sistema perguntará quantos Fractais de Comportamento ele deseja aplicar no link:

- 1 Fractal
- 2 Fractais
- 3 Fractais

Depois da escolha, o sistema abrirá somente a quantidade correspondente de campos. Todos os campos abertos deverão ser obrigatórios.

## Aplicar somente na branch do protótipo

Use a mesma pasta do projeto, mas garanta que está na branch correta:

```powershell
cd C:\Projetos\lifenergyproject
git checkout feature/multiplos-fractais-prototipo
```

Se a branch ainda não existir:

```powershell
git checkout main
git pull origin main
git checkout -b feature/multiplos-fractais-prototipo
```

## Aplicação

Extraia este pacote por cima da pasta:

```text
C:\Projetos\lifenergyproject
```

Permita substituir os arquivos.

## Validação local

```powershell
npm install
npm run build
npm run dev
```

Abra:

```text
/painel/prototipo-multiplos-fractais
```

## Pontos que devem ser validados pelo time

1. O aplicador consegue escolher entre 1, 2 ou 3 fractais.
2. A tela abre somente a quantidade exata de campos escolhida.
3. O avaliado é obrigado a digitar a atividade em cada fractal.
4. Cada fractal mantém sua própria reflexão final.
5. O resumo por fractal está claro.
6. O resumo final consolidado atende ao projeto.
7. A exportação futura em uma linha por avaliado está coerente.
8. Os campos dos fractais não aplicados ficam vazios na exportação futura.

## Publicação da branch

```powershell
git add .
git commit -m "Release 1.2.0 - Protótipo visual detalhado de múltiplos fractais"
git push origin feature/multiplos-fractais-prototipo
```

Não publique esta branch sobre a produção sem aprovação do time.
