import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export type TechnicalLibraryExtraction = {
  format: "pdf" | "docx";
  text: string;
  html: string | null;
};

function normalizeText(value: string) {
  return value.replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/\n{4,}/g, "\n\n\n").trim();
}

function stripUnsafeHtml(html: string) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, "")
    .replace(/<embed\b[^>]*\/?>/gi, "")
    .replace(/<link\b[^>]*\/?>/gi, "")
    .replace(/<meta\b[^>]*\/?>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/\shref\s*=\s*["']\s*javascript:[^"']*["']/gi, "")
    .replace(/\ssrc\s*=\s*["']\s*javascript:[^"']*["']/gi, "");
}

export async function extractTechnicalLibraryDocument(file: File): Promise<TechnicalLibraryExtraction> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();

  if (file.type === "application/pdf" || name.endsWith(".pdf")) {
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      const text = normalizeText(result.text || "");
      if (!text) throw new Error("Não foi possível extrair texto deste PDF. Use um PDF com texto selecionável.");
      return { format: "pdf", text, html: null };
    } finally {
      await parser.destroy();
    }
  }

  if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || name.endsWith(".docx")) {
    const [htmlResult, textResult] = await Promise.all([
      mammoth.convertToHtml({ buffer }, { includeDefaultStyleMap: true, includeEmbeddedStyleMap: true, externalFileAccess: false }),
      mammoth.extractRawText({ buffer }),
    ]);
    const text = normalizeText(textResult.value || "");
    if (!text) throw new Error("Não foi possível extrair o conteúdo deste arquivo DOCX.");
    return { format: "docx", text, html: stripUnsafeHtml(htmlResult.value || "").trim() || null };
  }

  throw new Error("Formato não suportado. Envie um arquivo PDF ou DOCX.");
}
