import { redirect } from "next/navigation";
import { CompanyShell } from "@/components/layout/CompanyShell";
import { createClient } from "@/lib/supabaseServer";

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
    .select("name, email, role, organizations(name)")
    .eq("auth_user_id", user.id)
    .single();

  if (error || !profile) {
    redirect("/login");
  }

  const organizations = (profile as any).organizations;

const organizationName = Array.isArray(organizations)
  ? organizations[0]?.name
  : organizations?.name;

  return (
    <CompanyShell
      userName={profile.name}
      organizationName={organizationName || "Plataforma Lifenergy"}
      role={profile.role}
    >
      {children}
    </CompanyShell>
  );
}
