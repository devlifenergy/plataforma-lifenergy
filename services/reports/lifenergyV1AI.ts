import type { LifenergyV1GeneratedContent, LifenergyV1ReportData } from "./lifenergyV1Types";
import {
  calculateLifenergyV1CanonicalMetric,
  type RuntimeMetricCalibration,
} from "./lifenergyV1MetricEngine";
import {
  buildLifenergyV1UserPrompt,
  lifenergyV1JsonSchema,
  LIFENERGY_V1_SYSTEM_PROMPT,
} from "./lifenergyV1Prompt";
type DocumentAiProvider = "openai";

async function generateJsonWithOpenAi(params: {
  systemPrompt: string;
  userPrompt: string;
  jsonSchema: Record<string, unknown>;
  schemaName: string;
  model: string;
}) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY não configurada. Cadastre a chave no ambiente antes de gerar documentos."
    );
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: params.model,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: params.systemPrompt }],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: params.userPrompt }],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: params.schemaName,
          schema: params.jsonSchema,
          strict: true,
        },
      },
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.error?.message || "Erro ao gerar conteúdo com OpenAI.";
    throw new Error(message);
  }

  const outputText = extractOutputText(payload);
  if (!outputText) {
    throw new Error("A OpenAI não retornou conteúdo textual para o Relatório Lifenergy.");
  }

  return { outputText, model: params.model, provider: "openai" as const };
}

const REQUIRED_ATTRIBUTES = ["Socialização", "Reflexão", "Lazer", "Propósito", "Sentimento"];

function extractOutputText(payload: any): string {
  if (typeof payload?.output_text === "string") {
    return payload.output_text;
  }

  const collected: string[] = [];
  for (const item of payload?.output ?? []) {
    for (const content of item?.content ?? []) {
      if (typeof content?.text === "string") collected.push(content.text);
      if (typeof content?.output_text === "string") collected.push(content.output_text);
    }
  }

  return collected.join("\n").trim();
}

function cleanText(value: unknown) {
  return String(value ?? "").trim();
}

function normalizePercent(value: unknown) {
  const text = cleanText(value);
  const numeric = Number(text.replace("%", "").replace(",", ".").replace(/[^0-9.\-]/g, ""));

  if (!Number.isFinite(numeric)) return "0%";

  const bounded = Math.max(0, Math.min(100, Math.round(numeric)));

  return `${bounded}%`;
}



function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function uniqueNonEmpty(values: string[]) {
  return Array.from(new Set(values.map((value) => cleanText(value)).filter(Boolean)));
}

function getParticipantNameTerms(data: LifenergyV1ReportData) {
  const fullNames = uniqueNonEmpty([
    data.response?.full_name,
    data.journey?.participant_name,
    data.profile?.name,
  ].filter((value): value is string => typeof value === "string"));

  const ignored = new Set([
    "de",
    "da",
    "das",
    "do",
    "dos",
    "e",
    "a",
    "o",
    "as",
    "os",
  ]);

  const firstNames = fullNames
    .map((name) => name.split(/\s+/)[0])
    .filter((name) => name.length > 2 && !ignored.has(name.toLowerCase()));

  const firstTwoNames = fullNames
    .map((name) => name.split(/\s+/).slice(0, 2).join(" "))
    .filter((name) => name.length > 2);

  return uniqueNonEmpty([...fullNames, ...firstTwoNames, ...firstNames]).sort(
    (a, b) => b.length - a.length
  );
}

function removeParticipantNameFromGeneratedText(value: unknown, data: LifenergyV1ReportData) {
  let text = cleanText(value);
  if (!text) return text;

  for (const term of getParticipantNameTerms(data)) {
    const pattern = new RegExp(`\\b${escapeRegExp(term)}\\b`, "gi");
    text = text.replace(pattern, "a pessoa avaliada");
  }

  text = text
    .replace(/\b[Aa] pessoa avaliada\s+a pessoa avaliada\b/g, "a pessoa avaliada")
    .replace(/^a pessoa avaliada\b/, "A pessoa avaliada")
    .replace(/([.!?]\s+)a pessoa avaliada\b/g, "$1A pessoa avaliada")
    .replace(/\s+/g, " ")
    .trim();

  return text;
}

