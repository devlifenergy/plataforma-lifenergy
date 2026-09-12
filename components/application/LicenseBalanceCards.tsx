import type { OrganizationLicenseSummary } from "@/services/licensing/licenseGuard";

type Props = {
  summary: OrganizationLicenseSummary;
  show?: Array<"individual" | "relational" | "corporate">;
};

const config = {
  individual: { label: "Relatório Individual", key: "individualReport" as const },
  relational: { label: "PDI Relacional", key: "pdiRelational" as const },
  corporate: { label: "PDI Corporativo", key: "pdiCorporate" as const },
};

export function LicenseBalanceCards({ summary, show = ["individual", "relational", "corporate"] }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {show.map((item) => {
        const meta = config[item];
        const balance = summary[meta.key];
        return (
          <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#B98A2E]">{meta.label}</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div><p className="text-lg font-bold text-[#0F2D4A]">{balance.contracted}</p><p className="text-[11px] text-slate-500">Contratadas</p></div>
              <div><p className="text-lg font-bold text-[#0F2D4A]">{balance.used}</p><p className="text-[11px] text-slate-500">Utilizadas</p></div>
              <div><p className={`text-lg font-bold ${balance.available > 0 ? "text-emerald-700" : "text-red-700"}`}>{balance.available}</p><p className="text-[11px] text-slate-500">Disponíveis</p></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
