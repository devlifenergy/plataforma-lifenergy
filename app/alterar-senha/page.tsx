import { redirect } from "next/navigation";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { createClient } from "@/lib/supabaseServer";
import { changeInitialPassword } from "@/services/auth/actions";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AlterarSenhaPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-16">
      <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B98A2E]">Acesso seguro</p>
        <h1 className="mt-2 text-3xl font-bold text-[#0F2D4A]">Crie sua nova senha</h1>
        <p className="mt-3 leading-7 text-slate-600">Por segurança, defina uma nova senha antes de acessar o Lifenergy Digital.</p>
        <form action={changeInitialPassword} className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-2 block font-semibold text-slate-700">Nova senha</span>
            <PasswordInput
              name="password"
              minLength={8}
              required
              autoComplete="new-password"
              inputClassName="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#B8860B]"
            />
          </label>
          <label className="block">
            <span className="mb-2 block font-semibold text-slate-700">Confirmar nova senha</span>
            <PasswordInput
              name="password_confirmation"
              minLength={8}
              required
              autoComplete="new-password"
              inputClassName="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#B8860B]"
            />
          </label>
          {params.error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{params.error}</p> : null}
          <button className="w-full rounded-xl bg-[#0F2D4A] px-5 py-3 font-bold text-white">Salvar nova senha e continuar</button>
        </form>
      </div>
    </main>
  );
}
