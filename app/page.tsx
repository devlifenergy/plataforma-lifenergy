import Image from "next/image";
import Link from "next/link";
import { AppVersion } from "@/components/AppVersion";

function ArrowIcon({ down = false }: { down?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={down ? "arrow-svg arrow-svg-down" : "arrow-svg"}
    >
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="mini-icon">
      <path d="M5 7.5c4.3-.9 7.7.1 11 2.5v15c-3.3-2.4-6.7-3.4-11-2.5v-15Zm22 0c-4.3-.9-7.7.1-11 2.5v15c3.3-2.4 6.7-3.4 11-2.5v-15Z" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="mini-icon">
      <path d="M13.4 4.8h5.2l.8 3a10.8 10.8 0 0 1 2.2.9l2.7-1.6 3.7 3.7-1.6 2.7c.4.7.7 1.4.9 2.2l3 .8v5.2l-3 .8c-.2.8-.5 1.5-.9 2.2l1.6 2.7-3.7 3.7-2.7-1.6c-.7.4-1.4.7-2.2.9l-.8 3h-5.2l-.8-3a10.8 10.8 0 0 1-2.2-.9l-2.7 1.6L4 27.2l1.6-2.7c-.4-.7-.7-1.4-.9-2.2l-3-.8v-5.2l3-.8c.2-.8.5-1.5.9-2.2L4 10.8l3.7-3.7 2.7 1.6c.7-.4 1.4-.7 2.2-.9l.8-3Z" />
      <circle cx="16" cy="19" r="4.1" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="mini-icon">
      <path d="M16 27S4.5 20.4 4.5 12.2C4.5 8.8 7 6.3 10.2 6.3c2.5 0 4.5 1.5 5.8 3.5 1.3-2 3.3-3.5 5.8-3.5 3.2 0 5.7 2.5 5.7 5.9C27.5 20.4 16 27 16 27Z" />
    </svg>
  );
}

function PatternIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="mini-icon">
      <circle cx="7" cy="9" r="2" /><circle cx="16" cy="6" r="2" /><circle cx="25" cy="10" r="2" />
      <circle cx="10" cy="20" r="2" /><circle cx="21" cy="23" r="2" />
      <path d="m8.5 10.2 5.8-3M17.7 7.1l5.6 2M8.5 10.8l1 7M11.8 19.6l7.3 2.4M23.5 11.8l-1.8 8.8" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="mini-icon">
      <circle cx="16" cy="16" r="11" /><path d="m20.5 11.5-3.1 6-5.9 3 3-6 6-3Z" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="mini-icon">
      <circle cx="16" cy="10" r="4" /><circle cx="7.5" cy="13" r="3" /><circle cx="24.5" cy="13" r="3" />
      <path d="M9.5 26v-3.5c0-4 2.7-6.5 6.5-6.5s6.5 2.5 6.5 6.5V26M2.5 25v-2.5c0-3 1.8-5 5-5 1 0 1.9.2 2.6.6M29.5 25v-2.5c0-3-1.8-5-5-5-1 0-1.9.2-2.6.6" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="mini-icon">
      <path d="M16 28V14M16 18c-5.6 0-9.5-3.1-9.5-8.8 5.7 0 9.5 3.1 9.5 8.8Zm0-3.3c0-5.8 3.9-9 9.5-9 0 5.9-3.8 9-9.5 9Z" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="mini-icon">
      <path d="M6 28V8l12-4v24M18 11h8v17M10 10h3M10 15h3M10 20h3M21 15h2M21 20h2M3 28h26" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="mini-icon">
      <path d="M16 4 26 8v7c0 6.5-4 10.8-10 13-6-2.2-10-6.5-10-13V8l10-4Z" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="mini-icon">
      <path d="M8 4h11l5 5v19H8V4Z" /><path d="M19 4v6h5M12 15h8M12 20h8" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="mini-icon">
      <path d="M6 27V17h4v10M14 27V11h4v16M22 27V6h4v21" />
    </svg>
  );
}

