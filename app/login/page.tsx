import LoginForm from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
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
            Acesse o portal da sua empresa.
          </p>
        </header>

        {params.error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
          >
            {params.error}
          </div>
        )}

        <LoginForm />

        <footer className="mt-8 border-t border-slate-100 pt-5 text-center">
          <p className="text-xs text-slate-400">
            Lifenergy Digital · Versão 1.1.2
          </p>
        </footer>
      </section>
    </main>
  );
}
