import { createClient } from "@/lib/supabaseServer";
import { Card } from "@/components/ui/Card";
import { TechnicalLibraryForm } from "@/components/application/TechnicalLibraryForm";
import { archiveTechnicalLibraryDocument, listTechnicalLibraryDocuments } from "@/services/library/actions";

export default async function BibliotecaTecnicaAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("auth_user_id", user?.id || "").maybeSingle();
  const docs = await listTechnicalLibraryDocuments(false);
  const isSuperAdmin = profile?.role === "super_admin";

  return <div className="space-y-6">
    <div><h1 className="text-3xl font-bold text-[#0F2D4A]">Biblioteca Técnica</h1><p className="mt-1 text-slate-500">Base de conhecimento e fundamentação teórica da Metodologia Lifenergy.</p></div>
    {isSuperAdmin ? <Card><h2 className="mb-4 text-xl font-bold text-[#0F2D4A]">Publicar conteúdo técnico</h2><TechnicalLibraryForm /></Card> : null}
    <Card><h2 className="mb-4 text-xl font-bold text-[#0F2D4A]">Conteúdos disponíveis</h2>{docs.length===0?<p className="text-slate-500">Nenhum conteúdo publicado.</p>:<div className="space-y-3">{docs.map((doc:any)=><div key={doc.id} className="rounded-xl border border-slate-200 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold text-[#0F2D4A]">{doc.title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{doc.description || "Sem descrição."}</p><p className="mt-1 text-xs text-slate-400">{doc.is_public ? "Público" : "Somente usuários da plataforma"}</p></div><div className="flex gap-2"><a href={`/api/biblioteca-tecnica/${doc.id}/download`} className="rounded-full bg-[#0F2D4A] px-4 py-2 text-xs font-bold text-white">Download</a>{isSuperAdmin?<form action={archiveTechnicalLibraryDocument}><input type="hidden" name="document_id" value={doc.id}/><button className="rounded-full border border-red-200 px-4 py-2 text-xs font-bold text-red-700">Arquivar</button></form>:null}</div></div></div>)}</div>}</Card>
  </div>;
}
