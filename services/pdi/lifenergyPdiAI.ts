import type { LifenergyPdiData, LifenergyPdiGeneratedContent } from "./lifenergyPdiTypes";
import {
  buildLifenergyPdiUserPrompt,
  lifenergyPdiJsonSchema,
  LIFENERGY_PDI_SYSTEM_PROMPT,
  LIFENERGY_PDI_CORPORATE_V31_ADDENDUM,
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
      typeof candidate.objetivo_central_pdi === "string" &&
      typeof candidate.objetivo_carreira_desenvolvimento === "string" &&
      typeof candidate.diagnostico_perfil === "string" &&
      Array.isArray(candidate.avaliacao_atributos) &&
      Array.isArray(candidate.pontos_fortes) &&
      Array.isArray(candidate.oportunidades_melhoria) &&
      Array.isArray(candidate.competencias_desenvolver) &&
      Array.isArray(candidate.objetivos_curto_prazo) &&
      Array.isArray(candidate.objetivos_medio_prazo) &&
      Array.isArray(candidate.direcionamento_longo_prazo) &&
      Array.isArray(candidate.plano_acao_70_20_10) &&
      Array.isArray(candidate.indicadores_evidencias) &&
      typeof candidate.apoio_suporte_necessario === "string" &&
      Array.isArray(candidate.cronograma_acompanhamento)
  );
}

function normalizeAttributes(
  content: LifenergyPdiGeneratedContent,
  data?: LifenergyPdiData
): LifenergyPdiGeneratedContent["avaliacao_atributos"] {
  const byName = new Map(
    content.avaliacao_atributos.map((item) => [cleanText(item.atributo).toLowerCase(), item])
  );

  const metricByName = new Map(
    data?.pdiType === "corporate"
      ? (data.reportContent.atributos_percentuais ?? []).map((item) => [
          cleanText(item.atributo).toLocaleLowerCase("pt-BR"),
          cleanText(item.percentual),
        ] as const)
      : []
  );

  return REQUIRED_ATTRIBUTES.map((name) => {
    const found = byName.get(name.toLowerCase());
    const sourceMetric = metricByName.get(name.toLocaleLowerCase("pt-BR"));
    if (data?.pdiType === "corporate" && !sourceMetric) {
      throw new Error(`Métrica Lifenergy ausente no Relatório de origem: ${name}.`);
    }
    return {
      atributo: name,
      // No PDI Corporativo V3.1 os percentuais são exclusivamente os do motor canônico.
      avaliacao: sourceMetric ?? normalizePercent(found?.avaliacao ?? "0%"),
      observacoes: cleanText(found?.observacoes) || "Observação não gerada.",
    };
  });
}

function normalizeObjectives(
  items: LifenergyPdiGeneratedContent["objetivos_curto_prazo"] | undefined,
  count: number,
  defaultPrazo: string
) {
  return take(
    items,
    count,
    [
      {
        numero: "01",
        objetivo: "Definir objetivo de desenvolvimento com o gestor imediato.",
        indicador_sucesso: "Objetivo validado, acompanhado e registrado em checkpoint.",
        prazo: defaultPrazo,
        prioridade: "Média",
      },
    ]
  ).map((item, index) => ({
    numero: cleanText(item.numero) || String(index + 1).padStart(2, "0"),
    objetivo: cleanText(item.objetivo),
    indicador_sucesso: cleanText(item.indicador_sucesso),
    prazo: cleanText(item.prazo) || defaultPrazo,
    prioridade: cleanText(item.prioridade) || "Média",
  }));
}

// Quantidades canônicas somente do PDI Corporativo. O PDI Relacional preserva
// seus próprios limites de estrutura e não utiliza esta recuperação.
const CORPORATE_REQUIRED_ARRAYS = [
  { key: "pontos_fortes", label: "pontos fortes", count: 3 },
  { key: "oportunidades_melhoria", label: "oportunidades de melhoria", count: 3 },
  { key: "competencias_desenvolver", label: "competências", count: 3 },
  { key: "objetivos_curto_prazo", label: "objetivos de curto prazo", count: 3 },
  { key: "objetivos_medio_prazo", label: "objetivos de médio prazo", count: 3 },
  { key: "direcionamento_longo_prazo", label: "direcionamento de longo prazo", count: 3 },
  { key: "plano_acao_70_20_10", label: "plano 70-20-10", count: 3 },
  { key: "indicadores_evidencias", label: "indicadores", count: 3 },
  { key: "cronograma_acompanhamento", label: "checkpoints", count: 2 },
] as const;

