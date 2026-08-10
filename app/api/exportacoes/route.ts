import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabaseAdmin";
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

function hierarchyLabel(value: unknown) {
  const number = Number(value || 0);
  if (number === 3) return "Maior importância — 3";
  if (number === 2) return "Média importância — 2";
  if (number === 1) return "Menor importância — 1";
  return "";
}

function applicatorNameFromJourney(journey: any) {
  const applicators = journey?.applicators;
  if (Array.isArray(applicators)) return applicators[0]?.name ?? "";
  return applicators?.name ?? "";
}

function organizationNameFromJourney(journey: any) {
  const organizations = journey?.organizations;
  if (Array.isArray(organizations)) return organizations[0]?.name ?? "";
  return organizations?.name ?? "";
}

function buildFileStamp() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toTimeString().slice(0, 5).replace(":", "-");
  return `${date}_${time}`;
}

function legacyFractalFromResponse(response: any, journey: any) {
  return {
    position: 1,
    presented_activity: journey.activity,
    copied_activity: response.behavior_fractal,
    response_1: response.response_1,
    hierarchy_1: response.hierarchy_1,
    justification_1: response.justification_1,
    response_2: response.response_2,
    hierarchy_2: response.hierarchy_2,
    justification_2: response.justification_2,
    response_3: response.response_3,
    hierarchy_3: response.hierarchy_3,
    justification_3: response.justification_3,
    final_feeling: response.final_feeling,
  };
}

async function requireSuperAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: "Não autenticado." }, { status: 401 }) };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("auth_user_id", user.id)
    .single();

  if (error || profile?.role !== "super_admin") {
    return { error: NextResponse.json({ error: "Acesso restrito ao super usuário." }, { status: 403 }) };
  }

  return { error: null };
}

export async function GET(request: Request) {
  const guard = await requireSuperAdmin();
  if (guard.error) return guard.error;

  const url = new URL(request.url);
  const organizationId = url.searchParams.get("organization_id")?.trim() || "";
  const avaliado = url.searchParams.get("avaliado")?.trim() || "";
  const startDate = url.searchParams.get("start_date")?.trim() || "";
  const endDate = url.searchParams.get("end_date")?.trim() || "";

  const admin = createAdminClient();

  let journeysQuery = admin
    .from("journeys")
    .select(
      "id, organization_id, code, token, status, activity, created_at, completed_at, applicators(name), organizations(name)"
    )
    .order("created_at", { ascending: false });

  if (organizationId) {
    journeysQuery = journeysQuery.eq("organization_id", organizationId);
  }

  const { data: journeys, error: journeysError } = await journeysQuery;

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
    let responsesQuery = admin
      .from("journey_responses")
      .select("*")
      .in("journey_id", journeyIds)
      .order("created_at", { ascending: false });

    if (avaliado) {
      const safeSearch = avaliado.replace(/[%,]/g, "");
      responsesQuery = responsesQuery.or(
        `full_name.ilike.%${safeSearch}%,email.ilike.%${safeSearch}%,cpf.ilike.%${safeSearch}%`
      );
    }

    if (startDate) {
      responsesQuery = responsesQuery.gte("application_date", startDate);
    }

    if (endDate) {
      responsesQuery = responsesQuery.lte("application_date", endDate);
    }

    const { data, error } = await responsesQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    responses = data ?? [];
  }

  const responseIds = responses.map((response) => response.id).filter(Boolean);
  const fractalsByResponse = new Map<string, any[]>();

  if (responseIds.length > 0) {
    const { data: responseFractals, error: responseFractalsError } = await admin
      .from("journey_response_fractals")
      .select("*")
      .in("journey_response_id", responseIds)
      .order("position", { ascending: true });

    if (!responseFractalsError) {
      for (const fractal of responseFractals ?? []) {
        const current = fractalsByResponse.get(fractal.journey_response_id) ?? [];
        current.push(fractal);
        fractalsByResponse.set(fractal.journey_response_id, current);
      }
    }
  }

  const baseHeaders = [
    "Empresa",
    "Código",
    "Status do Link",
    "Aplicador do Link",
    "Quantidade de Fractais Respondidos",
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
  ];

  const fractalHeaders = [1, 2, 3].flatMap((position) => [
    `Fractal ${position} - Atividade Apresentada`,
    `Fractal ${position} - Atividade Digitada`,
    `Fractal ${position} - Primeira Resposta`,
    `Fractal ${position} - Hierarquia da Primeira Resposta`,
    `Fractal ${position} - Justificativa da Primeira Resposta`,
    `Fractal ${position} - Segunda Resposta`,
    `Fractal ${position} - Hierarquia da Segunda Resposta`,
    `Fractal ${position} - Justificativa da Segunda Resposta`,
    `Fractal ${position} - Terceira Resposta`,
    `Fractal ${position} - Hierarquia da Terceira Resposta`,
    `Fractal ${position} - Justificativa da Terceira Resposta`,
    `Fractal ${position} - Reflexão após a Tarefa`,
  ]);

  const headers = [
    ...baseHeaders,
    ...fractalHeaders,
    "Data de Conclusão",
    "Token",
  ];

  const rows = responses.map((response) => {
    const journey = journeysById.get(response.journey_id) ?? {};
    const fractals = fractalsByResponse.get(response.id) ?? [
      legacyFractalFromResponse(response, journey),
    ];
    const fractalsByPosition = new Map<number, any>();

    for (const fractal of fractals) {
      fractalsByPosition.set(Number(fractal.position), fractal);
    }

    const baseValues = [
      organizationNameFromJourney(journey),
      journey.code,
      labelStatus(journey.status),
      applicatorNameFromJourney(journey),
      fractals.length,
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
    ];

    const fractalValues = [1, 2, 3].flatMap((position) => {
      const fractal = fractalsByPosition.get(position);
      if (!fractal) return Array(12).fill("");

      return [
        fractal.presented_activity,
        fractal.copied_activity,
        fractal.response_1,
        hierarchyLabel(fractal.hierarchy_1),
        fractal.justification_1,
        fractal.response_2,
        hierarchyLabel(fractal.hierarchy_2),
        fractal.justification_2,
        fractal.response_3,
        hierarchyLabel(fractal.hierarchy_3),
        fractal.justification_3,
        fractal.final_feeling,
      ];
    });

    return [
      ...baseValues,
      ...fractalValues,
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
