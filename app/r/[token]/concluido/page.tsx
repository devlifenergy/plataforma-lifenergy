import { createClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function JourneyCompletedPage({ params }: PageProps) {
  const { token } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .rpc("get_public_journey_by_token", { p_token: token })
    .single();

const journey = data as any;

  if (error || !data) {
    notFound();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <section className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
          {journey.organization_name}
        </p>

        <h1 className="text-3xl font-bold text-[#0F2D4A]">
          Avaliação concluída
        </h1>

        <p className="mt-4 text-slate-600">
          Obrigado pela sua participação. Sua avaliação foi registrada com
          sucesso.
        </p>

        <p className="mt-4 text-sm text-slate-500">
          Você já pode fechar esta página.
        </p>
      </section>
    </main>
  );
}
