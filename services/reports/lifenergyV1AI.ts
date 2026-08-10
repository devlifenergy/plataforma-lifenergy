import type { LifenergyV1GeneratedContent, LifenergyV1ReportData } from "./lifenergyV1Types";
import {
  buildLifenergyV1UserPrompt,
  lifenergyV1JsonSchema,
  LIFENERGY_V1_SYSTEM_PROMPT,
} from "./lifenergyV1Prompt";

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

function normalizeAttributes(content: LifenergyV1GeneratedContent): LifenergyV1GeneratedContent {
  const required = ["Socialização", "Reflexão", "Lazer", "Propósito", "Sentimento"];
  const byName = new Map(
    content.atributos_percentuais.map((item) => [item.atributo.toLowerCase(), item])
  );

  return {
    ...content,
    atributos_percentuais: required.map((name) => {
      const found = byName.get(name.toLowerCase());
      return found ?? { atributo: name, percentual: "0%" };
    }),
  };
}

function parseGeneratedContent(text: string): LifenergyV1GeneratedContent {
  const parsed = JSON.parse(text) as LifenergyV1GeneratedContent;

  if (!isLifenergyV1GeneratedContent(parsed)) {
    throw new Error("Resposta da IA fora do modelo Lifenergy V1.0 esperado.");
  }

  return normalizeAttributes(parsed);
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
          name: "lifenergy_v1_report",
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
    content: parseGeneratedContent(outputText),
    model,
  };
}
