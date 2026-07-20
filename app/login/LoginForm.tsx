"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  identifyCompanyByEmail,
  signIn,
} from "@/services/auth/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center rounded-xl bg-[#0F2A43] px-6 py-3.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <>
          <span
            aria-hidden="true"
            className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
          />
          Entrando...
        </>
      ) : (
        "Entrar no Portal"
      )}
    </button>
  );
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyStatus, setCompanyStatus] = useState<
    "idle" | "loading" | "found" | "not_found"
  >("idle");

  useEffect(() => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      setCompanyName("");
      setCompanyStatus("idle");
      return;
    }

    const timeout = window.setTimeout(async () => {
      setCompanyStatus("loading");

      const result = await identifyCompanyByEmail(normalizedEmail);

      if (result.companyName) {
        setCompanyName(result.companyName);
        setCompanyStatus("found");
      } else {
        setCompanyName("");
        setCompanyStatus("not_found");
      }
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [email]);

  return (
    <form action={signIn} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          E-mail
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0F2A43] focus:ring-4 focus:ring-[#0F2A43]/10"
          placeholder="email@empresa.com"
        />

        {companyStatus === "loading" && (
          <p className="mt-2 text-sm text-slate-500">
            Identificando empresa...
          </p>
        )}

        {companyStatus === "found" && (
          <div className="mt-3 rounded-xl border border-[#B98A2E]/25 bg-[#B98A2E]/5 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#B98A2E]">
              Empresa
            </p>
            <p className="mt-1 font-semibold text-[#0F2A43]">{companyName}</p>
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Senha
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0F2A43] focus:ring-4 focus:ring-[#0F2A43]/10"
          placeholder="Digite sua senha"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
