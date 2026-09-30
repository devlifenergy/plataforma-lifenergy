import { redirect } from "next/navigation";
import { CompanyShell } from "@/components/layout/CompanyShell";
import { createClient } from "@/lib/supabaseServer";
import {
  LIFENERGY_COMPANY_TERMS_VERSION,
  LIFENERGY_PRIVACY_POLICY_VERSION,
} from "@/lib/legal";

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("name, email, role, must_change_password, company_terms_accepted_at, company_terms_version, company_privacy_accepted_at, company_privacy_policy_version, organizations(name)")
    .eq("auth_user_id", user.id)
    .single();

  if (error || !profile) {
    redirect("/login");
  }
  if ((profile as any).must_change_password) {
    redirect("/alterar-senha");
  }

  const hasCurrentLegalAcceptance =
    (profile as any).company_terms_version === LIFENERGY_COMPANY_TERMS_VERSION &&
    (profile as any).company_privacy_policy_version === LIFENERGY_PRIVACY_POLICY_VERSION &&
    Boolean((profile as any).company_terms_accepted_at) &&
    Boolean((profile as any).company_privacy_accepted_at);

  if ((profile as any).role !== "super_admin" && !hasCurrentLegalAcceptance) {
    redirect("/aceite-legal");
  }

  const organizations = (profile as any).organizations;

const organizationName = Array.isArray(organizations)
  ? organizations[0]?.name
  : organizations?.name;

  return (
    <CompanyShell
      userName={profile.name}
      organizationName={organizationName || "Lifenergy Digital"}
      role={profile.role}
    >
      {children}
    </CompanyShell>
  );
}
