import type { LifenergyV1ReportData } from "./lifenergyV1Types";

export const LIFENERGY_V1_SYSTEM_PROMPT = `Você é o módulo de geração do Relatório Lifenergy V1.0.

Gere o relatório no mesmo padrão validado no projeto Laudos Lifenergy V2, retornando o conteúdo interpretativo para montagem em DOCX.

Referência de estrutura obrigatória:
1. Identificação
2. Registro de Aplicação
3. Registro de Dados – Resultado
   - Para cada fractal, gerar tabela com: Nº da resposta, Resposta, Hierarquia e Padrão de comportamento psicológico identificado.
   - Abaixo da tabela de cada fractal, gerar "Interpretação do Fractal X".
   - A seguir, gerar "Sugestões de desenvolvimento – Fractal X".
4. Síntese dos padrões psicológicos de comportamento recorrentes
5. Recomendações para desenvolvimento de habilidades
6. Categorização dos padrões de comportamento (0 a 100%)
   - Socialização
   - Reflexão
   - Lazer
   - Propósito
   - Sentimento
   - Leitura da métrica

Regras obrigatórias:
1. Escreva em português do Brasil.
2. Use linguagem técnica, humana, cuidadosa e semelhante ao relatório Lifenergy validado.
3. Não use linguagem diagnóstica médica, acusatória, patologizante ou determinista.
4. Não invente dados biográficos, clínicos ou profissionais que não estejam no material recebido.
5. Interprete a hierarquia como: 3 = maior importância, 2 = média importância, 1 = menor importância.
6. Use respostas, justificativas e reflexão final de cada fractal como base interpretativa.
7. Para cada resposta, escreva um padrão psicológico identificado breve, claro e específico.
8. Para cada fractal, escreva uma interpretação em um parágrafo e sugestões em outro parágrafo.
9. Quando houver mais de um fractal, cruze as informações na síntese, sem repetir mecanicamente o conteúdo de cada bloco.
10. Gere exatamente cinco atributos percentuais: Socialização, Reflexão, Lazer, Propósito e Sentimento.
11. Os percentuais devem ser coerentes com as respostas e variar de 0% a 100%.
12. A saída deve ser exclusivamente JSON válido, seguindo o schema solicitado.
13. Não inclua markdown, cercas de código ou comentários fora do JSON.`;

export function buildLifenergyV1UserPrompt(data: LifenergyV1ReportData) {
  return `Gere o conteúdo interpretativo do Relatório Lifenergy V1.0 completo para os dados abaixo.

O DOCX será montado com a seguinte estrutura:

RELATÓRIO LIFENERGY – DESENVOLVIMENTO HUMANO E ORGANIZACIONAL

1. Identificação
2. Registro de Aplicação
3. Registro de Dados – Resultado
   Para cada fractal:
   - tabela com Nº da resposta, Resposta, Hierarquia e Padrão de comportamento psicológico identificado;
   - Interpretação do Fractal X;
   - Sugestões de desenvolvimento – Fractal X.
4. Síntese dos padrões psicológicos de comportamento recorrentes
5. Recomendações para desenvolvimento de habilidades
6. Categorização dos padrões de comportamento (0 a 100%)
   Atributos obrigatórios: Socialização, Reflexão, Lazer, Propósito e Sentimento.
   Depois, escrever Leitura da métrica em um parágrafo.

DADOS DO AVALIADO E DA APLICAÇÃO:
${JSON.stringify(data, null, 2)}`;
}

export const lifenergyV1JsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fractal_analyses: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          position: { type: "number" },
          response_1_pattern: { type: "string" },
          response_2_pattern: { type: "string" },
          response_3_pattern: { type: "string" },
          interpretacao: { type: "string" },
          sugestoes: { type: "string" },
        },
        required: [
          "position",
          "response_1_pattern",
          "response_2_pattern",
          "response_3_pattern",
          "interpretacao",
          "sugestoes",
        ],
      },
    },
    sintese_padroes: { type: "string" },
    recomendacoes_habilidades: { type: "string" },
    atributos_percentuais: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          atributo: { type: "string" },
          percentual: { type: "string" },
        },
        required: ["atributo", "percentual"],
      },
    },
    leitura_metrica: { type: "string" },
  },
  required: [
    "fractal_analyses",
    "sintese_padroes",
    "recomendacoes_habilidades",
    "atributos_percentuais",
    "leitura_metrica",
  ],
} as const;
