-- RELEASE 1.2.0 - Patch sem RPC no envio final
-- Este patch NÃO é obrigatório para corrigir o envio final.
-- A correção principal está no arquivo app/api/journeys/submit/route.ts,
-- que passou a salvar diretamente nas tabelas usando o cliente admin do servidor.
--
-- Use este SQL apenas como verificação: ele confirma se as tabelas da 1.2.0 existem.

select
  table_name,
  case when table_name is not null then 'OK' else 'FALTANDO' end as status
from information_schema.tables
where table_schema = 'public'
  and table_name in ('journey_fractals', 'journey_response_fractals')
order by table_name;
