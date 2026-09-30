import Link from "next/link";
import {
  LIFENERGY_PARTICIPATION_TERMS_VERSION,
  legalReturnLabel,
  safeLegalReturnTo,
} from "@/lib/legal";

type PageProps = {
  searchParams: Promise<{ returnTo?: string | string[] }>;
};

export default async function ParticipationTermsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const returnTo = safeLegalReturnTo(params.returnTo);

  return (
    <main className="legal-page">
      <style>{`
        :root{color-scheme:light}
        .legal-page{min-height:100vh;background:#f3f8fb;color:#0f2d4a;font-family:Arial, Helvetica, sans-serif}
        .legal-header{border-bottom:1px solid #dce9ef;background:#fff}
        .legal-header-inner{max-width:980px;margin:0 auto;padding:22px 24px;display:flex;align-items:center;justify-content:space-between;gap:18px}
        .brand{font-weight:800;letter-spacing:-.02em;color:#052c42;text-decoration:none}
        .back-link{color:#0f6c87;text-decoration:none;font-weight:700;font-size:14px}
        .legal-main{max-width:980px;margin:0 auto;padding:46px 24px 64px}
        .eyebrow{margin:0 0 12px;color:#b98a2e;font-size:12px;font-weight:850;text-transform:uppercase;letter-spacing:.22em}
        h1{margin:0;color:#06233b;font-size:clamp(32px,4vw,48px);line-height:1.04;letter-spacing:-.04em}
        .intro{margin:16px 0 0;max-width:780px;color:#425c70;font-size:18px;line-height:1.7}
        .card{margin-top:26px;border:1px solid #dce9ef;border-radius:22px;background:#fff;padding:26px;box-shadow:0 14px 32px rgba(15,45,74,.08)}
        h2{margin:28px 0 10px;color:#08283f;font-size:22px;letter-spacing:-.02em}
        h2:first-child{margin-top:0}
        p,li{color:#425c70;font-size:16px;line-height:1.72}
        ul{margin:10px 0 0;padding-left:22px}
        .meta{margin-top:30px;border-top:1px solid #dce9ef;padding-top:18px;color:#64798a;font-size:14px}
        .bottom-action{margin-top:28px;display:flex;justify-content:center}
        .primary-return{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 22px;border-radius:14px;background:#0f2d4a;color:#fff;text-decoration:none;font-weight:800;box-shadow:0 12px 24px rgba(15,45,74,.16)}
        .primary-return:hover{opacity:.92}
        .legal-footer{border-top:1px solid #dce9ef;background:#fff}
        .legal-footer-inner{max-width:980px;margin:0 auto;padding:18px 24px;color:#64798a;font-size:13px}
        @media(max-width:640px){.legal-header-inner{align-items:flex-start;flex-direction:column}.legal-main{padding-top:34px}.card{padding:20px}.bottom-action{justify-content:stretch}.primary-return{width:100%}}
`}</style>

      <header className="legal-header">
        <div className="legal-header-inner">
          <Link href="/" className="brand">Lifenergy Digital</Link>
          <Link href={returnTo} className="back-link">{legalReturnLabel(returnTo)}</Link>
        </div>
      </header>

      <section className="legal-main">
        <p className="eyebrow">Aplicação on-line</p>
        <h1>Termo de Participação</h1>
        <p className="intro">
          Este Termo de Participação orienta a pessoa convidada a responder o formulário da
          metodologia Lifenergy no Lifenergy Digital.
        </p>

        <article className="card">
          <h2>1. Finalidade da participação</h2>
          <p>
            A participação tem como finalidade permitir a geração de um relatório de análise
            relacional baseado na metodologia Lifenergy, a partir das respostas, hierarquias,
            justificativas e reflexões registradas no formulário.
          </p>

          <h2>2. Responsabilidade pelas respostas</h2>
          <p>
            O participante deve responder de forma livre, consciente e compatível com sua percepção
            no momento da aplicação. As respostas fornecidas serão utilizadas como base para a
            análise relacional e para os documentos contratados pela organização responsável pela
            jornada.
          </p>

          <h2>3. Uso dos resultados</h2>
          <p>
            Os resultados gerados pelo Lifenergy Digital devem ser utilizados como instrumentos de
            desenvolvimento, reflexão e apoio à gestão. Eles não devem ser interpretados de forma
            isolada, discriminatória, punitiva ou fora do contexto metodológico Lifenergy.
          </p>

          <h2>4. Confidencialidade e acesso</h2>
          <p>
            As informações registradas na aplicação poderão ser acessadas por usuários autorizados da
            organização responsável, por aplicadores envolvidos na jornada e por administradores
            necessários à operação do Lifenergy Digital, sempre de acordo com a Política de
            Privacidade e com as finalidades informadas.
          </p>

          <h2>5. Privacidade e proteção de dados</h2>
          <p>
            Ao concluir a aplicação, o participante declara ciência de que seus dados serão utilizados
            para fins de geração de relatório de análise relacional usando a metodologia Lifenergy,
            conforme a Política de Privacidade vigente.
          </p>

          <h2>6. Direitos do participante</h2>
          <p>
            O participante poderá exercer seus direitos relacionados aos dados pessoais conforme a
            legislação aplicável, observadas as responsabilidades da organização responsável pela
            aplicação, as bases legais, as obrigações de guarda e o contexto da jornada realizada.
          </p>

          <p className="meta">Versão: {LIFENERGY_PARTICIPATION_TERMS_VERSION}</p>
        </article>

        <div className="bottom-action">
          <Link href={returnTo} className="primary-return">{legalReturnLabel(returnTo)}</Link>
        </div>
      </section>

      <footer className="legal-footer">
        <div className="legal-footer-inner">© 2026 Lifenergy. Desenvolvimento Humano e Organizacional.</div>
      </footer>
    </main>
  );
}
