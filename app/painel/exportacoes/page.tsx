export default function ExportacoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0F2D4A]">Exportações</h1>
        <p className="mt-1 text-slate-500">
          Exporte as respostas preenchidas para Excel.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <a
          href="/api/exportacoes"
          className="inline-flex rounded-xl bg-[#0F2D4A] px-6 py-4 font-semibold text-white"
        >
          Exportar Excel
        </a>
      </div>
    </div>
  );
}