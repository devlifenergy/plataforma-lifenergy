"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LIFENERGY_FRACTAL_MATRIX, findFractalMatrixItem } from "@/services/fractals/lifenergyFractalMatrix";
import { updateJourneyParticipant } from "@/services/journeys/actions";

type JourneyFractal = {
  position: number;
  activity: string;
  vortex: string;
  connection_point: string;
  fractal_code: string;
};

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
        const selected = findFractalMatrixItem(fractal.vortex, fractal.connection_point, fractal.fractal_code)?.fractal;
        return (
          <div key={fractal.position} className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="mb-3 font-semibold text-[#0F2D4A]">Fractal {fractal.position}</p>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-[15px] font-semibold text-slate-700">Vórtice *</span>
                <select name={`vortex_${fractal.position}`} required value={fractal.vortex} onChange={(e) => patch(index, { vortex: e.target.value, connection_point: "", fractal_code: "", activity: "" })} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
                  <option value="">Selecione</option>
                  {LIFENERGY_FRACTAL_MATRIX.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-[15px] font-semibold text-slate-700">Ponto de Conexão *</span>
                <select name={`connection_point_${fractal.position}`} required value={fractal.connection_point} disabled={!vortex} onChange={(e) => patch(index, { connection_point: e.target.value, fractal_code: "", activity: "" })} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100">
                  <option value="">Selecione</option>
                  {vortex?.connectionPoints.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-[15px] font-semibold text-slate-700">Fractal *</span>
                <select name={`fractal_code_${fractal.position}`} required value={fractal.fractal_code} disabled={!point} onChange={(e) => {
                  const code = e.target.value;
                  const found = findFractalMatrixItem(fractal.vortex, fractal.connection_point, code)?.fractal;
                  patch(index, { fractal_code: code, activity: found?.text ?? "" });
                }} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100">
                  <option value="">Selecione</option>
                  {point?.fractals.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                </select>
              </label>
            </div>
            {selected ? <p className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">{selected.text}</p> : null}
          </div>
        );
      })}

      <Button type="submit" className="w-full">Salvar alterações</Button>
    </form>
  );
}