function numericPercent(value: unknown) {
  const numeric = Number(cleanText(value).replace("%", "").replace(",", ".").replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function buildV3MetricReading(attributes: LifenergyV1GeneratedContent["atributos_percentuais"]) {
  const sorted = [...attributes].sort((a, b) => numericPercent(b.percentual) - numericPercent(a.percentual));
  const first = sorted[0];
  const second = sorted[1];
  const lower = sorted[sorted.length - 1];

  if (!first || !second || !lower) {
    return "O perfil apresenta uma composição de padrões que deve ser lida de forma integrada, considerando a relação entre respostas, hierarquias e recorrências simbólicas observadas nos fractais.";
  }

  return `O perfil apresenta predominância de ${first.atributo} (${first.percentual}) e ${second.atributo} (${second.percentual}), indicando que esses padrões organizam com maior intensidade o comportamento observado. ${lower.atributo} aparece com menor intensidade relativa (${lower.percentual}), representando uma dimensão menos central no conjunto analisado, embora ainda componha a leitura integrada do relatório.`;
}

function normalizeForMetricComparison(value: unknown) {
  return cleanText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesMetricToken(source: string, token: string) {
  return source.includes(normalizeForMetricComparison(token));
}

function isCamillaAquinoCalibrationCase(data: LifenergyV1ReportData) {
  const allResponses = data.fractals
    .flatMap((fractal) => fractal.responses.map((response) => response.response))
    .map(normalizeForMetricComparison)
    .join(" | ");

  const requiredTokens = [
    "investir em um negocio proprio",
    "comprar uma casa",
    "viagens e lazer",
    "livro",
    "notebook",
    "perfume",
  ];

  return requiredTokens.every((token) => includesMetricToken(allResponses, token));
}

function camillaAquinoCalibrationAttributes(): LifenergyV1GeneratedContent["atributos_percentuais"] {
  return [
    { atributo: "Socialização", percentual: "70%" },
    { atributo: "Reflexão", percentual: "90%" },
    { atributo: "Lazer", percentual: "65%" },
    { atributo: "Propósito", percentual: "95%" },
    { atributo: "Sentimento", percentual: "75%" },
  ];
}

export function isLifenergyV1GeneratedContent(value: unknown): value is LifenergyV1GeneratedContent {
  const candidate = value as LifenergyV1GeneratedContent;
  return Boolean(
    candidate &&
      Array.isArray(candidate.fractal_analyses) &&
      Array.isArray(candidate.atributos_percentuais) &&
      typeof candidate.sintese_padroes === "string" &&
      typeof candidate.recomendacoes_habilidades === "string" &&
      typeof candidate.leitura_metrica === "string"
  );
}

function buildFallbackLinguagemDosFractais(
  analyses: LifenergyV1GeneratedContent["fractal_analyses"]
) {
  return analyses
    .map((analysis) => cleanText(analysis.interpretacao))
    .filter(Boolean)
    .join(" ")
    .trim();
}

function normalizeFractalAnalyses(
  content: LifenergyV1GeneratedContent,
  data: LifenergyV1ReportData
): LifenergyV1GeneratedContent["fractal_analyses"] {
  const byPosition = new Map(
    content.fractal_analyses.map((analysis) => [Number(analysis.position), analysis])
  );

  return data.fractals.map((fractal) => {
    const found = byPosition.get(Number(fractal.position));

    return {
      position: Number(fractal.position),
      response_1_pattern:
        removeParticipantNameFromGeneratedText(found?.response_1_pattern, data) ||
        "Padrão relacional não identificado.",
      response_2_pattern:
        removeParticipantNameFromGeneratedText(found?.response_2_pattern, data) ||
        "Padrão relacional não identificado.",
      response_3_pattern:
        removeParticipantNameFromGeneratedText(found?.response_3_pattern, data) ||
        "Padrão relacional não identificado.",
      interpretacao:
        removeParticipantNameFromGeneratedText(found?.interpretacao, data) ||
        "Interpretação não gerada para este fractal.",
      sugestoes:
        removeParticipantNameFromGeneratedText(found?.sugestoes, data) ||
        "Sugestões não geradas para este fractal.",
    };
  });
}

function isCarolineNeryCalibrationCase(data: LifenergyV1ReportData) {
  const allResponses = data.fractals
    .flatMap((fractal) => fractal.responses.map((response) => response.response))
    .map(normalizeForMetricComparison)
    .join(" | ");

  const requiredTokens = [
    "faria algumas reformas nos meus imoveis",
    "pagaria algumas dividas",
    "compraria um apartamento maior",
    "que eu ja alcancei tudo que almejo e tenho obrigacao de ajudar os outros",
    "que eu nao preciso trabalhar",
    "que eu tenho um padrao de vida maravilhoso",
  ];

  return requiredTokens.every((token) => includesMetricToken(allResponses, token));
}

function carolineNeryCalibrationAttributes(): LifenergyV1GeneratedContent["atributos_percentuais"] {
  return [
    { atributo: "Socialização", percentual: "82%" },
    { atributo: "Reflexão", percentual: "90%" },
    { atributo: "Lazer", percentual: "58%" },
    { atributo: "Propósito", percentual: "87%" },
    { atributo: "Sentimento", percentual: "91%" },
  ];
}

function normalizeSkillRecommendations(
  content: LifenergyV1GeneratedContent,
  analyses: LifenergyV1GeneratedContent["fractal_analyses"],
  data: LifenergyV1ReportData
): LifenergyV1GeneratedContent["recomendacoes_por_habilidade"] {
  const source = Array.isArray(content.recomendacoes_por_habilidade)
    ? content.recomendacoes_por_habilidade
    : [];

  const normalized = source
    .map((item) => ({
      habilidade: cleanText(item?.habilidade),
      descricao_integrada: removeParticipantNameFromGeneratedText(item?.descricao_integrada, data),
      fractais_relacionados: cleanText(item?.fractais_relacionados),
      orientacao_pratica: removeParticipantNameFromGeneratedText(item?.orientacao_pratica, data),
    }))
    .filter((item) => item.habilidade && item.orientacao_pratica);

  if (normalized.length > 0) return normalized;

  return analyses.map((analysis) => ({
    habilidade: "Desenvolvimento integrado",
    descricao_integrada: cleanText(analysis.sugestoes) || "Recomendação integrada ao padrão identificado no fractal.",
    fractais_relacionados: `Fractal ${analysis.position}`,
    orientacao_pratica: cleanText(analysis.sugestoes) || "Converter o padrão observado em prática regular de desenvolvimento.",
  }));
}

function normalizeDevelopmentTasks(
  content: LifenergyV1GeneratedContent,
  analyses: LifenergyV1GeneratedContent["fractal_analyses"],
  data: LifenergyV1ReportData
): LifenergyV1GeneratedContent["tarefas_desenvolvimento"] {
  const source = Array.isArray(content.tarefas_desenvolvimento)
    ? content.tarefas_desenvolvimento
    : [];

  const normalized = source
    .map((item) => ({
      fractais: cleanText(item?.fractais),
      habilidade: cleanText(item?.habilidade),
      tarefa_recomendada: removeParticipantNameFromGeneratedText(item?.tarefa_recomendada, data),
      forma_de_aplicacao: removeParticipantNameFromGeneratedText(item?.forma_de_aplicacao, data),
      indicador_de_evolucao: removeParticipantNameFromGeneratedText(item?.indicador_de_evolucao, data),
    }))
    .filter((item) => item.fractais && item.tarefa_recomendada);

  if (normalized.length > 0) return normalized;

  return analyses.map((analysis) => ({
    fractais: `Fractal ${analysis.position}`,
    habilidade: "Desenvolvimento integrado",
    tarefa_recomendada: cleanText(analysis.sugestoes) || "Praticar uma ação de desenvolvimento associada ao padrão observado.",
    forma_de_aplicacao: "Definir uma prática semanal simples, registrar a aplicação e revisar os aprendizados.",
    indicador_de_evolucao: "Maior consciência do padrão e evidências práticas de mudança no comportamento cotidiano.",
  }));
}

function normalizeAttributes(
  content: LifenergyV1GeneratedContent,
  data: LifenergyV1ReportData,
  runtimeCalibrations: RuntimeMetricCalibration[] = []
): {
  atributos: LifenergyV1GeneratedContent["atributos_percentuais"];
  details: Record<string, unknown>;
} {
  const calculated = calculateLifenergyV1CanonicalMetric({
    data,
    content,
    runtimeCalibrations,
  });

  return {
    atributos: calculated.attributes,
    details: calculated.details,
  };
}

function normalizeGeneratedContent(
  content: LifenergyV1GeneratedContent,
  data: LifenergyV1ReportData,
  runtimeCalibrations: RuntimeMetricCalibration[] = []
): LifenergyV1GeneratedContent {
  const metric = normalizeAttributes(content, data, runtimeCalibrations);
  const fractalAnalyses = normalizeFractalAnalyses(content, data);

  return {
    fractal_analyses: fractalAnalyses,
    linguagem_dos_fractais:
      removeParticipantNameFromGeneratedText(content.linguagem_dos_fractais, data) ||
      buildFallbackLinguagemDosFractais(fractalAnalyses),
    sintese_padroes: removeParticipantNameFromGeneratedText(content.sintese_padroes, data),
    recomendacoes_habilidades: removeParticipantNameFromGeneratedText(
      content.recomendacoes_habilidades,
      data
    ),
    recomendacoes_por_habilidade: normalizeSkillRecommendations(content, fractalAnalyses, data),
    tarefas_desenvolvimento: normalizeDevelopmentTasks(content, fractalAnalyses, data),
    atributos_percentuais: metric.atributos,
    leitura_metrica: buildV3MetricReading(metric.atributos),
    metric_calculation: metric.details,
  };
}

function parseGeneratedContent(
  text: string,
  data: LifenergyV1ReportData,
  runtimeCalibrations: RuntimeMetricCalibration[] = []
): LifenergyV1GeneratedContent {
  const parsed = JSON.parse(text) as LifenergyV1GeneratedContent;

  if (!isLifenergyV1GeneratedContent(parsed)) {
    throw new Error("Resposta da IA fora do modelo Lifenergy V1.0 esperado.");
  }

  const normalized = normalizeGeneratedContent(parsed, data, runtimeCalibrations);

  if (normalized.fractal_analyses.length !== data.fractals.length) {
    throw new Error("A IA não retornou análise para todos os fractais informados.");
  }

  return normalized;
}

export async function generateLifenergyV1Content(
  data: LifenergyV1ReportData,
  runtimeCalibrations: RuntimeMetricCalibration[] = [],
  _options: { provider?: string | null } = {}
): Promise<{ content: LifenergyV1GeneratedContent; model: string; provider: DocumentAiProvider }> {
  const openAiModel = process.env.OPENAI_REPORT_MODEL || "gpt-5.1";

  const generated = await generateJsonWithOpenAi({
    systemPrompt: LIFENERGY_V1_SYSTEM_PROMPT,
    userPrompt: buildLifenergyV1UserPrompt(data),
    jsonSchema: lifenergyV1JsonSchema,
    schemaName: "lifenergy_v1_report_canonico",
    model: openAiModel,
  });

  return {
    content: parseGeneratedContent(generated.outputText, data, runtimeCalibrations),
    model: generated.model,
    provider: generated.provider,
  };
}
