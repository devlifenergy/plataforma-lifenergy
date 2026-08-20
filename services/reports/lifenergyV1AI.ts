import type { LifenergyV1GeneratedContent, LifenergyV1ReportData } from "./lifenergyV1Types";
import {
  buildLifenergyV1UserPrompt,
  lifenergyV1JsonSchema,
  LIFENERGY_V1_SYSTEM_PROMPT,
} from "./lifenergyV1Prompt";

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
      response_1_pattern: cleanText(found?.response_1_pattern) || "Padrão relacional não identificado.",
      response_2_pattern: cleanText(found?.response_2_pattern) || "Padrão relacional não identificado.",
      response_3_pattern: cleanText(found?.response_3_pattern) || "Padrão relacional não identificado.",
      interpretacao: cleanText(found?.interpretacao) || "Interpretação não gerada para este fractal.",
      sugestoes: cleanText(found?.sugestoes) || "Sugestões não geradas para este fractal.",
    };
  });
}

function normalizeAttributes(content: LifenergyV1GeneratedContent): LifenergyV1GeneratedContent["atributos_percentuais"] {
  const byName = new Map(
    content.atributos_percentuais.map((item) => [cleanText(item.atributo).toLowerCase(), item])
  );

  return REQUIRED_ATTRIBUTES.map((name) => {
    const found = byName.get(name.toLowerCase());
    return {
      atributo: name,
      percentual: normalizePercent(found?.percentual ?? "0%"),
    };
  });
}

function normalizeGeneratedContent(
  content: LifenergyV1GeneratedContent,
  data: LifenergyV1ReportData
): LifenergyV1GeneratedContent {
  return {
    fractal_analyses: normalizeFractalAnalyses(content, data),
    sintese_padroes: cleanText(content.sintese_padroes),
    recomendacoes_habilidades: cleanText(content.recomendacoes_habilidades),
    atributos_percentuais: normalizeAttributes(content),
    leitura_metrica: cleanText(content.leitura_metrica),
  };
}

function parseGeneratedContent(text: string, data: LifenergyV1ReportData): LifenergyV1GeneratedContent {
  const parsed = JSON.parse(text) as LifenergyV1GeneratedContent;

  if (!isLifenergyV1GeneratedContent(parsed)) {
    throw new Error("Resposta da IA fora do modelo Lifenergy V1.0 esperado.");
  }

  const normalized = normalizeGeneratedContent(parsed, data);

  if (normalized.fractal_analyses.length !== data.fractals.length) {
    throw new Error("A IA não retornou análise para todos os fractais informados.");
  }

  return normalized;
}

export async function generateLifenergyV1Content(
  data: LifenergyV1ReportData
): Promise<{ content: LifenergyV1GeneratedContent; model: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_REPORT_MODEL || "gpt-5.1";

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY não configurada. Cadastre a chave no ambiente Sandbox antes de gerar relatórios."
    );
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: LIFENERGY_V1_SYSTEM_PROMPT,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: buildLifenergyV1UserPrompt(data),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "lifenergy_v1_report_canonico",
          schema: lifenergyV1JsonSchema,
          strict: true,
        },
      },
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.error?.message || "Erro ao gerar conteúdo com IA.";
    throw new Error(message);
  }

  const outputText = extractOutputText(payload);
  if (!outputText) {
    throw new Error("A IA não retornou conteúdo textual para o relatório.");
  }

  return {
    content: parseGeneratedContent(outputText, data),
    model,
  };
}
