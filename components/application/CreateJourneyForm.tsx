"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LIFENERGY_FRACTAL_MATRIX } from "@/services/fractals/lifenergyFractalMatrix";
import { createJourney } from "@/services/journeys/actions";
import { BRAZILIAN_STATES } from "@/lib/brazil";
import { formatCpf, isValidCpf, isValidEmail, onlyDigits } from "@/lib/validation";

type ApplicatorOption = {
  id: string;
  name: string;
};

type CreateJourneyFormProps = {
  applicators: ApplicatorOption[];
};

type FractalSelection = {
  vortexId: string;
  connectionPointId: string;
  fractalId: string;
};

const FRACTAL_OPTIONS = [1, 2, 3];
function fractalDisplayText(value: string) {
  return String(value || "").replace(/^\s*\d+\.\s*/, "").trim();
}

const EMPTY_SELECTION: FractalSelection = { vortexId: "", connectionPointId: "", fractalId: "" };

function formatDateBr(value: string) {
  const digits = onlyDigits(value).slice(0, 8);
  return digits
    .replace(/^(\d{2})(\d)/, "$1/$2")
    .replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
}

function normalizeSelections(count: number, current: FractalSelection[]) {
  return Array.from({ length: count }, (_, index) => current[index] ?? { ...EMPTY_SELECTION });
}

