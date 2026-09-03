"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type FractalConfig = {
  id: string | null;
  position: number;
  activity: string;
  vortex?: string;
  connectionPoint?: string;
  fractalCode?: string;
};

type Props = {
  organizationName: string;
  token: string;
  activity: string;
  applicatorName: string;
  fractals?: FractalConfig[];
  initialIdentity?: Partial<Pick<IdentificationState, "fullName" | "cpf" | "email" | "naturalidade" | "birthDate" | "objective">>;
};

type IdentificationState = {
  fullName: string;
  cpf: string;
  email: string;
  naturalidade: string;
  birthDate: string;
  objective: string;
  applicatorName: string;
};

type FractalState = {
  copiedActivity: string;
  response1: string;
  response2: string;
  response3: string;
  justification1: string;
  justification2: string;
  justification3: string;
  finalFeeling: string;
  highest: number | null;
  lowest: number | null;
};

const STAGES_PER_FRACTAL = 8;

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

function isoToDateBr(value: string | undefined) {
  const match = String(value || "").slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return String(value || "");
  return `${match[3]}/${match[2]}/${match[1]}`;
}

function formatElapsedTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function localDateToIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function localTimeToDatabase(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function fieldClass(extra = "") {
  return `w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 outline-none transition focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20 ${extra}`;
}

function labelClass() {
  return "mb-2 block text-base font-semibold leading-7 text-slate-700";
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

function emptyFractalState(): FractalState {
  return {
    copiedActivity: "",
    response1: "",
    response2: "",
    response3: "",
    justification1: "",
    justification2: "",
    justification3: "",
    finalFeeling: "",
    highest: null,
    lowest: null,
  };
}

function responseByIndex(fractal: FractalState, index: number) {
  if (index === 1) return fractal.response1;
  if (index === 2) return fractal.response2;
  return fractal.response3;
}

function justificationByIndex(fractal: FractalState, index: number) {
  if (index === 1) return fractal.justification1;
  if (index === 2) return fractal.justification2;
  return fractal.justification3;
}

function hierarchyMap(fractal: FractalState) {
  const map: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
  if (fractal.highest) map[fractal.highest] = 3;
  if (fractal.lowest) map[fractal.lowest] = 1;
  const remaining = [1, 2, 3].find(
    (item) => item !== fractal.highest && item !== fractal.lowest
  );
  if (fractal.highest && fractal.lowest && remaining) map[remaining] = 2;
  return map;
}

function remainingResponse(fractal: FractalState) {
  return [1, 2, 3].find(
    (item) => item !== fractal.highest && item !== fractal.lowest
  );
}

function normalizedFractals(
  fractals: FractalConfig[] | undefined,
  fallbackActivity: string
): FractalConfig[] {
  const source: FractalConfig[] = fractals?.length
    ? fractals
    : [
        {
          id: null,
          position: 1,
          activity: fallbackActivity,
          vortex: "",
          connectionPoint: "",
          fractalCode: "",
        },
      ];

  const normalized: FractalConfig[] = source
    .filter((item) => item.activity?.trim())
    .slice(0, 3)
    .map((item, index) => ({
      id: item.id ?? null,
      position: item.position || index + 1,
      activity: item.activity,
      vortex: item.vortex ?? "",
      connectionPoint: item.connectionPoint ?? "",
      fractalCode: item.fractalCode ?? "",
    }));

  return normalized.length
    ? normalized
    : [
        {
          id: null,
          position: 1,
          activity: "Fractal de Comportamento",
          vortex: "",
          connectionPoint: "",
          fractalCode: "",
        },
      ];
}

export function PublicLifenergyForm({
  organizationName,
  token,
  activity,
  applicatorName,
  fractals,
  initialIdentity,
}: Props) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const hasRestoredDraftRef = useRef(false);
  const configuredFractals = useMemo(
    () => normalizedFractals(fractals, activity),
    [activity, fractals]
  );

  const [step, setStep] = useState(1);
  const [identity, setIdentity] = useState<IdentificationState>({
    fullName: initialIdentity?.fullName || "",
    cpf: formatCpf(initialIdentity?.cpf || ""),
    email: initialIdentity?.email || "",
    naturalidade: initialIdentity?.naturalidade || "",
    birthDate: isoToDateBr(initialIdentity?.birthDate),
    objective: initialIdentity?.objective || "",
    applicatorName,
  });
  const [fractalStates, setFractalStates] = useState<FractalState[]>(
    configuredFractals.map(() => emptyFractalState())
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const today = useMemo(() => new Date(), []);
  const applicationDate = localDateToIso(today);
  const initialTime = localTimeToDatabase(today);
  const draftStorageKey = `lifenergy-public-form-draft-${token}`;

  const totalSteps = 3 + configuredFractals.length * STAGES_PER_FRACTAL;
  const progress = Math.max(8, Math.round((step / totalSteps) * 100));

  function scrollToFormTop() {
    window.requestAnimationFrame(() => {
      const top = formRef.current
        ? formRef.current.getBoundingClientRect().top + window.scrollY - 12
        : 0;

      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  }

  useEffect(() => {
    scrollToFormTop();
  }, [step]);

  useEffect(() => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(draftStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.identity) setIdentity(parsed.identity);
        if (Array.isArray(parsed?.fractalStates)) setFractalStates(parsed.fractalStates);
        if (typeof parsed?.step === "number") setStep(Math.max(1, Math.min(totalSteps, parsed.step)));
      }
    } catch {
      // Ignora rascunho inválido.
    } finally {
      hasRestoredDraftRef.current = true;
    }
  }, [draftStorageKey, totalSteps]);

  useEffect(() => {
    if (!hasRestoredDraftRef.current || isSubmitting) return;
    window.localStorage.setItem(
      draftStorageKey,
      JSON.stringify({ step, identity, fractalStates })
    );
  }, [draftStorageKey, step, identity, fractalStates, isSubmitting]);

  useEffect(() => {
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isSubmitting) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [isSubmitting]);

  useEffect(() => {
    window.history.replaceState({ lifenergyStep: step }, "");

    const handlePopState = () => {
      setStep((current) => {
        if (current > 1) {
          const next = current - 1;
          window.history.pushState({ lifenergyStep: next }, "");
          return next;
        }
        return current;
      });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [step]);


  const currentFractalIndex =
    step >= 4 ? Math.floor((step - 4) / STAGES_PER_FRACTAL) : 0;
  const currentFractal = configuredFractals[currentFractalIndex];
  const currentState = fractalStates[currentFractalIndex];
  const currentStage =
    step >= 4 ? ((step - 4) % STAGES_PER_FRACTAL) + 1 : 0;
  const isLastFractalSummary =
    step >= 4 &&
    currentFractalIndex === configuredFractals.length - 1 &&
    currentStage === STAGES_PER_FRACTAL;

  const fractalsPayload = configuredFractals.map((fractal, index) => {
    const state = fractalStates[index];
    const map = hierarchyMap(state);
    return {
      fractal_id: fractal.id ?? "",
      position: fractal.position,
      vortex: fractal.vortex ?? "",
      connection_point: fractal.connectionPoint ?? "",
      fractal_code: fractal.fractalCode ?? "",
      presented_activity: fractal.activity,
      copied_activity: state.copiedActivity,
      response_1: state.response1,
      hierarchy_1: map[1],
      justification_1: state.justification1,
      response_2: state.response2,
      hierarchy_2: map[2],
      justification_2: state.justification2,
      response_3: state.response3,
      hierarchy_3: map[3],
      justification_3: state.justification3,
      final_feeling: state.finalFeeling,
    };
  });

  function updateIdentity<K extends keyof IdentificationState>(
    field: K,
    value: IdentificationState[K]
  ) {
    setIdentity((current) => ({ ...current, [field]: value }));
  }

  function updateFractal<K extends keyof FractalState>(
    index: number,
    field: K,
    value: FractalState[K]
  ) {
    setFractalStates((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  }

  function chooseHighest(index: number) {
    updateFractal(currentFractalIndex, "highest", index);
    if (currentState.lowest === index) {
      updateFractal(currentFractalIndex, "lowest", null);
    }
  }

  function chooseLowest(index: number) {
    if (index === currentState.highest) return;
    updateFractal(currentFractalIndex, "lowest", index);
  }

  function canContinue() {
    if (step === 1) return true;
    if (step === 2) return true;
    if (step === 3) {
      return Boolean(
        identity.fullName.trim() &&
          identity.cpf.trim().length >= 14 &&
          isEmailValid(identity.email) &&
          identity.naturalidade.trim() &&
          isValidDateBr(identity.birthDate) &&
          identity.objective.trim()
      );
    }
    if (!currentState) return false;

    if (currentStage === 1) return Boolean(currentState.copiedActivity.trim());
    if (currentStage === 2) {
      return Boolean(
        currentState.response1.trim() &&
          currentState.response2.trim() &&
          currentState.response3.trim()
      );
    }
    if (currentStage === 3) return currentState.highest !== null;
    if (currentStage === 4) return currentState.lowest !== null;
    if (currentStage === 5) {
      return Boolean(currentState.highest && currentState.lowest && remainingResponse(currentState));
    }
    if (currentStage === 6) {
      return Boolean(
        currentState.justification1.trim() &&
          currentState.justification2.trim() &&
          currentState.justification3.trim()
      );
    }
    if (currentStage === 7) return Boolean(currentState.finalFeeling.trim());
    if (currentStage === 8) return true;
    return false;
  }

  function goNext() {
    if (!canContinue()) return;
    setStep((current) => Math.min(totalSteps, current + 1));
  }

  function goBack() {
    setStep((current) => Math.max(1, current - 1));
  }

  function renderFractalTitle() {
    return `Fractal ${currentFractalIndex + 1} de ${configuredFractals.length}`;
  }

  function renderResponseButton(index: number, mode: "highest" | "lowest") {
    const selected = mode === "highest" ? currentState.highest === index : currentState.lowest === index;
    const disabled = mode === "lowest" && currentState.highest === index;

    return (
      <button
        type="button"
        key={index}
        onClick={() => (mode === "highest" ? chooseHighest(index) : chooseLowest(index))}
        disabled={disabled}
        className={`rounded-2xl border p-5 text-left leading-7 transition ${
          selected
            ? "border-[#B98A2E] bg-[#B98A2E] text-white"
            : disabled
              ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
              : "border-slate-200 bg-white text-slate-700 hover:border-[#B98A2E]"
        }`}
      >
        <span className="block text-base font-semibold">{responseLabel(index)}</span>
        <span className="mt-2 block">{responseByIndex(currentState, index)}</span>
      </button>
    );
  }

  function renderFractalSummary(fractal: FractalConfig, state: FractalState) {
    const map = hierarchyMap(state);
    const rows = [1, 2, 3].map((index) => ({
      index,
      response: responseByIndex(state, index),
      hierarchy: map[index],
      justification: justificationByIndex(state, index),
    }));

    return (
      <section key={fractal.position} className="rounded-2xl border border-slate-200 p-5">
        <h3 className="text-2xl font-bold text-[#0F2D4A]">
          Fractal {fractal.position} de {configuredFractals.length}
        </h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B98A2E]">
              Atividade apresentada
            </p>
            <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-slate-700">
              {fractal.activity}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B98A2E]">
              Atividade digitada pelo avaliado
            </p>
            <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-slate-700">
              {state.copiedActivity}
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-5 py-4 text-base font-bold text-[#0F2D4A]">Resposta</th>
                <th className="px-5 py-4 text-base font-bold text-[#0F2D4A]">Importância</th>
                <th className="px-5 py-4 text-base font-bold text-[#0F2D4A]">Justificativa</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.index} className="border-b border-slate-100 last:border-0">
                  <td className="px-5 py-4 align-top">
                    <p className="font-semibold text-[#0F2D4A]">{responseLabel(item.index)}</p>
                    <p className="mt-1 text-base text-slate-600">{item.response}</p>
                  </td>
                  <td className="px-5 py-4 align-top text-base text-slate-700">
                    {hierarchyLabel(item.hierarchy)}
                  </td>
                  <td className="px-5 py-4 align-top text-base text-slate-700">
                    {item.justification}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-xl bg-[#0F2D4A]/5 p-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B98A2E]">
            Reflexão após essa tarefa
          </p>
          <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-slate-700">
            {state.finalFeeling}
          </p>
        </div>
      </section>
    );
  }

  return (
    <form
      ref={formRef}
      action="/api/journeys/submit"
      method="POST"
      noValidate
      onSubmit={(event) => {
        if (!isLastFractalSummary || !canContinue() || isSubmitting) {
          event.preventDefault();
          return;
        }

        window.localStorage.removeItem(draftStorageKey);
        setIsSubmitting(true);
      }}
      onKeyDown={(event) => {
        const target = event.target as HTMLElement;
        const isTextArea = target.tagName.toLowerCase() === "textarea";
        if (event.key === "Enter" && !isTextArea && !isLastFractalSummary) {
          event.preventDefault();
        }
      }}
      className="lifenergy-public-form mx-auto max-w-5xl rounded-3xl bg-white p-5 shadow-sm sm:p-6 md:p-8 scroll-mt-4"
    >
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="application_date" value={applicationDate} />
      <input type="hidden" name="initial_time" value={initialTime} />
      <input type="hidden" name="tipo_aplicacao" value="aplicacao_assistida" />
      <input type="hidden" name="escolha_atividade" value="aplicador" />
      <input type="hidden" name="nome" value={identity.fullName} />
      <input type="hidden" name="cpf" value={identity.cpf} />
      <input type="hidden" name="email" value={identity.email} />
      <input type="hidden" name="naturalidade" value={identity.naturalidade} />
      <input type="hidden" name="data_nascimento" value={dateBrToIso(identity.birthDate)} />
      <input type="hidden" name="objetivo" value={identity.objective} />
      <input type="hidden" name="nome_aplicador" value={identity.applicatorName} />
      <input type="hidden" name="fractal_count" value={configuredFractals.length} />
      <input type="hidden" name="fractals_json" value={JSON.stringify(fractalsPayload)} />

      <header className="sticky top-0 z-10 -mx-6 -mt-6 border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur md:-mx-8 md:-mt-8 md:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B98A2E]">
          Lifenergy Digital
        </p>
        <h1 className="mt-1 text-2xl font-bold text-[#0F2D4A]">
          Passo {step} de {totalSteps} da sua tarefa.
        </h1>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-[#0F2D4A] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm font-medium text-slate-600">
          <p>Acompanhe aqui o seu avanço nessa tarefa.</p>
          <p className="rounded-full bg-[#0F2D4A]/10 px-3 py-1 font-bold text-[#0F2D4A]">
            Tempo de resposta: {formatElapsedTime(elapsedSeconds)}
          </p>
        </div>
      </header>

      <main className="mt-10 min-h-[520px]">
        {step === 1 && (
          <section className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
              {organizationName}
            </p>
            <h2 className="text-4xl font-bold text-[#0F2D4A]">
              Bem-vindo ao Lifenergy Digital — seu cantinho de reflexão e crescimento pessoal.
            </h2>
            <div className="space-y-4 text-base leading-8 text-slate-700">
              <p>
                Este link contém {configuredFractals.length === 1 ? "1 fractal ou atividade" : `${configuredFractals.length} fractais ou atividades`} de comportamento.
              </p>
              <p>
                O tempo estimado é de aproximadamente 15 minutos por fractal ou atividade.
              </p>
              <p>
                Cada tarefa deverá ser realizada em sequência, com atenção e sem interrupções.
              </p>
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <h2 className="text-3xl font-bold text-[#0F2D4A]">Antes de iniciar</h2>
            <div className="mt-8 space-y-5 rounded-2xl bg-slate-50 p-6 text-base leading-8 text-slate-700">
              <p>
                Você iniciará, a partir de agora, uma avaliação do seu padrão relacional — uma prática de autopercepção guiada pela Metodologia Lifenergy.
              </p>
              <p>
                Utilize preferencialmente um computador, tablet ou celular com acesso estável à internet, em um ambiente tranquilo, sem distrações ou interrupções, para manter sua atenção durante toda a atividade.
              </p>
              <p>
                Desenvolva as atividades exatamente na sequência apresentada. Elas representam situações simples e frequentes do seu cotidiano.
              </p>
              <p>
                Após iniciar, prossiga até a conclusão da atividade, evitando interrupções, para garantir o registro completo de suas respostas.
              </p>
              <p>
                Durante toda a atividade, siga cada etapa na ordem apresentada. Evite antecipar respostas e mantenha sua atenção voltada para a tarefa.
              </p>
            </div>
            <p className="mt-6 font-bold text-[#0F2D4A]">
              Ao continuar, você confirma que leu e compreendeu as orientações iniciais.
            </p>
          </section>
        )}

        {step === 3 && (
          <section>
            <h2 className="text-3xl font-bold text-[#0F2D4A]">Identificação</h2>
            <p className="mt-2 text-slate-600">
              Preencha seus dados de identificação para iniciar a atividade.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <label>
                <span className={labelClass()}>Nome Completo *</span>
                <input
                  value={identity.fullName}
                  onChange={(event) => updateIdentity("fullName", event.target.value)}
                  className={fieldClass()}
                />
              </label>
              <label>
                <span className={labelClass()}>CPF *</span>
                <input
                  value={identity.cpf}
                  onChange={(event) => updateIdentity("cpf", formatCpf(event.target.value))}
                  className={fieldClass()}
                  inputMode="numeric"
                  maxLength={14}
                />
              </label>
              <label>
                <span className={labelClass()}>E-mail *</span>
                <input
                  value={identity.email}
                  onChange={(event) => updateIdentity("email", event.target.value)}
                  type="email"
                  className={fieldClass()}
                />
              </label>
              <label>
                <span className={labelClass()}>Naturalidade *</span>
                <input
                  value={identity.naturalidade}
                  onChange={(event) => updateIdentity("naturalidade", event.target.value)}
                  placeholder="Cidade / Estado"
                  className={fieldClass()}
                />
              </label>
              <label>
                <span className={labelClass()}>Data de Nascimento *</span>
                <input
                  value={identity.birthDate}
                  onChange={(event) => updateIdentity("birthDate", formatDateBr(event.target.value))}
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="dd/mm/aaaa"
                  className={fieldClass()}
                />
              </label>
              <label className="md:col-span-2">
                <span className={labelClass()}>Objetivo de Participação *</span>
                <textarea
                  value={identity.objective}
                  onChange={(event) => updateIdentity("objective", event.target.value)}
                  className={fieldClass("min-h-32")}
                />
              </label>
            </div>
          </section>
        )}

        {currentStage === 1 && currentFractal && currentState && (
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
              {renderFractalTitle()}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#0F2D4A]">
              Fractal de Comportamento
            </h2>
            <p className="mt-2 text-slate-600">
              Leia a atividade apresentada e siga a orientação abaixo.
            </p>
            <div
              className="mt-6 select-none rounded-2xl border border-[#B98A2E]/40 bg-[#B98A2E]/10 p-6"
              onCopy={(event) => event.preventDefault()}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A671E]">
                Atividade apresentada pelo aplicador
              </p>
              <p className="mt-3 whitespace-pre-wrap text-base leading-7 text-slate-800">
                {currentFractal.activity}
              </p>
            </div>
            <p className="mt-6 rounded-xl bg-[#0F2D4A]/5 px-4 py-3 text-base font-bold leading-7 text-[#0F2D4A]">
              Escreva o texto acima no quadro abaixo.
            </p>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <textarea
                value={currentState.copiedActivity}
                onChange={(event) => updateFractal(currentFractalIndex, "copiedActivity", event.target.value)}
                onCopy={(event) => event.preventDefault()}
                onCut={(event) => event.preventDefault()}
                onPaste={(event) => event.preventDefault()}
                onDrop={(event) => event.preventDefault()}
                className={fieldClass("min-h-36")}
                placeholder="Digite aqui a atividade/fractal. Copiar e colar está bloqueado."
              />
            </div>
          </section>
        )}

        {currentStage === 2 && currentFractal && currentState && (
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
              {renderFractalTitle()}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#0F2D4A]">Registro das respostas</h2>
            <p className="mt-2 rounded-xl bg-[#0F2D4A]/5 px-4 py-3 text-base font-bold leading-7 text-[#0F2D4A]">
              Escreva três respostas espontâneas para a tarefa.
            </p>
            <div className="mt-8 grid gap-5">
              {[1, 2, 3].map((index) => (
                <label key={index}>
                  <span className={labelClass()}>{responseLabel(index)} *</span>
                  <textarea
                    value={responseByIndex(currentState, index)}
                    onChange={(event) =>
                      updateFractal(
                        currentFractalIndex,
                        index === 1 ? "response1" : index === 2 ? "response2" : "response3",
                        event.target.value
                      )
                    }
                    className={fieldClass("min-h-28")}
                  />
                </label>
              ))}
            </div>
          </section>
        )}

        {currentStage === 3 && currentState && (
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
              {renderFractalTitle()}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#0F2D4A]">Maior Importância</h2>
            <p className="mt-2 rounded-xl bg-[#0F2D4A]/5 px-4 py-3 text-base font-bold leading-7 text-[#0F2D4A]">
              Releia suas respostas e clique na que você considera de maior importância.
            </p>
            <div className="mt-8 grid gap-4">{[1, 2, 3].map((index) => renderResponseButton(index, "highest"))}</div>
          </section>
        )}

        {currentStage === 4 && currentState && (
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
              {renderFractalTitle()}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#0F2D4A]">Menor Importância</h2>
            <p className="mt-2 text-slate-600">
              Agora clique na resposta que você considera de menor importância.
            </p>
            <div className="mt-8 grid gap-4">{[1, 2, 3].map((index) => renderResponseButton(index, "lowest"))}</div>
          </section>
        )}

        {currentStage === 5 && currentState && (
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
              {renderFractalTitle()}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#0F2D4A]">Média Importância</h2>
            <p className="mt-2 text-slate-600">
              A resposta restante será considerada de média importância.
            </p>
            {remainingResponse(currentState) ? (
              <div className="mt-8 rounded-2xl border-2 border-[#0F2D4A] bg-[#0F2D4A]/5 p-5 text-slate-700 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B98A2E]">
                  {responseLabel(remainingResponse(currentState) ?? 1)}
                </p>
                <p className="mt-3 text-base font-semibold text-[#0F2D4A]">
                  {responseByIndex(currentState, remainingResponse(currentState) ?? 1)}
                </p>
                <p className="mt-3 font-bold text-[#0F2D4A]">Média Importância</p>
              </div>
            ) : null}
          </section>
        )}

        {currentStage === 6 && currentState && (
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
              {renderFractalTitle()}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#0F2D4A]">Justificativas</h2>
            <p className="mt-2 rounded-xl bg-[#0F2D4A]/5 px-4 py-3 text-base font-bold leading-7 text-[#0F2D4A]">
              Releia suas respostas e clique na que você considera de maior importância.
            </p>
            <p className="mt-3 text-slate-600">
              Para cada resposta, justifique o porquê da resposta apresentada e da hierarquia escolhida.
            </p>
            <div className="mt-8 space-y-6">
              {[1, 2, 3]
                .map((index) => ({ index, hierarchy: hierarchyMap(currentState)[index] }))
                .sort((a, b) => b.hierarchy - a.hierarchy)
                .map((item) => (
                  <div key={item.index} className="rounded-2xl border border-slate-200 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B98A2E]">
                      {hierarchyLabel(item.hierarchy)}
                    </p>
                    <p className="mt-3 font-semibold text-[#0F2D4A]">{responseLabel(item.index)}</p>
                    <p className="mt-2 text-slate-700">{responseByIndex(currentState, item.index)}</p>
                    <label className="mt-5 block">
                      <span className={labelClass()}>Justificativa *</span>
                      <textarea
                        value={justificationByIndex(currentState, item.index)}
                        onChange={(event) =>
                          updateFractal(
                            currentFractalIndex,
                            item.index === 1 ? "justification1" : item.index === 2 ? "justification2" : "justification3",
                            event.target.value
                          )
                        }
                        className={fieldClass("min-h-32")}
                      />
                    </label>
                  </div>
                ))}
            </div>
          </section>
        )}

        {currentStage === 7 && currentState && (
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
              {renderFractalTitle()}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#0F2D4A]">Reflexão após essa tarefa</h2>
            <label className="mt-8 block">
              <span className={labelClass()}>
                Agora pare, pense e escreva como você está sentindo-se após essa tarefa. *
              </span>
              <textarea
                value={currentState.finalFeeling}
                onChange={(event) => updateFractal(currentFractalIndex, "finalFeeling", event.target.value)}
                className={fieldClass("min-h-40")}
              />
            </label>
          </section>
        )}

        {currentStage === 8 && currentFractal && currentState && (
          <section>
            <h2 className="text-3xl font-bold text-[#0F2D4A]">
              Quadro resumo do {renderFractalTitle()}
            </h2>
            <div className="mt-4 rounded-2xl border border-[#B98A2E]/40 bg-[#B98A2E]/10 p-5 text-slate-700">
              <p className="font-bold text-[#0F2D4A]">Revise antes de continuar.</p>
              <p className="mt-2 leading-7">
                Confira a atividade digitada, as três respostas, as importâncias, as justificativas
                e a reflexão após essa tarefa. Caso queira alterar alguma informação deste fractal,
                utilize a opção <strong>Voltar</strong> antes de avançar ou concluir.
              </p>
            </div>
            <div className="mt-8">
              {renderFractalSummary(currentFractal, currentState)}
            </div>
          </section>
        )}
      </main>

      {!isLastFractalSummary ? (
        <p className="mt-8 text-[15px] font-semibold leading-6 text-[#0F2D4A]">
          Para seguir, clique em continuar.
        </p>
      ) : null}

      <footer className="mt-10 flex flex-col-reverse gap-4 border-t border-slate-200 pt-6 md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            goBack();
          }}
          disabled={step === 1 || isSubmitting}
          className={`rounded-xl px-6 py-3 font-semibold transition ${
            step === 1
              ? "cursor-not-allowed bg-slate-100 text-slate-400"
              : "border border-[#0F2D4A] bg-white text-[#0F2D4A] hover:bg-slate-50"
          }`}
        >
          Voltar
        </button>

        {!isLastFractalSummary ? (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              goNext();
            }}
            disabled={!canContinue()}
            className={`rounded-xl px-6 py-3 font-semibold transition ${
              canContinue()
                ? "bg-[#0F2D4A] text-white hover:opacity-90"
                : "cursor-not-allowed bg-slate-200 text-slate-500"
            }`}
          >
            {currentStage === 7
              ? "Revisar este fractal"
              : currentStage === 8
                ? "Continuar para o próximo fractal"
                : "Continuar"}
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-[#0F2D4A] px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Enviando avaliação..." : "Concluir Avaliação"}
          </button>
        )}
      </footer>
    </form>
  );
}
