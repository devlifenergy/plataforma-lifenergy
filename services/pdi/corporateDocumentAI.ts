import { inflateRawSync } from "node:zlib";
import type { CorporateDocumentCategory } from "./corporateKnowledge";
import { getCorporateDocumentCategoryLabel } from "./corporateKnowledge";

const MAX_SOURCE_CHARS = 120000;
const MAX_SUMMARY_CHARS = 12000;

function cleanText(value: unknown) {
  return String(value ?? "")
    .replace(/\u0000/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function decodeUtf8(buffer: Buffer) {
  return cleanText(new TextDecoder("utf-8", { fatal: false }).decode(buffer));
}

function stripXml(value: string) {
  return cleanText(
    value
      .replace(/<w:tab\/>/g, " ")
      .replace(/<\/w:p>/g, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/\s+\n/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
  );
}

function findEndOfCentralDirectory(buffer: Buffer) {
  const min = Math.max(0, buffer.length - 0xffff - 22);

  for (let index = buffer.length - 22; index >= min; index -= 1) {
    if (buffer.readUInt32LE(index) === 0x06054b50) {
      return index;
    }
  }

  throw new Error("Arquivo DOCX inválido ou corrompido.");
}

function extractZipEntry(buffer: Buffer, entryName: string) {
  const eocd = findEndOfCentralDirectory(buffer);
  const entryCount = buffer.readUInt16LE(eocd + 10);
  const centralOffset = buffer.readUInt32LE(eocd + 16);

  let pointer = centralOffset;

  for (let i = 0; i < entryCount; i += 1) {
    if (buffer.readUInt32LE(pointer) !== 0x02014b50) {
      throw new Error("Estrutura interna do DOCX inválida.");
    }

    const method = buffer.readUInt16LE(pointer + 10);
    const compressedSize = buffer.readUInt32LE(pointer + 20);
    const fileNameLength = buffer.readUInt16LE(pointer + 28);
    const extraLength = buffer.readUInt16LE(pointer + 30);
    const commentLength = buffer.readUInt16LE(pointer + 32);
    const localHeaderOffset = buffer.readUInt32LE(pointer + 42);
    const name = buffer
      .subarray(pointer + 46, pointer + 46 + fileNameLength)
      .toString("utf8");

    if (name === entryName) {
      if (buffer.readUInt32LE(localHeaderOffset) !== 0x04034b50) {
        throw new Error("Cabeçalho interno do DOCX inválido.");
      }

      const localNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
      const localExtraLength = buffer.readUInt16LE(localHeaderOffset + 28);
      const dataStart = localHeaderOffset + 30 + localNameLength + localExtraLength;
      const compressed = buffer.subarray(dataStart, dataStart + compressedSize);

      if (method === 0) return compressed;
      if (method === 8) return inflateRawSync(compressed);

      throw new Error("Método de compressão do DOCX não suportado.");
    }

    pointer += 46 + fileNameLength + extraLength + commentLength;
  }

  throw new Error("Não foi possível encontrar texto principal no DOCX.");
}

function extractDocxText(buffer: Buffer) {
  const documentXml = extractZipEntry(buffer, "word/document.xml").toString("utf8");
  return stripXml(documentXml);
}

function isTextLike(fileName: string, mimeType: string) {
  const lowerName = fileName.toLowerCase();
  const lowerType = mimeType.toLowerCase();

  return (
    lowerType.startsWith("text/") ||
    lowerType.includes("json") ||
    lowerType.includes("csv") ||
    lowerName.endsWith(".txt") ||
    lowerName.endsWith(".md") ||
    lowerName.endsWith(".csv") ||
    lowerName.endsWith(".json")
  );
}

export async function extractCorporateDocumentText(file: File) {
  const fileName = file.name || "documento";
  const mimeType = file.type || "";
  const buffer = Buffer.from(await file.arrayBuffer());

  if (!buffer.length) {
    throw new Error("O arquivo enviado está vazio.");
  }

  if (isTextLike(fileName, mimeType)) {
    const text = decodeUtf8(buffer);
    if (!text) throw new Error("Não foi possível extrair texto do arquivo enviado.");
    return text.slice(0, MAX_SOURCE_CHARS);
  }

  if (
    fileName.toLowerCase().endsWith(".docx") ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const text = extractDocxText(buffer);
    if (!text) throw new Error("Não foi possível extrair texto do DOCX enviado.");
    return text.slice(0, MAX_SOURCE_CHARS);
  }

  throw new Error(
    "Formato ainda não suportado para leitura automática. Envie TXT, MD, CSV, JSON ou DOCX."
  );
}

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

function deterministicSummary(params: {
  title: string;
  category: CorporateDocumentCategory;
  extractedText: string;
}) {
  const categoryLabel = getCorporateDocumentCategoryLabel(params.category);
  const source = cleanText(params.extractedText).slice(0, MAX_SUMMARY_CHARS);

  return cleanText(`Documento: ${params.title}
Categoria: ${categoryLabel}

Sumário técnico gerado automaticamente:
${source}

Observação técnica: este resumo foi criado a partir da extração textual do documento enviado e será usado apenas como contexto interno para o PDI Corporativo.`);
}

export async function generateCorporateDocumentSummary(params: {
  title: string;
  category: CorporateDocumentCategory;
  extractedText: string;
}) {
  const source = cleanText(params.extractedText).slice(0, MAX_SOURCE_CHARS);

  if (!source) {
    throw new Error("Não foi possível gerar sumário porque o documento não possui texto extraído.");
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_PDI_MODEL || process.env.OPENAI_REPORT_MODEL || "gpt-5.1";
  const categoryLabel = getCorporateDocumentCategoryLabel(params.category);

  if (!apiKey) {
    return deterministicSummary({ ...params, extractedText: source });
  }

  const systemPrompt = `Você é o leitor técnico da Biblioteca Corporativa Lifenergy.
Sua tarefa é ler o documento enviado pela empresa, interpretar o conteúdo e gerar um sumário técnico objetivo para uso interno da IA na geração do PDI Corporativo.
O sumário não será exibido para o usuário final.
Não invente informações.
Não crie recomendações de PDI.
Extraia apenas o que o documento permite compreender sobre cultura, competências, cargos, funções, estratégias, prioridades, treinamentos, desempenho ou rituais de gestão.
Escreva em português do Brasil.
Use linguagem objetiva e corporativa.`;

  const userPrompt = `Documento: ${params.title}
Categoria: ${categoryLabel}

Gere um sumário técnico estruturado com:
1. Finalidade do documento.
2. Pontos principais.
3. Competências, comportamentos, responsabilidades ou prioridades identificadas.
4. Possíveis usos do documento para orientar o PDI Corporativo.
5. Limites: o que o documento não informa.

CONTEÚDO EXTRAÍDO:
${source}`;

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
          content: [{ type: "input_text", text: systemPrompt }],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: userPrompt }],
        },
      ],
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.error?.message || "Erro ao gerar sumário do documento com IA.";
    throw new Error(message);
  }

  const outputText = cleanText(extractOutputText(payload));

  if (!outputText) {
    throw new Error("A IA não retornou sumário para o documento.");
  }

  return outputText.slice(0, MAX_SUMMARY_CHARS);
}
