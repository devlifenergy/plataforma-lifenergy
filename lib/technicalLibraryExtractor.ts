import mammoth from "mammoth";

export type TechnicalLibraryExtraction = {
  format: "pdf" | "docx";
  text: string;
  html: string | null;
};

function normalizeExtractedText(value: string) {
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n").replace(/\n{4,}/g, "\n\n\n").trim();
}

function stripUnsafeHtml(value: string) {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, "")
    .replace(/<embed\b[^>]*\/?>/gi, "")
    .replace(/<link\b[^>]*\/?>/gi, "")
    .replace(/<meta\b[^>]*\/?>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/\s(href|src)\s*=\s*"\s*javascript:[^"]*"/gi, ' $1="#"')
    .replace(/\s(href|src)\s*=\s*'\s*javascript:[^']*'/gi, " $1='#'");
}

async function extractPdf(buffer: Buffer): Promise<TechnicalLibraryExtraction> {
  // Import intencionalmente tardio: evita avaliar pdf.js ao abrir a Biblioteca
  // em runtimes serverless que não fornecem DOMMatrix.
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    const text = normalizeExtractedText(result.text ?? "");
    if (!text) {
      throw new Error("Não foi possível extrair texto deste PDF. Envie um PDF com texto selecionável; PDFs digitalizados somente como imagem não são suportados.");
    }
    return { format: "pdf", text, html: null };
  } finally {
    await parser.destroy();
  }
}

async function extractDocx(buffer: Buffer): Promise<TechnicalLibraryExtraction> {
  const [htmlResult, textResult] = await Promise.all([
    mammoth.convertToHtml({ buffer }, {
      includeDefaultStyleMap: true,
      includeEmbeddedStyleMap: true,
      externalFileAccess: false,
    }),
    mammoth.extractRawText({ buffer }),
  ]);
  const text = normalizeExtractedText(textResult.value ?? "");
  if (!text) throw new Error("Não foi possível extrair conteúdo textual deste arquivo DOCX.");
  const html = stripUnsafeHtml(htmlResult.value ?? "").trim();
  return { format: "docx", text, html: html || null };
}

export async function extractTechnicalLibraryDocument(file: File): Promise<TechnicalLibraryExtraction> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name.toLowerCase();
  const mimeType = (file.type || "").toLowerCase();

  if (mimeType === "application/pdf" || fileName.endsWith(".pdf")) return extractPdf(buffer);
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || fileName.endsWith(".docx")) return extractDocx(buffer);

  throw new Error("Formato não suportado. Envie um arquivo PDF ou DOCX.");
}
