import Link from "next/link";
import { signOut } from "@/services/auth/actions";

type MenuItem = {
  label: string;
  href: string;
  superAdminOnly?: boolean;
  hiddenForSuperAdmin?: boolean;
};

const menuItems: MenuItem[] = [
  { label: "Painel Inicial", href: "/painel" },
  { label: "Empresas", href: "/painel/empresas", superAdminOnly: true },
  { label: "Aplicadores Autorizados", href: "/painel/aplicadores", hiddenForSuperAdmin: true },
  { label: "Aplicação on-line", href: "/painel/entrevistados", hiddenForSuperAdmin: true },
  { label: "Relatório Lifenergy", href: "/painel/relatorio-relacional", hiddenForSuperAdmin: true },
  { label: "Trilha Lifenergy", href: "/painel/pdi", hiddenForSuperAdmin: true },
  { label: "PDI Corporativo", href: "/painel/pdi-corporativo", hiddenForSuperAdmin: true },
  { label: "Biblioteca Corporativa", href: "/painel/biblioteca", hiddenForSuperAdmin: true },
  { label: "Biblioteca Técnica", href: "/painel/biblioteca-tecnica" },
  { label: "Auditoria", href: "/painel/auditoria", superAdminOnly: true },
  { label: "Laudos", href: "/painel/exportacoes", superAdminOnly: true },
];

type CompanyShellProps = {
  children: React.ReactNode;
  userName: string;
  organizationName: string;
  role: string;
};

export function CompanyShell({
  children,
  userName,
  organizationName,
  role,
}: CompanyShellProps) {
  const isSuperAdmin = role === "super_admin";
  const visibleMenuItems = menuItems.filter((item) => {
    if (item.superAdminOnly && !isSuperAdmin) return false;
    if (item.hiddenForSuperAdmin && isSuperAdmin) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1F2933]">
      <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href="/painel" className="text-lg font-bold text-[#0F2A43] sm:text-xl">
            Lifenergy Digital
          </Link>

          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0 text-right text-xs sm:text-sm">
              <p className="max-w-[140px] truncate font-semibold text-[#0F2A43] sm:max-w-none">{organizationName}</p>
              <p className="max-w-[140px] truncate text-slate-500 sm:max-w-none">{userName}</p>
            </div>

            <details className="relative md:hidden">
              <summary className="cursor-pointer list-none rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#0F2A43] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F2A43]">
                Menu
              </summary>
              <div className="absolute right-0 top-full z-50 mt-2 max-h-[75vh] w-[min(90vw,320px)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                <nav aria-label="Menu principal" className="space-y-1">
                  {visibleMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#F5F7FA] hover:text-[#0F2A43] focus-visible:outline-2 focus-visible:outline-[#0F2A43]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <form action={signOut} className="mt-3 border-t border-slate-200 pt-3">
                  <button className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                    Sair
                  </button>
                </form>
              </div>
            </details>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        <aside className="hidden min-h-[calc(100vh-73px)] w-64 border-r border-slate-200 bg-white p-6 md:block">
          <nav className="space-y-2">
            {visibleMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#F5F7FA] hover:text-[#0F2A43]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <form action={signOut} className="mt-8">
            <button className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Sair
            </button>
          </form>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
