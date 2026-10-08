"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCompany } from "@/services/companies/actions";

function EyeIcon({ hidden }: { hidden: boolean }) {
  return hidden ? (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 4.2A10.5 10.5 0 0 1 12 4c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-4.2 4.8" />
      <path d="M6.6 6.6A16 16 0 0 0 2.5 10.5S6 17 12 17a10.8 10.8 0 0 0 4.1-.8" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function CompanyCreateForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(formData: FormData) {
    if (isPending) return;

    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const result = await createCompany(formData);
        formRef.current?.reset();
        setShowPassword(false);
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
    <form
      ref={formRef}
      action={handleSubmit}
      autoComplete="off"
      className="grid gap-4 md:grid-cols-2"
    >
      <input
        name="company_name"
        required
        disabled={isPending}
        autoComplete="off"
        placeholder="Nome da empresa *"
        className="rounded-xl border border-slate-300 p-3 outline-none transition focus:border-[#0F2D4A] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      />

      <input
        name="admin_name"
        required
        disabled={isPending}
        autoComplete="off"
        placeholder="Nome do administrador *"
        className="rounded-xl border border-slate-300 p-3 outline-none transition focus:border-[#0F2D4A] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      />

      <input
        name="admin_email"
        required
        disabled={isPending}
        type="email"
        autoComplete="new-email"
        defaultValue=""
        placeholder="E-mail do administrador *"
        className="rounded-xl border border-slate-300 p-3 outline-none transition focus:border-[#0F2D4A] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      />

      <div className="relative">
        <input
          name="password"
          required
          disabled={isPending}
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          defaultValue=""
          placeholder="Senha inicial *"
          className="w-full rounded-xl border border-slate-300 p-3 pr-12 outline-none transition focus:border-[#0F2D4A] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
        />
        <button
          type="button"
          disabled={isPending}
          onClick={() => setShowPassword((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-[#0F2D4A] disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={showPassword ? "Ocultar senha inicial" : "Visualizar senha inicial"}
          title={showPassword ? "Ocultar senha" : "Visualizar senha"}
        >
          <EyeIcon hidden={showPassword} />
        </button>
      </div>

      <input name="license_individual_reports" required min="0" type="number" disabled={isPending} placeholder="Licenças - Relatório Individual *" className="rounded-xl border border-slate-300 p-3 outline-none transition focus:border-[#0F2D4A] disabled:bg-slate-100" />
      <input name="license_pdi_relational" required min="0" type="number" disabled={isPending} placeholder="Licenças - Trilha Lifenergy *" className="rounded-xl border border-slate-300 p-3 outline-none transition focus:border-[#0F2D4A] disabled:bg-slate-100" />
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