export function CreateJourneyForm({ applicators }: CreateJourneyFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [fractalCount, setFractalCount] = useState(1);
  const [selections, setSelections] = useState<FractalSelection[]>([{ ...EMPTY_SELECTION }]);
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [participantEmail, setParticipantEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function setCount(value: number) {
    setFractalCount(value);
    setSelections((current) => normalizeSelections(value, current));
  }

  function updateSelection(index: number, patch: Partial<FractalSelection>) {
    setSelections((current) =>
      normalizeSelections(fractalCount, current).map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    );
  }

  function resetFormState() {
    formRef.current?.reset();
    setFractalCount(1);
    setSelections([{ ...EMPTY_SELECTION }]);
    setCpf("");
    setBirthDate("");
    setParticipantEmail("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPending) return;

    const formData = new FormData(event.currentTarget);

    if (!isValidCpf(String(formData.get("participant_cpf") || ""))) {
      setError("Informe um CPF válido.");
      return;
    }
    if (!isValidEmail(String(formData.get("participant_email") || ""))) {
      setError("Informe um e-mail válido.");
      return;
    }

    setError(null);
    setSuccess(false);

    startTransition(async () => {
      try {
        await createJourney(formData);
        resetFormState();
        setSuccess(true);
        router.refresh();
      } catch (caughtError) {
        const message =
          caughtError instanceof Error
            ? caughtError.message
            : "Não foi possível criar o convite.";
        setError(message);
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="fractal_count" value={fractalCount} />

      <section className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">
            Aplicador *
          </span>

          <select
            name="applicator_id"
            required
            disabled={isPending}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base leading-6 text-slate-900 outline-none transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20"
          >
            <option value="">Selecione</option>
            {applicators.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <Input name="participant_name" label="Nome completo do avaliado *" required disabled={isPending} />
        <label className="block">
          <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">E-mail *</span>
          <input name="participant_email" type="email" required disabled={isPending} value={participantEmail} onChange={(event) => setParticipantEmail(event.target.value)} aria-invalid={participantEmail ? !isValidEmail(participantEmail) : undefined} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base leading-6 text-slate-900 outline-none transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20" />
          {participantEmail && !isValidEmail(participantEmail) ? <span className="mt-1 block text-xs font-medium text-red-600">Informe um e-mail válido.</span> : null}
        </label>
        <label className="block">
          <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">
            CPF *
          </span>
          <input
            name="participant_cpf"
            value={cpf}
            onChange={(event) => setCpf(formatCpf(event.target.value))}
            required
            disabled={isPending}
            inputMode="numeric"
            maxLength={14}
            aria-invalid={cpf.length === 14 ? !isValidCpf(cpf) : undefined}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base leading-6 text-slate-900 outline-none transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20"
          />
          {cpf.length === 14 && !isValidCpf(cpf) ? <span className="mt-1 block text-xs font-medium text-red-600">CPF inválido.</span> : null}
        </label>
        <Input
          name="participant_city"
          label="Cidade *"
          required
          disabled={isPending}
        />
        <label className="block">
          <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">Estado *</span>
          <select name="participant_state" required disabled={isPending} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base leading-6 text-slate-900 outline-none transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20">
            <option value="">Selecione</option>
            {BRAZILIAN_STATES.map((state) => <option key={state} value={state}>{state}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">
            Data de nascimento *
          </span>
          <input
            name="participant_birth_date"
            value={birthDate}
            onChange={(event) => setBirthDate(formatDateBr(event.target.value))}
            required
            disabled={isPending}
            inputMode="numeric"
            maxLength={10}
            placeholder="dd/mm/aaaa"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base leading-6 text-slate-900 outline-none transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20"
          />
        </label>
        <label className="block md:col-span-3">
          <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">
            Objetivo de participação *
          </span>
          <textarea
            name="participant_objective"
            required
            rows={3}
            disabled={isPending}
            className="min-h-24 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-base leading-7 text-slate-900 outline-none transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20"
          />
        </label>
      </section>

      <fieldset className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <legend className="px-2 text-[15px] font-bold leading-6 text-[#0F2D4A]">
          Quantos Fractais de Comportamento deseja aplicar neste link?
        </legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {FRACTAL_OPTIONS.map((option) => (
            <label
              key={option}
              className={`cursor-pointer rounded-xl border px-4 py-3 text-base font-semibold transition ${
                fractalCount === option
                  ? "border-[#0F2D4A] bg-[#0F2D4A] text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-[#B8860B]"
              }`}
            >
              <input
                type="radio"
                name="fractal_count_choice"
                value={option}
                checked={fractalCount === option}
                disabled={isPending}
                onChange={() => setCount(option)}
                className="sr-only"
              />
              {option === 1 ? "1 Fractal" : `${option} Fractais`}
            </label>
          ))}
        </div>
        <p className="mt-3 text-[15px] leading-6 text-slate-600">
          O aplicador escolhe cada atividade dentro da matriz Lifenergy: Vórtice, Ponto de Conexão e Fractal de Comportamento.
        </p>
      </fieldset>

      <section className="space-y-4">
        {Array.from({ length: fractalCount }, (_, index) => {
          const position = index + 1;
          const selection = selections[index] ?? EMPTY_SELECTION;
          const selectedVortex = LIFENERGY_FRACTAL_MATRIX.find((item) => item.id === selection.vortexId);
          const selectedPoint = selectedVortex?.connectionPoints.find((item) => item.id === selection.connectionPointId);

          return (
            <div key={position} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-lg font-bold text-[#0F2D4A]">Fractal {position}</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">
                    Vórtice *
                  </span>
                  <select
                    name={`vortex_${position}`}
                    required
                    value={selection.vortexId}
                    disabled={isPending}
                    onChange={(event) =>
                      updateSelection(index, {
                        vortexId: event.target.value,
                        connectionPointId: "",
                        fractalId: "",
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base leading-6 text-slate-900 outline-none transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20"
                  >
                    <option value="">Selecione</option>
                    {LIFENERGY_FRACTAL_MATRIX.map((vortex) => (
                      <option key={vortex.id} value={vortex.id}>
                        {vortex.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">
                    Ponto de Conexão *
                  </span>
                  <select
                    name={`connection_point_${position}`}
                    required
                    value={selection.connectionPointId}
                    disabled={isPending || !selectedVortex}
                    onChange={(event) =>
                      updateSelection(index, {
                        connectionPointId: event.target.value,
                        fractalId: "",
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base leading-6 text-slate-900 outline-none transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20"
                  >
                    <option value="">Selecione</option>
                    {selectedVortex?.connectionPoints.map((point) => (
                      <option key={point.id} value={point.id}>
                        {point.title}
                      </option>
                    ))}
                  </select>
                </label>

                <fieldset className="md:col-span-2">
                  <legend className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">
                    Fractal de Comportamento *
                  </legend>
                  {!selectedPoint ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-[15px] leading-6 text-slate-500">
                      Selecione primeiro o Vórtice e o Ponto de Conexão.
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {selectedPoint.fractals.map((fractal) => {
                        const checked = selection.fractalId === fractal.id;
                        const alreadySelected = selections.some(
                          (otherSelection, otherIndex) =>
                            otherIndex !== index && otherSelection.fractalId === fractal.id
                        );
                        const disabled = isPending || alreadySelected;

                        return (
                          <label
                            key={fractal.id}
                            className={`block rounded-xl border px-4 py-4 text-[15px] leading-6 transition ${
                              checked
                                ? "border-[#B8860B] bg-[#B8860B]/5 ring-2 ring-[#B8860B]/15"
                                : alreadySelected
                                  ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 opacity-60"
                                  : "cursor-pointer border-slate-300 bg-white hover:border-slate-400"
                            } ${isPending ? "cursor-not-allowed opacity-60" : ""}`}
                          >
                            <input
                              type="radio"
                              name={`fractal_code_${position}`}
                              value={fractal.id}
                              checked={checked}
                              required
                              disabled={disabled}
                              onChange={() => updateSelection(index, { fractalId: fractal.id })}
                              className="sr-only"
                            />
                            <span className={alreadySelected ? "text-slate-400" : "text-slate-800"}>
                              {fractalDisplayText(fractal.title)}
                              {alreadySelected ? (
                                <span className="ml-2 font-semibold">(já selecionado neste link)</span>
                              ) : null}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </fieldset>
              </div>

            </div>
          );
        })}
      </section>

      {success ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-[15px] font-medium leading-6 text-emerald-700">
          Convite criado com sucesso. Os campos foram limpos para evitar links repetidos.
        </p>
      ) : null}

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-[15px] font-medium leading-6 text-red-700">
          {error}
        </p>
      ) : null}

      <div className="flex justify-end border-t border-slate-200 pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Criando..." : "Criar Convite"}
        </Button>
      </div>
    </form>
  );
}
