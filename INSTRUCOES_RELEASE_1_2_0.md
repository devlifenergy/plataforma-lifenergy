# Instruções — Release 1.2.0 Técnica

## Antes de aplicar

Confirme que você já fez backup do Supabase e salvou:

- `schema.sql`
- `data.sql`
- `backup_completo.dump`

Confirme também que a versão estável 1.1.10 está salva em Git.

## 1. Usar a branch correta

No PowerShell:

```powershell
cd C:\Projetos\lifenergyproject
git checkout feature/multiplos-fractais-prototipo
```

## 2. Aplicar o ZIP

Extraia o pacote da release 1.2.0 por cima da pasta:

```text
C:\Projetos\lifenergyproject
```

Permita substituir arquivos.

## 3. Executar a migration no Supabase

No Supabase Dashboard:

```text
SQL Editor → New query
```

Cole e execute todo o conteúdo do arquivo:

```text
banco/migrations/RELEASE_1_2_0_MULTIPLOS_FRACTAIS.sql
```

Essa migration é aditiva. Ela não apaga dados existentes.

## 4. Validar contagens

Depois da migration, rode no SQL Editor:

```sql
select
  'journeys' as tabela,
  count(*) as total
from journeys
union all
select
  'journey_responses',
  count(*)
from journey_responses
union all
select
  'journey_fractals',
  count(*)
from journey_fractals
union all
select
  'journey_response_fractals',
  count(*)
from journey_response_fractals;
```

A tabela `journey_fractals` deve ter pelo menos um registro para cada link/journey existente.
A tabela `journey_response_fractals` deve ter pelo menos um registro para cada resposta antiga já registrada.

## 5. Testar localmente

```powershell
npm install
npm run build
npm run dev
```

## 6. Testes obrigatórios

### Registro antigo

- Abrir exportação.
- Confirmar que registros antigos aparecem como Fractal 1.
- Confirmar que Fractal 2 e Fractal 3 ficam vazios para registros antigos.

### Novo link com 1 fractal

- Criar link com 1 fractal.
- Responder formulário.
- Exportar CSV.
- Confirmar uma linha por avaliado.

### Novo link com 2 fractais

- Criar link com 2 fractais.
- Responder formulário.
- Confirmar reflexão individual para cada fractal.
- Exportar CSV.

### Novo link com 3 fractais

- Criar link com 3 fractais.
- Responder formulário.
- Confirmar resumo final consolidado.
- Exportar CSV.

## 7. Publicação

Depois de aprovado localmente:

```powershell
git status
git add .
git commit -m "Release 1.2.0 - Múltiplos fractais por link"
git push origin feature/multiplos-fractais-prototipo
```

Depois da validação da branch, decidimos se fazemos merge para `main`.
