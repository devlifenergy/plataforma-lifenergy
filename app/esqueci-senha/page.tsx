import Link from "next/link";
import { AppVersion } from "@/components/application/AppVersion";
import { requestPasswordReset } from "@/services/auth/actions";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function EsqueciSenhaPage({ searchParams }: Props) {
  const params = await searchParams;

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

      <section className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_24px_70px_-35px_rgba(15,42,67,0.35)] sm:p-10">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-[0.08em] text-[#B98A2E] sm:text-3xl">
            LIFENERGY DIGITAL
          </h1>
          <p className="mt-4 text-sm font-medium text-slate-600">
            Informe seu e-mail para receber o link de redefinição de senha.
          </p>
        </header>

        {params.error ? (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
          >
            {params.error}
          </div>
        ) : null}

        <form action={requestPasswordReset} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              E-mail cadastrado
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0F2A43] focus:ring-4 focus:ring-[#0F2A43]/10"
              placeholder="email@empresa.com"
            />
          </div>

          <button className="flex w-full items-center justify-center rounded-xl bg-[#0F2A43] px-6 py-3.5 font-semibold text-white transition hover:opacity-90">
            Enviar link de redefinição
          </button>
        </form>

        <div className="mt-5 text-center">
          <Link href="/login" className="text-sm font-semibold text-[#0F2A43] underline-offset-4 hover:underline">
            Voltar para o login
          </Link>
        </div>

        <footer className="mt-8 border-t border-slate-100 pt-5 text-center">
          <p className="text-xs text-slate-400">
            Lifenergy Digital · <AppVersion />
          </p>
        </footer>
      </section>
    </main>
  );
}
