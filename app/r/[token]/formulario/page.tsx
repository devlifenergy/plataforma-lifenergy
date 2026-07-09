import { createClient } from "@/lib/supabaseServer";
import { PublicLifenergyForm } from "@/components/lifenergy/PublicLifenergyForm";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ token: string }>;
};

export default async function FormularioPage({ params }: PageProps) {
  const { token } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .rpc("get_public_journey_by_token", { p_token: token })
    .single();

const journey = data as any;

  if (error || !data) notFound();

 if (
  journey.status === "completed" ||
  journey.status === "exported"
) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
        <section className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-[#0F2D4A]">
            Avaliação já concluída
          </h1>
          <p className="mt-4 text-slate-600">
            Este link já foi utilizado e não aceita novas respostas.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <PublicLifenergyForm organizationName={journey.organization_name} token={token} />
    </main>
  );
}
