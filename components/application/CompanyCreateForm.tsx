"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCompany } from "@/services/companies/actions";
import { searchExistingCompanies, type ExistingCompanySearchResult } from "@/services/companies/searchExistingCompanies";

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

function SearchResultCard({ result }: { result: ExistingCompanySearchResult }) {
  const isActive = result.status === "active";

  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[#0F2D4A]">{result.name}</p>
          <p className="mt-1 text-xs text-slate-500">Encontrada por: {result.matchReason}</p>
        </div>
        <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
          {isActive ? "Ativa" : "Inativa"}
        </span>
      </div>
      <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
        <p><span className="font-semibold text-slate-700">Administrador:</span> {result.adminName}</p>
        <p className="break-all"><span className="font-semibold text-slate-700">E-mail:</span> {result.adminEmail}</p>
      </div>
    </div>
  );
}

export function CompanyCreateForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSearching, startSearchTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searchDone, setSearchDone] = useState(false);
  const [searchResults, setSearchResults] = useState<ExistingCompanySearchResult[]>([]);

  function handleDuplicateSearch() {
    const value = searchQuery.trim();
    setSearchError("");
    setSearchDone(false);
    setSearchResults([]);

    if (value.length < 2) {
      setSearchError("Informe pelo menos 2 caracteres para buscar.");
      return;
    }

    startSearchTransition(async () => {
      try {
        const results = await searchExistingCompanies(value);
        setSearchResults(results);
        setSearchDone(true);
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : "Erro ao buscar empresa existente.";
        setSearchError(message);
      }
    });
  }

  function handleSubmit(formData: FormData) {
    if (isPending) return;

    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const result = await createCompany(formData);
        formRef.current?.reset();
        setShowPassword(false);
        setSearchQuery("");
        setSearchResults([]);
        setSearchDone(false);
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
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 md:col-span-2">
        <p className="text-sm font-bold text-[#0F2D4A]">Verificar se a empresa já existe</p>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          Busque antes do cadastro pelo nome da empresa ou pelo usuário administrador para evitar duplicidade acidental.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleDuplicateSearch();
              }
            }}
            disabled={isSearching || isPending}
            placeholder="Nome da empresa ou e-mail do administrador"
            className="rounded-xl border border-amber-200 bg-white p-3 text-sm outline-none transition focus:border-[#B98A2E] focus:ring-2 focus:ring-[#B98A2E]/20 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
          <button
            type="button"
            onClick={handleDuplicateSearch}
            disabled={isSearching || isPending}
            className="rounded-xl bg-[#0F2D4A] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSearching ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {searchError ? (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {searchError}
          </p>
        ) : null}

        {searchDone && searchResults.length === 0 ? (
          <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            Nenhuma empresa encontrada com esses dados.
          </p>
        ) : null}

        {searchResults.length > 0 ? (
          <div className="mt-4 space-y-3">
            <p className="rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm font-semibold text-amber-700">
              Atenção: encontramos empresa(s) com dados semelhantes. Confira antes de criar um novo cadastro.
            </p>
            {searchResults.map((result) => (
              <SearchResultCard key={result.id} result={result} />
            ))}
          </div>
        ) : null}
      </section>

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
