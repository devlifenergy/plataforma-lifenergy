"use client";
import { useRef, useState, useTransition } from "react";
import { createParticipantDocument } from "@/services/library/actions";
type Candidate={responseId:string; participantName:string; cpf:string};
export function ParticipantDocumentForm({candidates}:{candidates:Candidate[]}) {
  const ref=useRef<HTMLFormElement>(null); const [message,setMessage]=useState(""); const [pending,start]=useTransition();
  return <form ref={ref} action={(fd)=>start(async()=>{try{await createParticipantDocument(fd); ref.current?.reset(); setMessage("Documento vinculado ao avaliado.");}catch(e){setMessage(e instanceof Error?e.message:"Erro ao vincular documento.");}})} className="grid gap-4 md:grid-cols-2">
    <select name="journey_response_id" required className="rounded-xl border border-slate-300 px-4 py-3"><option value="">Selecione o avaliado *</option>{candidates.map(c=><option key={c.responseId} value={c.responseId}>{c.participantName} · {c.cpf}</option>)}</select>
    <input name="title" required placeholder="Título do documento *" className="rounded-xl border border-slate-300 px-4 py-3" />
    <input name="category" placeholder="Categoria (opcional)" className="rounded-xl border border-slate-300 px-4 py-3" />
    <input name="file" type="file" required className="rounded-xl border border-slate-300 px-4 py-3" />
    <button disabled={pending} className="rounded-xl bg-[#0F2D4A] px-5 py-3 font-bold text-white md:col-span-2">{pending?"Salvando...":"Vincular documento ao avaliado"}</button>
    {message?<p className="text-sm md:col-span-2">{message}</p>:null}
  </form>;
}
