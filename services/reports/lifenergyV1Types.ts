export const LIFENERGY_REPORT_VERSION = "lifenergy_relatorio_canonico_v3_1_5_19";
export const LIFENERGY_REPORT_FORMAT = "docx";
export const LIFENERGY_REPORT_ENGINE_VERSION = "1.5.19";
export const LIFENERGY_REPORT_PROMPT_VERSION = "modelo_canonico_v3_2026_10_13";
export const LIFENERGY_REPORT_TEMPLATE_VERSION = "docx_modelo_canonico_v3_1_5_19";

export type LifenergyFractalResponse = {
  index: number;
  response: string;
  hierarchy: number;
  justification: string;
};

export type LifenergyFractalData = {
  position: number;
  presentedActivity: string;
  copiedActivity: string;
  responses: LifenergyFractalResponse[];
};

export type LifenergyV1ReportData = {
  profile: {
    id: string;
    role: string;
    organization_id: string | null;
    name: string | null;
    email: string | null;
  };
  organization: {
    id: string;
    name: string;
    document_ai_provider?: "openai" | "claude" | string | null;
    logo_file_name?: string | null;
    logo_mime_type?: string | null;
    logo_content_base64?: string | null;
    logo_size?: "small" | "medium" | "large" | string | null;
    logo_position?: "left" | "center" | "right" | string | null;
  };
  journey: {
    id: string;
    code: string;
    token: string;
    status: string;
    created_at: string | null;
    completed_at: string | null;
    participant_name: string;
    participant_email: string | null;
    applicator_name: string;
  };
  response: {
    id: string;
    application_date: string;
    initial_time: string | null;
    full_name: string;
    cpf: string;
    email: string;
    naturalidade: string;
    birth_date: string;
    participation_objective: string;
    application_type: string;
    applicator_name: string | null;
    activity_choice: string;
    created_at: string | null;
  };
  fractals: LifenergyFractalData[];
};


export type LifenergyV1SkillRecommendation = {
  habilidade: string;
  descricao_integrada: string;
  fractais_relacionados: string;
  orientacao_pratica: string;
};

export type LifenergyV1DevelopmentTask = {
  fractais: string;
  habilidade: string;
  tarefa_recomendada: string;
  forma_de_aplicacao: string;
  indicador_de_evolucao: string;
};

export type LifenergyV1GeneratedContent = {
  fractal_analyses: Array<{
    position: number;
    response_1_pattern: string;
    response_2_pattern: string;
    response_3_pattern: string;
    interpretacao: string;
    sugestoes: string;
  }>;
  sintese_padroes: string;
  recomendacoes_habilidades: string;
  /**
   * Campos legados mantidos para compatibilidade com versões anteriores do motor.
   * O Modelo Canônico V3 do DOCX não depende desses blocos.
   */
  recomendacoes_por_habilidade?: LifenergyV1SkillRecommendation[];
  tarefas_desenvolvimento?: LifenergyV1DevelopmentTask[];
  atributos_percentuais: Array<{
    atributo: string;
    percentual: string;
  }>;
  leitura_metrica: string;
  metric_calculation?: Record<string, unknown>;
};
