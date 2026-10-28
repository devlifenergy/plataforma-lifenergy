import Link from "next/link";

const menuItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Aplicações", href: "/aplicacoes" },
  { label: "Participantes", href: "/participantes" },
  { label: "Fractais", href: "/fractais" },
  { label: "Laudos", href: "/laudos" },
  { label: "Empresas", href: "/empresas" },
  { label: "Usuários", href: "/usuarios" },
  { label: "Configurações", href: "/configuracoes" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#EEF5F5] text-[#173A40]">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#173A40]">
            Lifenergy Digital
          </Link>

          <span className="text-sm font-medium text-[#00838F]">
            Projeto Vercel 2.0
          </span>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        <aside className="hidden min-h-[calc(100vh-73px)] w-64 border-r border-slate-200 bg-white p-6 md:block">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#EEF5F5] hover:text-[#173A40]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>

      <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-sm text-slate-500">
        Lifenergy – Desenvolvimento Humano e Organizacional
      </footer>
    </div>
  );
}
