import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";

type DashboardAction = {
  title: string;
  description: string;
  href: string;
};

const superAdminActions: DashboardAction[] = [
  {
    title: "Empresas",
    description: "Cadastre, edite e gerencie empresas, administradores e licenças.",
    href: "/painel/empresas",
  },
  {
    title: "Biblioteca Técnica",
    description: "Organize documentos técnicos disponíveis no Lifenergy Digital.",
    href: "/painel/biblioteca-tecnica",
  },
  {
    title: "Auditoria",
    description: "Acompanhe eventos, alterações e rastreabilidade do sistema.",
    href: "/painel/auditoria",
  },
  {
    title: "Laudos",
    description: "Exporte dados consolidados com filtros por empresa, avaliado e período.",
    href: "/painel/exportacoes",
  },
];

const organizationActions: DashboardAction[] = [
  {
    title: "Aplicadores Autorizados",
    description: "Cadastre e gerencie pessoas autorizadas a conduzir aplicações.",
    href: "/painel/aplicadores",
  },
  {
    title: "Aplicação on-line",
    description: "Crie links únicos, acompanhe aplicações concluídas e consulte os registros.",
    href: "/painel/entrevistados",
  },
  {
    title: "Relatório Lifenergy",
    description: "Gere relatórios Lifenergy a partir das aplicações concluídas.",
    href: "/painel/relatorio-relacional",
  },
  {
    title: "Trilha Lifenergy",
    description: "Gere trilhas de desenvolvimento individual a partir dos relatórios.",
    href: "/painel/pdi",
  },
  {
    title: "PDI Corporativo",
    description: "Crie PDIs corporativos usando a biblioteca e o contexto da organização.",
    href: "/painel/pdi-corporativo",
  },
  {
    title: "Biblioteca Corporativa",
    description: "Cadastre documentos corporativos para alimentar a inteligência da empresa.",
    href: "/painel/biblioteca",
  },
  {
    title: "Biblioteca Técnica",
    description: "Acesse materiais técnicos e orientações disponíveis no Lifenergy Digital.",
    href: "/painel/biblioteca-tecnica",
  },
];

function DashboardCards({ actions }: { actions: DashboardAction[] }) {
  return (
    <div className="mt-10 grid max-w-5xl gap-5 md:grid-cols-2 xl:grid-cols-3">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#B98A2E] hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-[#0F2A43]">{action.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{action.description}</p>
        </Link>
      ))}
    </div>
  );
}

export default async function PainelPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("auth_user_id", user.id)
    .single();

  if (error || !profile) {
    redirect("/login");
  }

  const role = (profile as { role: string }).role;

  if (role === "super_admin") {
    return (
      <section>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
          Painel Administrativo
        </p>

        <h1 className="text-4xl font-bold text-[#0F2A43]">
          Painel Inicial do Superusuário
        </h1>

        <p className="mt-4 max-w-3xl text-slate-700">
          Acesse aqui os mesmos módulos disponíveis no menu lateral para administração do Lifenergy Digital.
        </p>

        <DashboardCards actions={superAdminActions} />
      </section>
    );
  }

  return (
    <section>
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
        Painel da Empresa
      </p>

      <h1 className="text-4xl font-bold text-[#0F2A43]">
        Bem-vindo ao Lifenergy Digital
      </h1>

      <p className="mt-4 max-w-3xl text-slate-700">
        Utilize este ambiente para gerenciar aplicadores, aplicações, relatórios, trilhas de desenvolvimento e documentos corporativos.
      </p>

      <DashboardCards actions={organizationActions} />
    </section>
  );
}
