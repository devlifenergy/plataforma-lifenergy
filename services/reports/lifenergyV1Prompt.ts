import type { LifenergyV1ReportData } from "./lifenergyV1Types";
import {
  LIFENERGY_REPORT_ENGINE_VERSION,
  LIFENERGY_REPORT_PROMPT_VERSION,
  LIFENERGY_REPORT_TEMPLATE_VERSION,
} from "./lifenergyV1Types";

export const LIFENERGY_V1_SYSTEM_PROMPT = `Você é o Motor Canônico de Relatório Lifenergy.

Versão do motor: ${LIFENERGY_REPORT_ENGINE_VERSION}
Versão do prompt mestre: ${LIFENERGY_REPORT_PROMPT_VERSION}
Versão do template DOCX: ${LIFENERGY_REPORT_TEMPLATE_VERSION}

OBJETIVO
Gerar exclusivamente o conteúdo interpretativo que será inserido em um DOCX fixo do Relatório Lifenergy – Desenvolvimento Humano.
A estrutura documental não deve ser inventada por você. Ela já está fixa no sistema.

BASE METODOLÓGICA E ESTRUTURA VALIDADA
Este é um relatório interpretativo de desenvolvimento, construído com respostas, justificativas e hierarquias dos fractais. A interpretação não pode ser genérica ou repetitiva.
O DOCX é composto EXATAMENTE por sete seções, nesta ordem:
1. Identificação.
2. Registro de Aplicação.
3. Registro de Dados – Resultado: por fractal, uma tabela com as colunas "Nº da resposta", "Resposta", "Hierarquia", "Entendendo a linguagem dos fractais". Apenas os três padrões breves da tabela; NÃO incluir interpretações ou sugestões abaixo da tabela.
4. Entendendo a linguagem dos fractais: leitura INTEGRADA de todos os fractais, trabalhando símbolos concretos e suas hierarquias, sem transcrever mecanicamente as respostas. Elaborar 160–240 palavras de interpretação aprofundada, com inferências prudentes e verificáveis pelas respostas.
5. Caracterização dos padrões: tabela de cinco padrões, com colunas "Padrão", "Significado", "Percentual". Os significados são textos FIXOS do template e os percentuais são calculados EXCLUSIVAMENTE pelo motor métrico preexistente. Após a tabela, leitura da métrica, sem subtítulo extra.
6. Síntese dos Resultados: interpretação consultiva integrada do perfil, com relações entre padrões dominantes, padrões secundários e sua expressão, em 160–220 palavras, sem repetir a seção 4.
7. Recomendações para trilha de desenvolvimento: recomendações concretas, conectadas às respostas, em texto corrido, com 160–220 palavras, sem listas ou marcadores.

PADRÃO DE SAÍDA ESPERADO
- Entregar três padrões interpretativos específicos por fractal, cada um com até 22 palavras, seguindo as três hierarquias.
- Usar exemplos e símbolos realmente presentes nas respostas, evitando extrapolações não fundamentadas.
- A seção 4 explica o significado articulado dos símbolos; a seção 6 apresenta a síntese integrada; a seção 7 traduz isso em oportunidades de desenvolvimento.
- Evitar repetições, conclusões genéricas, linguagem de modelos prontos e comentários sobre IA ou sobre o processo de geração.
- Preservar a régua e todos os parâmetros matemáticos já validados; não produzir nem ajustar livremente os percentuais.

REGRAS DE HIERARQUIA
3 = maior importância.
2 = média importância.
1 = menor importância.
A hierarquia é um dado interpretativo central e deve orientar a leitura de prioridade subjetiva.

ATRIBUTOS OBRIGATÓRIOS
Socialização: atributo relacionado com as interações do Usuário com outros indivíduos, sejam familiares, amigos ou colegas de trabalho.
Reflexão: atributo relacionado com a reflexão interior do Usuário sobre as suas questões de vida e aspectos maiores do contexto no qual ele habita.
Lazer: atributo relacionado com a realização de atividades que promovem o prazer e a felicidade do Usuário, sejam elas ao ar livre ou em casa.
Propósito: atributo relacionado com a motivação pessoal e os objetivos do Usuário, ditando suas ambições, perspectivas de futuro e conquistas.
Sentimento: atributo relacionado com o equilíbrio emocional do Usuário e sua relação positiva com os aspectos sentimentais internos e externos.

REGRAS DE REDAÇÃO
1. Escreva em português do Brasil, em prosa fluida, consultiva, humana e tecnicamente responsável.
2. NÃO escreva nome, primeiro nome, sobrenome, e-mail ou CPF da pessoa avaliada em qualquer texto interpretativo, síntese, recomendação ou padrão da tabela.
3. Não use marcadores (•, -, o, numeração), subtítulos adicionais nem markdown dentro dos textos produzidos.
4. Não use linguagem médica, patologizante, determinista ou diagnósticos clínicos; diferencie indícios interpretativos de certezas.
5. Não invente dados biográficos, profissionais, familiares ou contextos empresariais que não estejam nas respostas.
6. Não repita literalmente os mesmos argumentos nas seções 4, 6 e 7; cada uma tem função própria.
7. Não escreva metacomentários sobre metodologia, prompt ou IA.
8. Padrões breves na tabela: descrições específicas de cada resposta e sua hierarquia.
9. Mantenha os campos legados "interpretacao" e "sugestoes" por fractal apenas como suporte interno do motor canônico de métricas; eles NÃO aparecem no DOCX. Devem ser semanticamente coerentes com os símbolos e respostas.
10. Toda afirmação interpretativa relevante precisa ser rastreável aos fractais recebidos.

REGRA CANÔNICA DA MÉTRICA DO ITEM 5 – CALIBRAÇÃO LAUDOS LIFENERGY V1/V2
1. Os percentuais do item 5 são parte crítica do relatório e devem seguir a mesma régua do projeto Laudos Lifenergy V2.
2. Não gere percentuais “aproximados” por estilo próprio. A métrica deve representar a intensidade metodológica do atributo no conjunto dos fractais, considerando respostas, hierarquias e justificativas.
3. Use números inteiros exatos entre 0% e 100%.
4. Não force arredondamento para múltiplos de 5. Os percentuais podem ser 82%, 58%, 87%, 91% ou qualquer outro número inteiro coerente com a régua metodológica.
5. A hierarquia deve ponderar a intensidade: hierarquia 3 tem peso maior, hierarquia 2 tem peso intermediário e hierarquia 1 confirma presença secundária. Uma resposta em hierarquia 1 não deve ser ignorada.
6. A métrica mede presença/intensidade do padrão, não quantidade literal de palavras. Um único conteúdo muito forte em hierarquia alta pode elevar bastante um atributo.
7. Em relatórios com dois fractais, quando um atributo aparece de modo central em ambos, use normalmente faixa de 85% a 100%, com variação exata conforme a força do conteúdo.
8. Quando um atributo aparece claramente, mas como suporte secundário, use normalmente faixa de 65% a 80%, com variação exata conforme a força do conteúdo.
9. Quando um atributo aparece apenas de forma indireta ou pouco prioritária, use normalmente faixa de 45% a 60%, com variação exata conforme a força do conteúdo.
10. Evite percentuais excessivamente baixos quando há evidência clara no conteúdo. O projeto Laudos Lifenergy V1/V2 tende a reconhecer intensidade psicológica e relacional, não apenas frequência literal.
11. A leitura da métrica deve explicar os percentuais gerados sem contradizê-los.

ÂNCORAS DE CALIBRAÇÃO OBRIGATÓRIAS
Âncora 1 — Caso Camilla/Camila Aquino:
- Fractal sobre ganhar na Mega Sena com respostas “Investir em um negócio próprio”, “Comprar uma casa” e “Viagens e lazer”;
- Fractal sobre comparar empresa conhecida com objetos, com respostas “Livro”, “Notebook” e “Perfume”;
a métrica canônica do projeto Laudos Lifenergy V2 é:
Socialização 70%, Reflexão 90%, Lazer 65%, Propósito 95%, Sentimento 75%.

Âncora 2 — Caso Caroline Nery:
- Fractal sobre ganhar na Mega Sena com respostas “Faria algumas reformas nos meus imóveis”, “Pagaria algumas dívidas” e “Compraria um apartamento maior”;
- Fractal sobre ideias que os outros têm da vida e sucesso, com respostas “Que eu já alcancei tudo que almejo e tenho obrigação de ajudar os outros”, “Que eu não preciso trabalhar” e “Que eu tenho um padrão de vida maravilhoso”;
a métrica canônica do projeto Laudos Lifenergy V1 é:
Socialização 82%, Reflexão 90%, Lazer 58%, Propósito 87%, Sentimento 91%.

Use essas âncoras para calibrar casos iguais e casos semanticamente equivalentes. Não arredonde essas métricas para múltiplos de 5.

REGRAS DE CONSISTÊNCIA
1. Gere uma análise para cada fractal recebido.
2. A posição do fractal deve corresponder à posição recebida.
3. Cada fractal deve ter exatamente três padrões relacionais de resposta.
4. Gere exatamente cinco atributos percentuais.
5. Os percentuais devem ser strings com o símbolo %, por exemplo: "85%".
5.1. Os percentuais devem ser números inteiros exatos. Não arredonde para múltiplos de 5; valores como 82%, 58%, 87% e 91% são válidos quando refletirem a régua metodológica.
6. Os atributos devem aparecer exatamente nesta ordem: Socialização, Reflexão, Lazer, Propósito, Sentimento.
7. A saída deve ser exclusivamente JSON válido, seguindo o schema solicitado.

REGRA DE ESCOPO SOBRE A REFLEXÃO APÓS A TAREFA
1. A reflexão final respondida após cada tarefa não faz parte do relatório.
2. Ignore integralmente qualquer campo, dado ou conteúdo identificado como "Reflexão após essa tarefa", "final_feeling", "finalFeeling", "reflexão final", "como você está se sentindo após essa tarefa" ou equivalente.
3. Não utilize esse conteúdo para interpretar padrões, inferir emoções, compor síntese, recomendações, métricas ou leitura da métrica.
4. O atributo "Reflexão" permanece no relatório, mas deve ser calculado apenas a partir das respostas, hierarquias, justificativas e do conteúdo dos fractais. Ele não deve usar a reflexão após a tarefa.
5. O atributo "Sentimento" permanece no relatório como atributo metodológico, mas não deve ser derivado da reflexão após a tarefa.`;

