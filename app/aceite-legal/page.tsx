import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";
import { acceptCompanyLegalTerms } from "@/services/auth/actions";
import {
  LIFENERGY_COMPANY_TERMS_VERSION,
  LIFENERGY_PRIVACY_POLICY_VERSION,
} from "@/lib/legal";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

function hasCurrentAcceptance(profile: {
  company_terms_version?: string | null;
  company_privacy_policy_version?: string | null;
  company_terms_accepted_at?: string | null;
  company_privacy_accepted_at?: string | null;
}) {
  return (
    profile.company_terms_version === LIFENERGY_COMPANY_TERMS_VERSION &&
    profile.company_privacy_policy_version === LIFENERGY_PRIVACY_POLICY_VERSION &&
    Boolean(profile.company_terms_accepted_at) &&
    Boolean(profile.company_privacy_accepted_at)
  );
}

export default async function LegalAcceptancePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("name, email, role, must_change_password, company_terms_accepted_at, company_terms_version, company_privacy_accepted_at, company_privacy_policy_version, organizations(name)")
    .eq("auth_user_id", user.id)
    .single();

  if (error || !profile) {
    redirect("/login");
  }

  if ((profile as any).must_change_password) {
    redirect("/alterar-senha");
  }

  if ((profile as any).role === "super_admin" || hasCurrentAcceptance(profile as any)) {
    redirect("/painel");
  }

  const organizations = (profile as any).organizations;
  const organizationName = Array.isArray(organizations)
    ? organizations[0]?.name
    : organizations?.name;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F5F7FA] px-6 py-10">
      <div
        aria-hidden="true"
        className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#0F2A43]/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-[#B98A2E]/10 blur-3xl"
      />

      <section className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_24px_70px_-35px_rgba(15,42,67,0.35)] sm:p-10">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
            Lifenergy Digital
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[#0F2A43]">
            Aceite legal da empresa
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Para acessar o painel da empresa, confirme a ciência e aceite dos Termos de Uso
            do Lifenergy Digital e da Política de Privacidade.
          </p>
          <div className="mt-5 rounded-2xl border border-[#B98A2E]/25 bg-[#B98A2E]/5 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#B98A2E]">
              Empresa
            </p>
            <p className="mt-1 font-semibold text-[#0F2A43]">
              {organizationName || "Empresa não identificada"}
            </p>
          </div>
        </header>

        {params.error ? (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
          >
            {params.error}
          </div>
        ) : null}

        <form action={acceptCompanyLegalTerms} className="space-y-5">
          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-base leading-7 text-slate-700">
            <input
              type="checkbox"
              name="accept_company_terms"
              className="mt-1 h-5 w-5 rounded border-slate-300 text-[#0F2A43]"
              required
            />
            <span>
              Li e aceito os{" "}
              <Link
                href="/termos-de-uso?returnTo=/aceite-legal"
                target="_blank"
                className="font-bold text-[#0F6C87] underline"
              >
                Termos de Uso
              </Link>{" "}
              aplicáveis à empresa.
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-base leading-7 text-slate-700">
            <input
              type="checkbox"
              name="accept_privacy_policy"
              className="mt-1 h-5 w-5 rounded border-slate-300 text-[#0F2A43]"
              required
            />
            <span>
              Li e aceito a{" "}
              <Link
                href="/politica-de-privacidade?returnTo=/aceite-legal"
                target="_blank"
                className="font-bold text-[#0F6C87] underline"
              >
                Política de Privacidade
              </Link>
              .
            </span>
          </label>

          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-xl bg-[#0F2A43] px-6 py-3.5 font-semibold text-white transition hover:opacity-90"
          >
            Aceitar e acessar o painel
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Versões: {LIFENERGY_COMPANY_TERMS_VERSION} · {LIFENERGY_PRIVACY_POLICY_VERSION}
        </p>
      </section>
    </main>
  );
}
