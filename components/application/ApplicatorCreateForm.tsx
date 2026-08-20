"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createApplicator } from "@/services/applicators/actions";

export function ApplicatorCreateForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleSubmit(formData: FormData) {
    if (isPending) return;

    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        await createApplicator(formData);
        formRef.current?.reset();
        setSuccess("Aplicador cadastrado com sucesso.");
        router.refresh();
      } catch (caught) {
        const message =
          caught instanceof Error ? caught.message : "Erro ao cadastrar aplicador.";
        setError(message);
      }
    });
  }

  const inputClass =
    "w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0F2D4A] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

  return (
    <form ref={formRef} action={handleSubmit} className="grid gap-4 md:grid-cols-4">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">Nome *</span>
        <input name="name" required disabled={isPending} className={inputClass} />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">E-mail</span>
        <input name="email" type="email" disabled={isPending} className={inputClass} />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">Telefone</span>
        <input name="phone" disabled={isPending} className={inputClass} />
      </label>

      <div className="flex items-end">
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[#0F2D4A] px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Cadastrando..." : "+ Novo Aplicador"}
        </button>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 md:col-span-4">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 md:col-span-4">
          {success}
        </p>
      ) : null}
    </form>
  );
}
