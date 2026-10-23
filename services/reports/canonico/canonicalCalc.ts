/** Transposição fiel de recalcular() de gerar_relatorio_openai.py.
 * O arquivo Python e o schema do usuário NÃO foram alterados.
 * Todo ajuste aqui é exclusivamente para executar no runtime Node da Vercel.
 */
import type { Atributo, RelatorioCanonico, Hierarquia } from "./canonicalTypes";

const ATRIBUTOS: Atributo[] = ["socializacao", "reflexao", "lazer", "proposito", "sentimento"];
const NOMES: Record<Atributo, string> = {
  socializacao: "Socialização", reflexao: "Reflexão", lazer: "Lazer",
  proposito: "Propósito", sentimento: "Sentimento",
};
const DEFINICOES: Record<string, string> = {
  "Socialização": "Interações com outros indivíduos, sejam familiares, amigos ou colegas de trabalho.",
  "Reflexão": "Reflexão interior sobre as questões de vida e aspectos maiores do contexto em que se habita.",
  "Lazer": "Atividades que promovem prazer e felicidade, ao ar livre ou em casa.",
  "Propósito": "Motivação pessoal e objetivos, ditando ambições, perspectivas de futuro e conquistas.",
  "Sentimento": "Equilíbrio emocional e relação positiva com os aspectos sentimentais internos e externos.",
};
const PESOS: Record<Hierarquia, number> = {
  "Maior importância": 3, "Média importância": 2, "Menor importância": 1,
};
const LIMIAR_RECORRENCIA = 0.30;
const PESO_F = 0.60, PESO_R = 0.25, PESO_C = 0.15;

// Python round(x, n) usa ties-to-even; diferenças de ponto flutuante muito próximas
// de um empate são verificadas por teste de paridade com o Python original.
function pythonRound(valor: number, casas: number): number {
  // CPython round(float, ndigits): arredondamento bancário sobre a fração binária
  // exata do IEEE-754 (não sobre valor*10**ndigits previamente arredondado).
  if (!Number.isFinite(valor)) throw new Error("Valor não numérico na memória de cálculo.");
  if (valor === 0) return 0;
  const buf = new ArrayBuffer(8);
  const view = new DataView(buf);
  view.setFloat64(0, Math.abs(valor));
  const bits = view.getBigUint64(0);
  const expBits = Number((bits >> BigInt(52)) & BigInt(0x7ff));
  let mantissa = bits & ((BigInt(1) << BigInt(52)) - BigInt(1));
  let expoente: number;
  if (expBits === 0) { expoente = -1022 - 52; }
  else { mantissa |= BigInt(1) << BigInt(52); expoente = expBits - 1023 - 52; }
  const fator = BigInt(10 ** casas);
  const numerador = mantissa * fator * (expoente >= 0 ? (BigInt(1) << BigInt(expoente)) : BigInt(1));
  const denominador = expoente < 0 ? BigInt(1) << BigInt(-expoente) : BigInt(1);
  let q = numerador / denominador;
  const resto = numerador % denominador;
  if (resto * BigInt(2) > denominador || (resto * BigInt(2) === denominador && q % BigInt(2) === BigInt(1))) q++;
  return Math.sign(valor) * Number(q) / Number(fator);
}
function halfUpPositivo(valor: number): number {
  // Equivalente de Decimal(str(valor)).quantize(Decimal('1'), ROUND_HALF_UP)
  // para percentuais não negativos.
  return Math.floor(valor + 0.5);
}
function rotulo(atributo: string, pct: number): string {
  if (pct >= 93) return "Predominante";
  if (pct >= 85) return "Forte";
  if (pct >= 72) return atributo === "Sentimento" ? "Equilibrado" : "Alto";
  if (pct >= 66) return "Bom nível";
  if (pct >= 50) return "Presente, porém secundário";
  return "Pouco expresso";
}