type CorporateArrayKey = (typeof CORPORATE_REQUIRED_ARRAYS)[number]["key"];

function missingCorporateSections(content: LifenergyPdiGeneratedContent) {
  return CORPORATE_REQUIRED_ARRAYS.flatMap((spec) => {
    const rows = content[spec.key];
    return Array.isArray(rows) && rows.length >= spec.count
      ? []
      : [{ ...spec, missing: spec.count - (Array.isArray(rows) ? rows.length : 0) }];
  });
}

/**
 * A resposta em JSON estruturado valida os CAMPOS, mas não obriga a quantidade
 * de linhas de uma tabela. Em vez de inventar objetivos genéricos ou perder todo
 * o PDI, solicite apenas os itens faltantes à IA a partir da leitura Lifenergy já
 * feita. Nenhum documento pode ser persistido enquanto faltar alguma seção.
 */
async function completeMissingCorporateSections(
  content: LifenergyPdiGeneratedContent,
  data: LifenergyPdiData,
  apiKey: string,
  model: string
): Promise<LifenergyPdiGeneratedContent> {
  let candidate = content;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const missing = missingCorporateSections(candidate);
    if (missing.length === 0) return candidate;

    // Reutiliza exatamente a definição dos campos da geração principal.
    // O complemento só pode conter as seções que ficaram incompletas.
    const properties: Record<string, unknown> = {};
    for (const section of missing) {
      properties[section.key] = lifenergyPdiJsonSchema.properties[section.key];
    }
    const schema = {
      type: "object",
      additionalProperties: false,
      properties,
      required: missing.map((section) => section.key),
    };
    const instructions = missing.map((section) =>
      `${section.key}: gerar somente ${section.missing} registro(s) NOVO(S). ` +
      `O total final da tabela deve ser ${section.count}.`
    ).join("\n");
    const existing = Object.fromEntries(
      missing.map(({ key }) => [key, candidate[key]])
    );

    const recoveryInput = {
      perfilLifenergyPrimario: {
        sinteseEInterpretacao: data.reportContent,
        competenciasPriorizadasNoPDI: candidate.competencias_desenvolver,
        analiseDoPdi: candidate.diagnostico_perfil,
      },
      aplicacaoNaEmpresa: {
        cargo: data.pdiContext?.current_job_title ?? null,
        area: data.pdiContext?.current_area ?? null,
        competenciasEPlanoDeAcaoJaGerados: candidate.plano_acao_70_20_10,
      },
      objetivosDeCurtoPrazoJaGerados: candidate.objetivos_curto_prazo,
      objetivosDeMedioPrazoJaGerados: candidate.objetivos_medio_prazo,
      direcionamentosDeLongoPrazoJaGerados: candidate.direcionamento_longo_prazo,
      registrosDasTabelasACompletar: existing,
    };

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
            content: [{
              type: "input_text",
              text: `Você revisa EXCLUSIVAMENTE um PDI Corporativo Lifenergy V3.1 parcialmente gerado. ` +
                `Não reescreva o PDI inteiro. Complete só os registros faltantes. ` +
                `A origem diagnóstica é o Relatório Lifenergy; a percepção do gestor não é diagnóstico. ` +
                `Mantenha a sequência de três competências Lifenergy, uma por objetivo de cada horizonte, ` +
                `priorizando os objetivos ainda não contemplados. Não duplique objetivos anteriores. ` +
                `Use linguagem corporativa, curta e verificável. Não invente desempenho, metas aprovadas ou resultados alcançados. ` +
                `Não utilize o nome da pessoa avaliada em nenhum campo; redija de forma impessoal. ` +
                `As metas numéricas, quando houver, são propostas a pactuar. ` +
                `Responda somente com o JSON solicitado.`,
            }],
          },
          {
            role: "user",
            content: [{
              type: "input_text",
              text: `O PDI foi gerado com linhas insuficientes.\n${instructions}\n` +
                `Não repita os itens existentes. Preserve a interpretação Lifenergy e a conexão entre competências, ` +
                `objetivos, ações e indicadores. Cada objetivo e indicador deve ser curto, concreto e mensurável.\n` +
                `${JSON.stringify(recoveryInput)}`,
            }],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "lifenergy_pdi_v31_complemento",
            schema,
            strict: true,
          },
        },
      }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const message = payload?.error?.message || "Erro ao completar tabelas do PDI.";
      throw new Error(`PDI Corporativo V3.1: a IA não conseguiu completar os objetivos. ${message} Nenhum PDI foi armazenado.`);
    }
    const outputText = extractOutputText(payload);
    if (!outputText) {
      throw new Error("PDI Corporativo V3.1: complemento vazio da IA. Nenhum PDI foi armazenado.");
    }
    let additional: Record<string, unknown>;
    try {
      additional = JSON.parse(outputText) as Record<string, unknown>;
    } catch {
      throw new Error("PDI Corporativo V3.1: complemento inválido da IA. Nenhum PDI foi armazenado.");
    }
    const updated = { ...candidate };
    let added = 0;
    for (const section of missing) {
      const returned = additional[section.key];
      if (!Array.isArray(returned)) continue;
      const valid = returned.filter((row) => {
        if (typeof row === "string") return row.trim().length > 0;
        return Boolean(row && typeof row === "object" &&
          Object.values(row).every((value) => typeof value === "string" && value.trim().length > 0));
      });
      // Não modificar as linhas anteriormente geradas; acrescentar apenas novas.
      const current = candidate[section.key] as unknown[];
      const combined = [...current, ...valid.slice(0, section.missing)];
      (updated as unknown as Record<CorporateArrayKey, unknown>)[section.key] = combined;
      added += combined.length - current.length;
    }
    if (added === 0) break; // Evita novas chamadas sem progresso.
    candidate = updated;
  }
  // Se mesmo após complemento houver falha, aborta sem armazenar documento.
  return candidate;
}

