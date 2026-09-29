import Link from "next/link";
import { LIFENERGY_PRIVACY_POLICY_VERSION } from "@/lib/legal";

export default function PrivacyPolicyPage() {
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
        .legal-footer{border-top:1px solid #dce9ef;background:#fff}
        .legal-footer-inner{max-width:980px;margin:0 auto;padding:18px 24px;color:#64798a;font-size:13px}
        @media(max-width:640px){.legal-header-inner{align-items:flex-start;flex-direction:column}.legal-main{padding-top:34px}.card{padding:20px}}
`}</style>

      <header className="legal-header">
        <div className="legal-header-inner">
          <Link href="/" className="brand">Lifenergy Digital</Link>
          <Link href="/" className="back-link">Voltar para a página inicial</Link>
        </div>
      </header>

      <section className="legal-main">
        <p className="eyebrow">Privacidade e proteção de dados</p>
        <h1>Política de Privacidade</h1>
        <p className="intro">
          Esta Política de Privacidade descreve, de forma objetiva, como os dados pessoais podem ser
          tratados no Lifenergy Digital para viabilizar aplicações, análises, relatórios e jornadas de
          desenvolvimento humano e organizacional.
        </p>

        <article className="card">
          <h2>1. Dados pessoais tratados</h2>
          <p>Durante o uso do Lifenergy Digital, podem ser tratados dados como:</p>
          <ul>
            <li>dados de identificação: nome, e-mail, CPF, naturalidade e data de nascimento;</li>
            <li>dados da aplicação: objetivo de participação, respostas, hierarquias, justificativas e reflexões registradas no formulário;</li>
            <li>dados operacionais: empresa, aplicador, data de aplicação, horário, status da jornada e documentos gerados;</li>
            <li>dados técnicos: registros necessários para segurança, funcionamento, auditoria e prevenção de uso indevido.</li>
          </ul>

          <h2>2. Finalidades do tratamento</h2>
          <p>Os dados são utilizados para:</p>
          <ul>
            <li>realizar a aplicação on-line da metodologia Lifenergy;</li>
            <li>gerar relatório de análise relacional e demais documentos contratados pela organização;</li>
            <li>permitir que usuários autorizados acompanhem aplicações, relatórios, PDIs e documentos corporativos;</li>
            <li>manter a segurança, a rastreabilidade e a integridade do sistema;</li>
            <li>cumprir obrigações legais, contratuais, técnicas e administrativas aplicáveis.</li>
          </ul>

          <h2>3. Ciência do participante na aplicação on-line</h2>
          <p>
            Antes de concluir a aplicação on-line, o participante deverá declarar ciência de que seus
            dados serão utilizados para fins de geração de um relatorio de analise relacional usando
            a metodologia Lifenergy, conforme esta Política de Privacidade.
          </p>

          <h2>4. Compartilhamento</h2>
          <p>
            Os dados podem ser acessados por usuários autorizados da organização responsável pela
            aplicação, por administradores necessários à operação do Lifenergy Digital e por
            fornecedores tecnológicos indispensáveis ao funcionamento, armazenamento, segurança,
            envio de comunicações e geração de documentos.
          </p>

          <h2>5. Segurança</h2>
          <p>
            O Lifenergy Digital adota medidas técnicas e administrativas destinadas a proteger os
            dados contra acessos não autorizados, perda, alteração indevida ou tratamento incompatível
            com as finalidades informadas. Ainda assim, nenhum ambiente digital é isento de riscos,
            razão pela qual o uso responsável das credenciais e dos links de aplicação é essencial.
          </p>

          <h2>6. Retenção e eliminação</h2>
          <p>
            Os dados serão mantidos pelo período necessário ao cumprimento das finalidades da
            aplicação, à execução contratual, ao atendimento de obrigações legais ou à preservação de
            registros legítimos da organização responsável. Solicitações de correção, atualização,
            anonimização ou eliminação poderão ser avaliadas conforme o contexto da aplicação e a
            legislação aplicável.
          </p>

          <h2>7. Direitos do titular</h2>
          <p>
            O titular dos dados poderá solicitar informações sobre o tratamento, acesso, correção,
            atualização, anonimização, bloqueio ou eliminação de dados, observadas as bases legais,
            obrigações de guarda e responsabilidades da organização responsável pela aplicação.
          </p>

          <h2>8. Atualizações desta política</h2>
          <p>
            Esta Política de Privacidade poderá ser atualizada para refletir mudanças no Lifenergy
            Digital, nas práticas de tratamento de dados, nos controles de segurança ou na legislação
            aplicável.
          </p>

          <p className="meta">Versão: {LIFENERGY_PRIVACY_POLICY_VERSION}</p>
        </article>
      </section>

      <footer className="legal-footer">
        <div className="legal-footer-inner">© 2026 Lifenergy. Desenvolvimento Humano e Organizacional.</div>
      </footer>
    </main>
  );
}
