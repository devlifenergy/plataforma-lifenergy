/** Ponte Node/Vercel: script Python e schema originais, prompt com APENAS ajuste de formato autorizado. */
import type { LifenergyV1ReportData } from "../lifenergyV1Types";
import type { RelatorioCanonico } from "./canonicalTypes";
import { prepararEntradaCanonica } from "./canonicalInput";
import { recalcularCanonico } from "./canonicalCalc";
import { harmonizarPercentuaisCanonicos } from "./canonicalConsistency";
import { CANONICAL_SYSTEM_PROMPT } from "./systemPrompt";
import schema from "./relatorio_lifenergy_schema.json";

function normalizar(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}
function validarSaida(data: LifenergyV1ReportData, saida: RelatorioCanonico) {
  if (!saida || !saida.identificacao || !saida.registro_aplicacao || !Array.isArray(saida.fractais) ||
      !saida.calculo_atributos || !Array.isArray(saida.padroes_psicologicos) ||
      typeof saida.sintese_fractais !== "string" || typeof saida.interpretacao_padroes !== "string" ||
      typeof saida.sintese_resultados !== "string" || typeof saida.recomendacoes !== "string") {
    throw new Error("Resposta da OpenAI não satisfaz os campos obrigatórios do schema canônico.");
  }
  if (normalizar(saida.identificacao.nome) !== normalizar(data.response.full_name)) {
    throw new Error("Nome de identificação divergente do cadastro: relatório recusado para não trocar avaliados.");
  }
  if (saida.fractais.length !== data.fractals.length) throw new Error("Quantidade de fractais divergente.");
  const input = prepararEntradaCanonica(data);
  for (let i = 0; i < saida.fractais.length; i++) {
    const fr = saida.fractais[i], ref = input.fractais[i];
    if (fr.numero !== ref.numero || !Array.isArray(fr.respostas) || fr.respostas.length !== 3) {
      throw new Error(`Fractal ${i + 1}: estrutura incompleta.`);
    }
    for (let j = 0; j < fr.respostas.length; j++) {
      const r = fr.respostas[j], original = ref.respostas[j];
      if (r.hierarquia !== original.hierarquia || normalizar(r.resposta) !== normalizar(original.resposta)) {
        throw new Error(`Fractal ${i + 1}, resposta ${j + 1}: dados de entrada modificados.`);
      }
      if (!r.padrao_nome || !r.padrao_interpretacao) throw new Error(`Fractal ${i + 1}, resposta ${j + 1}: interpretação não produzida.`);
    }
  }
  if (saida.padroes_psicologicos.length !== 5) throw new Error("Seção 5 não contém cinco padrões.");
  const corpo = [saida.sintese_fractais, saida.interpretacao_padroes, saida.sintese_resultados,
    saida.recomendacoes, ...saida.fractais.flatMap(fr => fr.respostas.map(r => r.padrao_interpretacao))].join(" ");
  const nome = normalizar(data.response.full_name);
  if (nome.length >= 5 && normalizar(corpo).includes(nome)) {
    throw new Error("Nome completo encontrado no texto interpretativo; geração recusada.");
  }
}

export async function gerarRelatorioCanonico(data: LifenergyV1ReportData): Promise<{
  relatorio: RelatorioCanonico; modelo: string; avisos: string[];
}> {
  const apiKey = process.env.OPENAI_API_KEY;
  const modelo = process.env.OPENAI_CANONICAL_MODEL;
  if (!apiKey) throw new Error("OPENAI_API_KEY não configurada no Sandbox.");
  if (!modelo) throw new Error("OPENAI_CANONICAL_MODEL ausente: o modelo não foi especificado pelo padrão fornecido.");
  if (!CANONICAL_SYSTEM_PROMPT.trim()) {
    throw new Error("prompt_sistema.txt canônico não foi fornecido; geração bloqueada para preservar a metodologia.");
  }
  const entrada = prepararEntradaCanonica(data);
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: modelo,
      temperature: 0,
      messages: [
        { role: "system", content: CANONICAL_SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify(entrada, null, 2) },
      ],
      response_format: { type: "json_schema", json_schema: schema },
    }),
    cache: "no-store",
  });
  const payload: any = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error?.message ?? "Falha na API OpenAI do motor canônico.");
  const msg = payload?.choices?.[0]?.message;
  if (msg?.refusal) throw new Error(`OpenAI recusou gerar este relatório: ${msg.refusal}`);
  if (!msg?.content || typeof msg.content !== "string") throw new Error("OpenAI não retornou JSON canônico.");
  let relatorio: RelatorioCanonico;
  try { relatorio = JSON.parse(msg.content) as RelatorioCanonico; }
  catch { throw new Error("OpenAI retornou JSON inválido."); }
  validarSaida(data, relatorio);
  const avisos = recalcularCanonico(relatorio);  // formula e intensidades canônicas preservadas
  const corrigidos = harmonizarPercentuaisCanonicos(relatorio);
  if (corrigidos > 0) avisos.push(`Referências percentuais harmonizadas no texto: ${corrigidos}.`);
  return { relatorio, modelo, avisos };
}
