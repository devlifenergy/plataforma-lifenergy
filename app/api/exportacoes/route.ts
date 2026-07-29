import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";


const WINDOWS_1252_SPECIAL_CHARS: Record<string, number> = {
  "€": 0x80,
  "‚": 0x82,
  "ƒ": 0x83,
  "„": 0x84,
  "…": 0x85,
  "†": 0x86,
  "‡": 0x87,
  "ˆ": 0x88,
  "‰": 0x89,
  "Š": 0x8a,
  "‹": 0x8b,
  "Œ": 0x8c,
  "Ž": 0x8e,
  "‘": 0x91,
  "’": 0x92,
  "“": 0x93,
  "”": 0x94,
  "•": 0x95,
  "–": 0x96,
  "—": 0x97,
  "˜": 0x98,
  "™": 0x99,
  "š": 0x9a,
  "›": 0x9b,
  "œ": 0x9c,
  "ž": 0x9e,
  "Ÿ": 0x9f,
};

function encodeWindows1252(value: string) {
  const bytes: number[] = [];

  for (const char of value) {
    const special = WINDOWS_1252_SPECIAL_CHARS[char];
    if (special !== undefined) {
      bytes.push(special);
      continue;
    }

    const code = char.codePointAt(0) ?? 63;
    if (code <= 0x7f || (code >= 0xa0 && code <= 0xff)) {
      bytes.push(code);
    } else {
      bytes.push(63);
    }
  }

  return new Uint8Array(bytes);
}

function normalizeCell(value: unknown) {
  return String(value ?? "")
    .replaceAll("\u0000", "")
    .replace(/\r\n|\r|\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function csv(value: unknown) {
  const text = normalizeCell(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function formatDate(value: unknown) {
  if (!value) return "";
  const text = String(value);
  const match = text.slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return normalizeCell(text);

  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatDateTime(value: unknown) {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return normalizeCell(value);

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  // Não usar vírgula aqui. Alguns editores/planilhas interpretam a vírgula
  // como separador de coluna quando o CSV é aberto diretamente.
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function labelApplicationType(value: unknown) {
  const labels: Record<string, string> = {
    auto_aplicacao: "Auto Aplicação",
    aplicacao_assistida: "Aplicação Assistida",
  };

  return labels[String(value ?? "")] ?? normalizeCell(value);
}

function labelActivityChoice(value: unknown) {
  const labels: Record<string, string> = {
    propria_pessoa: "A própria pessoa",
    aplicador: "O aplicador",
  };

  return labels[String(value ?? "")] ?? normalizeCell(value);
}

function labelStatus(value: unknown) {
  const labels: Record<string, string> = {
    created: "Criada",
    link_sent: "Convite enviado",
    in_progress: "Em andamento",
    completed: "Concluída",
    exported: "Exportada",
  };

  return labels[String(value ?? "")] ?? normalizeCell(value);
}

function applicatorNameFromJourney(journey: any) {
  const applicators = journey?.applicators;
  if (Array.isArray(applicators)) return applicators[0]?.name ?? "";
  return applicators?.name ?? "";
}

function buildFileStamp() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toTimeString().slice(0, 5).replace(":", "-");
  return `${date}_${time}`;
}

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("auth_user_id", user.id)
    .single();

  if (profileError || !profile?.organization_id) {
    return NextResponse.json(
      { error: "Perfil da empresa não encontrado." },
      { status: 400 }
    );
  }

  const { data: journeys, error: journeysError } = await supabase
    .from("journeys")
    .select(
      "id, code, token, status, activity, created_at, completed_at, applicators(name)"
    )
    .eq("organization_id", profile.organization_id)
    .order("created_at", { ascending: false });

  if (journeysError) {
    return NextResponse.json({ error: journeysError.message }, { status: 400 });
  }

  const journeysById = new Map<string, any>();
  for (const journey of journeys ?? []) {
    journeysById.set(journey.id, journey);
  }

  const journeyIds = Array.from(journeysById.keys());

  let responses: any[] = [];

  if (journeyIds.length > 0) {
    const { data, error } = await supabase
      .from("journey_responses")
      .select("*")
      .in("journey_id", journeyIds)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    responses = data ?? [];
  }

  const headers = [
    "Código",
    "Status do Link",
    "Atividade Cadastrada no Link",
    "Aplicador do Link",
    "Data da Aplicação",
    "Hora Inicial",
    "Nome do Avaliado",
    "CPF",
    "E-mail",
    "Naturalidade",
    "Data de Nascimento",
    "Objetivo de Participação",
    "Tipo de Aplicação",
    "Nome do Aplicador Informado",
    "Escolha da Atividade",
    "Fractal/Atividade Digitada",
    "Primeira Resposta",
    "Hierarquia da Primeira Resposta",
    "Justificativa da Primeira Resposta",
    "Segunda Resposta",
    "Hierarquia da Segunda Resposta",
    "Justificativa da Segunda Resposta",
    "Terceira Resposta",
    "Hierarquia da Terceira Resposta",
    "Justificativa da Terceira Resposta",
    "Reflexão Final",
    "Data de Conclusão",
    "Token",
  ];

  const rows = responses.map((response) => {
    const journey = journeysById.get(response.journey_id) ?? {};

    return [
      journey.code,
      labelStatus(journey.status),
      journey.activity,
      applicatorNameFromJourney(journey),
      formatDate(response.application_date),
      response.initial_time,
      response.full_name,
      response.cpf,
      response.email,
      response.naturalidade,
      formatDate(response.birth_date),
      response.participation_objective,
      labelApplicationType(response.application_type),
      response.applicator_name,
      labelActivityChoice(response.activity_choice),
      response.behavior_fractal,
      response.response_1,
      response.hierarchy_1,
      response.justification_1,
      response.response_2,
      response.hierarchy_2,
      response.justification_2,
      response.response_3,
      response.hierarchy_3,
      response.justification_3,
      response.final_feeling,
      formatDateTime(journey.completed_at ?? response.created_at),
      journey.token,
    ]
      .map(csv)
      .join(";");
  });

  const headerRow = headers.map(csv).join(";");
  const content = ["sep=;", headerRow, ...rows].join("\r\n");
  const encodedContent = encodeWindows1252(content);
  const stamp = buildFileStamp();

  return new NextResponse(encodedContent, {
    headers: {
      "Content-Type": "text/csv; charset=windows-1252",
      "Content-Disposition": `attachment; filename="Lifenergy_Export_${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
