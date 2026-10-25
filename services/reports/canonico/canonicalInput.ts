/** Ponte de leitura da jornada da Release 1.5.17 para a entrada canônica. */
import type { LifenergyV1ReportData } from "../lifenergyV1Types";
import type { Hierarquia } from "./canonicalTypes";
const texto = (x: unknown) => String(x ?? "").trim();
const preencher = (x: unknown) => texto(x) || "A preencher";
function dateBR(raw: unknown) {
  const x = texto(raw);
  const m = x.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : (x || "A preencher");
}
function nomeHierarquia(n: number): Hierarquia {
  if (n === 3) return "Maior importância";
  if (n === 2) return "Média importância";
  if (n === 1) return "Menor importância";
  throw new Error(`Hierarquia ${n} inválida na resposta.`);
}
function escolha(raw: unknown) {
  const n = texto(raw);
  if (["aplicador", "O aplicador"].includes(n)) return "Aplicador/instrutor";
  if (["propria_pessoa", "A própria pessoa"].includes(n)) return "A própria pessoa";
  return n || "A preencher";
}
export function prepararEntradaCanonica(data: LifenergyV1ReportData) {
  if (!data.fractals.length) throw new Error("Não há fractais disponíveis para geração.");
  return {
    identificacao: {
      nome: preencher(data.response.full_name), cpf: preencher(data.response.cpf),
      email: preencher(data.response.email), data_nascimento: dateBR(data.response.birth_date),
      naturalidade: preencher(data.response.naturalidade),
      objetivo_participacao: preencher(data.response.participation_objective),
    },
    registro_aplicacao: {
      aplicador: preencher(data.response.applicator_name || data.journey.applicator_name),
      escolha_atividade: escolha(data.response.activity_choice),
      // O dado inicial_time não expressa duração: não inventar tempo de resposta.
      tempo_resposta: "A preencher",
      data_aplicacao: dateBR(data.response.application_date),
      fractais_aplicados: data.fractals.map(f => `Fractal ${f.position} — ${texto(f.presentedActivity || f.copiedActivity)}`),
    },
    fractais: data.fractals.map(f => {
      if (f.responses.length !== 3) throw new Error(`Fractal ${f.position} sem três respostas.`);
      const sorted = [...f.responses].sort((a, b) => b.hierarchy - a.hierarchy);
      if (new Set(sorted.map(r => r.hierarchy)).size !== 3 || sorted.some(r => ![1,2,3].includes(r.hierarchy))) {
        throw new Error(`Fractal ${f.position}: hierarquia 3/2/1 inconsistente.`);
      }
      return {
        numero: Number(f.position),
        enunciado: texto(f.presentedActivity || f.copiedActivity),
        respostas: sorted.map((r, i) => ({
          numero: i + 1, resposta: texto(r.response),
          hierarquia: nomeHierarquia(r.hierarchy), peso: r.hierarchy,
          justificativa: texto(r.justification),
        })),
      };
    }),
  };
}
