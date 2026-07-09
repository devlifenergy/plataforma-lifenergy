/**
 * Lifenergy Platform MVP 1.0
 * Login page
 */

import { signIn } from "@/services/auth/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F7FA] px-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
            Lifenergy Platform
          </p>
          <h1 className="text-3xl font-bold text-[#0F2A43]">Entrar</h1>
          <p className="mt-3 text-sm text-slate-600">
            Acesse o painel da sua empresa.
          </p>
        </div>

        {params?.error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {params.error}
          </div>
        )}

        <form action={signIn} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              E-mail
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0F2A43]"
              placeholder="email@empresa.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Senha
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0F2A43]"
              placeholder="Sua senha"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#0F2A43] px-6 py-4 font-semibold text-white transition hover:opacity-90"
          >
            Acessar Painel
          </button>
        </form>
      </section>
    </main>
  );
}
