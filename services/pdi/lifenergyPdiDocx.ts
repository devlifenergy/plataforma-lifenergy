import type { LifenergyPdiData, LifenergyPdiGeneratedContent } from "./lifenergyPdiTypes";
import {
  LIFENERGY_PDI_ENGINE_VERSION,
  LIFENERGY_PDI_PROMPT_VERSION,
  LIFENERGY_PDI_TEMPLATE_VERSION,
} from "./lifenergyPdiTypes";

function cleanXmlText(value: unknown) {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim();
}

function xml(value: unknown) {
  return cleanXmlText(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function normalizeParagraphText(value: unknown) {
  return cleanXmlText(value).replace(/\r\n|\r/g, "\n");
}

function formatDate(value: unknown) {
  const text = cleanXmlText(value);
  const match = text.slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return text;
  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}

function fileSafe(value: unknown) {
  const base = cleanXmlText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);

  return base || "Avaliado";
}

export function buildLifenergyPdiFileName(data: LifenergyPdiData) {
  const tipo = data.pdiType === "corporate" ? "Corporativo" : "Relacional";
  const cargo = data.pdiType === "corporate" && data.pdiContext?.current_job_title
    ? `_${fileSafe(data.pdiContext.current_job_title)}`
    : "";
  return `PDI_Lifenergy_${tipo}_${fileSafe(data.reportData.response.full_name)}${cargo}.docx`;
}

function run(text: unknown, options?: { bold?: boolean; italic?: boolean; color?: string; size?: number }) {
  const bold = options?.bold ? "<w:b/>" : "";
  const italic = options?.italic ? "<w:i/>" : "";
  const color = options?.color ? `<w:color w:val="${options.color}"/>` : "";
  const size = options?.size ? `<w:sz w:val="${options.size}"/>` : "";
  return `<w:r><w:rPr>${bold}${italic}${color}${size}</w:rPr><w:t xml:space="preserve">${xml(text)}</w:t></w:r>`;
}

function paragraph(
  text: unknown,
  options?: { style?: string; bold?: boolean; italic?: boolean; color?: string; size?: number; center?: boolean; keepNext?: boolean }
) {
  const parts: string[] = [];
  if (options?.style) parts.push(`<w:pStyle w:val="${options.style}"/>`);
  if (options?.center) parts.push('<w:jc w:val="center"/>');
  if (options?.keepNext) parts.push("<w:keepNext/>");
  const paragraphProperties = parts.length > 0 ? `<w:pPr>${parts.join("")}</w:pPr>` : "";

  return `<w:p>${paragraphProperties}${run(text, {
    bold: options?.bold,
    italic: options?.italic,
    color: options?.color,
    size: options?.size,
  })}</w:p>`;
}

/**
 * Reduz redundância em tabelas corporativas apenas quando há limite de frase
 * completo. Nunca corta uma meta SMART, prazo, número ou evidência ao meio.
 * Se o texto não possuir ponto seguro de condensação, mantém o conteúdo:
 * a orientação de concisão da IA tem prioridade sobre abreviação arriscada.
 */
function corporateExecutiveCell(value: unknown, maxLength: number) {
  const text = cleanXmlText(value).replace(/\s+/g, " ");
  if (text.length <= maxLength) return text;
  const floor = Math.round(maxLength * 0.55);
  const sentenceEnd = /[.!?](?=\s|$)/g;
  let boundary = -1;
  for (const match of text.matchAll(sentenceEnd)) {
    const candidate = (match.index ?? -1) + 1;
    if (candidate >= floor && candidate <= maxLength) boundary = candidate;
  }
  if (boundary > 0) return text.slice(0, boundary).trim();
  // Evita resultados como "...registradas em agenda e.".
  return text;
}

function executiveRows(rows: string[][], limits: number[]): string[][] {
  return [rows[0], ...rows.slice(1).map((r) => r.map((cell, i) => corporateExecutiveCell(cell, limits[i] ?? 180)))];
}

function fieldLine(label: string, value: unknown) {
  return paragraph(`${label}: ${cleanXmlText(value) || "-"}`);
}

function list(items: unknown[]) {
  return items.map((item) => paragraph(`• ${cleanXmlText(item)}`)).join("");
}

function paragraphs(text: unknown) {
  const normalized = normalizeParagraphText(text);
  if (!normalized) return paragraph("");

  return normalized
    .split(/\n{2,}|\n/)
    .map((part) => paragraph(part))
    .join("");
}

function heading1(text: unknown) {
  return paragraph(text, { style: "Heading1" });
}

function heading2(text: unknown) {
  return paragraph(text, { style: "Heading2" });
}

function tableCell(content: string, options?: { header?: boolean; width?: number }) {
  const shade = options?.header ? '<w:shd w:fill="F2F2F2"/>' : "";
  const width = options?.width ?? 2400;
  return `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>${shade}</w:tcPr>${content}</w:tc>`;
}

function table(rows: Array<Array<string>>, options?: { headerRows?: number; widths?: number[]; compact?: boolean }) {
  const headerRows = options?.headerRows ?? 1;
  const widths = options?.widths ?? [];
  const renderedRows = rows
    .map((row, rowIndex) => {
      const isHeader = rowIndex < headerRows;
      const renderedCells = row
        .map((cell, cellIndex) =>
          tableCell(paragraph(cell, { bold: isHeader, keepNext: isHeader && Boolean(options?.compact) }), {
            header: isHeader,
            width: widths[cellIndex],
          })
        )
        .join("");
      const rowProperties = options?.compact
        ? `<w:trPr>${isHeader ? "<w:tblHeader/>" : ""}<w:cantSplit/></w:trPr>`
        : "";
      return `<w:tr>${rowProperties}${renderedCells}</w:tr>`;
    })
    .join("");

  return `<w:tbl>
    <w:tblPr>
      <w:tblW w:w="${options?.compact ? widths.reduce((sum, width) => sum + width, 0) : 0}" w:type="${options?.compact ? "dxa" : "auto"}"/>
      ${options?.compact ? '<w:tblLayout w:type="fixed"/>' : ""}
      <w:tblBorders>
        <w:top w:val="single" w:sz="6" w:space="0" w:color="888888"/>
        <w:left w:val="single" w:sz="6" w:space="0" w:color="888888"/>
        <w:bottom w:val="single" w:sz="6" w:space="0" w:color="888888"/>
        <w:right w:val="single" w:sz="6" w:space="0" w:color="888888"/>
        <w:insideH w:val="single" w:sz="6" w:space="0" w:color="888888"/>
        <w:insideV w:val="single" w:sz="6" w:space="0" w:color="888888"/>
      </w:tblBorders>
      <w:tblCellMar>
        <w:top w:w="80" w:type="dxa"/>
        <w:left w:w="80" w:type="dxa"/>
        <w:bottom w:w="80" w:type="dxa"/>
        <w:right w:w="80" w:type="dxa"/>
      </w:tblCellMar>
    </w:tblPr>
    ${options?.compact && widths.length ? `<w:tblGrid>${widths.map((width) => `<w:gridCol w:w="${width}"/>`).join("")}</w:tblGrid>` : ""}
    ${renderedRows}
  </w:tbl>`;
}


type OrganizationLogoMedia = {
  extension: "png" | "jpg";
  buffer: Buffer;
};

function getOrganizationLogoMedia(data: { organization?: { logo_mime_type?: string | null; logo_content_base64?: string | null } }) {
  const mime = cleanXmlText(data.organization?.logo_mime_type).toLowerCase();
  const rawBase64 = cleanXmlText(data.organization?.logo_content_base64).replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "");

  if (!rawBase64) return null;
  if (mime !== "image/png" && mime !== "image/jpeg") return null;

  try {
    const buffer = Buffer.from(rawBase64, "base64");
    if (!buffer.length) return null;

    return {
      extension: mime === "image/png" ? "png" : "jpg",
      buffer,
    } satisfies OrganizationLogoMedia;
  } catch {
    return null;
  }
}