function assertCorporateV31Complete(content: LifenergyPdiGeneratedContent) {
  for (const { key, label: section, count } of CORPORATE_REQUIRED_ARRAYS) {
    const value = content[key];
    // O schema JSON da OpenAI garante o formato dos itens, mas nao o tamanho exato
    // de cada array. Itens adicionais nao tornam o PDI incompleto: a normalizacao
    // abaixo ja seleciona somente a quantidade prevista no modelo canonico.
    if (!Array.isArray(value) || value.length < count) {
      throw new Error(`PDI Corporativo V3.1 incompleto: ${section} exige pelo menos ${count} registros (recebidos ${Array.isArray(value) ? value.length : 0}). Nenhum PDI foi armazenado.`);
    }
    if (value.length > count) {
      console.warn(`[PDI Corporativo V3.1] ${section}: recebidos ${value.length} registros; serao utilizados os ${count} primeiros.`);
    }
  }
  for (let i = 0; i < 3; i++) {
    const competency = cleanText(content.competencias_desenvolver[i]?.competencia);
    const action = cleanText(content.plano_acao_70_20_10[i]?.competencia);
    if (!competency || !action || competency.toLocaleLowerCase("pt-BR") !== action.toLocaleLowerCase("pt-BR")) {
      throw new Error(`PDI Corporativo V3.1 inconsistente: a competência ${i + 1} da Seção 7 deve corresponder à Seção 5.`);
    }
  }
}

/**
 * Redação corporativa impessoal sem alterar campos de identificação, assinaturas
 * ou dados brutos do Relatório Lifenergy. Atua apenas sobre o JSON gerado pela IA.
 * O PDI Relacional mantém integralmente o seu comportamento anterior.
 */
