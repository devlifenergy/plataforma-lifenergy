import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabaseServer";
import { getTechnicalLibraryDocument } from "@/services/library/actions";

function getYouTubeEmbedUrl(value?: string | null) {
  if (!value) return null;

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    let id = "";

    if (host === "youtu.be") {
      id = url.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") id = url.searchParams.get("v") ?? "";
      else {
        const parts = url.pathname.split("/").filter(Boolean);
        if (["embed", "shorts", "live"].includes(parts[0] ?? "")) {
          id = parts[1] ?? "";
        }
      }
    }

    return /^[A-Za-z0-9_-]{6,}$/.test(id)
      ? `https://www.youtube.com/embed/${id}`
      : null;
  } catch {
    return null;
  }
}

type PdfBlock =
  | { kind: "heading"; text: string; level: 2 | 3 }
  | { kind: "paragraph"; text: string }
  | { kind: "bullet"; items: string[] }
  | { kind: "checklist"; items: string[] };

function isAllCapsHeading(text: string) {
  const letters = text.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, "");
  return (
    letters.length >= 4 &&
    text.length <= 100 &&
    letters === letters.toUpperCase()
  );
}

function isNumberedHeading(text: string) {
  return /^\d+(?:\.\d+)*[.)]?\s+\S/.test(text) && text.length <= 130;
}

function looksLikeShortHeading(text: string) {
  return (
    text.length <= 80 &&
    !/[.!?;:]$/.test(text) &&
    /^(objetivo|recomendações|recomendacoes|checklist|conclusão|conclusao|introdução|introducao|orientações|orientacoes|observações|observacoes|acesso|principais|como\s|seção|secao)/i.test(
      text
    )
  );
}

function parsePdfText(text: string): PdfBlock[] {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const blocks: PdfBlock[] = [];
  let paragraph: string[] = [];
  let bullets: string[] = [];
  let checklist: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  };

  const flushBullets = () => {
    if (!bullets.length) return;
    blocks.push({ kind: "bullet", items: bullets });
    bullets = [];
  };

  const flushChecklist = () => {
    if (!checklist.length) return;
    blocks.push({ kind: "checklist", items: checklist });
    checklist = [];
  };

  const flushLists = () => {
    flushBullets();
    flushChecklist();
  };

  for (const line of lines) {
    const bulletMatch = line.match(/^[•●▪◦\-–—]\s*(.+)$/);
    const checkMatch = line.match(/^[□☐☑✓✔]\s*(.+)$/);

    if (bulletMatch) {
      flushParagraph();
      flushChecklist();
      bullets.push(bulletMatch[1]);
      continue;
    }

    if (checkMatch) {
      flushParagraph();
      flushBullets();
      checklist.push(checkMatch[1]);
      continue;
    }

    if (isAllCapsHeading(line) || isNumberedHeading(line) || looksLikeShortHeading(line)) {
      flushParagraph();
      flushLists();
      blocks.push({
        kind: "heading",
        text: line,
        level: isAllCapsHeading(line) ? 2 : 3,
      });
      continue;
    }

    flushLists();
    paragraph.push(line);

    // Fecha parágrafos naturais para evitar blocos excessivamente longos.
    if (/[.!?]$/.test(line) && paragraph.join(" ").length >= 120) {
      flushParagraph();
    }
  }

  flushParagraph();
  flushLists();
  return blocks;
}

function PdfEditorialContent({ text }: { text: string }) {
  const blocks = parsePdfText(text);

  return (
    <article className="mx-auto max-w-4xl text-[16px] leading-8 text-slate-700">
      {blocks.map((block, index) => {
        if (block.kind === "heading") {
          return block.level === 2 ? (
            <h2
              key={index}
              className="mb-4 mt-10 border-b border-slate-200 pb-3 text-xl font-bold tracking-tight text-[#0F2A43] first:mt-0"
            >
              {block.text}
            </h2>
          ) : (
            <h3
              key={index}
              className="mb-3 mt-8 text-lg font-semibold text-[#0F2A43]"
            >
              {block.text}
            </h3>
          );
        }

        if (block.kind === "bullet") {
          return (
            <ul key={index} className="my-5 space-y-2 pl-1">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-3">
                  <span className="mt-[2px] font-bold text-[#B98A2E]">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.kind === "checklist") {
          return (
            <ul key={index} className="my-5 space-y-2">
              {block.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="flex gap-3 rounded-lg bg-slate-50 px-4 py-2"
                >
                  <span className="text-[#B98A2E]">□</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className="my-4">
            {block.text}
          </p>
        );
      })}
    </article>
  );
}

export default async function TechnicalLibraryDocumentPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  const document = await getTechnicalLibraryDocument(documentId);

  if (!document) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const backHref = user ? "/painel" : "/biblioteca-tecnica";
  const backLabel = user ? "← Voltar ao Painel" : "← Voltar à Biblioteca Técnica";

  const youtubeEmbedUrl = getYouTubeEmbedUrl(document.external_url);
  const isDocx = document.source_format === "docx" && document.extracted_html;

  return (
    <main className="min-h-screen bg-[#F7F5EF] px-5 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href={backHref}
          className="text-sm font-semibold text-[#0F2A43] hover:underline"
        >
          {backLabel}
        </Link>

        <header className="mt-8 border-b border-slate-200 pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#B98A2E]">
            Biblioteca Técnica Lifenergy
          </p>
          <h1 className="mt-3 max-w-5xl text-3xl font-bold tracking-tight text-[#0F2A43] md:text-4xl">
            {document.title}
          </h1>
          {document.description ? (
            <p className="mt-5 max-w-4xl text-base leading-7 text-slate-600">
              {document.description}
            </p>
          ) : null}
        </header>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm md:px-12 md:py-12">
          {isDocx ? (
            <article
              className="mx-auto max-w-4xl text-[16px] leading-8 text-slate-700
                [&_h1]:mb-5 [&_h1]:mt-10 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#0F2A43]
                [&_h2]:mb-4 [&_h2]:mt-9 [&_h2]:border-b [&_h2]:border-slate-200 [&_h2]:pb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#0F2A43]
                [&_h3]:mb-3 [&_h3]:mt-7 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#0F2A43]
                [&_p]:my-4
                [&_ul]:my-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-7
                [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-7
                [&_table]:my-7 [&_table]:w-full [&_table]:border-collapse
                [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:p-3 [&_th]:text-left [&_th]:font-semibold [&_th]:text-[#0F2A43]
                [&_td]:border [&_td]:border-slate-200 [&_td]:p-3 [&_td]:align-top"
              dangerouslySetInnerHTML={{ __html: document.extracted_html! }}
            />
          ) : document.extracted_text ? (
            <PdfEditorialContent text={document.extracted_text} />
          ) : (
            <p className="text-slate-600">
              Não há conteúdo textual disponível para este documento.
            </p>
          )}
        </section>

        {youtubeEmbedUrl ? (
          <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
            <h2 className="mb-4 text-lg font-semibold text-[#0F2A43]">
              Conteúdo complementar
            </h2>
            <div className="aspect-video overflow-hidden rounded-xl bg-black">
              <iframe
                src={youtubeEmbedUrl}
                title="Vídeo complementar"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </section>
        ) : document.external_url ? (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0F2A43]">
              Referência complementar
            </h2>
            <a
              href={document.external_url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex rounded-xl bg-[#0F2A43] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Acessar conteúdo externo
            </a>
          </section>
        ) : null}
      </div>
    </main>
  );
}