function sumPythonFloat(nums: number[]): number {
  // Python 3.12+ emprega soma compensada para floats; evita perda de precisão
  // da redução ingênua usada em JavaScript.
  let hi = 0, lo = 0;
  for (const item of nums) {
    const x = hi + item;
    const yr = x - hi;
    lo += (hi - (x - yr)) + (item - yr);
    hi = x;
  }
  return hi + lo;
}

export function recalcularCanonico(rel: RelatorioCanonico): string[] {
  const avisos: string[] = [];
  const todas: RelatorioCanonico["fractais"][number]["respostas"][number][] = [];
  const fortesPorFractal: Record<Atributo, number>[] = [];
  if (!rel.fractais.length) throw new Error("O modelo canônico exige pelo menos um fractal.");
  for (const fr of rel.fractais) {
    if (fr.respostas.length !== 3) throw new Error(`Fractal ${fr.numero}: esperadas exatamente três respostas.`);
    for (const r of fr.respostas) {
      if (!(r.hierarquia in PESOS)) throw new Error(`Hierarquia inválida no Fractal ${fr.numero}.`);
      r.peso = PESOS[r.hierarquia];
      for (const a of ATRIBUTOS) {
        if (!Number.isFinite(r.intensidades[a]) || r.intensidades[a] < 0 || r.intensidades[a] > 1 ||
            Math.abs(r.intensidades[a] * 20 - Math.round(r.intensidades[a] * 20)) > 1e-7) {
          throw new Error(`Intensidade ${a} fora dos múltiplos de 0,05 entre 0 e 1 no fractal ${fr.numero}.`);
        }
      }
    }
    const somaW = fr.respostas.reduce((s, r) => s + r.peso, 0);
    const forca = {} as Record<Atributo, number>;
    for (const a of ATRIBUTOS) {
      forca[a] = pythonRound(sumPythonFloat(fr.respostas.map(r => r.peso * r.intensidades[a])) / somaW, 3);
    }
    fr.forca_por_atributo = forca;
    fortesPorFractal.push(forca);
    todas.push(...fr.respostas);
  }
  const somaTotal = todas.reduce((s, r) => s + r.peso, 0);
  for (const a of ATRIBUTOS) {
    const calc = rel.calculo_atributos[a];
    if (!calc || !Number.isFinite(calc.C)) throw new Error(`Centralidade ${a} não informada.`);
    if (calc.C < 0 || calc.C > 1) throw new Error(`Centralidade ${a} fora de 0..1.`);
    const F = sumPythonFloat(todas.map(r => r.peso * r.intensidades[a])) / somaTotal;
    const R = fortesPorFractal.filter(f => f[a] >= LIMIAR_RECORRENCIA).length / rel.fractais.length;
    const pct = halfUpPositivo(100 * (PESO_F * F + PESO_R * R + PESO_C * calc.C));
    if (pct !== calc.percentual) {
      avisos.push(`${NOMES[a]}: modelo informou ${calc.percentual}%, cálculo correto é ${pct}%.`);
    }
    Object.assign(calc, { F_total: pythonRound(F, 3), R: pythonRound(R, 2), percentual: pct });
  }
  const textos = Object.fromEntries(rel.padroes_psicologicos.map(p => [p.atributo, p.manifestacao]));
  const rotModelo = Object.fromEntries(rel.padroes_psicologicos.map(p => [p.atributo, p.rotulo]));
  const tabela = ATRIBUTOS.map(a => {
    const nome = NOMES[a];
    const pct = rel.calculo_atributos[a].percentual;
    let rot = rotulo(nome, pct);
    if (String(rotModelo[nome] ?? "").startsWith(rot)) rot = rotModelo[nome];
    return {
      atributo: nome, definicao: DEFINICOES[nome], rotulo: rot,
      manifestacao: textos[nome] ?? "", percentual: pct,
    };
  });
  rel.padroes_psicologicos = tabela.sort((a, b) => b.percentual - a.percentual);
  if (avisos.length) avisos.push("Revise os textos que citam percentuais (interpretação e síntese).");
  return avisos;
}

