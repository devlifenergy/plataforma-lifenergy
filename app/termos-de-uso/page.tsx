import Link from "next/link";
import { LIFENERGY_TERMS_VERSION } from "@/lib/legal";

export default function TermsOfUsePage() {
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
          <Link href="/" className="back-link">Voltar para a página inicial</Link>
        </div>
      </header>

      <section className="legal-main">
        <p className="eyebrow">Termos legais</p>
        <h1>Termos de Uso</h1>
        <p className="intro">
          Estes Termos de Uso regulam o acesso e a utilização do Lifenergy Digital por empresas,
          administradores, aplicadores e participantes autorizados.
        </p>

        <article className="card">
          <h2>1. Objeto</h2>
          <p>
            O Lifenergy Digital é uma plataforma on-line destinada ao apoio de jornadas de
            desenvolvimento humano e organizacional, incluindo aplicação on-line, gestão de
            aplicadores, biblioteca técnica, biblioteca corporativa, geração de relatórios e PDIs,
            conforme as funcionalidades contratadas pela organização.
          </p>

          <h2>2. Acesso autorizado</h2>
          <p>
            O acesso ao Lifenergy Digital é restrito a usuários autorizados pela organização
            contratante ou a pessoas convidadas para participar de uma aplicação. Cada usuário é
            responsável por manter a confidencialidade de suas credenciais e por utilizar o sistema
            de forma ética, segura e compatível com sua finalidade.
          </p>

          <h2>3. Uso adequado do sistema</h2>
          <p>
            Os usuários se comprometem a não compartilhar links, senhas ou informações de acesso
            com pessoas não autorizadas. Também se comprometem a não tentar acessar dados,
            relatórios ou documentos pertencentes a outra organização. Não devem inserir conteúdos
            ilícitos, ofensivos, discriminatórios ou incompatíveis com a finalidade da metodologia.
            Os relatórios devem ser utilizados exclusivamente como instrumentos de desenvolvimento,
            reflexão e apoio à gestão, evitando interpretações discriminatórias, descontextualizadas
            ou que violem a legislação aplicável. A violação destas regras poderá resultar em
            suspensão ou bloqueio de acesso, sem prejuízo das medidas legais cabíveis.
          </p>

          <h2>4. Responsabilidades da organização</h2>
          <p>
            A organização contratante é responsável por indicar e gerenciar usuários autorizados,
            orientar seus aplicadores quanto ao uso adequado da plataforma, comunicar os
            participantes sobre a jornada e suas finalidades e utilizar os resultados gerados de
            forma compatível com a legislação vigente e com a Política de Privacidade.
          </p>

          <h2>5. Conteúdos e relatórios</h2>
          <p>
            Os conteúdos, relatórios e documentos gerados no Lifenergy Digital são produzidos a
            partir das informações registradas pelos usuários e participantes. As análises devem ser
            interpretadas dentro do contexto metodológico Lifenergy e utilizadas exclusivamente como
            apoio ao desenvolvimento humano e organizacional.
          </p>

          <h2>6. Disponibilidade e evolução do serviço</h2>
          <p>
            O Lifenergy Digital poderá receber atualizações, melhorias, correções técnicas e novas
            funcionalidades. Sempre que necessário, estes Termos de Uso poderão ser revisados para
            refletir mudanças operacionais, legais ou de segurança.
          </p>

          <h2>7. Privacidade e proteção de dados</h2>
          <p>
            O tratamento de dados pessoais realizado no Lifenergy Digital segue o disposto na
            Política de Privacidade. Ao utilizar o sistema, o usuário declara ciência de que seus
            dados serão tratados conforme as finalidades informadas, as bases legais aplicáveis e os
            controles de segurança implementados. Os titulares poderão exercer seus direitos previstos
            na legislação por meio dos canais disponibilizados pela plataforma ou pela organização
            contratante.
          </p>

          <p className="meta">Versão: {LIFENERGY_TERMS_VERSION}</p>
        </article>

        <div className="bottom-action">
          <Link href="/" className="primary-return">Voltar para a página inicial</Link>
        </div>
      </section>

      <footer className="legal-footer">
        <div className="legal-footer-inner">© 2026 Lifenergy. Desenvolvimento Humano e Organizacional.</div>
      </footer>
    </main>
  );
}
