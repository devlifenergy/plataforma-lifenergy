/* Integração: tipos derivados dos nomes do schema fornecido; não modifica o schema. */
import type { LifenergyV1ReportData } from "../lifenergyV1Types";
export type { LifenergyV1ReportData };
export type Atributo = "socializacao" | "reflexao" | "lazer" | "proposito" | "sentimento";
export type Hierarquia = "Maior importância" | "Média importância" | "Menor importância";
export type Intensidades = Record<Atributo, number>;
export type CalculoAtributo = { F_total: number; R: number; C: number; percentual: number };
export type PadraoPsicologico = {
  atributo: string;
  definicao: string;
  rotulo: string;
  manifestacao: string;
  percentual: number;
};
export type RespostaCanonica = {
  numero: number; resposta: string; hierarquia: Hierarquia; peso: number;
  justificativa: string; padrao_nome: string; padrao_interpretacao: string;
  intensidades: Intensidades;
};
export type FractalCanonico = {
  numero: number; enunciado: string; respostas: RespostaCanonica[];
  forca_por_atributo: Intensidades;
};
export type RelatorioCanonico = {
  identificacao: {
    nome: string; cpf: string; email: string; data_nascimento: string;
    naturalidade: string; objetivo_participacao: string;
  };
  registro_aplicacao: {
    aplicador: string; escolha_atividade: string; tempo_resposta: string;
    data_aplicacao: string; fractais_aplicados: string[];
  };
  fractais: FractalCanonico[];
  sintese_fractais: string;
  calculo_atributos: Record<Atributo, CalculoAtributo>;
  padroes_psicologicos: PadraoPsicologico[];
  interpretacao_padroes: string;
  sintese_resultados: string;
  recomendacoes: string;
};
