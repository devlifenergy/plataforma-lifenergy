"use client";

import { useMemo, useState } from "react";

type Props = {
  organizationName: string;
  token: string;
  activity: string;
  applicatorName: string;
};

type FormState = {
  fullName: string;
  cpf: string;
  email: string;
  naturalidade: string;
  birthDate: string;
  objective: string;
  applicatorName: string;
  fractal: string;
  response1: string;
  response2: string;
  response3: string;
  justification1: string;
  justification2: string;
  justification3: string;
  finalFeeling: string;
};

const TOTAL_STEPS = 10;

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

function formatDateBr(value: string) {
  const digits = onlyDigits(value).slice(0, 8);
  return digits
    .replace(/^(\d{2})(\d)/, "$1/$2")
    .replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
}

function isValidDateBr(value: string) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;

  const [, dayText, monthText, yearText] = match;
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);

  if (year < 1900 || year > new Date().getFullYear()) return false;
  if (month < 1 || month > 12) return false;

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function dateBrToIso(value: string) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return value;

  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

function localDateToIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function fieldClass(extra = "") {
  return `w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20 ${extra}`;
}

function labelClass() {
  return "mb-2 block text-sm font-semibold text-slate-700";
}

function isEmailValid(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

function hierarchyLabel(value: number) {
  if (value === 3) return "Maior importância — 3";
  if (value === 2) return "Média importância — 2";
  return "Menor importância — 1";
}

function responseLabel(index: number) {
  if (index === 1) return "Primeira Resposta";
  if (index === 2) return "Segunda Resposta";
  return "Terceira Resposta";
}

function responseByIndex(form: FormState, index: number) {
  if (index === 1) return form.response1;
  if (index === 2) return form.response2;
  return form.response3;
}

function justificationByIndex(form: FormState, index: number) {
  if (index === 1) return form.justification1;
  if (index === 2) return form.justification2;
  return form.justification3;
}

export function PublicLifenergyForm({
  organizationName,
  token,
  activity,
  applicatorName,
}: Props) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    fullName: "",
    cpf: "",
    email: "",
    naturalidade: "",
    birthDate: "",
    objective: "",
    applicatorName,
    fractal: "",
    response1: "",
    response2: "",
    response3: "",
    justification1: "",
    justification2: "",
    justification3: "",
    finalFeeling: "",
  });
  const [highest, setHighest] = useState<number | null>(null);
  const [lowest, setLowest] = useState<number | null>(null);

  const today = useMemo(() => new Date(), []);
  const applicationDate = localDateToIso(today);
  const initialTime = today.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const progress = Math.max(8, Math.round((step / TOTAL_STEPS) * 100));

  const hierarchyMap: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
  if (highest) hierarchyMap[highest] = 3;
  if (lowest) hierarchyMap[lowest] = 1;

  const remaining = [1, 2, 3].find(
    (item) => item !== highest && item !== lowest
  );

  if (highest && lowest && remaining) hierarchyMap[remaining] = 2;

  const orderedByHierarchy = [1, 2, 3]
    .map((index) => ({
      index,
      response: responseByIndex(form, index),
      hierarchy: hierarchyMap[index],
    }))
    .filter((item) => item.hierarchy > 0)
    .sort((a, b) => b.hierarchy - a.hierarchy);

  const orderedByResponse = [1, 2, 3]
    .map((index) => ({
      index,
      response: responseByIndex(form, index),
      hierarchy: hierarchyMap[index],
    }))
    .filter((item) => item.hierarchy > 0);

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function canContinue() {
    if (step === 1) return true;
    if (step === 2) {
      return Boolean(
        form.fullName.trim() &&
          form.cpf.trim().length >= 14 &&
          isEmailValid(form.email) &&
          form.naturalidade.trim() &&
          isValidDateBr(form.birthDate) &&
          form.objective.trim()
      );
    }
    if (step === 3) return true;
    if (step === 4) return Boolean(form.fractal.trim());
    if (step === 5) {
      return Boolean(
        form.response1.trim() &&
          form.response2.trim() &&
          form.response3.trim()
      );
    }
    if (step === 6) return highest !== null;
    if (step === 7) return lowest !== null;
    if (step === 8) return Boolean(highest && lowest && remaining);
    if (step === 9) {
      return Boolean(
        form.justification1.trim() &&
          form.justification2.trim() &&
          form.justification3.trim()
      );
    }
    if (step === 10) return Boolean(form.finalFeeling.trim());
    return false;
  }

  function goNext() {
    if (!canContinue()) return;
    setStep((current) => Math.min(TOTAL_STEPS, current + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setStep((current) => Math.max(1, current - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function chooseHighest(index: number) {
    setHighest(index);
    if (lowest === index) setLowest(null);
  }

  function chooseLowest(index: number) {
    if (index === highest) return;
    setLowest(index);
  }

  return (
    <form
      action="/api/journeys/submit"
      method="POST"
      className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-sm md:p-8"
    >
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="application_date" value={applicationDate} />
      <input type="hidden" name="initial_time" value={initialTime} />
      <input type="hidden" name="tipo_aplicacao" value="aplicacao_assistida" />
      <input type="hidden" name="escolha_atividade" value="aplicador" />
      <input type="hidden" name="nome" value={form.fullName} />
      <input type="hidden" name="cpf" value={form.cpf} />
      <input type="hidden" name="email" value={form.email} />
      <input type="hidden" name="naturalidade" value={form.naturalidade} />
      <input type="hidden" name="data_nascimento" value={dateBrToIso(form.birthDate)} />
      <input type="hidden" name="objetivo" value={form.objective} />
      <input type="hidden" name="nome_aplicador" value={form.applicatorName} />
      <input type="hidden" name="fractal" value={form.fractal} />
      <input type="hidden" name="resposta_1" value={form.response1} />
      <input type="hidden" name="resposta_2" value={form.response2} />
      <input type="hidden" name="resposta_3" value={form.response3} />
      <input type="hidden" name="hierarquia_1" value={hierarchyMap[1] || ""} />
      <input type="hidden" name="hierarquia_2" value={hierarchyMap[2] || ""} />
      <input type="hidden" name="hierarquia_3" value={hierarchyMap[3] || ""} />
      <input type="hidden" name="justificativa_1" value={form.justification1} />
      <input type="hidden" name="justificativa_2" value={form.justification2} />
      <input type="hidden" name="justificativa_3" value={form.justification3} />
      <input type="hidden" name="sentimento_final" value={form.finalFeeling} />

      <header className="sticky top-0 z-10 -mx-6 -mt-6 border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur md:-mx-8 md:-mt-8 md:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B98A2E]">
          Lifenergy Digital
        </p>
        <h1 className="mt-1 text-2xl font-bold text-[#0F2D4A]">
          Passo {step} de {TOTAL_STEPS} da sua tarefa.
        </h1>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-[#0F2D4A] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-sm font-medium text-slate-600">
          Acompanhe aqui o seu avanço nessa tarefa.
        </p>
      </header>

      <main className="mt-10 min-h-[520px]">
        {step === 1 && (
          <section className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
              {organizationName}
            </p>
            <div>
              <h2 className="text-4xl font-bold text-[#0F2D4A]">
                Bem-vindo ao Lifenergy Digital — seu cantinho de reflexão e crescimento pessoal.
              </h2>
            </div>
            <div className="space-y-4 text-base leading-8 text-slate-700">
              <p>
                Você iniciará, a partir de agora, uma avaliação do seu padrão relacional —
                uma prática de autopercepção guiada pela Metodologia Lifenergy.
              </p>
              <p>
                Utilize preferencialmente um computador, tablet ou celular com
                acesso estável à internet, em um ambiente tranquilo, sem
                distrações ou interrupções, para manter sua atenção durante toda
                a atividade.
              </p>
              <p>
                Desenvolva as atividades exatamente na sequência apresentada.
                Elas representam situações simples e frequentes do seu cotidiano.
              </p>
              <p>
                Após iniciar, prossiga até a conclusão da atividade, evitando
                interrupções, para garantir o registro completo de suas respostas.
              </p>
              <p>
                Durante toda a atividade, siga cada etapa na ordem apresentada.
                Evite antecipar respostas e mantenha sua atenção voltada para a tarefa.
              </p>
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <h2 className="text-3xl font-bold text-[#0F2D4A]">Identificação</h2>
            <p className="mt-2 text-slate-600">
              Preencha seus dados de identificação para iniciar a atividade.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <label>
                <span className={labelClass()}>Nome Completo *</span>
                <input
                  value={form.fullName}
                  onChange={(event) => update("fullName", event.target.value)}
                  className={fieldClass()}
                />
              </label>
              <label>
                <span className={labelClass()}>CPF *</span>
                <input
                  value={form.cpf}
                  onChange={(event) => update("cpf", formatCpf(event.target.value))}
                  className={fieldClass()}
                  inputMode="numeric"
                  maxLength={14}
                />
              </label>
              <label>
                <span className={labelClass()}>E-mail *</span>
                <input
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  type="email"
                  className={fieldClass()}
                />
              </label>
              <label>
                <span className={labelClass()}>Naturalidade *</span>
                <input
                  value={form.naturalidade}
                  onChange={(event) => update("naturalidade", event.target.value)}
                  placeholder="Cidade / Estado"
                  className={fieldClass()}
                />
              </label>
              <label>
                <span className={labelClass()}>Data de Nascimento *</span>
                <input
                  value={form.birthDate}
                  onChange={(event) => update("birthDate", formatDateBr(event.target.value))}
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="dd/mm/aaaa"
                  className={fieldClass()}
                />
              </label>
              <label className="md:col-span-2">
                <span className={labelClass()}>Objetivo de Participação *</span>
                <textarea
                  value={form.objective}
                  onChange={(event) => update("objective", event.target.value)}
                  className={fieldClass("min-h-32")}
                />
              </label>
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <h2 className="text-3xl font-bold text-[#0F2D4A]">Instruções</h2>
            <div className="mt-8 space-y-5 rounded-2xl bg-slate-50 p-6 text-base leading-8 text-slate-700">
              <p>
                Você receberá uma atividade intitulada “Fractal de Comportamento”,
                apresentada pelo aplicador. Essa atividade deve ser realizada com
                atenção, de forma contínua e sem interrupções. Responda de maneira
                espontânea, sem excesso de reflexão, considerando aquilo que vier
                primeiro à sua percepção.
              </p>
              <ol className="list-decimal space-y-3 pl-6">
                <li>Leia com atenção, em voz alta, a atividade ou fractal de comportamento apresentado pelo aplicador.</li>
                <li>No campo indicado, digite a atividade ou o fractal de comportamento que você leu.</li>
                <li>Em seguida, registre as três respostas, uma em cada campo indicado.</li>
                <li>Depois de registrar as três respostas, releia todas elas com atenção.</li>
                <li>Selecione a resposta que você considera de maior importância neste momento e clique sobre ela.</li>
                <li>Em seguida, selecione a resposta que você considera de menor importância e clique sobre ela.</li>
                <li>A resposta restante será considerada automaticamente como de média importância.</li>
                <li>Na etapa de justificativas, explique o porquê da resposta que você deu e da importância atribuída a ela.</li>
                <li>Ao final, no quadro indicado, descreva como você se sentiu durante a realização da atividade.</li>
                <li>Quando aparecer o quadro resumo, faça uma revisão das suas respostas, importância e justificativas.</li>
                <li>Caso queira alterar alguma resposta, importância ou justificativa, utilize a opção de voltar.</li>
                <li>Antes de enviar, revise o resumo da sua tarefa.</li>
              </ol>
            </div>
            <p className="mt-6 font-bold text-[#0F2D4A]">
              Ao continuar, você confirma que leu, compreendeu as instruções e realizou a tarefa.
            </p>
          </section>
        )}

        {step === 4 && (
          <section>
            <h2 className="text-3xl font-bold text-[#0F2D4A]">Fractal de Comportamento</h2>
            <p className="mt-2 text-slate-600">
              Copie abaixo a atividade ou Fractal de comportamento apresentado pelo Aplicador:
            </p>
            <div
              className="mt-6 select-none rounded-2xl border border-[#B98A2E]/40 bg-[#B98A2E]/10 p-6"
              onCopy={(event) => event.preventDefault()}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A671E]">
                Atividade apresentada pelo aplicador
              </p>
              <p className="mt-3 whitespace-pre-wrap text-base leading-7 text-slate-800">
                {activity}
              </p>
            </div>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <textarea
                value={form.fractal}
                onChange={(event) => update("fractal", event.target.value)}
                onCopy={(event) => event.preventDefault()}
                onCut={(event) => event.preventDefault()}
                onPaste={(event) => event.preventDefault()}
                onDrop={(event) => event.preventDefault()}
                autoComplete="off"
                className={fieldClass("min-h-48 bg-white")}
              />
            </div>
            <p className="mt-5 text-sm font-semibold text-[#0F2D4A]">
              Leia atentamente o Fractal de Comportamento antes de prosseguir.
            </p>
          </section>
        )}

        {step === 5 && (
          <section>
            <h2 className="text-3xl font-bold text-[#0F2D4A]">Registro de Dados</h2>
            <p className="mt-2 text-slate-600">
              Nesta etapa, registre <strong>APENAS</strong> as suas três respostas.
            </p>
            <div className="mt-8 space-y-5">
              {[1, 2, 3].map((item) => {
                const field = item === 1 ? "response1" : item === 2 ? "response2" : "response3";
                return (
                  <label key={item} className="block">
                    <span className={labelClass()}>{responseLabel(item)} *</span>
                    <textarea
                      value={form[field]}
                      onChange={(event) => update(field as keyof FormState, event.target.value)}
                      className={fieldClass("min-h-28")}
                    />
                  </label>
                );
              })}
            </div>
          </section>
        )}

        {step === 6 && (
          <section>
            <h2 className="text-3xl font-bold text-[#0F2D4A]">Hierarquia</h2>
            <p className="mt-2 text-slate-600">Agora vamos organizar suas respostas por importância.</p>
            <h3 className="mt-8 text-xl font-bold text-[#0F2D4A]">
              Releia suas respostas e clique na que você considera de Maior Importância.
            </h3>
            <div className="mt-4 grid gap-4">
              {[1, 2, 3].map((index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => chooseHighest(index)}
                  className={`rounded-2xl border p-5 text-left transition ${
                    highest === index
                      ? "border-[#0F2D4A] bg-[#0F2D4A] text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-[#B98A2E]"
                  }`}
                >
                  <span className="block text-sm font-semibold">{responseLabel(index)}</span>
                  <span className="mt-2 block">{responseByIndex(form, index)}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 7 && (
          <section>
            <h2 className="text-3xl font-bold text-[#0F2D4A]">Hierarquia</h2>
            <p className="mt-2 text-slate-600">Agora vamos organizar suas respostas por importância.</p>
            <h3 className="mt-8 text-xl font-bold text-[#0F2D4A]">
              Releia suas respostas e clique na que você considera de Menor Importância.
            </h3>
            <div className="mt-4 grid gap-4">
              {[1, 2, 3]
                .filter((index) => index !== highest)
                .map((index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => chooseLowest(index)}
                    className={`rounded-2xl border p-5 text-left transition ${
                      lowest === index
                        ? "border-[#B98A2E] bg-[#B98A2E] text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-[#B98A2E]"
                    }`}
                  >
                    <span className="block text-sm font-semibold">{responseLabel(index)}</span>
                    <span className="mt-2 block">{responseByIndex(form, index)}</span>
                  </button>
                ))}
            </div>
          </section>
        )}

        {step === 8 && (
          <section>
            <h2 className="text-3xl font-bold text-[#0F2D4A]">Média Importância</h2>
            <p className="mt-2 text-slate-600">
              A resposta restante será considerada de média importância.
            </p>
            {remaining ? (
              <div className="mt-8 rounded-2xl border-2 border-[#0F2D4A] bg-[#0F2D4A]/5 p-5 text-slate-700 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B98A2E]">
                  {responseLabel(remaining)}
                </p>
                <p className="mt-3 text-base font-semibold text-[#0F2D4A]">
                  {responseByIndex(form, remaining)}
                </p>
                <p className="mt-3 font-bold text-[#0F2D4A]">Média Importância</p>
              </div>
            ) : null}
          </section>
        )}

        {step === 9 && (
          <section>
            <h2 className="text-3xl font-bold text-[#0F2D4A]">Justificativas</h2>
            <p className="mt-2 text-slate-600">
              Para cada resposta, justifique o porquê da resposta apresentada e da hierarquia escolhida, iniciando pela resposta de maior importância e finalizando pela de menor importância.
            </p>
            <div className="mt-8 space-y-6">
              {orderedByHierarchy.map((item) => {
                const field = item.index === 1 ? "justification1" : item.index === 2 ? "justification2" : "justification3";
                return (
                  <div key={item.index} className="rounded-2xl border border-slate-200 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B98A2E]">
                      {hierarchyLabel(item.hierarchy)}
                    </p>
                    <p className="mt-3 font-semibold text-[#0F2D4A]">{responseLabel(item.index)}</p>
                    <p className="mt-2 text-slate-700">{item.response}</p>
                    <label className="mt-5 block">
                      <span className={labelClass()}>Justificativa *</span>
                      <textarea
                        value={form[field]}
                        onChange={(event) => update(field as keyof FormState, event.target.value)}
                        className={fieldClass("min-h-32")}
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {step === 10 && (
          <section>
            <h2 className="text-3xl font-bold text-[#0F2D4A]">Resumo da sua tarefa</h2>
            <p className="mt-2 text-slate-600">
              Revise o resumo abaixo antes de concluir. Caso queira alterar alguma resposta, classificação ou justificativa, utilize a opção Voltar para retornar às etapas anteriores e realizar os ajustes necessários.
            </p>
            <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-5 py-4 text-sm font-bold text-[#0F2D4A]">Resposta</th>
                    <th className="px-5 py-4 text-sm font-bold text-[#0F2D4A]">Importância</th>
                    <th className="px-5 py-4 text-sm font-bold text-[#0F2D4A]">Justificativa</th>
                  </tr>
                </thead>
                <tbody>
                  {orderedByResponse.map((item) => (
                    <tr key={item.index} className="border-b border-slate-100 last:border-0">
                      <td className="px-5 py-4 align-top">
                        <p className="font-semibold text-[#0F2D4A]">{responseLabel(item.index)}</p>
                        <p className="mt-1 text-sm text-slate-600">{item.response}</p>
                      </td>
                      <td className="px-5 py-4 align-top text-sm text-slate-700">
                        {hierarchyLabel(item.hierarchy)}
                      </td>
                      <td className="px-5 py-4 align-top text-sm text-slate-700">
                        {justificationByIndex(form, item.index)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-8">
              <h2 className="text-3xl font-bold text-[#0F2D4A]">Reflexão Final</h2>
              <label className="mt-8 block">
                <span className={labelClass()}>
                  Agora pare por alguns instantes e descreva como você se sentiu durante o desenvolvimento da atividade. *
                </span>
                <textarea
                  value={form.finalFeeling}
                  onChange={(event) => update("finalFeeling", event.target.value)}
                  className={fieldClass("min-h-40")}
                />
              </label>
            </div>
          </section>
        )}
      </main>

      {step < TOTAL_STEPS ? (
        <p className="mt-8 text-sm font-semibold text-[#0F2D4A]">
          Para seguir, clique em continuar.
        </p>
      ) : null}

      <footer className="mt-10 flex flex-col-reverse gap-4 border-t border-slate-200 pt-6 md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 1}
          className={`rounded-xl px-6 py-3 font-semibold transition ${
            step === 1
              ? "cursor-not-allowed bg-slate-100 text-slate-400"
              : "border border-[#0F2D4A] bg-white text-[#0F2D4A] hover:bg-slate-50"
          }`}
        >
          Voltar
        </button>

        {step < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!canContinue()}
            className={`rounded-xl px-6 py-3 font-semibold transition ${
              canContinue()
                ? "bg-[#0F2D4A] text-white hover:opacity-90"
                : "cursor-not-allowed bg-slate-200 text-slate-500"
            }`}
          >
            Continuar
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canContinue()}
            className={`rounded-xl px-6 py-3 font-semibold transition ${
              canContinue()
                ? "bg-[#0F2D4A] text-white hover:opacity-90"
                : "cursor-not-allowed bg-slate-200 text-slate-500"
            }`}
          >
            Concluir Avaliação
          </button>
        )}
      </footer>
    </form>
  );
}