function HeroOrbit() {
  return (
    <div className="hero-orbit" aria-label="Símbolo Lifenergy com pontos em movimento">
      <div className="orbit orbit-one"><span className="orbit-dot dot-a" /></div>
      <div className="orbit orbit-two"><span className="orbit-dot dot-b" /></div>
      <div className="orbit orbit-three"><span className="orbit-dot dot-c" /></div>
      <div className="orbit orbit-four"><span className="orbit-dot dot-d" /></div>
      <span className="free-dot free-one" /><span className="free-dot free-two" />
      <div className="hero-symbol-card">
        <Image src="/lifenergy-symbol.png" alt="" width={230} height={230} priority />
      </div>
    </div>
  );
}

const essenceLeft = [
  { label: "Conhecimento", icon: <BookIcon /> },
  { label: "Tecnologia", icon: <GearIcon /> },
  { label: "Sensibilidade", icon: <HeartIcon /> },
];

const essenceRight = [
  { label: "Padrões", icon: <PatternIcon /> },
  { label: "Escolhas", icon: <CompassIcon /> },
  { label: "Relações", icon: <PeopleIcon /> },
  { label: <>Novos caminhos<br />Mudanças reais</>, icon: <LeafIcon /> },
];

const benefits = [
  { text: "Leitura estruturada de padrões relacionais", icon: <PatternIcon /> },
  { text: "Jornadas aplicáveis a pessoas, equipes e organizações", icon: <PeopleIcon /> },
  { text: "Dados organizados para apoiar decisões mais humanas", icon: <ChartIcon /> },
  { text: "Metodologia integrada em experiência digital segura", icon: <ShieldIcon /> },
];

