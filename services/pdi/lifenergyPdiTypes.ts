import type { LifenergyV1GeneratedContent, LifenergyV1ReportData } from "@/services/reports/lifenergyV1Types";
import type { OrganizationDocumentForPdi, PdiContextRecord } from "./corporateKnowledge";

export const LIFENERGY_PDI_VERSION = "lifenergy_pdi_v3_1_1_5_3";
export const LIFENERGY_PDI_FORMAT = "docx";
export const LIFENERGY_PDI_ENGINE_VERSION = "1.5.3";
export const LIFENERGY_PDI_PROMPT_VERSION = "pdi_lifenergy_v3_1_corporativo_revisado_2026_08_25";
export const LIFENERGY_PDI_TEMPLATE_VERSION = "docx_pdi_lifenergy_v3_1_corporativo_revisado_2026_08_25";

export type LifenergyPdiType = "relational" | "corporate";

export type LifenergyPdiData = {
  pdiType: LifenergyPdiType;
  pdiContext: PdiContextRecord | null;
  corporateDocuments: OrganizationDocumentForPdi[];
  reportData: LifenergyV1ReportData;
  reportContent: LifenergyV1GeneratedContent;
  sourceReportId: string | null;
};

export type LifenergyPdiGeneratedContent = {
  objetivo_central_pdi: string;
  objetivo_carreira_desenvolvimento: string;
  diagnostico_perfil: string;
  avaliacao_atributos: Array<{
    atributo: string;
    avaliacao: string;
    observacoes: string;
  }>;
  pontos_fortes: string[];
  oportunidades_melhoria: string[];
  competencias_desenvolver: Array<{
    competencia: string;
    tipo: string;
    nivel_atual: string;
    competencia_organizacional_relacionada: string;
    estrategia_desenvolvimento: string;
  }>;
  objetivos_curto_prazo: Array<{
    numero: string;
    objetivo: string;
    indicador_sucesso: string;
    prazo: string;
    prioridade: string;
  }>;
  objetivos_medio_prazo: Array<{
    numero: string;
    objetivo: string;
    indicador_sucesso: string;
    prazo: string;
    prioridade: string;
  }>;
  direcionamento_longo_prazo: Array<{
    foco: string;
    resultado_esperado: string;
    evidencia_evolucao: string;
  }>;
  plano_acao_70_20_10: Array<{
    competencia: string;
    acao_70_experiencia: string;
    acao_20_social: string;
    acao_10_formal: string;
    frequencia: string;
    responsavel: string;
    recursos: string;
    evidencia_conclusao: string;
  }>;
  indicadores_evidencias: Array<{
    indicador: string;
    criterio_smart: string;
    kpi_comportamental: string;
    evidencia: string;
    prazo: string;
  }>;
  apoio_suporte_necessario: string;
  cronograma_acompanhamento: Array<{
    checkpoint: string;
    data_prevista: string;
    participantes: string;
    pauta_principal: string;
    observacoes: string;
  }>;
};
