import type { LifenergyV1GeneratedContent, LifenergyV1ReportData } from "@/services/reports/lifenergyV1Types";

export const LIFENERGY_PDI_VERSION = "lifenergy_pdi_v1_0_1_4_0";
export const LIFENERGY_PDI_FORMAT = "docx";
export const LIFENERGY_PDI_ENGINE_VERSION = "1.4.0";
export const LIFENERGY_PDI_PROMPT_VERSION = "pdi_lifenergy_v1_0_2026_08_22";
export const LIFENERGY_PDI_TEMPLATE_VERSION = "docx_pdi_lifenergy_v1_0_2026_08_22";

export type LifenergyPdiData = {
  reportData: LifenergyV1ReportData;
  reportContent: LifenergyV1GeneratedContent;
  sourceReportId: string | null;
};

export type LifenergyPdiGeneratedContent = {
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
    estrategia_desenvolvimento: string;
  }>;
  objetivos_curto_prazo: Array<{
    numero: string;
    objetivo: string;
    indicador_sucesso: string;
    prazo: string;
    prioridade: string;
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
