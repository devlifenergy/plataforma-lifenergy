"use client";

import { useId, useRef, useState, useTransition } from "react";
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

export function CorporateDocumentForm({ categories }: CorporateDocumentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputId = useId();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedFileName, setSelectedFileName] = useState("Nenhum arquivo selecionado");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;

    const formData = new FormData(event.currentTarget);

    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        await createOrganizationDocument(formData);
        formRef.current?.reset();
        setSelectedFileName("Nenhum arquivo selecionado");
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
        <span className="mt-2 block text-xs leading-5 text-slate-500">
          A categoria será usada como identificação do documento na Biblioteca Corporativa.
        </span>
      </label>

      <label className="block">
        <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">
          Arquivo do documento *
        </span>

        <input
          id={fileInputId}
          type="file"
          name="file"
          required
          disabled={isPending}
          accept=".txt,.md,.csv,.json,.docx,text/plain,text/markdown,text/csv,application/json,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="sr-only"
          onChange={(event) => {
            const fileName = event.currentTarget.files?.[0]?.name;
            setSelectedFileName(fileName || "Nenhum arquivo selecionado");
          }}
        />

        <div className="flex flex-col gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 sm:flex-row sm:items-center">
          <label
            htmlFor={fileInputId}
            className={`inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#0F2D4A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0F2D4A]/90 ${
              isPending ? "pointer-events-none opacity-60" : ""
            }`}
          >
            Selecionar arquivo
          </label>
          <span className="text-sm leading-5 text-slate-600">{selectedFileName}</span>
        </div>

        <span className="mt-2 block text-xs leading-5 text-slate-500">
          Envie o arquivo corporativo correspondente à categoria selecionada.
        </span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">
          Formatos aceitos nesta versão: TXT, MD, CSV, JSON e DOCX.
        </span>
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

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Lendo documento..." : "Salvar documento na Biblioteca"}
        </Button>
      </div>
    </form>
  );
}
