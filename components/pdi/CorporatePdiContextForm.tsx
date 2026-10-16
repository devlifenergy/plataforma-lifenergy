"use client";

import { useState, type ReactNode } from "react";
import {
  PDI_MOTIVES, PDI_TENURES, PDI_RATINGS, PDI_ADAPTATION, PDI_CHALLENGES,
  PDI_FREQUENCIES, PDI_COMPETENCIES, PDI_CAREERS, PDI_SUCCESSION,
  parseCorporateQuestionnaire, type PdiContextText,
} from "@/services/pdi/corporateContextQuestionnaire";
import { savePdiContext } from "@/services/pdi/actions";
import { Button } from "@/components/ui/Button";

type Context = Partial<PdiContextText> & {
  current_job_title?: string | null;
  current_area?: string | null;
  manager_name?: string | null;
};
const fieldClass = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#B8860B]";
const smallClass = "rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm";

function SelectField({ label, name, values, initial, required = true }: {
  label: string; name: string; values: readonly string[]; initial?: string; required?: boolean;
}) {
  return <label className="block space-y-1.5"><span className="block text-sm font-semibold text-slate-700">{label}</span>
    <select name={name} defaultValue={initial ?? ""} required={required} className={fieldClass}>
      <option value="">Selecione...</option>{values.map((v) => <option value={v} key={v}>{v}</option>)}
    </select>
  </label>;
}
function TextField({ name, label, initial, required = false }: { name: string; label: string; initial?: string | null; required?: boolean }) {
  return <label className="block space-y-1.5"><span className="block text-sm font-semibold text-slate-700">{label}</span>
    <input className={fieldClass} name={name} defaultValue={initial ?? ""} required={required} maxLength={180} />
  </label>;
}
function Scale({ name, initial, required = true }: { name: string; initial?: string; required?: boolean }) {
  return <select name={name} defaultValue={initial ?? ""} required={required} className={smallClass} aria-label="Nota de 1 a 5">
    <option value="">Nota...</option>{[1,2,3,4,5].map((n) => <option value={n} key={n}>{n}</option>)}
  </select>;
}
/** Escala Likert de escolha única: os cinco valores continuam sendo enviados como 1..5. */
function LikertScale({ name, label, initial, required = true }: {
  name: string; label: string; initial?: string; required?: boolean;
}) {
  const labelId = `likert_${name}`;
  return <div role="radiogroup" aria-labelledby={labelId} className="grid gap-3 rounded-xl bg-slate-50 px-3 py-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
    <span id={labelId} className="text-sm leading-5 text-slate-700">{label}</span>
    <div className="flex flex-wrap gap-2" aria-label="Selecione uma nota de 1 a 5">
      {[1, 2, 3, 4, 5].map((n) => <label key={n} className="cursor-pointer" title={`${n} de 5`}>
        <input
          type="radio" name={name} value={n} defaultChecked={initial === String(n)} required={required}
          aria-label={`${n} de 5`} className="peer sr-only"
        />
        <span className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-slate-300 bg-white text-sm font-semibold text-slate-700 transition-colors hover:border-[#B8860B] hover:bg-amber-50 peer-checked:border-[#0F2D4A] peer-checked:bg-[#0F2D4A] peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#B8860B]">
          {n}
        </span>
      </label>)}
    </div>
  </div>;
}
function Section({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
    <div><h3 className="font-bold text-[#0F2D4A]">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p></div>
    {children}
  </section>;
}
export function CorporatePdiContextForm({ responseId, context }: { responseId: string; context?: Context | null }) {
  const initial = parseCorporateQuestionnaire(context);
  const [motive, setMotive] = useState(initial.q_motive ?? "");
  const [succession, setSuccession] = useState(initial.q_succession ?? "");
  const [challenges, setChallenges] = useState<string[]>(() => PDI_CHALLENGES.filter(c => initial[`q_challenge_${c}`]));
  const [competencies, setCompetencies] = useState<string[]>(() => PDI_COMPETENCIES.filter(c => initial[`q_competency_${c}`]));
  const hasLegacy = Boolean((context?.context_summary || context?.current_situation || context?.current_challenges || context?.development_priorities || context?.career_direction) && !initial.q_motive);

  return <form action={savePdiContext} className="mt-4 space-y-4">
    <input type="hidden" name="journey_response_id" value={responseId} />
    <input type="hidden" name="pdi_type" value="corporate" />
    <input type="hidden" name="corporate_questionnaire" value="1" />
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <TextField name="current_job_title" label="Cargo atual *" initial={context?.current_job_title} required />
      <TextField name="current_area" label="Área" initial={context?.current_area} />
      <TextField name="manager_name" label="Gestor imediato" initial={context?.manager_name} />
    </div>
    <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">Preenchimento pelo gestor imediato. As respostas objetivas alimentam automaticamente o contexto do PDI Corporativo. Notas de 1 a 5 representam avaliação percebida pelo gestor, não métricas Lifenergy.</p>
    {hasLegacy && <details className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm"><summary className="cursor-pointer font-semibold">Contexto anterior: consultar antes de substituir</summary>
      {(["context_summary", "current_situation", "current_challenges", "development_priorities", "career_direction"] as const).map(k => context?.[k] && <p className="mt-2 whitespace-pre-line" key={k}><strong>{k}:</strong> {context[k]}</p>)}
    </details>}

    <Section title="1. Contexto atual" subtitle="Finalidade do PDI e tempo na função.">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2"><label className="block text-sm font-semibold">Motivo principal do PDI *</label>
          <select name="q_motive" value={motive} onChange={e=>setMotive(e.target.value)} required className={fieldClass}><option value="">Selecione...</option>{PDI_MOTIVES.map(v => <option key={v} value={v}>{v}</option>)}</select>
          {motive === "Outro" && <input name="q_motive_other" defaultValue={initial.q_motive_other ?? ""} required maxLength={120} placeholder="Descreva o motivo em uma linha" className={fieldClass}/>}
        </div>
        <SelectField name="q_tenure" label="Tempo no cargo atual *" values={PDI_TENURES} initial={initial.q_tenure} />
      </div>
    </Section>

    <Section title="2. Situação atual" subtitle="Para cada afirmação, 1 = discordo totalmente; 5 = concordo totalmente.">
      <div className="space-y-2">{PDI_RATINGS.map(([key, label]) =>
        <LikertScale key={key} name={`q_rating_${key}`} label={label} initial={initial[`q_rating_${key}`]} />
      )}</div>
      <SelectField name="q_adaptation" label="Adaptação às rotinas do cargo *" values={PDI_ADAPTATION} initial={initial.q_adaptation}/>
    </Section>

    <Section title="3. Desafios atuais" subtitle="Marque os desafios existentes e a frequência de cada um. Se não houver, deixe todos desmarcados.">
      <div className="space-y-2">{PDI_CHALLENGES.map(name => <div key={name} className="rounded-lg bg-slate-50 px-3 py-2">
        <div className="flex items-center justify-between gap-3">
          <label className="flex flex-1 items-center gap-2 text-sm"><input type="checkbox" name="q_challenge" value={name} checked={challenges.includes(name)} onChange={e=>setChallenges(prev=>e.target.checked ? [...prev,name] : prev.filter(x=>x!==name))}/>{name}</label>
          {challenges.includes(name) && <select name={`q_frequency_${name}`} defaultValue={initial[`q_frequency_${name}`] ?? ""} required className={smallClass}><option value="">Frequência...</option>{PDI_FREQUENCIES.map(v=><option key={v} value={v}>{v}</option>)}</select>}
        </div>
        {name === "Outro" && challenges.includes(name) && <input name="q_challenge_other" defaultValue={initial.q_challenge_other ?? ""} required maxLength={120} placeholder="Descreva o desafio" className={`${fieldClass} mt-2`}/>}
      </div>)}</div>
    </Section>

    <Section title="4. Prioridades de desenvolvimento" subtitle={`Escolha até três competências e classifique a urgência de 1 (pode esperar) a 5 (urgente). Selecionadas: ${competencies.length}/3.`}>
      <div className="space-y-2">{PDI_COMPETENCIES.map(name => <div key={name} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2">
        <label className="flex flex-1 items-center gap-2 text-sm"><input type="checkbox" name="q_competency" value={name} checked={competencies.includes(name)} disabled={!competencies.includes(name) && competencies.length >= 3} onChange={e=>setCompetencies(prev=>e.target.checked ? [...prev,name] : prev.filter(x=>x!==name))}/>{name}</label>
        {competencies.includes(name) && <Scale name={`q_urgency_${name}`} initial={initial[`q_urgency_${name}`]}/>}
      </div>)}</div>
    </Section>

    <Section title="5. Carreira e sucessão" subtitle="Este bloco orienta o objetivo de carreira do PDI; não equivale a uma aprovação de promoção.">
      <SelectField name="q_career" label="Direcionamento previsto para os próximos 12 meses *" values={PDI_CAREERS} initial={initial.q_career}/>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-1.5"><span className="block text-sm font-semibold">Posição ou trilha de sucessão mapeada? *</span>
          <select className={fieldClass} name="q_succession" value={succession} onChange={e=>setSuccession(e.target.value)} required><option value="">Selecione...</option>{PDI_SUCCESSION.map(v=><option key={v} value={v}>{v}</option>)}</select>
        </label>
        {succession === "Sim" && <TextField name="q_succession_name" label="Nome da posição ou trilha *" initial={initial.q_succession_name} required/>}
      </div>
      <div className="space-y-1.5">
        <LikertScale name="q_readiness" label="Prontidão percebida para o próximo passo (1 a 5) *" initial={initial.q_readiness} />
        <p className="px-1 text-xs text-slate-500">1 = nada pronto · 5 = totalmente pronto</p>
      </div>
    </Section>
    <div className="flex justify-end"><Button type="submit">Salvar Contexto Operacional</Button></div>
  </form>;
}
