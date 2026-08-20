# Instruções — Release 1.3.3

## Antes de aplicar

Use a branch da 1.3.2:

```powershell
cd C:\Projetos\lifenergyproject
git checkout feature/relatorio-lifenergy-v1-engine-1-3-2
```

## Aplicação

Copie os arquivos deste pacote por cima do projeto.

## SQL

Não é necessário executar SQL novo.

## Build local

```powershell
rmdir /s /q .next
npm run build
npm run dev
```

## Testes obrigatórios

### Relatório

1. Gerar relatório de uma avaliação concluída.
2. Confirmar título: `RELATORIO LIFENERGY - DESENVOLVIMENTO HUMANO`.
3. Confirmar item 4: `4. Síntese dos padrões relacionais`.
4. Confirmar quarta coluna das tabelas: `Padrões relacionais identificados`.
5. Confirmar texto fixo dos atributos no item 6.
6. Confirmar que relatórios antigos gerados na 1.3.2 não são reutilizados como 1.3.3.

### Super usuário

1. Cadastrar nova empresa.
2. Clicar várias vezes no botão `Cadastrar Empresa` e confirmar que fica bloqueado.
3. Confirmar que os campos limpam após sucesso.
4. Acessar `Laudos e Exportações`.
5. Aplicar filtros e confirmar preview dos dados antes de exportar.

### Cliente

1. Cadastrar novo aplicador.
2. Clicar várias vezes no botão `+ Novo Aplicador` e confirmar que fica bloqueado.
3. Confirmar que os campos limpam após sucesso.

## Publicar no Sandbox

Depois de validar localmente:

```powershell
git add .
git commit -m "Release 1.3.3 - Ajustes relatorio e cadastros"
git push origin feature/relatorio-lifenergy-v1-engine-1-3-2
```

Para publicar no Sandbox do time:

```powershell
git checkout feature/multiplos-fractais-prototipo
git pull origin feature/multiplos-fractais-prototipo
git merge feature/relatorio-lifenergy-v1-engine-1-3-2
npm run build
git push origin feature/multiplos-fractais-prototipo
```

Não fazer merge na `main` ainda.
