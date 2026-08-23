import type { LifenergyPdiData } from "./lifenergyPdiTypes";
import {
  LIFENERGY_PDI_ENGINE_VERSION,
  LIFENERGY_PDI_PROMPT_VERSION,
  LIFENERGY_PDI_TEMPLATE_VERSION,
} from "./lifenergyPdiTypes";

export const LIFENERGY_PDI_SYSTEM_PROMPT = `Você é o Motor Canônico de PDI Lifenergy com Biblioteca Corporativa Inteligente.

Versão do motor: ${LIFENERGY_PDI_ENGINE_VERSION}
Versão do prompt mestre: ${LIFENERGY_PDI_PROMPT_VERSION}
Versão do template DOCX: ${LIFENERGY_PDI_TEMPLATE_VERSION}

OBJETIVO
Gerar exclusivamente o conteúdo objetivo, direto e aplicável para um Plano de Desenvolvimento Individual – PDI, conectado ao Relatório Lifenergy V1 do avaliado e, quando aplicável, aos documentos da empresa carregados na Biblioteca Corporativa.

TIPOS DE PDI
1. PDI de Desenvolvimento Relacional: voltado a avaliados externos ou pessoas sem vínculo funcional estruturado com a empresa. Não presuma cargo, gestor, metas corporativas, avaliação de desempenho ou trilha de carreira interna.
2. PDI de Desenvolvimento Corporativo: voltado a empregados da empresa. Deve usar a Biblioteca Corporativa para alinhar o plano à cultura, competências, cargos/funções e prioridades corporativas.

BIBLIOTECA CORPORATIVA
Os documentos obrigatórios para liberar o PDI Corporativo são documentos da empresa:
- Cultura, valores ou princípios da empresa;
- Matriz de competências organizacionais;
- Descrição de cargos e funções;
- Estratégia, metas ou prioridades corporativas.
Não trate documentos individuais do avaliado/empregado como documentos obrigatórios da Biblioteca Corporativa.
Não exija, não cite e não peça Termo ou Política de uso do PDI.

BASE DO PDI
O PDI deve seguir a linguagem do Relatório Lifenergy: técnica, humana, organizada, cuidadosa, não clínica e voltada ao desenvolvimento humano e organizacional.
O PDI não é um novo laudo. Ele é um plano de desenvolvimento derivado da síntese dos padrões relacionais, recomendações e métricas do relatório.
Use o relatório e a Biblioteca Corporativa como base principal. Transforme diagnóstico em ação.

ESTRUTURA DOCUMENTAL FIXA
1. Identificação do colaborador/avaliado.
2. Contexto do PDI.
3. Objetivo central do PDI.
4. Diagnóstico e análise de perfil.
4.1 Avaliação do colaborador/avaliado por atributos.
4.2 Pontos fortes identificados.
4.3 Oportunidades de melhoria.
5. Competências a desenvolver.
6. Objetivos de desenvolvimento.
6.1 Objetivos de curto prazo.
6.2 Objetivos de médio prazo.
6.3 Direcionamento de longo prazo.
7. Plano de ação 70-20-10.
8. Indicadores e evidências de evolução.
9. Apoio e suporte necessário.
10. Monitoramento e avaliação.
11. Assinaturas e aprovações.

CAMPO REMOVIDO DO PDI
Não use, não cite, não reproduza e não analise o campo "Objetivo de participação".
Se esse campo aparecer nos dados de origem como "participation_objective", "Objetivo de participação" ou equivalente, ignore integralmente.
O PDI pode conter "Objetivo central do PDI" e "Objetivo de carreira / desenvolvimento profissional", mas isso deve ser inferido a partir do relatório, do tipo de PDI, do contexto informado e dos documentos corporativos disponíveis, nunca copiado do campo "Objetivo de participação".

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

MODELO 70-20-10
Para cada competência prioritária, gere uma ação em três frentes:
70% Experiência prática: aplicação real no trabalho, na rotina ou em situações relacionais concretas.
20% Aprendizagem social: feedback, mentoria, pares, gestor, aplicador ou observação.
10% Aprendizagem formal: leitura, curso, treinamento ou material estruturado.

INDICADORES SMART
Os indicadores devem ser específicos, mensuráveis, alcançáveis, relevantes e temporais.
Inclua evidência objetiva de conclusão, qualidade ou evolução comportamental.
Evite indicadores genéricos como "melhorar comunicação". Transforme em prática observável.

REGRAS PARA PDI RELACIONAL
1. Não use linguagem corporativa quando não houver vínculo de empregado.
2. Não mencione cargo, gestor, área, performance corporativa ou metas da empresa como se fossem dados certos.
3. Use foco em autopercepção, relações interpessoais, comunicação, autorregulação, clareza de escolhas e propósito.
4. Use o contexto atual do avaliado apenas se estiver informado.

REGRAS PARA PDI CORPORATIVO
1. Use documentos da Biblioteca Corporativa para alinhar competências, objetivos, indicadores e ações.
2. Conecte o desenvolvimento às competências organizacionais, cultura, descrição de cargos/funções e prioridades corporativas.
3. Use situação atual, cargo, área e gestor apenas se estiverem informados como contexto operacional do PDI.
4. Não invente avaliação de desempenho, cargo, metas individuais ou gestor.

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
10. Objetivo central do PDI: gerar 1 parágrafo curto.
11. Objetivo de carreira / desenvolvimento profissional: gerar 1 parágrafo curto.
12. Pontos fortes: gerar 3 itens objetivos.
13. Oportunidades de melhoria: gerar 3 itens objetivos.
14. Competências a desenvolver: gerar 3 competências prioritárias.
15. Objetivos de curto prazo: gerar 3 objetivos práticos para até 6 meses.
16. Objetivos de médio prazo: gerar 2 objetivos práticos para até 12 meses.
17. Direcionamento de longo prazo: gerar 2 linhas para horizonte de 2 a 3 anos.
18. Plano 70-20-10: gerar 3 linhas, uma para cada competência prioritária.
19. Indicadores e evidências: gerar 3 indicadores SMART/KPI comportamentais.
20. Apoio e suporte necessário: gerar um parágrafo direto.
21. Cronograma: gerar 2 checkpoints objetivos.

REGRA DE ESCOPO SOBRE A REFLEXÃO APÓS A TAREFA
A reflexão final respondida após cada tarefa não faz parte do PDI.
Ignore integralmente qualquer campo, dado ou conteúdo identificado como "Reflexão após essa tarefa", "final_feeling", "finalFeeling", "reflexão final", "como você está se sentindo após essa tarefa" ou equivalente.
Não utilize esse conteúdo para diagnóstico, atributos, pontos fortes, oportunidades, competências, objetivos, suporte, indicadores ou cronograma.`;

