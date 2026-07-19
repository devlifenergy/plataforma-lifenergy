import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";

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
          Bem-vindo ao Lifenergy Digital
        </h1>

        <p className="mt-4 max-w-3xl text-slate-700">
          Utilize a área de Empresas para cadastrar, editar e administrar as
          empresas clientes.
        </p>

        <div className="mt-10 max-w-md">
          <Link
            href="/painel/empresas"
            className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#B98A2E] hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-[#0F2A43]">Empresas</h2>
            <p className="mt-2 text-sm text-slate-600">
              Cadastre e gerencie as empresas clientes.
            </p>
          </Link>
        </div>
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
        Este é o ambiente de trabalho da sua empresa para gerenciar aplicadores,
        aplicações e exportações para laudos.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <Link
          href="/painel/aplicadores"
          className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#B98A2E] hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-[#0F2A43]">
            Aplicadores
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Cadastre, credencie e gerencie os aplicadores da sua empresa.
          </p>
        </Link>

        <Link
          href="/painel/entrevistados"
          className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#B98A2E] hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-[#0F2A43]">Avaliados</h2>
          <p className="mt-2 text-sm text-slate-600">
            Crie links únicos para os candidatos preencherem os formulários.
          </p>
        </Link>

        <Link
          href="/painel/exportacoes"
          className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#B98A2E] hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-[#0F2A43]">Laudos</h2>
          <p className="mt-2 text-sm text-slate-600">
            Exporte os dados para o arquivo, a fim de gerar os laudos.
          </p>
        </Link>
      </div>
    </section>
  );
}