function redactEvaluatedPersonName(text: string, fullName: string): string {
  const tokens = fullName.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return text;
  const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const variants = [
    tokens.join(" "),
    ...(tokens.length >= 3 ? [tokens.slice(0, 2).join(" ")] : []),
    tokens[0],
    // Tolera pequenas variações de grafia frequentes na redação (Camilla/Camila).
    tokens[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/([a-z])\1/gi, "$1"),
  ].filter((v) => v.length >= 3);
  if (variants.length === 0) return text;
  const alternatives = [...new Set(variants)]
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join("|");
  const nameMatcher = new RegExp(`(?<![\\p{L}\\p{N}])(?:${alternatives})(?![\\p{L}\\p{N}])`, "giu");
  return text
    .replace(nameMatcher, "a pessoa avaliada")
    .replace(/\b(?:de|da|do)\s+a pessoa avaliada\b/giu, "da pessoa avaliada")
    .replace(/\b(?:a|o)\s+a pessoa avaliada\b/giu, "a pessoa avaliada")
    .replace(/\bpor\s+a pessoa avaliada\b/giu, "pela pessoa avaliada")
    .replace(/\b(?:na|no|em)\s+a pessoa avaliada\b/giu, "na pessoa avaliada")
    .replace(/(^|[.!?]\s+|\n)(a pessoa avaliada)/g, (_match, prefix: string) => `${prefix}A pessoa avaliada`);
}

/** Retira apenas menções como (95%), (90% e 75%) da redação da seção 4. */
function removeParenthesizedPercentages(text: string): string {
  return text
    .replace(/\s*\(([^()]*)\)/g, (match, inner: string) => {
      const containsPercent = /\d{1,3}(?:[.,]\d+)?\s*%/.test(inner);
      const containsOnlyPercentValues = /^[\d\s%.,;/eE]+$/.test(inner.trim());
      return containsPercent && containsOnlyPercentValues ? "" : match;
    })
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function sanitizeCorporatePdiNarrative(
  content: LifenergyPdiGeneratedContent,
  fullName: string
): LifenergyPdiGeneratedContent {
  // Sanitiza todos os campos narrativos, inclusive as ações e responsáveis.
  // Não toca nos dados da aplicação nem no DOCX de identificação/assinatura.
  function sanitizeValue<T>(value: T, section4 = false): T {
    if (typeof value === "string") {
      const withoutName = redactEvaluatedPersonName(value, fullName);
      return (section4 ? removeParenthesizedPercentages(withoutName) : withoutName) as T;
    }
    if (Array.isArray(value)) {
      return value.map((item) => sanitizeValue(item, section4)) as T;
    }
    if (value !== null && typeof value === "object") {
      const result = Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, item]) => [
          key,
          sanitizeValue(item, section4 || [
            "diagnostico_perfil", "avaliacao_atributos",
            "pontos_fortes", "oportunidades_melhoria",
          ].includes(key)),
        ])
      );
      return result as T;
    }
    return value;
  }
  return sanitizeValue(content);
}

