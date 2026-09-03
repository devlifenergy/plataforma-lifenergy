"use client";

import { useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { updateOrganizationLogo } from "@/services/pdi/actions";

type CompanyLogoFormProps = {
  hasLogo: boolean;
  logoFileName?: string | null;
  logoDataUrl?: string | null;
};

export function CompanyLogoForm({ hasLogo, logoFileName, logoDataUrl }: CompanyLogoFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputId = useId();
  const router = useRouter();
  const [selectedFileName, setSelectedFileName] = useState("Nenhum arquivo selecionado");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;

    const formData = new FormData(event.currentTarget);

    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        await updateOrganizationLogo(formData);
        formRef.current?.reset();
        setSelectedFileName("Nenhum arquivo selecionado");
        setSuccess("Logomarca salva com sucesso. Ela será usada no cabeçalho dos próximos relatórios gerados.");
        router.refresh();
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : "Erro ao salvar logomarca.";
        setError(message);
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[220px_1fr] md:items-center">
        <div className="flex min-h-[100px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4">
          {logoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoDataUrl} alt="Logomarca da empresa" className="max-h-20 max-w-full object-contain" />
          ) : (
            <span className="text-center text-sm leading-6 text-slate-500">
              Nenhuma logomarca cadastrada
            </span>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-700">
            {hasLogo ? `Logomarca atual: ${logoFileName || "arquivo cadastrado"}` : "Carregue a logomarca da empresa"}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Use preferencialmente PNG ou JPG, em fundo transparente ou branco. Tamanho máximo: 1 MB.
          </p>
        </div>
      </div>

      <div>
        <input
          id={inputId}
          type="file"
          name="logo_file"
          required
          disabled={isPending}
          accept="image/png,image/jpeg,.png,.jpg,.jpeg"
          className="sr-only"
          onChange={(event) => {
            const fileName = event.currentTarget.files?.[0]?.name;
            setSelectedFileName(fileName || "Nenhum arquivo selecionado");
          }}
        />

        <div className="flex flex-col gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 sm:flex-row sm:items-center">
          <label
            htmlFor={inputId}
            className={`inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#0F2D4A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0F2D4A]/90 ${
              isPending ? "pointer-events-none opacity-60" : ""
            }`}
          >
            Selecionar logomarca
          </label>
          <span className="text-sm leading-5 text-slate-600">{selectedFileName}</span>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700">
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
          {isPending ? "Salvando logomarca..." : hasLogo ? "Atualizar logomarca" : "Salvar logomarca"}
        </Button>
      </div>
    </form>
  );
}
