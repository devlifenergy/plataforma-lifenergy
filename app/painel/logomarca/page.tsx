import { CompanyLogoForm } from "@/components/application/CompanyLogoForm";
import { Card } from "@/components/ui/Card";
import { getOrganizationLogoData } from "@/services/pdi/actions";

export default async function CadastroLogomarcaPage() {
  const organization = await getOrganizationLogoData();
  const logoDataUrl =
    organization.logo_content_base64 && organization.logo_mime_type
      ? `data:${organization.logo_mime_type};base64,${organization.logo_content_base64}`
      : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#173A40]">Cadastro da Logomarca</h1>
        <p className="mt-1 max-w-4xl text-slate-500">
          Cadastre ou atualize a logomarca da empresa e defina sua apresentação no cabeçalho dos relatórios.
        </p>
      </div>

      <Card>
        <div className="mb-5 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-[#173A40]">Logomarca da empresa</h2>
          <p className="mt-1 text-[15px] leading-6 text-slate-600">
            A logomarca cadastrada será usada no cabeçalho dos próximos relatórios gerados pela plataforma.
          </p>
        </div>

        <CompanyLogoForm
          hasLogo={Boolean(organization.logo_content_base64)}
          logoFileName={organization.logo_file_name}
          logoDataUrl={logoDataUrl}
          logoSize={organization.logo_size}
          logoPosition={organization.logo_position}
        />
      </Card>
    </div>
  );
}
