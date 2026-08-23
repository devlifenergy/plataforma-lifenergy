"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createOrganizationDocument } from "@/services/pdi/actions";

type CategoryOption = {
  id: string;
  label: string;
  requiredForCorporatePdi: boolean;
  description: string;
};

type CorporateDocumentFormProps = {
  categories: ReadonlyArray<CategoryOption>;
};

function isTextLike(file: File) {
  return (
    file.type.startsWith("text/") ||
    file.type.includes("json") ||
    file.type.includes("csv") ||
    file.name.endsWith(".md") ||
    file.name.endsWith(".txt") ||
    file.name.endsWith(".csv")
  );
}

export function CorporateDocumentForm({ categories }: CorporateDocumentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [contentText, setContentText] = useState("");

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (isTextLike(file)) {
      const text = await file.text();
      setContentText(text.slice(0, 60000));
      return;
    }

    setContentText("");
    setError(
      "Arquivo carregado como referência. Para DOCX/PDF, cole abaixo o texto, resumo ou conteúdo extraído que a IA deve usar."
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        await createOrganizationDocument(formData);
        formRef.current?.reset();
        setContentText("");
        setSuccess("Documento salvo na Biblioteca Corporativa.");
        router.refresh();
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : "Erro ao salvar documento.";
        setError(message);
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">
            Categoria do documento *
          </span>
          <select
            name="category"
            required
            disabled={isPending}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base leading-6 text-slate-900 outline-none transition focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20 disabled:bg-slate-100"
          >
            <option value="">Selecione</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.requiredForCorporatePdi ? "Obrigatório — " : "Opcional — "}
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">
            Nome do documento *
          </span>
          <input
            name="title"
            required
            disabled={isPending}
            placeholder="Ex.: Matriz de Competências 2026"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base leading-6 text-slate-900 outline-none transition focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20 disabled:bg-slate-100"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">
          Arquivo de referência
        </span>
        <input
          type="file"
          name="file"
          disabled={isPending}
          onChange={handleFileChange}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base leading-6 text-slate-900 outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-[#0F2D4A] file:px-4 file:py-2 file:font-semibold file:text-white focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20 disabled:bg-slate-100"
        />
        <span className="mt-2 block text-xs leading-5 text-slate-500">
          Arquivos TXT/CSV/MD são lidos automaticamente. Para DOCX/PDF, cole o texto ou resumo abaixo.
        </span>
      </label>

      <label className="block">
        <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">
          Conteúdo do documento para uso da IA *
        </span>
        <textarea
          name="content_text"
          required
          disabled={isPending}
          rows={8}
          value={contentText}
          onChange={(event) => setContentText(event.target.value)}
          placeholder="Cole aqui o texto, resumo ou conteúdo extraído do documento. Esse conteúdo será usado pela IA na geração do PDI Corporativo."
          className="min-h-48 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-base leading-7 text-slate-900 outline-none transition focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20 disabled:bg-slate-100"
        />
      </label>

      {error ? (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium leading-6 text-amber-800">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium leading-6 text-emerald-700">
          {success}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : "Salvar documento na Biblioteca"}
      </Button>
    </form>
  );
}
