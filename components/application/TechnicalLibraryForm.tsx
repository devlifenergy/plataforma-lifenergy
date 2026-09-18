"use client";

import { useRef, useState, useTransition } from "react";
import { createTechnicalLibraryDocument } from "@/services/library/actions";

export function TechnicalLibraryForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState("");
  const [pending, start] = useTransition();

  return (
    <form
      ref={ref}
      action={(fd) =>
        start(async () => {
          try {
            await createTechnicalLibraryDocument(fd);
            ref.current?.reset();
            setMessage("Conteúdo publicado.");
          } catch (e) {
            setMessage(e instanceof Error ? e.message : "Erro ao publicar.");
          }
        })
      }
      className="grid gap-4 md:grid-cols-2"
    >
      <input
        name="title"
        required
        placeholder="Título *"
        className="rounded-xl border border-slate-300 px-4 py-3"
      />

      <input
        name="file"
        type="file"
        accept=".pdf,application/pdf"
        className="rounded-xl border border-slate-300 px-4 py-3"
      />

      <input
        name="external_url"
        type="url"
        placeholder="Link externo (YouTube, site, vídeo etc.)"
        className="rounded-xl border border-slate-300 px-4 py-3 md:col-span-2"
      />

      <p className="text-xs text-slate-500 md:col-span-2">
        Informe pelo menos um conteúdo: arquivo PDF, link externo ou ambos.
      </p>

      <textarea
        name="description"
        placeholder="Descrição / fundamentação"
        rows={3}
        className="rounded-xl border border-slate-300 px-4 py-3 md:col-span-2"
      />

      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <input name="is_public" type="checkbox" defaultChecked />
        Disponibilizar também ao público geral
      </label>

      <button
        disabled={pending}
        className="rounded-xl bg-[#0F2D4A] px-5 py-3 font-bold text-white disabled:opacity-60"
      >
        {pending ? "Publicando..." : "Adicionar à Biblioteca Técnica"}
      </button>

      {message ? <p className="text-sm md:col-span-2">{message}</p> : null}
    </form>
  );
}
