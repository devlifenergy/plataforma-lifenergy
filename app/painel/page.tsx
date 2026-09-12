import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";

const companyCards = [
  ["Aplicadores Autorizados", "/painel/aplicadores", "Cadastre e gerencie os aplicadores autorizados da empresa."],
  ["Aplicação on-line", "/painel/entrevistados", "Crie links, acompanhe o preenchimento e gerencie as aplicações on-line."],
  ["Relatório Relacional", "/painel/relatorio-relacional", "Gere e faça novo download dos relatórios vinculados às aplicações concluídas."],
  ["PDI Relacional", "/painel/pdi", "Gere um PDI Relacional para cada relatório individual existente."],
  ["PDI Corporativo", "/painel/pdi-corporativo", "Gere um PDI Corporativo por relatório, orientado pelo cargo e pela Biblioteca Corporativa."],
  ["Biblioteca Corporativa", "/painel/biblioteca", "Gerencie logomarca e documentos corporativos usados na geração dos PDIs."],
  ["Biblioteca Técnica", "/painel/biblioteca-tecnica", "Consulte a base de conhecimento e fundamentação técnica da Plataforma Lifenergy."],
] as const;

export default async function PainelPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("auth_user_id", user.id)
    .single();
  if (error || !profile) redirect("/login");

  if ((profile as { role: string }).role === "super_admin") {
    return (
      <section>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">Painel Administrativo</p>
        <h1 className="text-4xl font-bold text-[#0F2A43]">Bem-vindo ao Lifenergy Digital</h1>
        <p className="mt-4 max-w-3xl text-slate-700">Utilize este ambiente para administrar empresas clientes e exportar os dados consolidados de avaliações concluídas.</p>
        <div className="mt-10 grid max-w-3xl gap-6 md:grid-cols-2">
          <Link href="/painel/empresas" className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#B98A2E] hover:shadow-md"><h2 className="text-lg font-semibold text-[#0F2A43]">Empresas</h2><p className="mt-2 text-sm text-slate-600">Cadastre, edite e gerencie as empresas clientes.</p></Link>
          <Link href="/painel/exportacoes" className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#B98A2E] hover:shadow-md"><h2 className="text-lg font-semibold text-[#0F2A43]">Laudos</h2><p className="mt-2 text-sm text-slate-600">Exporte os dados para Excel com filtros por empresa, avaliado e período.</p></Link>
        </div>
      </section>
    );
  }

  return (
    <section>
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">Painel da Empresa</p>
      <h1 className="text-4xl font-bold text-[#0F2A43]">Bem-vindo ao Lifenergy Digital</h1>
      <p className="mt-4 max-w-4xl text-slate-700">Acesse as principais funções da plataforma pelos atalhos abaixo.</p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {companyCards.map(([title, href, description]) => (
          <Link key={href} href={href} className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#B98A2E] hover:shadow-md">
            <div className="mb-4 h-1.5 w-12 rounded-full bg-[#B98A2E] transition-all group-hover:w-20" />
            <h2 className="text-lg font-semibold text-[#0F2A43]">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
