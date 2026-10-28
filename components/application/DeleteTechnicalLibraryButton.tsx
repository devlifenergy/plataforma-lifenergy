"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteTechnicalLibraryDocument } from "@/services/library/actions";

type Props = {
  documentId: string;
  documentTitle: string;
};

export function DeleteTechnicalLibraryButton({ documentId, documentTitle }: Props) {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending || confirmation !== "EXCLUIR") return;

    const formData = new FormData();
    formData.set("document_id", documentId);
    formData.set("confirmation", confirmation);

    setError("");
    startTransition(async () => {
      try {
        await deleteTechnicalLibraryDocument(formData);
        router.refresh();
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Não foi possível excluir o conteúdo.");
      }
    });
  }

  return (
    <details className="w-full min-w-0 rounded-xl border border-red-200 bg-white px-3 py-1 sm:w-auto">
      <summary className="cursor-pointer text-xs font-bold text-red-700">
        Excluir
      </summary>
      <form onSubmit={handleDelete} className="mt-3 w-full max-w-sm space-y-3 pb-2">
        <p className="break-words text-xs font-semibold text-slate-800">
          {documentTitle}
        </p>
        <p className="text-xs leading-5 text-red-700">
          A exclusão é definitiva. O documento e seu conteúdo serão apagados da
          Biblioteca Técnica, inclusive da consulta pública, sem possibilidade
          de recuperação por esta tela. Para apenas ocultá-lo, use Arquivar.
        </p>
        <label className="block text-xs font-semibold text-slate-700">
          Digite EXCLUIR para confirmar
          <input
            type="text"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            autoComplete="off"
            disabled={isPending}
            placeholder="EXCLUIR"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal outline-none focus:border-red-500"
          />
        </label>
        {error ? <p role="alert" className="text-xs text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={isPending || confirmation !== "EXCLUIR"}
          className="rounded-lg bg-red-700 px-3 py-2 text-xs font-bold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Excluindo..." : "Excluir definitivamente"}
        </button>
      </form>
    </details>
  );
}
