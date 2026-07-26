import { AppShell } from "@/components/layout/AppShell";

export default function Home() {
  return (
    <AppShell>
      <section>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
          Lifenergy 2.0
        </p>

        <h1 className="max-w-4xl text-4xl font-bold leading-tight text-[#0F2A43] md:text-5xl">
          Plataforma Institucional de Desenvolvimento Humano e Organizacional
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
          Sistema integrado para aplicação de fractais de comportamento,
          registro de respostas, análise de padrões psicológicos e geração de
          laudos técnicos pela metodologia Lifenergy.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            ["Aplicações", "Registro estruturado das sessões Lifenergy."],
            ["Laudos", "Base preparada para geração de DOCX e PDF."],
            ["Dashboard", "Indicadores e gestão das aplicações."],
          ].map(([title, description]) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="mb-3 text-xl font-semibold text-[#0F2A43]">
                {title}
              </h2>
              <p className="text-slate-600">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/aplicacao"
            className="rounded-xl bg-[#0F2A43] px-6 py-4 text-center font-semibold text-white transition hover:opacity-90"
          >
            Iniciar Aplicação
          </a>

          <a
            href="/admin"
            className="rounded-xl border border-[#0F2A43] px-6 py-4 text-center font-semibold text-[#0F2A43] transition hover:bg-white"
          >
            Acessar Painel
          </a>
        </div>
      </section>
    </AppShell>
  );
}