function logoDrawingXml(relId: string, logoSize: string | null | undefined) {
  const dimensions = logoSize === "small"
    ? { cx: 1100000, cy: 480000 }
    : logoSize === "large"
      ? { cx: 2100000, cy: 910000 }
      : { cx: 1500000, cy: 650000 };
  return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0">
    <wp:extent cx="${dimensions.cx}" cy="${dimensions.cy}"/>
    <wp:effectExtent l="0" t="0" r="0" b="0"/>
    <wp:docPr id="1" name="Logomarca da empresa"/>
    <wp:cNvGraphicFramePr>
      <a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/>
    </wp:cNvGraphicFramePr>
    <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
      <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
        <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
          <pic:nvPicPr>
            <pic:cNvPr id="0" name="Logomarca da empresa"/>
            <pic:cNvPicPr/>
          </pic:nvPicPr>
          <pic:blipFill>
            <a:blip r:embed="${relId}"/>
            <a:stretch><a:fillRect/></a:stretch>
          </pic:blipFill>
          <pic:spPr>
            <a:xfrm><a:off x="0" y="0"/><a:ext cx="${dimensions.cx}" cy="${dimensions.cy}"/></a:xfrm>
            <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
          </pic:spPr>
        </pic:pic>
      </a:graphicData>
    </a:graphic>
  </wp:inline></w:drawing></w:r>`;
}

function buildLogoHeaderXml(
  data: { organization?: { name?: string | null; logo_mime_type?: string | null; logo_content_base64?: string | null; logo_size?: string | null; logo_position?: string | null } },
  title: string,
  subtitle: string
) {
  const logoMedia = getOrganizationLogoMedia(data);
  const logoAlignment = data.organization?.logo_position === "left"
    ? "left"
    : data.organization?.logo_position === "right"
      ? "right"
      : "center";
  const logoXml = logoMedia
    ? `<w:p><w:pPr><w:jc w:val="${logoAlignment}"/></w:pPr>${logoDrawingXml("rIdLogo", data.organization?.logo_size)}</w:p>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
  xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
  xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
  ${logoXml}
  <w:p>
    <w:pPr><w:jc w:val="center"/></w:pPr>
    <w:r><w:rPr><w:b/><w:color w:val="0F2D4A"/><w:sz w:val="18"/></w:rPr><w:t>${xml(title)}</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr><w:jc w:val="center"/></w:pPr>
    <w:r><w:rPr><w:color w:val="666666"/><w:sz w:val="16"/></w:rPr><w:t>${xml(subtitle)}</w:t></w:r>
  </w:p>
</w:hdr>`;
}

function buildHeaderRelsXml(logoMedia: OrganizationLogoMedia | null) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${
    logoMedia
      ? `<Relationship Id="rIdLogo" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/company_logo.${logoMedia.extension}"/>`
      : ""
  }
