"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LIFENERGY_FRACTAL_MATRIX } from "@/services/fractals/lifenergyFractalMatrix";
import { updateJourneyParticipant } from "@/services/journeys/actions";

type JourneyFractal = {
  position: number;
  activity: string;
  vortex: string;
  connection_point: string;
  fractal_code: string;
};

function fractalDisplayText(value: string) {
  return String(value || "").replace(/^\s*\d+\.\s*/, "").trim();
}

type Props = {
  journeyId: string;
  participantName: string;
  participantEmail: string;
  participantCpf: string;
  participantNaturalidade: string;
  participantBirthDate: string;
  participantObjective: string;
  fractals: JourneyFractal[];
};

export function EditJourneyForm(props: Props) {
  const [fractals, setFractals] = useState<JourneyFractal[]>(props.fractals);

  function patch(index: number, values: Partial<JourneyFractal>) {
    setFractals((current) => current.map((item, i) => (i === index ? { ...item, ...values } : item)));
  }

  return (
    <form action={updateJourneyParticipant} className="space-y-3">
      <input type="hidden" name="journey_id" value={props.journeyId} />
      <input type="hidden" name="participant_cpf" value={props.participantCpf} />
      <input type="hidden" name="participant_naturalidade" value={props.participantNaturalidade} />
      <input type="hidden" name="participant_birth_date" value={props.participantBirthDate} />
      <input type="hidden" name="participant_objective" value={props.participantObjective} />
      <input type="hidden" name="fractal_count" value={fractals.length} />

      <Input name="participant_name" label="Nome do avaliado *" defaultValue={props.participantName} required />
      <Input name="participant_email" label="E-mail" type="email" defaultValue={props.participantEmail} />

      {fractals.map((fractal, index) => {
        const vortex = LIFENERGY_FRACTAL_MATRIX.find((item) => item.id === fractal.vortex);
        const point = vortex?.connectionPoints.find((item) => item.id === fractal.connection_point);
        return (
          <div key={fractal.position} className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="mb-3 font-semibold text-[#0F2D4A]">Fractal {fractal.position}</p>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[15px] font-semibold text-slate-700">Vórtice *</span>
                <select name={`vortex_${fractal.position}`} required value={fractal.vortex} onChange={(e) => patch(index, { vortex: e.target.value, connection_point: "", fractal_code: "", activity: "" })} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
                  <option value="">Selecione</option>
                  {LIFENERGY_FRACTAL_MATRIX.map((item) => <option key={item.id} value={item.id}>{fractalDisplayText(item.title)}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-[15px] font-semibold text-slate-700">Ponto de Conexão *</span>
                <select name={`connection_point_${fractal.position}`} required value={fractal.connection_point} disabled={!vortex} onChange={(e) => patch(index, { connection_point: e.target.value, fractal_code: "", activity: "" })} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100">
                  <option value="">Selecione</option>
                  {vortex?.connectionPoints.map((item) => <option key={item.id} value={item.id}>{fractalDisplayText(item.title)}</option>)}
                </select>
              </label>
              <fieldset className="md:col-span-2">
                <legend className="mb-2 block text-[15px] font-semibold text-slate-700">Fractal de Comportamento *</legend>
                {!point ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-500">
                    Selecione primeiro o Vórtice e o Ponto de Conexão.
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {point.fractals.map((item) => {
                      const checked = fractal.fractal_code === item.id;
                      const alreadySelected = fractals.some(
                        (otherFractal, otherIndex) =>
                          otherIndex !== index && otherFractal.fractal_code === item.id
                      );

                      return (
                        <label
                          key={item.id}
                          className={`block rounded-xl border px-4 py-3 text-sm leading-6 transition ${
                            checked
                              ? "border-[#B8860B] bg-[#B8860B]/5 ring-2 ring-[#B8860B]/15"
                              : alreadySelected
                                ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 opacity-60"
                                : "cursor-pointer border-slate-300 bg-white hover:border-slate-400"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`fractal_code_${fractal.position}`}
                            value={item.id}
                            checked={checked}
                            required
                            disabled={alreadySelected}
                            onChange={() => patch(index, { fractal_code: item.id, activity: item.text })}
                            className="sr-only"
                          />
                          <span className={alreadySelected ? "text-slate-400" : "text-slate-800"}>
                            {fractalDisplayText(item.title)}
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

      <Button type="submit" className="w-full">Salvar alterações</Button>
    </form>
  );
}