function normalizeGeneratedContent(content: LifenergyPdiGeneratedContent, data?: LifenergyPdiData): LifenergyPdiGeneratedContent {
  if (data?.pdiType === "corporate") assertCorporateV31Complete(content);
  const competencies = take(
    content.competencias_desenvolver,
    3,
    [
      {
        competencia: "Competência a definir",
        tipo: "Comportamental",
        nivel_atual: "Em desenvolvimento",
        competencia_organizacional_relacionada: "A definir com gestor imediato",
        estrategia_desenvolvimento: "Definir estratégia com gestor imediato.",
      },
    ]
  ).map((item) => ({
    competencia: cleanText(item.competencia),
    tipo: cleanText(item.tipo) || "Comportamental",
    nivel_atual: cleanText(item.nivel_atual) || "Em desenvolvimento",
    competencia_organizacional_relacionada:
      cleanText(item.competencia_organizacional_relacionada) || "A definir com gestor imediato",
    estrategia_desenvolvimento:
      cleanText(item.estrategia_desenvolvimento) || "Definir estratégia com gestor imediato.",
  }));

  return {
    objetivo_central_pdi:
      cleanText(content.objetivo_central_pdi) ||
      "Desenvolver competências comportamentais prioritárias alinhadas ao diagnóstico Lifenergy.",
    objetivo_carreira_desenvolvimento:
      cleanText(content.objetivo_carreira_desenvolvimento) ||
      "Fortalecer o desenvolvimento profissional por meio de ações práticas, acompanhamento e evidências de evolução.",
    diagnostico_perfil: cleanText(content.diagnostico_perfil),
    avaliacao_atributos: normalizeAttributes(content, data),
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
    competencias_desenvolver: competencies,
    objetivos_curto_prazo: normalizeObjectives(content.objetivos_curto_prazo, 3, "Até 6 meses"),
    objetivos_medio_prazo: normalizeObjectives(content.objetivos_medio_prazo, data?.pdiType === "corporate" ? 3 : 2, "Até 12 meses"),
    direcionamento_longo_prazo: take(
      content.direcionamento_longo_prazo,
      data?.pdiType === "corporate" ? 3 : 2,
      [
        {
          foco: "Consolidação comportamental",
          resultado_esperado: "Ampliar consistência na aplicação das competências desenvolvidas.",
          evidencia_evolucao: "Registros de evolução e feedbacks em checkpoints.",
        },
      ]
    ).map((item) => ({
      foco: cleanText(item.foco),
      resultado_esperado: cleanText(item.resultado_esperado),
      evidencia_evolucao: cleanText(item.evidencia_evolucao),
    })),
    plano_acao_70_20_10: take(
      content.plano_acao_70_20_10,
      3,
      competencies.map((item) => ({
        competencia: item.competencia,
        acao_70_experiencia: "Aplicar a competência em situações reais da rotina de trabalho.",
        acao_20_social: "Solicitar feedback do gestor ou de pares sobre a prática realizada.",
        acao_10_formal: "Realizar leitura, curso curto ou treinamento relacionado à competência.",
        frequencia: "Semanal",
        responsavel: "Avaliado",
        recursos: "Agenda de acompanhamento, registros de prática e materiais de apoio.",
        evidencia_conclusao: "Registro da ação realizada e validação no checkpoint.",
      }))
    ).map((item) => ({
      competencia: cleanText(item.competencia),
      acao_70_experiencia: cleanText(item.acao_70_experiencia),
      acao_20_social: cleanText(item.acao_20_social),
      acao_10_formal: cleanText(item.acao_10_formal),
      frequencia: cleanText(item.frequencia) || "Semanal",
      responsavel: cleanText(item.responsavel) || "Avaliado",
      recursos: cleanText(item.recursos) || "Materiais de apoio e acompanhamento do gestor.",
      evidencia_conclusao: cleanText(item.evidencia_conclusao) || "Registro da prática e validação em checkpoint.",
    })),
    indicadores_evidencias: take(
      content.indicadores_evidencias,
      3,
      [
        {
          indicador: "Evolução comportamental percebida",
          criterio_smart: "Registrar evidências mensais de prática e revisar em checkpoint trimestral.",
          kpi_comportamental: "Feedback positivo ou evolução registrada pelo gestor.",
          evidencia: "Registro de prática, feedback e próximos passos.",
          prazo: "Até 90 dias",
        },
      ]
    ).map((item) => ({
      indicador: cleanText(item.indicador),
      criterio_smart: cleanText(item.criterio_smart),
      kpi_comportamental: cleanText(item.kpi_comportamental),
      evidencia: cleanText(item.evidencia),
      prazo: cleanText(item.prazo) || "Até 90 dias",
    })),
    apoio_suporte_necessario: cleanText(content.apoio_suporte_necessario),
    cronograma_acompanhamento: take(
      content.cronograma_acompanhamento,
      2,
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
              text: data.pdiType === "corporate"
                ? `${LIFENERGY_PDI_SYSTEM_PROMPT}\n${LIFENERGY_PDI_CORPORATE_V31_ADDENDUM}`
                : LIFENERGY_PDI_SYSTEM_PROMPT,
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
          name: "lifenergy_pdi_v2",
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

  let generated: LifenergyPdiGeneratedContent;
  try {
    generated = JSON.parse(outputText) as LifenergyPdiGeneratedContent;
  } catch {
    throw new Error("A IA retornou JSON inválido para o PDI. Nenhum PDI foi armazenado.");
  }
  if (!isLifenergyPdiGeneratedContent(generated)) {
    throw new Error("Resposta da IA fora do modelo Lifenergy PDI V2 esperado. Nenhum PDI foi armazenado.");
  }
  if (data.pdiType === "corporate") {
    generated = await completeMissingCorporateSections(generated, data, apiKey, model);
  }
  const normalized = normalizeGeneratedContent(generated, data);
  const content = data.pdiType === "corporate"
    ? sanitizeCorporatePdiNarrative(normalized, data.reportData.response.full_name)
    : normalized;
  return { content, model };
}
