import Link from "next/link";
import {
  LIFENERGY_PRIVACY_POLICY_VERSION,
  legalReturnLabel,
  safeLegalReturnTo,
} from "@/lib/legal";

type PageProps = {
  searchParams: Promise<{ returnTo?: string | string[] }>;
};

export default async function PrivacyPolicyPage({ searchParams }: PageProps) {
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
        <p className="eyebrow">Privacidade e proteção de dados</p>
        <h1>Política de Privacidade</h1>
        <p className="intro">
          Esta Política de Privacidade estabelece as diretrizes para o tratamento de dados pessoais
          no Lifenergy Digital, em conformidade com a legislação aplicável, especialmente a Lei Geral
          de Proteção de Dados Pessoais (LGPD – Lei nº 13.709/2018). Ao utilizar o sistema, o usuário
          declara ciência de que seus dados poderão ser tratados conforme as finalidades descritas
          neste documento.
        </p>

        <article className="card">
          <h2>1. Dados pessoais tratados</h2>
          <p>
            Durante o uso do Lifenergy Digital, poderão ser tratados dados pessoais necessários para
            viabilizar aplicações, análises, relatórios e jornadas de desenvolvimento humano e
            organizacional, incluindo:
          </p>
          <ul>
            <li><strong>Dados de identificação:</strong> nome, e-mail, CPF, naturalidade e data de nascimento.</li>
            <li><strong>Dados da aplicação:</strong> objetivo de participação, respostas, hierarquias, justificativas e reflexões registradas no formulário.</li>
            <li><strong>Dados operacionais:</strong> empresa, aplicador, data e horário da aplicação, status da jornada e documentos gerados.</li>
            <li><strong>Dados técnicos:</strong> registros de acesso, logs de segurança, informações de auditoria e demais dados necessários para prevenção de uso indevido e funcionamento adequado da plataforma.</li>
          </ul>

          <h2>2. Finalidades do tratamento</h2>
          <p>Os dados pessoais são tratados para:</p>
          <ul>
            <li>viabilizar a aplicação on-line da metodologia Lifenergy;</li>
            <li>gerar relatório de análise relacional e demais documentos contratados pela organização;</li>
            <li>permitir que usuários autorizados acompanhem aplicações, relatórios, PDIs e documentos corporativos;</li>
            <li>garantir a segurança, rastreabilidade, integridade e funcionamento do sistema;</li>
            <li>cumprir obrigações legais, contratuais, técnicas e administrativas aplicáveis.</li>
          </ul>

          <h2>3. Ciência do participante na aplicação on-line</h2>
          <p>
            Antes de concluir a aplicação, o participante deverá declarar ciência de que seus dados
            serão utilizados para fins de geração de relatório de análise relacional baseado na
            metodologia Lifenergy, conforme previsto nesta Política de Privacidade.
          </p>

          <h2>4. Compartilhamento de dados</h2>
          <p>Os dados pessoais poderão ser acessados ou compartilhados com:</p>
          <ul>
            <li>usuários autorizados da organização responsável pela aplicação;</li>
            <li>administradores necessários à operação e manutenção do Lifenergy Digital;</li>
            <li>fornecedores tecnológicos responsáveis por serviços essenciais, tais como hospedagem, segurança, armazenamento, envio de comunicações e geração de documentos.</li>
          </ul>
          <p>
            O compartilhamento será realizado exclusivamente para finalidades legítimas e compatíveis
            com o uso da plataforma.
          </p>

          <h2>5. Segurança da informação</h2>
          <p>
            O Lifenergy Digital adota medidas técnicas e administrativas destinadas a proteger os
            dados pessoais contra acessos não autorizados, perda, alteração indevida ou qualquer forma
            de tratamento incompatível com as finalidades informadas.
          </p>
          <p>
            Ainda assim, nenhum ambiente digital é totalmente isento de riscos, razão pela qual o uso
            responsável das credenciais e dos links de aplicação é fundamental para a proteção das
            informações.
          </p>

          <h2>6. Retenção e eliminação dos dados</h2>
          <p>
            Os dados pessoais serão mantidos pelo período necessário ao cumprimento das finalidades
            da aplicação, à execução contratual, ao atendimento de obrigações legais ou à preservação
            de registros legítimos da organização responsável.
          </p>
          <p>
            Solicitações de correção, atualização, anonimização ou eliminação serão avaliadas conforme
            o contexto da aplicação e as bases legais aplicáveis.
          </p>

          <h2>7. Direitos do titular</h2>
          <p>O titular dos dados poderá exercer seus direitos previstos na LGPD, incluindo:</p>
          <ul>
            <li>confirmação da existência de tratamento;</li>
            <li>acesso aos dados;</li>
            <li>correção de dados incompletos, inexatos ou desatualizados;</li>
            <li>anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;</li>
            <li>informação sobre compartilhamento;</li>
            <li>revogação do consentimento, quando aplicável.</li>
          </ul>
          <p>
            O exercício desses direitos observará as bases legais, obrigações de guarda e
            responsabilidades da organização responsável pela aplicação.
          </p>

          <h2>8. Atualizações desta política</h2>
          <p>
            Esta Política de Privacidade poderá ser atualizada para refletir mudanças no Lifenergy
            Digital, nas práticas de tratamento de dados, nos controles de segurança ou na legislação
            aplicável. A versão vigente será sempre disponibilizada aos usuários.
          </p>

          <p className="meta">Versão: {LIFENERGY_PRIVACY_POLICY_VERSION}</p>
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
