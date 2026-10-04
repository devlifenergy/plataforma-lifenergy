"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCompany } from "@/services/companies/actions";

export function CompanyCreateForm() {
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
        const result = await createCompany(formData);
        formRef.current?.reset();
        setSuccess(result.emailRequested
          ? (result.emailSent
              ? "Empresa cadastrada e acesso enviado por e-mail."
              : `Empresa cadastrada. ${result.emailWarning || "Não foi possível enviar o e-mail de acesso."}`)
          : "Empresa cadastrada com sucesso.");
        router.refresh();
      } catch (caught) {
        const message =
          caught instanceof Error ? caught.message : "Erro ao cadastrar empresa.";
        setError(message);
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <input
        name="company_name"
        required
        disabled={isPending}
        placeholder="Nome da empresa *"
        className="rounded-xl border border-slate-300 p-3 outline-none transition focus:border-[#0F2D4A] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      />

      <input
        name="admin_name"
        required
        disabled={isPending}
        placeholder="Nome do administrador *"
        className="rounded-xl border border-slate-300 p-3 outline-none transition focus:border-[#0F2D4A] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      />

      <input
        name="admin_email"
        required
        disabled={isPending}
        type="email"
        placeholder="E-mail do administrador *"
        className="rounded-xl border border-slate-300 p-3 outline-none transition focus:border-[#0F2D4A] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      />

      <input
        name="password"
        required
        disabled={isPending}
        type="password"
        placeholder="Senha inicial *"
        className="rounded-xl border border-slate-300 p-3 outline-none transition focus:border-[#0F2D4A] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      />

      <input name="license_individual_reports" required min="0" type="number" disabled={isPending} placeholder="Licenças - Relatório Individual *" className="rounded-xl border border-slate-300 p-3 outline-none transition focus:border-[#0F2D4A] disabled:bg-slate-100" />
      <input name="license_pdi_relational" required min="0" type="number" disabled={isPending} placeholder="Licenças - PDI Relacional *" className="rounded-xl border border-slate-300 p-3 outline-none transition focus:border-[#0F2D4A] disabled:bg-slate-100" />
      <input name="license_pdi_corporate" required min="0" type="number" disabled={isPending} placeholder="Licenças - PDI Corporativo *" className="rounded-xl border border-slate-300 p-3 outline-none transition focus:border-[#0F2D4A] disabled:bg-slate-100 md:col-span-2" />

      <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
        <input name="send_access_email" type="checkbox" disabled={isPending} className="mt-1 h-4 w-4" />
        <span><strong className="block text-sm text-slate-800">Enviar e-mail de acesso</strong><span className="text-xs text-slate-500">Envia ao administrador o link de acesso, usuário e senha temporária.</span></span>
      </label>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 md:col-span-2">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 md:col-span-2">
          {success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-[#0F2D4A] px-6 py-4 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
      >
        {isPending ? "Cadastrando empresa..." : "Cadastrar Empresa"}
      </button>
    </form>
  );
}
