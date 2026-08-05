import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabaseServer";

async function getOrganizationIdFromCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Usuário não autenticado.", status: 401 as const };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("auth_user_id", user.id)
    .single();

  if (error || !profile?.organization_id) {
    return { error: "Perfil da empresa não encontrado.", status: 400 as const };
  }

  return { organizationId: profile.organization_id };
}

type RouteContext = {
  params: Promise<{
    journeyId: string;
  }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const currentUser = await getOrganizationIdFromCurrentUser();

  if ("error" in currentUser) {
    return NextResponse.json(
      { error: currentUser.error },
      { status: currentUser.status }
    );
  }

  const { journeyId } = await context.params;

  if (!journeyId) {
    return NextResponse.json(
      { error: "Link não informado." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  const { data: journey, error: journeyError } = await admin
    .from("journeys")
    .select("id, status, organization_id")
    .eq("id", journeyId)
    .eq("organization_id", currentUser.organizationId)
    .single();

  if (journeyError || !journey) {
    return NextResponse.json(
      { error: "Link não encontrado para esta empresa." },
      { status: 404 }
    );
  }

  if (journey.status !== "created" && journey.status !== "link_sent") {
    return NextResponse.json(
      { error: "Somente links ainda não respondidos podem ser excluídos." },
      { status: 409 }
    );
  }

  const { count, error: responsesError } = await admin
    .from("journey_responses")
    .select("id", { count: "exact", head: true })
    .eq("journey_id", journeyId);

  if (responsesError) {
    return NextResponse.json(
      { error: responsesError.message },
      { status: 400 }
    );
  }

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { error: "Este link já possui respostas registradas e não pode ser excluído." },
      { status: 409 }
    );
  }

  const { data: deleted, error: deleteError } = await admin
    .from("journeys")
    .delete()
    .eq("id", journeyId)
    .eq("organization_id", currentUser.organizationId)
    .select("id");

  if (deleteError) {
    return NextResponse.json(
      { error: deleteError.message },
      { status: 400 }
    );
  }

  if (!deleted || deleted.length === 0) {
    return NextResponse.json(
      { error: "Nenhum link foi excluído." },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
