import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabaseServer";

type AuditMetadata = Record<string, unknown>;

export type AuditAction =
  | "legal.company_acceptance"
  | "journey.created"
  | "journey.updated"
  | "journey.deleted"
  | "journey.invitation_email_sent"
  | "public_form.completed"
  | "report.relational_generated"
  | "pdi.generated"
  | "document.downloaded"
  | "company.created"
  | "company.updated"
  | "license.updated";

type AuditLogParams = {
  action: AuditAction | string;
  organizationId?: string | null;
  organizationName?: string | null;
  actorUserId?: string | null;
  actorProfileId?: string | null;
  actorName?: string | null;
  actorEmail?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  description?: string | null;
  metadata?: AuditMetadata | null;
};

function normalizeText(value: unknown) {
  const text = String(value ?? "").trim();
  return text || null;
}

function readIpFromHeaders(headerList: { get(name: string): string | null }) {
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || null;

  return (
    headerList.get("x-real-ip") ||
    headerList.get("cf-connecting-ip") ||
    headerList.get("x-vercel-forwarded-for") ||
    null
  );
}

async function readRequestContext() {
  try {
    const headerList = await headers();
    return {
      ipAddress: readIpFromHeaders(headerList),
      userAgent: headerList.get("user-agent"),
    };
  } catch {
    return { ipAddress: null, userAgent: null };
  }
}

async function readCurrentActor() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("id, auth_user_id, organization_id, name, email, role, organizations(name)")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (!profile) {
      return {
        actorUserId: user.id,
        actorProfileId: null,
        actorName: user.email ?? null,
        actorEmail: user.email ?? null,
        organizationId: null,
        organizationName: null,
      };
    }

    const organizations = (profile as any).organizations;
    const organizationName = Array.isArray(organizations)
      ? organizations[0]?.name
      : organizations?.name;

    return {
      actorUserId: user.id,
      actorProfileId: (profile as any).id ?? null,
      actorName: (profile as any).name ?? null,
      actorEmail: (profile as any).email ?? user.email ?? null,
      organizationId: (profile as any).organization_id ?? null,
      organizationName: organizationName ?? null,
    };
  } catch {
    return null;
  }
}

async function resolveOrganizationName(organizationId: string | null | undefined) {
  if (!organizationId) return null;

  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("organizations")
      .select("name")
      .eq("id", organizationId)
      .maybeSingle();

    return (data as any)?.name ?? null;
  } catch {
    return null;
  }
}

export async function logAuditEvent(params: AuditLogParams) {
  try {
    const [requestContext, currentActor] = await Promise.all([
      readRequestContext(),
      readCurrentActor(),
    ]);

    const organizationId =
      normalizeText(params.organizationId) ?? currentActor?.organizationId ?? null;
    const organizationName =
      normalizeText(params.organizationName) ??
      currentActor?.organizationName ??
      (await resolveOrganizationName(organizationId));

    const admin = createAdminClient();

    await admin.from("audit_logs").insert({
      organization_id: organizationId,
      organization_name: organizationName,
      actor_profile_id: normalizeText(params.actorProfileId) ?? currentActor?.actorProfileId ?? null,
      actor_user_id: normalizeText(params.actorUserId) ?? currentActor?.actorUserId ?? null,
      actor_name: normalizeText(params.actorName) ?? currentActor?.actorName ?? null,
      actor_email: normalizeText(params.actorEmail) ?? currentActor?.actorEmail ?? null,
      action: normalizeText(params.action) ?? "unknown",
      entity_type: normalizeText(params.entityType),
      entity_id: normalizeText(params.entityId),
      description: normalizeText(params.description),
      metadata: params.metadata ?? {},
      ip_address: requestContext.ipAddress,
      user_agent: requestContext.userAgent,
    });
  } catch (error) {
    console.error("Falha ao registrar auditoria:", error);
  }
}