</Relationships>`;
}

const ATTRIBUTE_DESCRIPTIONS: Record<string, string> = {
  Socialização:
    "Atributo relacionado com as interações do Usuário com outros indivíduos, sejam familiares, amigos ou colegas de trabalho.",
  Reflexão:
    "Atributo relacionado com a reflexão interior do Usuário sobre as suas questões de vida e aspectos maiores do contexto no qual ele habita.",
  Lazer:
    "Atributo relacionado com a realização de atividades que promovem o prazer e a felicidade do Usuário, sejam elas ao ar livre ou em casa.",
  Propósito:
    "Atributo relacionado com a motivação pessoal e os objetivos do Usuário, ditando suas ambições, perspectivas de futuro e conquistas.",
  Sentimento:
    "Atributo relacionado com o equilíbrio emocional do Usuário e sua relação positiva com os aspectos sentimentais internos e externos.",
};


function pdiTypeLabel(data: LifenergyPdiData) {
  return data.pdiType === "corporate"
    ? "PDI de Desenvolvimento Corporativo"
    : "PDI de Desenvolvimento Relacional";
}

function contextBlock(data: LifenergyPdiData) {
  const context = data.pdiContext;
  const rows = [
    ["Tipo de PDI", pdiTypeLabel(data)],
    ["Tipo de pessoa", context?.person_type === "employee" ? "Empregado da empresa" : "Avaliado externo"],
    ["Cargo atual", context?.current_job_title || "-"],
    ["Área", context?.current_area || "-"],
    ["Gestor imediato", context?.manager_name || "-"],
    ["Contexto atual", context?.context_summary || "-"],
    ["Situação atual", context?.current_situation || "-"],
    ["Desafios atuais", context?.current_challenges || "-"],
    ["Prioridades de desenvolvimento", context?.development_priorities || "-"],
    ["Direcionamento de carreira/desenvolvimento", context?.career_direction || "-"],
  ];

  return table([["Campo", "Informação"], ...rows], { widths: [3200, 7200] });
}

function corporateDocumentsBlock(_data: LifenergyPdiData) {
  return "";
}


function corporateContextNote(data: LifenergyPdiData) {
  if (data.pdiType !== "corporate" || !data.pdiContext?.current_job_title) return "";
  return paragraph(
    "Cargo, área e demais informações funcionais refletem o contexto informado. Os alinhamentos com a Descrição de Cargos e Funções e os direcionamentos de carreira deverão ser confirmados pela liderança responsável.",
    { italic: true, color: "666666" }
  );
}

/** Mantém cada competência e sua tabela na mesma página quando couber. */
function keepCorporateActionBlockTogether(inner: string) {
  return `<w:tbl>
    <w:tblPr><w:tblW w:w="15000" w:type="dxa"/><w:tblBorders>
      <w:top w:val="nil"/><w:bottom w:val="nil"/>
      <w:left w:val="nil"/><w:right w:val="nil"/>
      <w:insideH w:val="nil"/><w:insideV w:val="nil"/>
    </w:tblBorders><w:tblCellMar><w:top w:w="0" w:type="dxa"/>
      <w:bottom w:w="0" w:type="dxa"/><w:left w:w="0" w:type="dxa"/>
      <w:right w:w="0" w:type="dxa"/></w:tblCellMar></w:tblPr>
    <w:tblGrid><w:gridCol w:w="15000"/></w:tblGrid>
    <w:tr><w:trPr><w:cantSplit/></w:trPr><w:tc>
      <w:tcPr><w:tcW w:w="15000" w:type="dxa"/></w:tcPr>
      ${inner}<w:p/>
    </w:tc></w:tr>
  </w:tbl>`;
}

function actionPlanBlock(content: LifenergyPdiGeneratedContent, corporateV31 = false) {
  return content.plano_acao_70_20_10
    .map((item, index) => {
      const inner = [
        corporateV31
          ? paragraph(`Competência ${index + 1} – ${item.competencia}`, { style: "Heading2", keepNext: true })
          : heading2(`Competência ${index + 1} – ${item.competencia}`),
        table(
          [
            ["Dimensão", "Ação"],
            ["70% – Prática", item.acao_70_experiencia],
            ["20% – Social", item.acao_20_social],
            ["10% – Formal", item.acao_10_formal],
          ],
          { widths: corporateV31 ? [3000, 11900] : [2100, 8200], compact: corporateV31 }
        ),
        paragraph(
          `Frequência: ${cleanXmlText(item.frequencia) || "-"} · Responsável: ${
            cleanXmlText(item.responsavel) || "-"
          } · Recursos: ${cleanXmlText(item.recursos) || "-"}`
        ),
        paragraph(`Evidência de conclusão: ${cleanXmlText(item.evidencia_conclusao) || "-"}`),
      ].join("");
      return corporateV31 ? keepCorporateActionBlockTogether(inner) : inner;
    })
    .join("");
}

function buildDocumentXml(data: LifenergyPdiData, content: LifenergyPdiGeneratedContent) {
  const corporateV31 = data.pdiType === "corporate";
  const pdiHeading1 = (text: string) => corporateV31
    ? paragraph(text, { style: "Heading1", keepNext: true })
    : heading1(text);
  const pdiHeading2 = (text: string) => corporateV31
    ? paragraph(text, { style: "Heading2", keepNext: true })
    : heading2(text);
  const reportData = data.reportData;
  const pdiTable = (rows: Array<Array<string>>, corporateWidths: number[]) => {
    if (corporateV31) return table(rows, { widths: corporateWidths, compact: true });
    const headers = rows[0]?.join("|") ?? "";
    const legacyWidths = headers.includes("Avaliação|Observações") ? [2200, 1600, 6200]
      : headers.includes("Pontos Fortes Identificados") ? [5000, 5000]
      : headers.startsWith("Competência|Tipo") ? [1900, 1400, 1400, 2600, 3300]
      : headers.startsWith("Nº|Objetivo") ? [600, 3200, 3600, 1400, 1200]
      : headers.startsWith("Foco|Resultado") ? [2800, 3700, 3700]
      : headers.startsWith("Indicador|Critério") ? [2200, 3000, 2600, 2600, 1200]
      : headers.startsWith("Reunião /") ? [2000, 1600, 2300, 3000, 2500]
      : [3100, 4800, 2100];
    return table(rows, { widths: legacyWidths });
  };
  const response = reportData.response;
  const applicationDate = formatDate(response.application_date);

  const attributeRows = [
    ["Atributo", "Avaliação", "Observações"],
    ...content.avaliacao_atributos.map((item) => [
      item.atributo,
      item.avaliacao,
      item.observacoes,
    ]),
  ];

  const competencyRows = [
    ["Competência", "Tipo", "Nível Atual", corporateV31 ? "Competência organizacional" : "Competência organizacional relacionada", "Estratégia de Desenvolvimento"],
    ...content.competencias_desenvolver.map((item) => [
      item.competencia,
      item.tipo,
      item.nivel_atual,
      item.competencia_organizacional_relacionada,
      item.estrategia_desenvolvimento,
    ]),
  ];

  const shortObjectiveRows = [
    ["Nº", "Objetivo", corporateV31 ? "Indicador de Sucesso" : "Indicador SMART / Indicador de Sucesso", "Prazo", "Prioridade"],
    ...content.objetivos_curto_prazo.map((item) => [
      item.numero,
      item.objetivo,
      item.indicador_sucesso,
      item.prazo,
      item.prioridade,
    ]),
  ];

  const mediumObjectiveRows = [
    ["Nº", "Objetivo", corporateV31 ? "Indicador de Sucesso" : "Indicador SMART / Indicador de Sucesso", "Prazo", "Prioridade"],
    ...content.objetivos_medio_prazo.map((item) => [
      item.numero,
      item.objetivo,
      item.indicador_sucesso,
      item.prazo,
      item.prioridade,
    ]),
  ];

  const longTermRows = [
    ["Foco", "Resultado Esperado", "Evidência de Evolução"],
    ...content.direcionamento_longo_prazo.map((item) => [
      item.foco,
      item.resultado_esperado,
      item.evidencia_evolucao,
    ]),
  ];

  const strengthsOpportunitiesRows = [
    ["Pontos Fortes Identificados", "Oportunidades de Melhoria"],
    ...Array.from({
      length: Math.max(content.pontos_fortes.length, content.oportunidades_melhoria.length, 3),
    }).map((_, index) => [
      content.pontos_fortes[index] || "-",
      content.oportunidades_melhoria[index] || "-",
    ]),
  ];


  const indicatorRows = [
    ["Indicador", "Critério SMART", "KPI comportamental", "Evidência", "Prazo"],
    ...content.indicadores_evidencias.map((item) => [
      item.indicador,
      item.criterio_smart,
      item.kpi_comportamental,
      item.evidencia,
      item.prazo,
    ]),
  ];

  const monitoringRows = [
    ["Reunião / Checkpoint", "Data Prevista", "Participantes", "Pauta Principal", "Observações"],
    ...content.cronograma_acompanhamento.map((item) => [
      item.checkpoint,
      item.data_prevista,
      item.participantes,
      item.pauta_principal,
      item.observacoes,
    ]),
  ];

  const signatureRows = [
    ["Função", "Nome Completo e Assinatura", "Data"],
    ["Avaliado", response.full_name, "___/___/______"],
    ["Aplicador", response.applicator_name || reportData.journey.applicator_name || "", "___/___/______"],
    ["Diretor / Responsável pela Área (quando aplicável)", "", "___/___/______"],
  ];

  const body = [
    paragraph(pdiTypeLabel(data).toUpperCase(), { style: "Title" }),
    paragraph(`Empresa: ${reportData.organization.name}`, { center: true, color: "666666", size: 20 }),

    pdiHeading1("SEÇÃO 1 – IDENTIFICAÇÃO DO COLABORADOR / AVALIADO"),
    fieldLine("Nome", response.full_name),
    fieldLine("CPF", response.cpf),
    fieldLine("E-mail", response.email),
    fieldLine("Data de nascimento", formatDate(response.birth_date)),
    fieldLine("Naturalidade", response.naturalidade),

    pdiHeading1("SEÇÃO 2 – CONTEXTO DO PDI"),
    contextBlock(data),
    corporateContextNote(data),
    corporateDocumentsBlock(data),

    pdiHeading1("SEÇÃO 3 – OBJETIVO CENTRAL DO PDI"),
    paragraphs(content.objetivo_central_pdi),
    pdiHeading2("3.1 – Objetivo de carreira / desenvolvimento profissional"),
    paragraphs(content.objetivo_carreira_desenvolvimento),

    pdiHeading1("SEÇÃO 4 – DIAGNÓSTICO E ANÁLISE DE PERFIL"),
    paragraphs(content.diagnostico_perfil),
    paragraph(
      corporateV31
        ? "A leitura de desenvolvimento articula os padrões do Relatório Lifenergy V3, os indicadores matemáticos originais e o contexto organizacional informado. A validação de desempenho e de trajetória de carreira cabe à liderança e aos processos formais da organização."
        : "O diagnóstico está conectado à síntese dos padrões relacionais do Relatório Lifenergy V1 do avaliado.",
      { italic: true, color: "666666" }
    ),

    pdiHeading2("4.1 – Avaliação do Colaborador / Avaliado"),
    pdiTable(attributeRows, [2200, 1800, 10900]),
    paragraph(
      "ⓘ Escala de Referência: 0% a 29% = Inferior / 30% a 49% = Média inferior / 50% a 69% = Média / 70% a 89% = Média Superior / 90% a 100% = Superior",
      { italic: true, color: "666666" }
    ),

    pdiHeading2("4.2 e 4.3 – Pontos Fortes e Oportunidades de Melhoria"),
    pdiTable(strengthsOpportunitiesRows, [7450, 7450]),

    pdiHeading1("SEÇÃO 5 – COMPETÊNCIAS A DESENVOLVER"),
    paragraph(corporateV31
      ? "Com base no diagnóstico, seguem as competências prioritárias a serem desenvolvidas no período de vigência deste PDI."
      : "Com base no diagnóstico, seguem as competências prioritárias a serem desenvolvidas no período de vigência deste PDI. A estratégia de desenvolvimento descreve a prática ligada à competência; o resultado consolidado dessa prática está descrito na Seção 6."),
    pdiTable(corporateV31 ? executiveRows(competencyRows, [82, 45, 126, 116, 165]) : competencyRows, [2600, 1800, 2900, 2800, 4800]),

    pdiHeading1("SEÇÃO 6 – OBJETIVOS DE DESENVOLVIMENTO"),
    paragraph("Cada objetivo expressa o resultado consolidado que a respectiva estratégia da Seção 5 deve produzir ao longo do tempo — não a ação em si."),
    pdiHeading2("6.1 – Objetivos de Curto Prazo (até 6 meses)"),
    pdiTable(corporateV31 ? executiveRows(shortObjectiveRows, [4, 166, 151, 33, 16]) : shortObjectiveRows, [650, 6000, 5550, 1650, 1050]),

    pdiHeading2("6.2 – Objetivos de Médio Prazo (até 12 meses)"),
    pdiTable(corporateV31 ? executiveRows(mediumObjectiveRows, [4, 166, 151, 33, 16]) : mediumObjectiveRows, [650, 6000, 5550, 1650, 1050]),

    pdiHeading2("6.3 – Direcionamento de Longo Prazo (2 a 3 anos)"),
    pdiTable(corporateV31 ? executiveRows(longTermRows, [110, 164, 153]) : longTermRows, [4500, 5000, 5400]),

    pdiHeading1("SEÇÃO 7 – PLANO DE AÇÃO 70-20-10"),
    paragraph(corporateV31
      ? `As ações abaixo estão vinculadas ao cargo de ${cleanXmlText(data.pdiContext?.current_job_title) || "referência"}, tomando como referência as atribuições descritas na Biblioteca Corporativa e os dados informados pela organização. Cada competência combina experiência prática (70%), aprendizagem social (20%) e aprendizagem formal (10%).`
      : "As ações abaixo foram adaptadas às atividades reais do cargo e ao contexto de desenvolvimento informado, sempre que esses dados estiverem disponíveis. Cada competência combina experiência prática (70%), aprendizagem social (20%) e aprendizagem formal (10%)."),
    actionPlanBlock(content, corporateV31),

    pdiHeading1("SEÇÃO 8 – INDICADORES E EVIDÊNCIAS DE EVOLUÇÃO"),
    ...(corporateV31 ? [] : [paragraph("Os indicadores abaixo devem apoiar o acompanhamento do progresso e a verificação objetiva da evolução comportamental.")]),
    pdiTable(corporateV31 ? executiveRows(indicatorRows, [111, 153, 112, 133, 48]) : indicatorRows, [3400, 3600, 3000, 3300, 1600]),

    pdiHeading1("SEÇÃO 9 – APOIO E SUPORTE NECESSÁRIO"),
    paragraphs(content.apoio_suporte_necessario),

    pdiHeading1("SEÇÃO 10 – MONITORAMENTO E AVALIAÇÃO"),
    pdiHeading2("10.1 – Cronograma de Acompanhamento"),
    ...(corporateV31 ? [] : [paragraph("Os checkpoints devem ocorrer com regularidade, preferencialmente a cada trimestre, para revisar objetivos, atualizar status das ações e registrar aprendizados.")]),
    pdiTable(corporateV31 ? executiveRows(monitoringRows, [83, 54, 95, 150, 108]) : monitoringRows, [2700, 2250, 2900, 4600, 2450]),

    pdiHeading1("SEÇÃO 11 – ASSINATURAS E APROVAÇÕES"),
    paragraph("Todas as partes envolvidas devem assinar este documento, confirmando ciência, concordância e comprometimento com o Plano de Desenvolvimento Individual."),
    pdiTable(signatureRows, [4600, 7600, 2700]),
    pdiHeading2("Declaração de Ciência e Comprometimento"),
    paragraph("Ao assinar este documento, todas as partes envolvidas declaram estar cientes dos objetivos, ações e responsabilidades definidos neste Plano de Desenvolvimento Individual, comprometendo-se a apoiar ativamente a execução e o acompanhamento das atividades previstas, em conformidade com as políticas e diretrizes de Gestão de Pessoas da organização."),

    ...(corporateV31 ? [
      pdiHeading2("Referências legais e institucionais"),
      paragraph(
        "Fontes indicadas no Modelo Canônico PDI Corporativo V3.1: Lei nº 14.457/2022; Consolidação das Leis do Trabalho (CLT); Lei nº 10.224/2001 (assédio sexual); Lei Geral de Proteção de Dados Pessoais (LGPD); Norma Regulamentadora nº 1 (NR-1), com Portaria MTE nº 1.419/2024 e Portaria MTE nº 765/2025 (prorrogação indicada no modelo para 26/05/2026); Código de Ética do Psicólogo; Resoluções CFP nº 6/2019 e nº 1/2009; Cartilha do Ministério Público do Trabalho (MPT); orientações do Tribunal Superior do Trabalho (TST) e decisões sobre a valoração do depoimento da vítima.",
        { size: 18, color: "666666" }
      ),
    ] : []),

    paragraph(`Data de geração: ${corporateV31 ? formatDate(new Date().toISOString()) : (applicationDate || formatDate(new Date().toISOString()))}`, {
      italic: true,
      color: "666666",
    }),
  ].join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <w:document
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
    xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
    xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
    xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
    xmlns:w10="urn:schemas-microsoft-com:office:word"
    xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
    xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
    xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"
    xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"
    xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"
    xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
    mc:Ignorable="w14 wp14">
    <w:body>
      ${body}
      <w:sectPr>
        <w:headerReference w:type="default" r:id="rId3"/>
        <w:footerReference w:type="default" r:id="rId2"/>
        <w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/>
        <w:pgMar w:top="1134" w:right="850" w:bottom="1134" w:left="850" w:header="708" w:footer="708" w:gutter="0"/>
      </w:sectPr>
    </w:body>
  </w:document>`;
}

