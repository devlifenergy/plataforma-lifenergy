import type { LifenergyPdiData, LifenergyPdiGeneratedContent } from "./lifenergyPdiTypes";
import {
  buildLifenergyPdiUserPrompt,
  lifenergyPdiJsonSchema,
  LIFENERGY_PDI_SYSTEM_PROMPT,
} from "./lifenergyPdiPrompt";

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

function take<T>(items: T[] | undefined, count: number, fallback: T[]): T[] {
  const source = Array.isArray(items) ? items.filter(Boolean) : [];
  const merged = [...source, ...fallback];
  return merged.slice(0, count);
}

export function isLifenergyPdiGeneratedContent(value: unknown): value is LifenergyPdiGeneratedContent {
  const candidate = value as LifenergyPdiGeneratedContent;
  return Boolean(
    candidate &&
      typeof candidate.diagnostico_perfil === "string" &&
      Array.isArray(candidate.avaliacao_atributos) &&
      Array.isArray(candidate.pontos_fortes) &&
      Array.isArray(candidate.oportunidades_melhoria) &&
      Array.isArray(candidate.competencias_desenvolver) &&
      Array.isArray(candidate.objetivos_curto_prazo) &&
      typeof candidate.apoio_suporte_necessario === "string" &&
      Array.isArray(candidate.cronograma_acompanhamento)
  );
}

function normalizeAttributes(content: LifenergyPdiGeneratedContent): LifenergyPdiGeneratedContent["avaliacao_atributos"] {
  const byName = new Map(
    content.avaliacao_atributos.map((item) => [cleanText(item.atributo).toLowerCase(), item])
  );

  return REQUIRED_ATTRIBUTES.map((name) => {
    const found = byName.get(name.toLowerCase());
    return {
      atributo: name,
      avaliacao: normalizePercent(found?.avaliacao ?? "0%"),
      observacoes: cleanText(found?.observacoes) || "Observação não gerada.",
    };
  });
}

function normalizeGeneratedContent(content: LifenergyPdiGeneratedContent): LifenergyPdiGeneratedContent {
  return {
    diagnostico_perfil: cleanText(content.diagnostico_perfil),
    avaliacao_atributos: normalizeAttributes(content),
    pontos_fortes: take(
      content.pontos_fortes?.map(cleanText),
      3,
      ["Ponto forte não gerado.", "Ponto forte não gerado.", "Ponto forte não gerado."]
    ),
    oportunidades_melhoria: take(
      content.oportunidades_melhoria?.map(cleanText),
      3,
      ["Oportunidade de melhoria não gerada.", "Oportunidade de melhoria não gerada.", "Oportunidade de melhoria não gerada."]
    ),
    competencias_desenvolver: take(
      content.competencias_desenvolver,
      3,
      [
        {
          competencia: "Competência a definir",
          tipo: "Comportamental",
          nivel_atual: "Em desenvolvimento",
          estrategia_desenvolvimento: "Definir estratégia com gestor imediato.",
        },
      ]
    ).map((item) => ({
      competencia: cleanText(item.competencia),
      tipo: cleanText(item.tipo) || "Comportamental",
      nivel_atual: cleanText(item.nivel_atual) || "Em desenvolvimento",
      estrategia_desenvolvimento:
        cleanText(item.estrategia_desenvolvimento) || "Definir estratégia com gestor imediato.",
    })),
    objetivos_curto_prazo: take(
      content.objetivos_curto_prazo,
      3,
      [
        {
          numero: "01",
          objetivo: "Definir objetivo de desenvolvimento com o gestor imediato.",
          indicador_sucesso: "Objetivo validado e acompanhado em checkpoint.",
          prazo: "Até 6 meses",
          prioridade: "Média",
        },
      ]
    ).map((item, index) => ({
      numero: cleanText(item.numero) || String(index + 1).padStart(2, "0"),
      objetivo: cleanText(item.objetivo),
      indicador_sucesso: cleanText(item.indicador_sucesso),
      prazo: cleanText(item.prazo) || "Até 6 meses",
      prioridade: cleanText(item.prioridade) || "Média",
    })),
    apoio_suporte_necessario: cleanText(content.apoio_suporte_necessario),
    cronograma_acompanhamento: take(
      content.cronograma_acompanhamento,
      1,
      [
        {
          checkpoint: "Checkpoint trimestral",
          data_prevista: "A definir",
          participantes: "Colaborador + Gestor imediato",
          pauta_principal: "Revisão do progresso das ações e ajuste de prioridades.",
          observacoes: "Registrar avanços, aprendizados e próximos passos.",
        },
      ]
    ).map((item) => ({
      checkpoint: cleanText(item.checkpoint) || "Checkpoint trimestral",
      data_prevista: cleanText(item.data_prevista) || "A definir",
      participantes: cleanText(item.participantes) || "Colaborador + Gestor imediato",
      pauta_principal:
        cleanText(item.pauta_principal) || "Revisão do progresso das ações e ajuste de prioridades.",
      observacoes: cleanText(item.observacoes) || "Registrar avanços, aprendizados e próximos passos.",
    })),
  };
}

function parseGeneratedContent(text: string): LifenergyPdiGeneratedContent {
  const parsed = JSON.parse(text) as LifenergyPdiGeneratedContent;

  if (!isLifenergyPdiGeneratedContent(parsed)) {
    throw new Error("Resposta da IA fora do modelo Lifenergy PDI esperado.");
  }

  return normalizeGeneratedContent(parsed);
}

export async function generateLifenergyPdiContent(
  data: LifenergyPdiData
): Promise<{ content: LifenergyPdiGeneratedContent; model: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_PDI_MODEL || process.env.OPENAI_REPORT_MODEL || "gpt-5.1";

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY não configurada. Cadastre a chave no ambiente Sandbox antes de gerar PDI."
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
              text: LIFENERGY_PDI_SYSTEM_PROMPT,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: buildLifenergyPdiUserPrompt(data),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "lifenergy_pdi_v1",
          schema: lifenergyPdiJsonSchema,
          strict: true,
        },
      },
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.error?.message || "Erro ao gerar PDI com IA.";
    throw new Error(message);
  }

  const outputText = extractOutputText(payload);
  if (!outputText) {
    throw new Error("A IA não retornou conteúdo textual para o PDI.");
  }

  return {
    content: parseGeneratedContent(outputText),
    model,
  };
}
