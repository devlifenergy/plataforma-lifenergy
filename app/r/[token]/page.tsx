import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function PublicJourneyPage({ params }: PageProps) {
  const { token } = await params;
  redirect(`/r/${token}/formulario`);
}