export default function Home() {
  return (
    <main className="landing-shell">
      <style>{`
        :root{--ink:#0a3150;--ink-2:#174d69;--teal:#1aa8ad;--cyan:#73d7dc;--ice:#eef8fb;--line:#d4eaf2;--hero:#073f5a;--hero2:#0b5875}
        *{box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{margin:0;background:#edf5f8;color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        a{color:inherit}
        .landing-shell{min-height:100vh;background:linear-gradient(180deg,#f8fbfc 0,#edf5f8 100%);padding:0 18px 28px}
        .page{width:min(1180px,100%);margin:0 auto;background:#fff;box-shadow:0 24px 70px rgba(7,57,76,.12);border:1px solid #dbeaf0;border-radius:0 0 26px 26px;overflow:hidden}
        .container{width:min(1030px,calc(100% - 64px));margin:0 auto}
        .header{height:92px;display:flex;align-items:center;justify-content:space-between;gap:28px;background:#fff}
        .brand-link{display:inline-flex;align-items:center;text-decoration:none;min-width:185px}
        .brand-link img{display:block;width:210px;height:auto}
        .desktop-nav{display:flex;align-items:center;gap:34px;margin-left:auto}
        .desktop-nav a{text-decoration:none;font-weight:650;font-size:14px;color:#244861}
        .desktop-nav a:hover{color:#087e9a}
        .header-actions{display:flex;align-items:center;gap:12px}
        .login-top{display:inline-flex;align-items:center;gap:10px;text-decoration:none;border:1px solid #b7d5e1;border-radius:14px;padding:11px 18px;font-weight:700;color:#173e59;background:#f8fcfd}
        .menu-icon{display:none;width:42px;height:42px;border:0;background:transparent;position:relative}
        .menu-icon::before,.menu-icon::after,.menu-icon span{content:"";position:absolute;left:8px;right:8px;height:2px;background:#1b536e;border-radius:3px}
        .menu-icon::before{top:12px}.menu-icon span{top:20px}.menu-icon::after{top:28px}
        .hero{position:relative;overflow:hidden;background:radial-gradient(circle at 78% 48%,rgba(54,185,208,.26),transparent 28%),linear-gradient(135deg,var(--hero) 0%,#064865 52%,var(--hero2) 100%);color:#fff;border-radius:0 0 30px 30px}
        .hero-inner{min-height:520px;display:grid;grid-template-columns:1.02fr .98fr;align-items:center;gap:42px;padding:58px 0 52px}
        .eyebrow{margin:0 0 16px;font-size:12px;line-height:1.2;text-transform:uppercase;letter-spacing:.22em;font-weight:800;color:#4f94b5}
        .hero .eyebrow{color:#d6f3f4}
        .hero h1{margin:0;max-width:560px;font-size:clamp(48px,5vw,70px);line-height:.98;letter-spacing:-.052em;font-weight:760}
        .hero h1 span{display:block;color:#9fe9e2;margin-top:8px}
        .hero-copy>p:not(.eyebrow){max-width:565px;margin:24px 0 28px;color:#e7f4f5;font-size:clamp(17px,1.7vw,21px);line-height:1.48}
        .primary-btn{display:inline-flex;align-items:center;justify-content:center;gap:15px;min-height:54px;padding:0 26px;background:#8ce4dd;color:#073e55;border-radius:14px;text-decoration:none;font-weight:800;box-shadow:0 15px 32px rgba(0,25,40,.24);transition:transform .2s,background .2s}
        .primary-btn:hover{transform:translateY(-2px);background:#a8eee8}
        .arrow-svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
        .hero-orbit{position:relative;width:min(460px,100%);aspect-ratio:1;justify-self:end;display:grid;place-items:center;filter:drop-shadow(0 24px 28px rgba(0,24,37,.23))}
        .hero-orbit::before{content:"";position:absolute;inset:18%;border-radius:50%;background:radial-gradient(circle,#43d9e250 0,#48c9d226 34%,transparent 72%);filter:blur(8px)}
        .orbit{position:absolute;border-radius:50%;border:1px solid rgba(189,245,246,.58);animation:spin linear infinite;transform-origin:center}
        .orbit-one{inset:9% 4%;animation-duration:14s;transform:rotate(13deg)}
        .orbit-two{inset:16% 8%;animation-duration:11s;animation-direction:reverse;transform:rotate(-27deg)}
        .orbit-three{inset:23% 13%;animation-duration:9s;transform:rotate(52deg)}
        .orbit-four{inset:29% 18%;animation-duration:7s;animation-direction:reverse;transform:rotate(76deg)}
        .orbit-dot{position:absolute;left:50%;top:-10px;translate:-50% 0;border-radius:50%;box-shadow:0 0 20px currentColor}
        .dot-a{width:28px;height:28px;background:#85e7df;color:#85e7df}.dot-b{width:20px;height:20px;background:#5bbce5;color:#5bbce5}.dot-c{width:17px;height:17px;background:#b0efe9;color:#b0efe9}.dot-d{width:12px;height:12px;background:#69cee1;color:#69cee1}
        .free-dot{position:absolute;border-radius:50%;animation:float 4.8s ease-in-out infinite;box-shadow:0 0 20px currentColor}.free-one{width:34px;height:34px;background:#74ded5;color:#74ded5;right:8%;top:39%}.free-two{width:12px;height:12px;background:#5bc3df;color:#5bc3df;left:14%;bottom:22%;animation-delay:-2.2s}
        .hero-symbol-card{position:relative;z-index:5;width:145px;height:145px;display:grid;place-items:center;border-radius:30px;background:linear-gradient(150deg,#0c5d78,#083e57);box-shadow:0 0 0 1px #9de9e270,0 0 45px rgba(105,225,225,.45),0 25px 50px rgba(0,20,35,.35);animation:float 5.4s ease-in-out infinite}
        .hero-symbol-card img{width:104px;height:104px;object-fit:contain}
        @keyframes spin{to{transform:rotate(373deg)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        .section{padding:52px 0}
        .section h2{margin:0;color:#093250;font-size:clamp(36px,4vw,50px);line-height:1.07;letter-spacing:-.045em}
        .section-copy{margin:14px 0 0;color:#3d6378;font-size:18px;line-height:1.55;max-width:860px}
        .essence{background:#fff}
        .essence-map{position:relative;margin-top:34px;display:grid;grid-template-columns:1fr 200px 1fr;align-items:center;gap:34px}
        .essence-list{display:grid;gap:12px}
        .essence-pill{position:relative;display:flex;align-items:center;gap:14px;min-height:62px;padding:11px 18px;border-radius:16px;background:linear-gradient(135deg,#f0f8fb,#e8f4f8);border:1px solid #dfedf2;font-weight:750;color:#123f5d}
        .essence-left .essence-pill::after{content:"";position:absolute;right:-35px;width:35px;height:1.5px;background:#36a7c1}
        .essence-right .essence-pill::before{content:"";position:absolute;left:-35px;width:35px;height:1.5px;background:#23a9a4}
        .icon-bubble{width:42px;height:42px;flex:0 0 42px;display:grid;place-items:center;border-radius:50%;background:#def4f7;color:#0784a6}
        .mini-icon{width:25px;height:25px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
        .essence-center{position:relative;z-index:2;display:grid;justify-items:center;gap:8px;padding:22px 12px;border-radius:22px;background:linear-gradient(145deg,#edf8fb,#dff2f7);border:1px solid #d7ebf2;box-shadow:0 12px 30px rgba(14,88,112,.08);font-weight:800;text-align:center;color:#0d4866}
        .essence-center img{width:68px;height:68px;object-fit:contain}
        .vision-row{display:grid;grid-template-columns:1fr 1.05fr;gap:18px;padding-top:0}
        .vision-card{position:relative;min-height:360px;border:1px solid var(--line);border-radius:22px;background:#fff;overflow:hidden;padding:30px}
        .vision-card h3{margin:10px 0 0;font-size:clamp(28px,3vw,40px);line-height:1.16;letter-spacing:-.035em;color:#17445f;font-family:Georgia,"Times New Roman",serif;font-weight:600}
        .landscape{position:absolute;left:0;right:0;bottom:0;height:145px;overflow:hidden;background:linear-gradient(#fff 0%,#fbf4dc 62%,#e8f1ee 100%)}
        .sun{position:absolute;width:62px;height:62px;border-radius:50%;right:18%;top:14px;background:#f7d99b;opacity:.75}
        .wave{position:absolute;left:-6%;right:-6%;height:88px;border-radius:50% 50% 0 0/55% 55% 0 0;transform:rotate(-2deg)}
        .wave.w1{bottom:-25px;background:#1b7897}.wave.w2{bottom:3px;background:#42a8b7;opacity:.9;transform:rotate(3deg)}.wave.w3{bottom:28px;background:#8ed2d7;opacity:.8;transform:rotate(-4deg)}.wave.w4{bottom:53px;background:#c7eaf0;opacity:.9;transform:rotate(3deg)}
        .why-card{padding:30px;border:1px solid var(--line);border-radius:22px;background:#fff}
        .why-card h3{margin:8px 0 20px;font-size:clamp(28px,3vw,38px);line-height:1.05;letter-spacing:-.035em;color:#0a3150}
        .benefit-list{display:grid;gap:14px}
        .benefit-item{display:grid;grid-template-columns:40px 1fr;align-items:center;gap:12px;color:#345b72;font-size:16px;line-height:1.35}.benefit-item .mini-icon{color:#087da2}
        .integrated{background:linear-gradient(180deg,#f8fcfd,#edf8fb);border-top:1px solid #e1eff4;border-bottom:1px solid #e1eff4}
        .integrated-flow{margin-top:28px;display:grid;grid-template-columns:220px 40px minmax(330px,430px) 40px 220px;align-items:center;justify-content:center;gap:10px}
        .source-list{display:grid;gap:12px}.source-card{display:flex;align-items:center;gap:12px;padding:13px 15px;border-radius:15px;background:#fff;border:1px solid #d9edf3;box-shadow:0 8px 18px rgba(13,83,107,.06);font-weight:750;color:#1c4660}.source-card .icon-bubble{width:38px;height:38px;flex-basis:38px}
        .flow-arrow-wrap{display:grid;place-items:center;color:#2498b1}.flow-arrow-wrap .arrow-svg{width:30px;height:30px}
        .hub-card{border:1px solid #bfe0eb;border-radius:20px;background:linear-gradient(145deg,#eefafe,#dff4f9);padding:16px;box-shadow:0 18px 34px rgba(14,88,112,.08)}
        .hub-brand{display:flex;align-items:center;justify-content:center;gap:10px;font-size:20px;font-weight:850;color:#0c4563;margin-bottom:12px}.hub-brand img{width:44px;height:44px;object-fit:contain}
        .hub-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.hub-item{min-height:105px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;padding:12px;text-align:center;border-radius:13px;background:#fff;border:1px solid #d8eaf0;font-weight:750;font-size:14px;line-height:1.2;color:#17445f}.hub-item .mini-icon{color:#0a89a9}
        .outcome-card{text-align:center;padding:22px 18px;border-radius:18px;background:linear-gradient(145deg,#e9faf8,#d7f1ee);border:1px solid #c5e8e4;color:#153f58}.outcome-card .icon-bubble{margin:0 auto 10px}.outcome-card strong{display:block;font-size:24px;line-height:1.05}.outcome-card p{margin:10px 0 0;font-size:14px;line-height:1.4;color:#426679}
        .journey{position:relative;overflow:hidden;padding:42px 0 46px;background:linear-gradient(135deg,#eaf7fb,#f8fbfa)}
        .journey::before,.journey::after{content:"";position:absolute;left:-8%;right:-8%;height:110px;border-radius:50% 50% 0 0/70% 70% 0 0;bottom:-56px}.journey::before{background:#7acdd3;transform:rotate(-2deg)}.journey::after{background:#2f8ca4;bottom:-82px;transform:rotate(3deg)}
        .journey-inner{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:30px}.journey h2{margin:4px 0 0;font-size:clamp(30px,3.5vw,44px);line-height:1.08;letter-spacing:-.04em}.journey .primary-btn{background:#0a5b78;color:#fff;box-shadow:none;white-space:nowrap}
        .footer{background:#fff;padding:20px 0}.footer-inner{display:grid;grid-template-columns:190px 1fr auto;align-items:center;gap:18px;font-size:12px;color:#5b7282}.footer-inner img{width:150px;height:auto}.version-wrap{white-space:nowrap;color:#476578}
        @media(max-width:900px){
          .desktop-nav{display:none}.menu-icon{display:block}.header{height:82px}.brand-link img{width:184px}.container{width:min(100% - 38px,760px)}
          .hero-inner{min-height:0;grid-template-columns:1fr;gap:24px;padding:42px 0 35px}.hero-copy{order:1}.hero-orbit{order:2;justify-self:center;width:min(380px,88vw)}.hero h1{font-size:clamp(42px,9vw,62px)}
          .essence-map{grid-template-columns:1fr;gap:18px}.essence-left,.essence-right{grid-template-columns:1fr}.essence-left .essence-pill::after,.essence-right .essence-pill::before{display:none}.essence-center{width:min(220px,100%);margin:0 auto}
          .vision-row{grid-template-columns:1fr}.vision-card{min-height:330px}
          .integrated-flow{grid-template-columns:1fr;max-width:560px;margin-left:auto;margin-right:auto}.flow-arrow-wrap .arrow-svg{transform:rotate(90deg)}.hub-card{width:100%}.outcome-card{width:100%}
          .journey-inner{align-items:flex-start;flex-direction:column}.journey .primary-btn{white-space:normal}
          .footer-inner{grid-template-columns:1fr auto}.footer-inner>span:nth-child(2){grid-column:1/-1;grid-row:2}.footer-inner img{width:135px}
        }
        @media(max-width:560px){
          .landing-shell{padding:0}.page{border:0;border-radius:0;box-shadow:none}.container{width:min(100% - 30px,500px)}
          .header{height:76px}.brand-link img{width:160px}.login-top{padding:9px 14px;font-size:14px}.menu-icon{width:34px;height:38px}
          .hero{border-radius:0 0 24px 24px}.hero-inner{padding:35px 0 28px}.hero h1{font-size:clamp(40px,12vw,54px)}.hero-copy>p:not(.eyebrow){font-size:17px;margin:20px 0 24px}.primary-btn{width:100%;padding:0 18px}.hero-orbit{width:min(310px,88vw)}.hero-symbol-card{width:108px;height:108px;border-radius:23px}.hero-symbol-card img{width:80px;height:80px}.dot-a{width:22px;height:22px}.free-one{width:27px;height:27px}
          .section{padding:42px 0}.section h2{font-size:34px}.section-copy{font-size:16px}.essence-map{margin-top:26px}.essence-pill{font-size:15px}.vision-card,.why-card{padding:24px}.vision-card{min-height:310px}.why-card h3{font-size:30px}.benefit-item{font-size:15px}
          .hub-grid{grid-template-columns:1fr 1fr}.hub-item{min-height:100px;font-size:12px;padding:9px}.source-card{font-size:15px}.outcome-card strong{font-size:22px}
          .journey{padding:36px 0 88px}.journey h2{font-size:32px}.footer-inner{grid-template-columns:1fr;justify-items:start}.footer-inner>span:nth-child(2){grid-column:auto;grid-row:auto}.version-wrap{font-size:11px}
        }
        @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.orbit,.free-dot,.hero-symbol-card{animation:none}.primary-btn{transition:none}}
      `}</style>

      <div className="page">
        <header className="header container">
          <Link href="/" className="brand-link" aria-label="Lifenergy - início">
            <Image src="/lifenergy-logo.png" alt="Lifenergy" width={960} height={230} priority />
          </Link>

          <nav className="desktop-nav" aria-label="Navegação principal">
            <a href="#essencia">Nossa essência</a>
            <a href="#visao-integrada">Visão integrada</a>
          </nav>

          <div className="header-actions">
            <Link href="/login" className="login-top">Entrar <ArrowIcon /></Link>
            <button className="menu-icon" type="button" aria-label="Menu"><span /></button>
          </div>
        </header>

        <section className="hero" id="inicio">
          <div className="hero-inner container">
            <div className="hero-copy">
              <p className="eyebrow">Pessoas no centro da transformação</p>
              <h1>Consciência que transforma.<span>Energia que conecta.</span></h1>
              <p>Uma metodologia de desenvolvimento humano e organizacional que revela potenciais, amplia perspectivas e fortalece relações.</p>
              <Link href="/login" className="primary-btn">Entrar no Lifenergy Digital <ArrowIcon /></Link>
            </div>
            <HeroOrbit />
          </div>
        </section>

        <section className="section essence" id="essencia">
          <div className="container">
            <p className="eyebrow">Nossa essência</p>
            <h2>Desenvolvimento que começa de dentro.</h2>
            <p className="section-copy">Lifenergy Digital integra conhecimento, tecnologia e sensibilidade para apoiar mudanças reais. Tornamos visíveis os padrões que orientam escolhas e relações, criando espaço para novos caminhos.</p>

            <div className="essence-map" aria-label="Conhecimento, tecnologia e sensibilidade geram padrões, escolhas, relações e novos caminhos">
              <div className="essence-list essence-left">
                {essenceLeft.map((item) => <div className="essence-pill" key={item.label}><span className="icon-bubble">{item.icon}</span><span>{item.label}</span></div>)}
              </div>
              <div className="essence-center">
                <Image src="/lifenergy-symbol.png" alt="" width={230} height={230} />
                <span>Lifenergy<br />Digital</span>
              </div>
              <div className="essence-list essence-right">
                {essenceRight.map((item, i) => <div className="essence-pill" key={i}><span className="icon-bubble">{item.icon}</span><span>{item.label}</span></div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="porque-lifenergy">
          <div className="container vision-row">
            <article className="vision-card">
              <p className="eyebrow">Visão integrada</p>
              <h3>“Pessoas mais conscientes constroem organizações mais produtivas.”</h3>
              <div className="landscape" aria-hidden="true"><span className="sun" /><span className="wave w4" /><span className="wave w3" /><span className="wave w2" /><span className="wave w1" /></div>
            </article>

            <article className="why-card">
              <p className="eyebrow">Por que Lifenergy Digital</p>
              <h3>Clareza para compreender.<br />Direção para transformar.</h3>
              <div className="benefit-list">
                {benefits.map((item) => <div className="benefit-item" key={item.text}><span className="icon-bubble">{item.icon}</span><span>{item.text}</span></div>)}
              </div>
            </article>
          </div>
        </section>

        <section className="section integrated" id="visao-integrada">
          <div className="container">
            <p className="eyebrow">Conexões que geram perspectiva</p>
            <h2>Visão integrada.</h2>
            <p className="section-copy">Lifenergy Digital organiza e cruza informações dos sistemas envolvidos para identificar padrões, ampliar perspectivas e orientar ações de desenvolvimento humano e organizacional.</p>

            <div className="integrated-flow" aria-label="Pessoas, organizações e contexto ético e legal conectados pelo Lifenergy Digital a uma leitura integrada">
              <div className="source-list">
                <div className="source-card"><span className="icon-bubble"><PeopleIcon /></span><span>Pessoas</span></div>
                <div className="source-card"><span className="icon-bubble"><BuildingIcon /></span><span>Organizações</span></div>
                <div className="source-card"><span className="icon-bubble"><ShieldIcon /></span><span>Contexto ético e legal</span></div>
              </div>

              <div className="flow-arrow-wrap"><ArrowIcon /></div>

              <div className="hub-card">
                <div className="hub-brand"><Image src="/lifenergy-symbol.png" alt="" width={230} height={230} /><span>Lifenergy Digital</span></div>
                <div className="hub-grid">
                  <div className="hub-item"><DocumentIcon /><span>Relatório<br />relacional</span></div>
                  <div className="hub-item"><BookIcon /><span>Biblioteca<br />corporativa</span></div>
                  <div className="hub-item"><ChartIcon /><span>PDI<br />corporativo</span></div>
                  <div className="hub-item"><ShieldIcon /><span>Cadastro de aplicadores autorizados</span></div>
                </div>
              </div>

              <div className="flow-arrow-wrap"><ArrowIcon /></div>

              <div className="outcome-card">
                <span className="icon-bubble"><ChartIcon /></span>
                <strong>Uma leitura integrada</strong>
                <p>Informações conectadas para apoiar decisões e caminhos de desenvolvimento.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="journey" id="jornada">
          <div className="container journey-inner">
            <div>
              <p className="eyebrow">Lifenergy Digital</p>
              <h2>Acesse sua jornada de desenvolvimento.</h2>
            </div>
            <Link href="/login" className="primary-btn">Entrar no Lifenergy Digital <ArrowIcon /></Link>
          </div>
        </section>

        <footer className="footer">
          <div className="container footer-inner">
            <Image src="/lifenergy-logo.png" alt="Lifenergy" width={960} height={230} />
            <span>© 2026 Lifenergy. Desenvolvimento Humano e Organizacional.</span>
            <span className="version-wrap"><AppVersion /></span>
          </div>
        </footer>
      </div>
    </main>
  );
}
