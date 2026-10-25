/**
 * Consistencia numerica do DOCX: texto usa somente os percentuais finais
 * de calculo_atributos (ja recalculados pelo motor canônico).
 * Nao altera formula, intensidades, centralidade, respostas ou justificativas.
 */
import type { Atributo, RelatorioCanonico } from "./canonicalTypes";

const ATRIBUTOS: Atributo[] = ["socializacao", "reflexao", "lazer", "proposito", "sentimento"];
const NOMES: Record<Atributo, string> = {
  socializacao: "Socialização", reflexao: "Reflexão", lazer: "Lazer",
  proposito: "Propósito", sentimento: "Sentimento",
};
const REFERENCIA = "(?:Socializa(?:ç|c)(?:ão|ao)|Reflex(?:ã|a)o|Lazer|Prop(?:ó|o)sito|Sentimento)";
const ASSOCIADO_ANTES = new RegExp(
  "(" + REFERENCIA + ")([ \\t]*(?:\\([ \\t]*|[:=–—-][ \\t]*|(?:(?:é[ \\t]+de|atinge|alcança|apresenta|apresentou|registra|em|de|com)[ \\t]+))?)(\\d{1,3})([ \\t]*%)",
  "gi",
);
const ASSOCIADO_DEPOIS = new RegExp(
  "(\\d{1,3})([ \\t]*%)([ \\t]+(?:(?:de|em|para|no|na)[ \\t]+)?)(" + REFERENCIA + ")",
  "gi",
);
const PORCENTAGENS_TEXTUAIS = /\\d+(?:[.,]\\d+)?\\s*(?:%|por cento)/gi;

function atributoDe(nome: string): Atributo {
  const normalizado = nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const encontrado = ATRIBUTOS.find(a => a === normalizado);
  if (!encontrado) throw new Error("Atributo não reconhecido no texto: " + nome);
  return encontrado;
}

/**
 * Corrige apenas o numero das referências inequívocas a atributos.
 * Bloqueia valores soltos/ambiguos, em vez de adivinhar a qual atributo se referem.
 * Os campos originais do avaliado e as intensidades nao sao acessados.
 * Funciona tanto antes do armazenamento quanto no download de JSONs ja salvos.
 */
export function harmonizarPercentuaisCanonicos(rel: RelatorioCanonico): number {
  const definitivos = {} as Record<Atributo, number>;
  for (const atributo of ATRIBUTOS) {
    const numero = rel.calculo_atributos[atributo]?.percentual;
    if (!Number.isInteger(numero) || numero < 0 || numero > 100) {
      throw new Error("Percentual final inválido: " + NOMES[atributo]);
    }
    definitivos[atributo] = numero;
  }
  for (const item of rel.padroes_psicologicos) {
    const atributo = atributoDe(item.atributo);
    if (item.percentual !== definitivos[atributo]) {
      throw new Error("Tabela difere do cálculo definitivo para " + item.atributo);
    }
  }

  let corrigidos = 0;
  function ajustar(campo: string, texto: string): string {
    const total = (texto.match(PORCENTAGENS_TEXTUAIS) || []).length;
    let associados = 0;
    const primeiro = texto.replace(
      ASSOCIADO_ANTES,
      (_trecho, nome: string, separador: string, antigo: string, sinal: string) => {
        associados++;
        const final = String(definitivos[atributoDe(nome)]);
        if (final !== antigo) corrigidos++;
        return nome + separador + final + sinal;
      },
    );
    const ajustado = primeiro.replace(
      ASSOCIADO_DEPOIS,
      (_trecho, antigo: string, sinal: string, separador: string, nome: string) => {
        associados++;
        const final = String(definitivos[atributoDe(nome)]);
        if (final !== antigo) corrigidos++;
        return final + sinal + separador + nome;
      },
    );
    if (associados !== total) {
      throw new Error(
        "Referência percentual não associada inequivocamente a um atributo em " +
        campo + ". Relatório bloqueado para evitar divergência numérica.",
      );
    }
    return ajustado;
  }

  // Exclusivamente textos produzidos pela IA. Nunca alterar justificativas.
  rel.sintese_fractais = ajustar("sintese_fractais", rel.sintese_fractais);
  rel.interpretacao_padroes = ajustar("interpretacao_padroes", rel.interpretacao_padroes);
  rel.sintese_resultados = ajustar("sintese_resultados", rel.sintese_resultados);
  rel.recomendacoes = ajustar("recomendacoes", rel.recomendacoes);
  for (const padrao of rel.padroes_psicologicos) {
    padrao.manifestacao = ajustar("padroes_psicologicos.manifestacao", padrao.manifestacao);
  }
  for (const fractal of rel.fractais) {
    for (const resposta of fractal.respostas) {
      resposta.padrao_nome = ajustar("fractais.padrao_nome", resposta.padrao_nome);
      resposta.padrao_interpretacao = ajustar("fractais.padrao_interpretacao", resposta.padrao_interpretacao);
    }
  }
  return corrigidos;
}