const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="21"/></w:rPr></w:rPrDefault>
    <w:pPrDefault><w:pPr><w:spacing w:after="140" w:line="260" w:lineRule="auto"/></w:pPr></w:pPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:rPr><w:b/><w:color w:val="0F2D4A"/><w:sz w:val="34"/></w:rPr><w:pPr><w:jc w:val="center"/><w:spacing w:after="240"/></w:pPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:rPr><w:b/><w:color w:val="0F2D4A"/><w:sz w:val="27"/></w:rPr><w:pPr><w:spacing w:before="300" w:after="150"/></w:pPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:rPr><w:b/><w:color w:val="0F2D4A"/><w:sz w:val="23"/></w:rPr><w:pPr><w:spacing w:before="200" w:after="100"/></w:pPr></w:style>
</w:styles>`;

const corporateV31StylesXml = stylesXml
  .replace('<w:spacing w:after="140" w:line="260" w:lineRule="auto"/>', '<w:spacing w:after="90" w:line="256" w:lineRule="auto"/>')
  .replace('<w:spacing w:before="300" w:after="150"/>', '<w:spacing w:before="220" w:after="100"/>')
  .replace('<w:spacing w:before="200" w:after="100"/>', '<w:spacing w:before="140" w:after="70"/>');

const footerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p>
    <w:pPr><w:jc w:val="center"/></w:pPr>
    <w:r><w:rPr><w:color w:val="666666"/><w:sz w:val="18"/></w:rPr><w:t>Plataforma Lifenergy · PDI Lifenergy · Biblioteca Corporativa Inteligente</w:t></w:r>
  </w:p>
</w:ftr>`;

