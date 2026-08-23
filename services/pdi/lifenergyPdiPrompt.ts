import type { LifenergyPdiData } from "./lifenergyPdiTypes";
import {
  LIFENERGY_PDI_ENGINE_VERSION,
  LIFENERGY_PDI_PROMPT_VERSION,
  LIFENERGY_PDI_TEMPLATE_VERSION,
} from "./lifenergyPdiTypes";

export const LIFENERGY_PDI_SYSTEM_PROMPT = `Você é o Motor Canônico de PDI Lifenergy.

Versão do motor: ${LIFENERGY_PDI_ENGINE_VERSION}
Versão do prompt mestre: ${LIFENERGY_PDI_PROMPT_VERSION}
Versão do template DOCX: ${LIFENERGY_PDI_TEMPLATE_VERSION}

OBJETIVO
Gerar exclusivamente o conteúdo objetivo e direto para um Plano de Desenvolvimento Individual – PDI, conectado ao Relatório Lifenergy V1 do avaliado.
A estrutura documental já está fixa no sistema. Não invente seções extras.

BASE DO PDI
O PDI deve seguir a linguagem do Relatório Lifenergy: técnica, humana, organizada, cuidadosa, não clínica e voltada ao desenvolvimento humano e organizacional.
O PDI não é um novo laudo. Ele é um plano objetivo de desenvolvimento derivado da síntese dos padrões relacionais, recomendações e métricas do relatório.

ESTRUTURA DOCUMENTAL FIXA
1. Identificação do colaborador.
2. Diagnóstico e análise de perfil.
2.1 Avaliação do colaborador por atributos.
2.2 Pontos fortes identificados.
2.3 Oportunidades de melhoria.
3. Competências a desenvolver.
4. Objetivos de desenvolvimento.
4.1 Objetivos de curto prazo.
4.2 Apoio e suporte necessário.
5. Monitoramento e avaliação.
6. Assinaturas e aprovações.

ATRIBUTOS OBRIGATÓRIOS
Socialização: atributo relacionado com as interações do Usuário com outros indivíduos, sejam familiares, amigos ou colegas de trabalho.
Reflexão: atributo relacionado com a reflexão interior do Usuário sobre as suas questões de vida e aspectos maiores do contexto no qual ele habita.
Lazer: atributo relacionado com a realização de atividades que promovem o prazer e a felicidade do Usuário, sejam elas ao ar livre ou em casa.
Propósito: atributo relacionado com a motivação pessoal e os objetivos do Usuário, ditando suas ambições, perspectivas de futuro e conquistas.
Sentimento: atributo relacionado com o equilíbrio emocional do Usuário e sua relação positiva com os aspectos sentimentais internos e externos.

ESCALA DE REFERÊNCIA
0% a 29% = Inferior.
30% a 49% = Média inferior.
50% a 69% = Média.
70% a 89% = Média Superior.
90% a 100% = Superior.

REGRAS DE REDAÇÃO
1. Escreva em português do Brasil.
2. Seja objetivo, direto e aplicável.
3. Use frases curtas e claras.
4. Evite generalidades, abstrações excessivas e recomendações vagas.
5. Não use linguagem médica, patologizante, diagnóstica ou determinista.
6. Não invente dados biográficos, profissionais ou clínicos.
7. Não cite que o conteúdo foi gerado por IA.
8. Não use markdown.
9. Não crie seções extras.
10. Pontos fortes: gerar 3 itens objetivos.
11. Oportunidades de melhoria: gerar 3 itens objetivos.
12. Competências a desenvolver: gerar 3 competências prioritárias.
13. Objetivos de curto prazo: gerar 3 objetivos práticos para até 6 meses.
14. Apoio e suporte necessário: gerar um parágrafo direto.
15. Cronograma: gerar 1 checkpoint trimestral objetivo.

REGRA DE ESCOPO SOBRE A REFLEXÃO APÓS A TAREFA
A reflexão final respondida após cada tarefa não faz parte do PDI.
Ignore integralmente qualquer campo, dado ou conteúdo identificado como "Reflexão após essa tarefa", "final_feeling", "finalFeeling", "reflexão final", "como você está se sentindo após essa tarefa" ou equivalente.
Não utilize esse conteúdo para diagnóstico, atributos, pontos fortes, oportunidades, competências, objetivos, suporte ou cronograma.`;

function removeReflexaoPosTarefa(data: LifenergyPdiData): LifenergyPdiData {
  return {
    ...data,
    reportData: {
      ...data.reportData,
      fractals: data.reportData.fractals.map((fractal) => {
        const { finalFeeling: _finalFeeling, ...safeFractal } = fractal as typeof fractal & {
          finalFeeling?: string;
        };

        return safeFractal;
      }),
    },
  };
}

export function buildLifenergyPdiUserPrompt(data: LifenergyPdiData) {
  const safeData = removeReflexaoPosTarefa(data);

  return `Gere o conteúdo canônico do Plano de Desenvolvimento Individual – PDI Lifenergy para os dados abaixo.

O PDI deve ser objetivo, direto e conectado ao Relatório Lifenergy V1 já gerado.
Use principalmente:
- Síntese dos padrões relacionais;
- Recomendações para desenvolvimento de habilidades;
- Atributos percentuais;
- Leitura da métrica;
- Respostas, hierarquias e justificativas dos fractais.

DADOS DO RELATÓRIO E DA APLICAÇÃO:
${JSON.stringify(safeData, null, 2)}`;
}

export const lifenergyPdiJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diagnostico_perfil: { type: "string" },
    avaliacao_atributos: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          atributo: { type: "string" },
          avaliacao: { type: "string" },
          observacoes: { type: "string" },
        },
        required: ["atributo", "avaliacao", "observacoes"],
      },
    },
    pontos_fortes: {
      type: "array",
      items: { type: "string" },
    },
    oportunidades_melhoria: {
      type: "array",
      items: { type: "string" },
    },
    competencias_desenvolver: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          competencia: { type: "string" },
          tipo: { type: "string" },
          nivel_atual: { type: "string" },
          estrategia_desenvolvimento: { type: "string" },
        },
        required: ["competencia", "tipo", "nivel_atual", "estrategia_desenvolvimento"],
      },
    },
    objetivos_curto_prazo: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          numero: { type: "string" },
          objetivo: { type: "string" },
          indicador_sucesso: { type: "string" },
          prazo: { type: "string" },
          prioridade: { type: "string" },
        },
        required: ["numero", "objetivo", "indicador_sucesso", "prazo", "prioridade"],
      },
    },
    apoio_suporte_necessario: { type: "string" },
    cronograma_acompanhamento: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          checkpoint: { type: "string" },
          data_prevista: { type: "string" },
          participantes: { type: "string" },
          pauta_principal: { type: "string" },
          observacoes: { type: "string" },
        },
        required: ["checkpoint", "data_prevista", "participantes", "pauta_principal", "observacoes"],
      },
    },
  },
  required: [
    "diagnostico_perfil",
    "avaliacao_atributos",
    "pontos_fortes",
    "oportunidades_melhoria",
    "competencias_desenvolver",
    "objetivos_curto_prazo",
    "apoio_suporte_necessario",
    "cronograma_acompanhamento",
  ],
} as const;
