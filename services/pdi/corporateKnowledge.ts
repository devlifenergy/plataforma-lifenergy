import { createAdminClient } from "@/lib/supabaseAdmin";

export const CORPORATE_DOCUMENT_CATEGORIES = [
  {
    id: "culture_values",
    label: "Cultura, valores ou princípios da empresa",
    requiredForCorporatePdi: true,
    description:
      "Código de cultura, valores, princípios de liderança, manifesto institucional ou documento equivalente.",
  },
  {
    id: "competencies_matrix",
    label: "Matriz de competências organizacionais",
    requiredForCorporatePdi: true,
    description:
      "Competências comportamentais, técnicas, de liderança, por área, cargo ou nível.",
  },
  {
    id: "jobs_roles",
    label: "Descrição de cargos e funções",
    requiredForCorporatePdi: true,
    description:
      "Descrições de cargos, responsabilidades, entregas esperadas, indicadores e níveis de senioridade.",
  },
  {
    id: "strategy_priorities",
    label: "Estratégia, metas ou prioridades corporativas",
    requiredForCorporatePdi: true,
    description:
      "Planejamento estratégico, OKRs, metas anuais, prioridades do ciclo ou mapa estratégico.",
  },
  {
    id: "learning_tracks",
    label: "Trilhas, treinamentos e materiais de desenvolvimento",
    requiredForCorporatePdi: false,
    description:
      "Catálogo de cursos, trilhas de aprendizagem, workshops, materiais de liderança e programas internos.",
  },
  {
    id: "performance_model",
    label: "Avaliação de desempenho, feedbacks ou gestão de performance",
    requiredForCorporatePdi: false,
    description:
      "Modelos de avaliação, feedback 180º/360º, metas individuais ou critérios de desempenho.",
  },
  {
    id: "management_rituals",
    label: "Rituais de gestão e acompanhamento",
    requiredForCorporatePdi: false,
    description:
      "Reuniões 1:1, checkpoints, reuniões de equipe, revisões trimestrais e rituais de liderança.",
  },
  {
    id: "other",
    label: "Outros documentos corporativos",
    requiredForCorporatePdi: false,
    description: "Outros documentos da empresa que possam contextualizar o PDI.",
  },
] as const;

export type CorporateDocumentCategory = (typeof CORPORATE_DOCUMENT_CATEGORIES)[number]["id"];

export const MANDATORY_CORPORATE_PDI_DOCUMENT_CATEGORIES = CORPORATE_DOCUMENT_CATEGORIES.filter(
  (item) => item.requiredForCorporatePdi
).map((item) => item.id);

export type OrganizationDocumentForPdi = {
  id: string;
  category: CorporateDocumentCategory;
  title: string;
  file_name: string | null;
  mime_type: string | null;
  file_size: number | null;
  content_text: string;
  created_at: string;
  updated_at: string | null;
};

export type PdiContextRecord = {
  id: string;
  journey_response_id: string;
  pdi_type: "relational" | "corporate";
  person_type: "external" | "employee";
  current_job_title: string | null;
  current_area: string | null;
  manager_name: string | null;
  context_summary: string | null;
  current_situation: string | null;
  current_challenges: string | null;
  development_priorities: string | null;
  career_direction: string | null;
};

export function getCorporateDocumentCategoryLabel(category: string) {
  return (
    CORPORATE_DOCUMENT_CATEGORIES.find((item) => item.id === category)?.label ?? category
  );
}

export function getCorporateLibraryStatus(documents: Array<{ category: string; content_text?: string | null }>) {
  const activeWithContent = new Set(
    documents
      .filter((item) => String(item.content_text ?? "").trim().length > 0)
      .map((item) => item.category)
  );

  const missing = MANDATORY_CORPORATE_PDI_DOCUMENT_CATEGORIES.filter(
    (category) => !activeWithContent.has(category)
  );

  return {
    ready: missing.length === 0,
    missing,
    completed: MANDATORY_CORPORATE_PDI_DOCUMENT_CATEGORIES.filter((category) =>
      activeWithContent.has(category)
    ),
  };
}

export async function loadPdiContextAndCorporateKnowledge(params: {
  organizationId: string;
  responseId: string;
  pdiType: "relational" | "corporate";
}) {
  const admin = createAdminClient();

  const [{ data: context }, { data: documents, error: documentsError }] = await Promise.all([
    admin
      .from("pdi_contexts")
      .select(
        "id, journey_response_id, pdi_type, person_type, current_job_title, current_area, manager_name, context_summary, current_situation, current_challenges, development_priorities, career_direction"
      )
      .eq("organization_id", params.organizationId)
      .eq("journey_response_id", params.responseId)
      .maybeSingle(),
    admin
      .from("organization_documents")
      .select("id, category, title, file_name, mime_type, file_size, content_text, created_at, updated_at")
      .eq("organization_id", params.organizationId)
      .eq("status", "active")
      .order("created_at", { ascending: false }),
  ]);

  if (documentsError) {
    throw new Error(documentsError.message);
  }

  const activeDocuments = (documents ?? []) as OrganizationDocumentForPdi[];
  const libraryStatus = getCorporateLibraryStatus(activeDocuments);

  if (params.pdiType === "corporate" && !libraryStatus.ready) {
    const missingLabels = libraryStatus.missing.map(getCorporateDocumentCategoryLabel);
    throw new Error(
      `PDI Corporativo bloqueado. Documentos obrigatórios da empresa pendentes: ${missingLabels.join(
        "; "
      )}.`
    );
  }

  if (params.pdiType === "corporate" && !String((context as any)?.current_job_title ?? "").trim()) {
    throw new Error("PDI Corporativo bloqueado. Informe o Cargo atual no Contexto Operacional antes da geração.");
  }

  return {
    pdiContext: (context ?? null) as PdiContextRecord | null,
    corporateDocuments: params.pdiType === "corporate" ? activeDocuments : [],
    libraryStatus,
  };
}