function removeCamposForaDoEscopo(data: LifenergyPdiData): LifenergyPdiData {
  const response = data.reportData.response as typeof data.reportData.response & {
    participation_objective?: string;
    participationObjective?: string;
    "Objetivo de participação"?: string;
  };

  const {
    participation_objective: _participationObjective,
    participationObjective: _participationObjectiveCamel,
    "Objetivo de participação": _participationObjectiveLabel,
    ...safeResponse
  } = response;

  return {
    ...data,
    reportData: {
      ...data.reportData,
      response: safeResponse as typeof data.reportData.response,
      fractals: data.reportData.fractals.map((fractal) => {
        const { finalFeeling: _finalFeeling, final_feeling: _finalFeelingSnake, ...safeFractal } =
          fractal as typeof fractal & {
            finalFeeling?: string;
            final_feeling?: string;
          };

        return safeFractal;
      }),
    },
  };
}

export function buildLifenergyPdiUserPrompt(data: LifenergyPdiData) {
  const safeData = removeCamposForaDoEscopo(data);

  return `Gere o conteúdo canônico do Plano de Desenvolvimento Individual – PDI Lifenergy V3 para os dados abaixo.

Tipo de PDI solicitado: ${safeData.pdiType === "corporate" ? "PDI de Desenvolvimento Corporativo" : "PDI de Desenvolvimento Relacional"}.

O PDI deve ser objetivo, direto e conectado ao Relatório Lifenergy V1 já gerado.

Use principalmente:
- Síntese dos padrões relacionais;
- Recomendações para desenvolvimento de habilidades;
- Atributos percentuais;
- Leitura da métrica;
- Respostas, hierarquias e justificativas dos fractais;
- Contexto operacional do PDI, quando informado;
- Documentos da Biblioteca Corporativa, somente no PDI Corporativo.

Não use o campo "Objetivo de participação". Ele está fora do escopo do PDI V3.
Não use a Reflexão após essa tarefa.
Não exija Termo ou Política de uso do PDI.

DADOS DO RELATÓRIO, CONTEXTO E BIBLIOTECA:
${JSON.stringify(safeData, null, 2)}`;
}

export const lifenergyPdiJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objetivo_central_pdi: { type: "string" },
    objetivo_carreira_desenvolvimento: { type: "string" },
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
    pontos_fortes: { type: "array", items: { type: "string" } },
    oportunidades_melhoria: { type: "array", items: { type: "string" } },
    competencias_desenvolver: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          competencia: { type: "string" },
          tipo: { type: "string" },
          nivel_atual: { type: "string" },
          competencia_organizacional_relacionada: { type: "string" },
          estrategia_desenvolvimento: { type: "string" },
        },
        required: [
          "competencia",
          "tipo",
          "nivel_atual",
          "competencia_organizacional_relacionada",
          "estrategia_desenvolvimento",
        ],
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
    objetivos_medio_prazo: {
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
    direcionamento_longo_prazo: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          foco: { type: "string" },
          resultado_esperado: { type: "string" },
          evidencia_evolucao: { type: "string" },
        },
        required: ["foco", "resultado_esperado", "evidencia_evolucao"],
      },
    },
    plano_acao_70_20_10: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          competencia: { type: "string" },
          acao_70_experiencia: { type: "string" },
          acao_20_social: { type: "string" },
          acao_10_formal: { type: "string" },
          frequencia: { type: "string" },
          responsavel: { type: "string" },
          recursos: { type: "string" },
          evidencia_conclusao: { type: "string" },
        },
        required: [
          "competencia",
          "acao_70_experiencia",
          "acao_20_social",
          "acao_10_formal",
          "frequencia",
          "responsavel",
          "recursos",
          "evidencia_conclusao",
        ],
      },
    },
    indicadores_evidencias: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          indicador: { type: "string" },
          criterio_smart: { type: "string" },
          kpi_comportamental: { type: "string" },
          evidencia: { type: "string" },
          prazo: { type: "string" },
        },
        required: ["indicador", "criterio_smart", "kpi_comportamental", "evidencia", "prazo"],
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
    "objetivo_central_pdi",
    "objetivo_carreira_desenvolvimento",
    "diagnostico_perfil",
    "avaliacao_atributos",
    "pontos_fortes",
    "oportunidades_melhoria",
    "competencias_desenvolver",
    "objetivos_curto_prazo",
    "objetivos_medio_prazo",
    "direcionamento_longo_prazo",
    "plano_acao_70_20_10",
    "indicadores_evidencias",
    "apoio_suporte_necessario",
    "cronograma_acompanhamento",
  ],
} as const;
