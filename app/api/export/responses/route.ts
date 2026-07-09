import { createClient } from "@/lib/supabaseServer";

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function labelApplicationType(value: unknown) {
  const labels: Record<string, string> = {
    auto_aplicacao: "Auto Aplicação",
    aplicacao_assistida: "Aplicação Assistida",
  };
  return labels[String(value ?? "")] ?? String(value ?? "");
}

function labelActivityChoice(value: unknown) {
  const labels: Record<string, string> = {
    propria_pessoa: "A própria pessoa",
    aplicador: "O aplicador",
  };
  return labels[String(value ?? "")] ?? String(value ?? "");
}

function labelStatus(value: unknown) {
  const labels: Record<string, string> = {
    created: "Criada",
    link_sent: "Convite enviado",
    in_progress: "Em andamento",
    completed: "Concluída",
    exported: "Exportada",
  };
  return labels[String(value ?? "")] ?? String(value ?? "");
}

function formatDate(value: unknown) {
  if (!value) return "";
  const text = String(value);
  const [year, month, day] = text.slice(0, 10).split("-");
  if (!year || !month || !day) return text;
  return `${day}/${month}/${year}`;
}

function formatDateTime(value: unknown) {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("pt-BR");
}

function buildExcelHtml(rows: any[]) {
  const columns = [
    ["Código", (r: any) => r.code],
    ["Empresa", (r: any) => r.organization_name],
    ["Aplicador", (r: any) => r.applicator_name],
    ["Data da Aplicação", (r: any) => formatDate(r.application_date)],
    ["Hora Inicial", (r: any) => r.initial_time],
    ["Nome", (r: any) => r.full_name],
    ["CPF", (r: any) => r.cpf],
    ["E-mail", (r: any) => r.email],
    ["Naturalidade", (r: any) => r.naturalidade],
    ["Data de Nascimento", (r: any) => formatDate(r.birth_date)],
    ["Objetivo de Participação", (r: any) => r.participation_objective],
    ["Tipo de Aplicação", (r: any) => labelApplicationType(r.application_type)],
    ["Nome do Aplicador", (r: any) => r.response_applicator_name],
    ["Escolha da Atividade", (r: any) => labelActivityChoice(r.activity_choice)],
    ["Fractal de Comportamento", (r: any) => r.behavior_fractal],
    ["Resposta 1", (r: any) => r.response_1],
    ["Hierarquia 1", (r: any) => r.hierarchy_1],
    ["Justificativa 1", (r: any) => r.justification_1],
    ["Resposta 2", (r: any) => r.response_2],
    ["Hierarquia 2", (r: any) => r.hierarchy_2],
    ["Justificativa 2", (r: any) => r.justification_2],
    ["Resposta 3", (r: any) => r.response_3],
    ["Hierarquia 3", (r: any) => r.hierarchy_3],
    ["Justificativa 3", (r: any) => r.justification_3],
    ["Reflexão Final", (r: any) => r.final_feeling],
    ["Status", (r: any) => labelStatus(r.journey_status)],
    ["Data de Conclusão", (r: any) => formatDateTime(r.completed_at)],
    ["Journey ID", (r: any) => r.journey_id],
    ["Token", (r: any) => r.token],
    ["Exportado em", () => new Date().toLocaleString("pt-BR")],
  ] as const;

  const header = columns
    .map(([label]) => `<th style="background:#0F2D4A;color:#FFFFFF;font-weight:bold;border:1px solid #d1d5db;padding:8px;">${escapeHtml(label)}</th>`)
    .join("");

  const body = rows
    .map((row) => {
      const cells = columns
        .map(([, getter]) => `<td style="mso-number-format:'\\@';border:1px solid #d1d5db;padding:8px;vertical-align:top;">${escapeHtml(getter(row))}</td>`)
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
</head>
<body>
  <table>${`<thead><tr>${header}</tr></thead><tbody>${body}</tbody>`}</table>
</body>
</html>`;
}

export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Não autenticado.", { status: 401 });
  }

  const url = new URL(request.url);
  const startDate = url.searchParams.get("start_date") || null;
  const endDate = url.searchParams.get("end_date") || null;
  const applicatorId = url.searchParams.get("applicator_id") || null;
  const status = url.searchParams.get("status") || null;

  const { data, error } = await supabase.rpc("export_journey_responses", {
    p_start_date: startDate || null,
    p_end_date: endDate || null,
    p_applicator_id: applicatorId || null,
    p_status: status || null,
  });

  if (error) {
    return new Response(error.message, { status: 400 });
  }

  const html = buildExcelHtml(data ?? []);
  const now = new Date();
  const stamp = now
    .toISOString()
    .slice(0, 16)
    .replace("T", "_")
    .replace(":", "-");

  return new Response("\ufeff" + html, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.ms-excel; charset=utf-8",
      "Content-Disposition": `attachment; filename="Lifenergy_Export_${stamp}.xls"`,
      "Cache-Control": "no-store",
    },
  });
}
