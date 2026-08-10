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
  finalFeeling: string;
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
  atributos_percentuais: Array<{
    atributo: string;
    percentual: string;
  }>;
  leitura_metrica: string;
};
