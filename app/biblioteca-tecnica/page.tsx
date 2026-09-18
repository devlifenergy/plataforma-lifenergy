import Link from "next/link";
import { listTechnicalLibraryDocuments } from "@/services/library/actions";

function isYouTubeUrl(value: string | null | undefined) {
  if (!value) return false;
  try {
    const host = new URL(value).hostname.toLowerCase();
    return (
      host === "youtu.be" ||
      host === "www.youtu.be" ||
      host === "youtube.com" ||
      host === "www.youtube.com" ||
      host.endsWith(".youtube.com")
    );
  } catch {
    return false;
  }
}

export default async function BibliotecaTecnicaPublicaPage() {
  const docs = await listTechnicalLibraryDocuments(true);

  return (
    <main className="min-h-screen bg-[#f7f6f1] text-[#153047]">
      <header className="bg-[#102e43] px-6 py-6 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="font-bold tracking-[0.14em] text-[#e8cc86]"
          >
            LIFENERGY
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-[#e5c87f]/60 px-5 py-2 text-sm font-semibold text-[#f1d994]"
          >
            Entrar
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#a17824]">
          Fundamentação teórica
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-[#102e43]">
          Biblioteca Técnica Lifenergy
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Consulte materiais técnicos, conceitos, vídeos e referências
          disponibilizados pela plataforma.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {docs.map((doc: any) => {
            const hasFile = Boolean(doc.file_name);
            const hasLink = Boolean(doc.external_url);
            const youtube = isYouTubeUrl(doc.external_url);

            return (
              <article
                key={doc.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold text-[#0F2D4A]">
                  {doc.title}
                </h2>
                <p className="mt-3 leading-7 text-slate-600">
                  {doc.description || "Material técnico Lifenergy."}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {hasFile ? (
                    <a
                      href={`/api/biblioteca-tecnica/${doc.id}/view`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-full bg-[#0F2D4A] px-5 py-2.5 text-sm font-bold text-white"
                    >
                      Visualizar conteúdo
                    </a>
                  ) : null}

                  {hasLink ? (
                    <a
                      href={doc.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-full border border-[#0F2D4A] px-5 py-2.5 text-sm font-bold text-[#0F2D4A]"
                    >
                      {youtube ? "Assistir ao vídeo" : "Acessar conteúdo"}
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        {docs.length === 0 ? (
          <p className="mt-10 rounded-2xl bg-white p-6 text-slate-500">
            Nenhum material público disponível no momento.
          </p>
        ) : null}
      </section>
    </main>
  );
}
