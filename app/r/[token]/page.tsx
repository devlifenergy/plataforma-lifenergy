import { createClient } from "@/lib/supabaseServer";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function PublicJourneyPage({ params }: PageProps) {
  const { token } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .rpc("get_public_journey_by_token", { p_token: token })
    .single();
const journey = data as any;

  if (error || !data) {
    notFound();
  }

  if (journey.status === "completed" || journey.status === "exported") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
        <section className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
            {journey.organization_name}
          </p>
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
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <section className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
          {journey.organization_name}
        </p>

        <h1 className="text-4xl font-bold text-[#0F2D4A]">
          Avaliação Lifenergy
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-700">
          Olá, {journey.participant_name}.
        </p>

        <p className="mt-4 text-slate-600">
          Você foi convidado(a) para participar de uma avaliação. O tempo
          aproximado de preenchimento é de 10 minutos.
        </p>

        <p className="mt-4 text-sm text-slate-500">
          Suas respostas serão tratadas com confidencialidade.
        </p>

        <Link
          href={`/r/${journey.token}/formulario`}
          className="mt-8 inline-flex rounded-xl bg-[#0F2D4A] px-8 py-4 font-semibold text-white transition hover:opacity-90"
        >
          Iniciar
        </Link>
      </section>
    </main>
  );
}
