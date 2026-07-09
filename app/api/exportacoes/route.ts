import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

function csv(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("journey_responses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const headers = [
    "Nome",
    "CPF",
    "E-mail",
    "Naturalidade",
    "Data de Nascimento",
    "Objetivo",
    "Tipo de Aplicacao",
    "Nome do Aplicador",
    "Escolha da Atividade",
    "Fractal",
    "Resposta 1",
    "Hierarquia 1",
    "Justificativa 1",
    "Resposta 2",
    "Hierarquia 2",
    "Justificativa 2",
    "Resposta 3",
    "Hierarquia 3",
    "Justificativa 3",
    "Reflexao Final",
  ];

  const rows = (data ?? []).map((r: any) =>
    [
      r.full_name,
      r.cpf,
      r.email,
      r.naturalidade,
      r.birth_date,
      r.participation_objective,
      r.application_type,
      r.applicator_name,
      r.activity_choice,
      r.behavior_fractal,
      r.response_1,
      r.hierarchy_1,
      r.justification_1,
      r.response_2,
      r.hierarchy_2,
      r.justification_2,
      r.response_3,
      r.hierarchy_3,
      r.justification_3,
      r.final_feeling,
    ]
      .map(csv)
      .join(";")
  );

  const content = "\uFEFF" + [headers.join(";"), ...rows].join("\n");

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="lifenergy_export.csv"`,
    },
  });
}