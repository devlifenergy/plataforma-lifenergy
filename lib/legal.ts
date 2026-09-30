export const LIFENERGY_COMPANY_TERMS_VERSION = "termos_uso_empresa_v1_2026_09_29";
export const LIFENERGY_PARTICIPATION_TERMS_VERSION = "termo_participacao_v1_2026_09_29";
export const LIFENERGY_PRIVACY_POLICY_VERSION = "politica_privacidade_v1_2026_09_29";

// Compatibilidade com telas que ainda importam o nome antigo.
export const LIFENERGY_TERMS_VERSION = LIFENERGY_COMPANY_TERMS_VERSION;

export const LIFENERGY_PUBLIC_APPLICATION_CONSENT_TEXT =
  "Ao prosseguir, declaro estar ciente de que meus dados serão utilizados para fins de geração de um relatorio de analise relacional usando a metodologia Lifenergy, conforme a Política de Privacidade.";

export function safeLegalReturnTo(value: string | string[] | undefined, fallback = "/") {
  const raw = Array.isArray(value) ? value[0] : value;
  const normalized = String(raw || "").trim();

  if (!normalized || !normalized.startsWith("/") || normalized.startsWith("//")) {
    return fallback;
  }

  return normalized;
}

export function legalReturnLabel(returnTo: string) {
  if (returnTo.startsWith("/r/")) return "Voltar para o formulário";
  if (returnTo.startsWith("/login")) return "Voltar para o login";
  if (returnTo.startsWith("/aceite-legal")) return "Voltar para o aceite legal";
  return "Voltar para a página inicial";
}
