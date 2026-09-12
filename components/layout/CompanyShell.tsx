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
  { label: "Relatório Relacional", href: "/painel/relatorio-relacional", hiddenForSuperAdmin: true },
  { label: "PDI Relacional", href: "/painel/pdi", hiddenForSuperAdmin: true },
  { label: "PDI Corporativo", href: "/painel/pdi-corporativo", hiddenForSuperAdmin: true },
  { label: "Biblioteca Corporativa", href: "/painel/biblioteca", hiddenForSuperAdmin: true },
  { label: "Biblioteca Técnica", href: "/painel/biblioteca-tecnica" },
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
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/painel" className="text-xl font-bold text-[#0F2A43]">
            Lifenergy Digital
          </Link>

          <div className="text-right text-sm">
            <p className="font-semibold text-[#0F2A43]">{organizationName}</p>
            <p className="text-slate-500">{userName}</p>
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

        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
