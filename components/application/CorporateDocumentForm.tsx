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

export function CorporateDocumentForm({ categories }: CorporateDocumentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
        setSuccess("Documento salvo. A IA gerou o sumário técnico para uso interno do PDI.");
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
          <span className="mt-2 block text-xs leading-5 text-slate-500">
            Escolha a categoria para que a IA saiba como usar este documento na geração do PDI Corporativo.
          </span>
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
          <span className="mt-2 block text-xs leading-5 text-slate-500">
            Use um nome claro para facilitar a gestão da Biblioteca Corporativa.
          </span>
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">
          Arquivo do documento *
        </span>
        <input
          type="file"
          name="file"
          required
          disabled={isPending}
          accept=".txt,.md,.csv,.json,.docx,text/plain,text/markdown,text/csv,application/json,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base leading-6 text-slate-900 outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-[#0F2D4A] file:px-4 file:py-2 file:font-semibold file:text-white focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20 disabled:bg-slate-100"
        />
        <span className="mt-2 block text-xs leading-5 text-slate-500">
          Ao salvar, a IA lê o arquivo, interpreta o conteúdo e grava um sumário técnico interno no banco de dados. Esse sumário não fica visível para o usuário da empresa.
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

      <Button type="submit" disabled={isPending}>
        {isPending ? "Lendo documento com IA..." : "Salvar documento na Biblioteca"}
      </Button>
    </form>
  );
}
