import test from "node:test";
import assert from "node:assert/strict";
import { harmonizarPercentuaisCanonicos } from "./canonicalConsistency.ts";

function exemplo() {
  const values = {
    socializacao: 83, sentimento: 80, reflexao: 73, proposito: 73, lazer: 39,
  };
  const rotulos = {
    socializacao: "Socialização", sentimento: "Sentimento", reflexao: "Reflexão",
    proposito: "Propósito", lazer: "Lazer",
  };
  return {
    calculo_atributos: Object.fromEntries(Object.entries(values).map(([k, percentual]) => [
      k, { F_total: 0.53, R: 1, C: 0.73, percentual },
    ])),
    padroes_psicologicos: Object.entries(rotulos).map(([k, atributo]) => ({
      atributo, definicao: "Texto original", rotulo: "Alto", manifestacao: "Sem números",
      percentual: values[k],
    })),
    sintese_fractais: "Texto do item 4 sem percentuais.",
    interpretacao_padroes:
      "Socialização (85%) é o atributo mais forte. Sentimento (81%) também se destaca. " +
      "Reflexão (76%) e Propósito (74%) aparecem em níveis altos. Lazer (59%) é o menor.",
    sintese_resultados: "Lazer: 59% e 83% de Socialização.",
    recomendacoes: "Texto sem números.",
    fractais: [{
      respostas: [{
        justificativa: "Ganhei 59% por um projeto pessoal",
        intensidades: { socializacao: 0.5, sentimento: 0.5, reflexao: 0.5, proposito: 0.5, lazer: 0.5 },
        padrao_nome: "Padrão original",
        padrao_interpretacao: "O Sentimento (81%) é mencionado.",
      }],
    }],
  };
}

test("corrige divergencia real entre tabela e paragrafo, preservando texto", () => {
  const r = exemplo();
  const calcAntes = JSON.stringify(r.calculo_atributos);
  const entradaAntes = JSON.stringify(r.fractais[0].respostas[0].intensidades);
  const justificativaAntes = r.fractais[0].respostas[0].justificativa;
  assert.equal(harmonizarPercentuaisCanonicos(r), 8);
  assert.equal(r.interpretacao_padroes,
    "Socialização (83%) é o atributo mais forte. Sentimento (80%) também se destaca. " +
    "Reflexão (73%) e Propósito (73%) aparecem em níveis altos. Lazer (39%) é o menor.");
  assert.equal(r.sintese_resultados, "Lazer: 39% e 83% de Socialização.");
  assert.equal(r.fractais[0].respostas[0].padrao_interpretacao, "O Sentimento (80%) é mencionado.");
  assert.equal(JSON.stringify(r.calculo_atributos), calcAntes);
  assert.equal(JSON.stringify(r.fractais[0].respostas[0].intensidades), entradaAntes);
  assert.equal(r.fractais[0].respostas[0].justificativa, justificativaAntes);
});
test("download de documento ja coerente e idempotente", () => {
  const r = exemplo();
  harmonizarPercentuaisCanonicos(r);
  assert.equal(harmonizarPercentuaisCanonicos(r), 0);
});
test("recusa percentual isolado para evitar troca por associacao errada", () => {
  const r = exemplo();
  r.recomendacoes = "O resultado de 59% foi citado sem atributo.";
  assert.throws(() => harmonizarPercentuaisCanonicos(r), /não associada/);
});
test("recusa divergencia entre memoria de calculo e tabela", () => {
  const r = exemplo();
  r.padroes_psicologicos[0].percentual = 75;
  assert.throws(() => harmonizarPercentuaisCanonicos(r), /Tabela difere/);
});