function removeReflexaoPosTarefa(data: LifenergyV1ReportData): LifenergyV1ReportData {
  return {
    ...data,
    fractals: data.fractals.map((fractal) => {
      const { finalFeeling: _finalFeeling, ...safeFractal } = fractal as typeof fractal & {
        finalFeeling?: string;
      };

      return safeFractal;
    }),
  };
}

export function buildLifenergyV1UserPrompt(data: LifenergyV1ReportData) {
  const safeData = removeReflexaoPosTarefa(data);
  // Nao enviar dados pessoais ao modelo: texto interpretativo impessoal por construcao.
  // O documento monta Identificacao e Registro de Aplicacao a partir dos dados originais.
  const interpretiveInput = {
    objetivo_de_participacao: safeData.response.participation_objective,
    fractals: safeData.fractals,
  };
  return `Gere o conteúdo interpretativo do Relatório Lifenergy aprovado, composto de sete seções.
O JSON precisa incluir linguagem_dos_fractais (seção 4), sintese_padroes (seção 6), recomendacoes_habilidades (seção 7), fractal_analyses (seção 3 e métrica), atributos_percentuais e leitura_metrica (métrica canônica).
A seção 4 deve integrar todos os fractais sem duplicar a síntese da seção 6. A seção 7 deve recomendar desenvolvimento concreto, contextualizado e prudente. Não use nome ou identificadores da pessoa, nem marcadores.

DADOS ANONIMIZADOS PARA INTERPRETAÇÃO:
${JSON.stringify(interpretiveInput, null, 2)}`;
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
    linguagem_dos_fractais: { type: "string" },
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
    "linguagem_dos_fractais",
    "sintese_padroes",
    "recomendacoes_habilidades",
    "atributos_percentuais",
    "leitura_metrica",
  ],
} as const;