const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="png" ContentType="image/png"/>
  <Default Extension="jpg" ContentType="image/jpeg"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
  <Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;

const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;

const documentRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>
</Relationships>`;

function coreXml() {
  const now = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <dc:title>PLANO DE DESENVOLVIMENTO INDIVIDUAL – PDI</dc:title>
    <dc:creator>Plataforma Lifenergy</dc:creator>
    <cp:lastModifiedBy>Plataforma Lifenergy</cp:lastModifiedBy>
    <cp:keywords>Motor ${LIFENERGY_PDI_ENGINE_VERSION}; Prompt ${LIFENERGY_PDI_PROMPT_VERSION}; Template ${LIFENERGY_PDI_TEMPLATE_VERSION}</cp:keywords>
    <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>
    <dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
  </cp:coreProperties>`;
}

const appXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Plataforma Lifenergy</Application>
</Properties>`;

function makeCrcTable() {
  const table: number[] = [];
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
}

const crcTable = makeCrcTable();

function crc32(buffer: Buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date = new Date()) {
  const dosTime =
    (date.getHours() << 11) |
    (date.getMinutes() << 5) |
    Math.floor(date.getSeconds() / 2);
  const dosDate =
    ((date.getFullYear() - 1980) << 9) |
    ((date.getMonth() + 1) << 5) |
    date.getDate();
  return { dosTime, dosDate };
}

function createZip(entries: Array<{ name: string; data: string | Buffer }>) {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;
  const { dosTime, dosDate } = dosDateTime();

  for (const entry of entries) {
    const nameBuffer = Buffer.from(entry.name, "utf8");
    const dataBuffer = Buffer.isBuffer(entry.data)
      ? entry.data
      : Buffer.from(entry.data, "utf8");
    const crc = crc32(dataBuffer);

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt16LE(dosTime, 10);
    localHeader.writeUInt16LE(dosDate, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(dataBuffer.length, 18);
    localHeader.writeUInt32LE(dataBuffer.length, 22);
    localHeader.writeUInt16LE(nameBuffer.length, 26);
    localHeader.writeUInt16LE(0, 28);

    localParts.push(localHeader, nameBuffer, dataBuffer);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt16LE(dosTime, 12);
    centralHeader.writeUInt16LE(dosDate, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(dataBuffer.length, 20);
    centralHeader.writeUInt32LE(dataBuffer.length, 24);
    centralHeader.writeUInt16LE(nameBuffer.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    centralParts.push(centralHeader, nameBuffer);

    offset += localHeader.length + nameBuffer.length + dataBuffer.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralDirectory, end]);
}

export function buildLifenergyPdiDocx(
  data: LifenergyPdiData,
  content: LifenergyPdiGeneratedContent
) {
  const logoMedia = getOrganizationLogoMedia(data.reportData);
  const entries: Array<{ name: string; data: string | Buffer }> = [
    { name: "[Content_Types].xml", data: contentTypesXml },
    { name: "_rels/.rels", data: relsXml },
    { name: "docProps/core.xml", data: coreXml() },
    { name: "docProps/app.xml", data: appXml },
    { name: "word/_rels/document.xml.rels", data: documentRelsXml },
    { name: "word/_rels/header1.xml.rels", data: buildHeaderRelsXml(logoMedia) },
    { name: "word/styles.xml", data: data.pdiType === "corporate" ? corporateV31StylesXml : stylesXml },
    { name: "word/footer1.xml", data: footerXml },
    {
      name: "word/header1.xml",
      data: buildLogoHeaderXml(
        data.reportData,
        `PDI Lifenergy – ${data.reportData.response.full_name}`,
        "Plataforma Lifenergy · PDI Lifenergy · Biblioteca Corporativa Inteligente"
      ),
    },
    { name: "word/document.xml", data: buildDocumentXml(data, content) },
  ];

  if (logoMedia) {
    entries.push({ name: `word/media/company_logo.${logoMedia.extension}`, data: logoMedia.buffer });
  }

  return createZip(entries);
}
