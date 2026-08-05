# Instruções — Release 1.1.10

## Objetivo

Aplicar melhorias operacionais sobre a versão estável 1.1.9, sem alterar o banco de dados.

## Antes de aplicar

No PowerShell:

```powershell
cd C:\Projetos\lifenergyproject
git checkout main
git pull origin main
git status
npm run build
git tag v1.1.9-estavel
git push origin v1.1.9-estavel
```

Se a tag já existir, ignore o erro da tag e siga.

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

Teste:

1. Tela de Avaliados.
2. Criação de um link.
3. Verificar se o botão muda para `Criando...` e impede cliques repetidos.
4. Verificar se os campos são limpos após o sucesso.
5. Criar um link pendente e testar `Excluir link`.
6. Confirmar que link respondido/concluído não permite exclusão.
7. Conferir leitura da tela e tamanho da fonte.

## Publicação

```powershell
git add .
git commit -m "Release 1.1.10 - Melhorias operacionais"
git push origin main
```
