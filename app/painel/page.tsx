/**
 * Lifenergy Platform MVP 1.0
 * Company dashboard page
 */

export default async function PainelPage() {
  return (
    <section>
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
        Painel da Empresa
      </p>

      <h1 className="text-4xl font-bold text-[#0F2A43]">
        Bem-vindo à Lifenergy Platform
      </h1>

      <p className="mt-4 max-w-3xl text-slate-700">
        Este é o ambiente da sua empresa para gerenciar aplicadores,
        aplicações e exportações do MVP Lifenergy.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0F2A43]">
            Aplicadores
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Cadastre e gerencie os aplicadores da empresa.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0F2A43]">
            Aplicações
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Crie links únicos para os entrevistados preencherem o formulário.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0F2A43]">
            Exportação
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Exporte os dados para Excel e gere os laudos manualmente.
          </p>
        </div>
      </div>
    </section>
  );
}