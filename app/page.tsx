import Image from "next/image";
import Link from "next/link";
import { AppVersion } from "@/components/AppVersion";

type IconProps = { className?: string };

function ArrowRight({ className = "icon" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

function ArrowDown({ className = "icon" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 4v14M6 12l6 6 6-6" />
    </svg>
  );
}

function BookIcon({ className = "icon" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M5 7.5c4.3-.9 7.7.1 11 2.5v15c-3.3-2.4-6.7-3.4-11-2.5v-15Zm22 0c-4.3-.9-7.7.1-11 2.5v15c3.3-2.4 6.7-3.4 11-2.5v-15Z" />
    </svg>
  );
}

function GearIcon({ className = "icon" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M13.4 4.8h5.2l.8 3a10.8 10.8 0 0 1 2.2.9l2.7-1.6 3.7 3.7-1.6 2.7c.4.7.7 1.4.9 2.2l3 .8v5.2l-3 .8c-.2.8-.5 1.5-.9 2.2l1.6 2.7-3.7 3.7-2.7-1.6c-.7.4-1.4.7-2.2.9l-.8 3h-5.2l-.8-3a10.8 10.8 0 0 1-2.2-.9l-2.7 1.6L4 27.2l1.6-2.7c-.4-.7-.7-1.4-.9-2.2l-3-.8v-5.2l3-.8c.2-.8.5-1.5.9-2.2L4 10.8l3.7-3.7 2.7 1.6c.7-.4 1.4-.7 2.2-.9l.8-3Z" />
      <circle cx="16" cy="19" r="4.1" />
    </svg>
  );
}

function HeartIcon({ className = "icon" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M16 27S4.5 20.4 4.5 12.2C4.5 8.8 7 6.3 10.2 6.3c2.5 0 4.5 1.5 5.8 3.5 1.3-2 3.3-3.5 5.8-3.5 3.2 0 5.7 2.5 5.7 5.9C27.5 20.4 16 27 16 27Z" />
    </svg>
  );
}

function PatternIcon({ className = "icon" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="7" cy="9" r="2" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="25" cy="10" r="2" />
      <circle cx="10" cy="20" r="2" />
      <circle cx="21" cy="23" r="2" />
      <path d="m8.5 10.2 5.8-3M17.7 7.1l5.6 2M8.5 10.8l1 7M11.8 19.6l7.3 2.4M23.5 11.8l-1.8 8.8" />
    </svg>
  );
}

function CompassIcon({ className = "icon" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="11" />
      <path d="m20.5 11.5-3.1 6-5.9 3 3-6 6-3Z" />
    </svg>
  );
}

function PeopleIcon({ className = "icon" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="10" r="4" />
      <circle cx="7.5" cy="13" r="3" />
      <circle cx="24.5" cy="13" r="3" />
      <path d="M9.5 26v-3.5c0-4 2.7-6.5 6.5-6.5s6.5 2.5 6.5 6.5V26M2.5 25v-2.5c0-3 1.8-5 5-5 1 0 1.9.2 2.6.6M29.5 25v-2.5c0-3-1.8-5-5-5-1 0-1.9.2-2.6.6" />
    </svg>
  );
}

function LeafIcon({ className = "icon" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M16 28V14M16 18c-5.6 0-9.5-3.1-9.5-8.8 5.7 0 9.5 3.1 9.5 8.8Zm0-3.3c0-5.8 3.9-9 9.5-9 0 5.9-3.8 9-9.5 9Z" />
    </svg>
  );
}

function BuildingIcon({ className = "icon" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M6 28V8l12-4v24M18 11h8v17M10 10h3M10 15h3M10 20h3M21 15h2M21 20h2M3 28h26" />
    </svg>
  );
}

function ShieldIcon({ className = "icon" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M16 4 26 8v7c0 6.5-4 10.8-10 13-6-2.2-10-6.5-10-13V8l10-4Z" />
    </svg>
  );
}

function DocumentIcon({ className = "icon" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M8 4h11l5 5v19H8V4Z" />
      <path d="M19 4v6h5M12 15h8M12 20h8" />
    </svg>
  );
}

function ChartIcon({ className = "icon" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M6 27V17h4v10M14 27V11h4v16M22 27V6h4v21" />
    </svg>
  );
}

function EssenceConnector({ reverse = false }: { reverse?: boolean }) {
  return (
    <svg className={`connector ${reverse ? "connector-reverse" : ""}`} viewBox="0 0 100 220" aria-hidden="true" preserveAspectRatio="none">
      {reverse ? (
        <>
          <path d="M96 110C72 110 71 32 8 32" />
          <path d="M96 110C72 110 71 84 8 84" />
          <path d="M96 110C72 110 71 136 8 136" />
          <path d="M96 110C72 110 71 188 8 188" />
        </>
      ) : (
        <>
          <path d="M4 32C29 32 29 70 92 110" />
          <path d="M4 110C29 110 29 110 92 110" />
          <path d="M4 188C29 188 29 150 92 110" />
        </>
      )}
    </svg>
  );
}

function LandscapeArt() {
  return (
    <svg className="landscape-art" viewBox="0 0 600 260" aria-hidden="true" preserveAspectRatio="xMidYMax slice">
      <circle cx="458" cy="58" r="39" fill="#f8dfaa" opacity=".95" />
      <path d="M0 137C90 99 135 112 205 144C276 177 365 103 446 124C510 140 563 137 600 119V260H0Z" fill="#d9eef5" />
      <path d="M0 163C98 113 168 145 239 174C318 207 365 142 450 151C515 158 560 162 600 143V260H0Z" fill="#a9dce4" />
      <path d="M0 189C87 155 157 174 226 201C299 230 369 171 444 179C509 186 553 187 600 170V260H0Z" fill="#70c2cf" />
      <path d="M0 218C91 184 176 198 249 221C326 246 399 208 469 208C521 208 565 215 600 203V260H0Z" fill="#2f91a9" />
      <path d="M0 240C103 214 184 224 261 241C350 260 425 238 495 237C540 237 573 242 600 235V260H0Z" fill="#126b87" />
    </svg>
  );
}

function FooterWaves() {
  return (
    <svg className="footer-waves" viewBox="0 0 1200 250" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 155C170 96 288 124 424 165C578 211 756 93 910 126C1038 153 1118 157 1200 128V250H0Z" fill="#d9eef5" />
      <path d="M0 187C173 131 310 160 451 194C595 229 750 143 910 161C1037 176 1118 183 1200 160V250H0Z" fill="#a6dbe3" />
      <path d="M0 218C170 175 328 194 466 220C625 250 786 191 932 195C1047 198 1126 209 1200 195V250H0Z" fill="#62becd" />
      <path d="M0 238C178 206 330 216 490 234C656 253 817 224 961 226C1061 228 1137 234 1200 225V250H0Z" fill="#2f91a9" />
      <circle cx="1088" cy="80" r="11" fill="#f8dfaa" />
      <path d="M620 199C728 171 798 174 879 195C944 211 1013 211 1082 191" fill="none" stroke="#fff" strokeWidth="2" opacity=".72" />
    </svg>
  );
}

function HeroOrbit() {
  return (
    <div className="hero-orbit" role="img" aria-label="Símbolo Lifenergy com pontos em movimento">
      <div className="hero-glow" />
      <div className="orbit orbit-a"><span className="orb orb-a" /></div>
      <div className="orbit orbit-b"><span className="orb orb-b" /></div>
      <div className="orbit orbit-c"><span className="orb orb-c" /></div>
      <div className="orbit orbit-d"><span className="orb orb-d" /></div>
      <span className="free-orb free-a" />
      <span className="free-orb free-b" />
      <div className="hero-symbol">
        <Image src="/lifenergy-symbol.png" alt="" width={220} height={220} priority />
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

const hubItems = [
  { text: "Relatório relacional", icon: <DocumentIcon /> },
  { text: "Biblioteca corporativa", icon: <BookIcon /> },
  { text: "PDI corporativo", icon: <ChartIcon /> },
  { text: "Cadastro de aplicadores autorizados", icon: <PeopleIcon /> },
];

export default function Home() {
  return (
    <main className="landing-shell">
      <style>{`
        :root{--ink:#0b3554;--ink2:#2f5b73;--blue:#0a6686;--teal:#2eb4b6;--cyan:#76dfe0;--ice:#eef8fb;--line:#d6e9ef;--hero1:#073d59;--hero2:#0b5a76}
        *{box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{margin:0;background:#edf5f8;color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        a{color:inherit}
        .landing-shell{min-height:100vh;padding:0 18px 30px;background:linear-gradient(180deg,#f7fbfc 0%,#edf5f8 100%)}
        .page{width:min(1180px,100%);margin:0 auto;background:#fff;border:1px solid #d7e8ee;border-radius:0 0 28px 28px;box-shadow:0 28px 80px rgba(10,62,85,.12);overflow:hidden}
        .container{width:min(1034px,calc(100% - 64px));margin-inline:auto}
        .icon{width:28px;height:28px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
        .mini{width:23px;height:23px}
        .header{height:92px;display:flex;align-items:center;justify-content:space-between;gap:28px;background:#fff}
        .brand-link{display:inline-flex;align-items:center;text-decoration:none;flex:none}
        .brand-link img{display:block;width:205px;height:auto}
        .desktop-nav{display:flex;align-items:center;gap:34px;margin-left:auto}
        .desktop-nav a{text-decoration:none;font-size:14px;font-weight:700;color:#2b536b;transition:color .2s}
        .desktop-nav a:hover{color:#0c83a0}
        .header-actions{display:flex;align-items:center;gap:12px}
        .login-top{display:inline-flex;align-items:center;gap:10px;min-height:46px;padding:0 18px;border:1px solid #b8d7e2;border-radius:14px;background:#f9fcfd;text-decoration:none;font-weight:800;color:#173f5a}
        .login-top .icon{width:18px;height:18px}
        .mobile-menu{display:none;position:relative}
        .mobile-menu summary{list-style:none;width:42px;height:42px;cursor:pointer;display:grid;place-items:center;border-radius:12px;border:1px solid transparent}
        .mobile-menu summary::-webkit-details-marker{display:none}
        .hamburger{position:relative;width:25px;height:18px}
        .hamburger::before,.hamburger::after,.hamburger span{content:"";position:absolute;left:0;right:0;height:2px;border-radius:3px;background:#19516e}
        .hamburger::before{top:0}.hamburger span{top:8px}.hamburger::after{top:16px}
        .mobile-panel{position:absolute;right:0;top:50px;z-index:30;width:220px;padding:10px;border-radius:16px;background:#fff;border:1px solid #d7e8ee;box-shadow:0 18px 42px rgba(4,54,77,.16)}
        .mobile-panel a{display:block;padding:12px 13px;border-radius:10px;text-decoration:none;font-weight:700;color:#214b64}.mobile-panel a:hover{background:#edf8fa}
        .hero{position:relative;overflow:hidden;color:#fff;background:radial-gradient(circle at 76% 50%,rgba(55,200,216,.25),transparent 30%),linear-gradient(135deg,var(--hero1) 0%,#064864 52%,var(--hero2) 100%);border-radius:0 0 30px 30px}
        .hero-inner{min-height:520px;display:grid;grid-template-columns:1.03fr .97fr;align-items:center;gap:48px;padding:56px 0 50px}
        .eyebrow{margin:0 0 14px;color:#4e94b3;font-size:12px;line-height:1.2;font-weight:850;text-transform:uppercase;letter-spacing:.22em}
        .hero .eyebrow{color:#d8f4f5}
        .hero h1{margin:0;max-width:560px;color:#fff;font-size:clamp(48px,5.1vw,70px);line-height:.98;letter-spacing:-.052em;font-weight:780}
        .hero h1 span{display:block;margin-top:8px;color:#9ee9e2}
        .hero-copy>p:not(.eyebrow){max-width:560px;margin:22px 0 28px;color:#e7f4f5;font-size:clamp(17px,1.7vw,21px);line-height:1.5}
        .primary-btn{display:inline-flex;align-items:center;justify-content:center;gap:14px;min-height:54px;padding:0 26px;border-radius:14px;background:#91e8e0;color:#073d54;text-decoration:none;font-weight:850;box-shadow:0 15px 34px rgba(0,25,40,.22);transition:transform .2s,background .2s}
        .primary-btn:hover{transform:translateY(-2px);background:#adf0eb}.primary-btn .icon{width:19px;height:19px}
        .hero-orbit{position:relative;width:min(440px,100%);aspect-ratio:1;justify-self:end;display:grid;place-items:center;filter:drop-shadow(0 22px 32px rgba(0,23,38,.22))}
        .hero-glow{position:absolute;inset:22%;border-radius:50%;background:radial-gradient(circle,#4be0e35e 0%,#49ccd02a 45%,transparent 74%);filter:blur(8px)}
        .orbit{position:absolute;border-radius:50%;border:1px solid rgba(193,246,247,.72);animation:spin linear infinite;transform-origin:center}
        .orbit::after{content:"";position:absolute;inset:50% -4%;height:1px;background:linear-gradient(90deg,transparent,rgba(152,234,240,.45),transparent);transform:rotate(18deg)}
        .orbit-a{inset:8% 3%;animation-duration:15s;transform:rotate(13deg)}
        .orbit-b{inset:16% 8%;animation-duration:12s;animation-direction:reverse;transform:rotate(-24deg)}
        .orbit-c{inset:24% 14%;animation-duration:9.5s;transform:rotate(52deg)}
        .orbit-d{inset:31% 20%;animation-duration:7.5s;animation-direction:reverse;transform:rotate(76deg)}
        .orb{position:absolute;left:50%;top:-11px;translate:-50% 0;border-radius:50%;box-shadow:0 0 22px currentColor}
        .orb-a{width:30px;height:30px;background:#8aebe3;color:#8aebe3}.orb-b{width:22px;height:22px;background:#63c7e7;color:#63c7e7}.orb-c{width:18px;height:18px;background:#b1f1eb;color:#b1f1eb}.orb-d{width:13px;height:13px;background:#65d3e6;color:#65d3e6}
        .free-orb{position:absolute;border-radius:50%;animation:float 4.8s ease-in-out infinite;box-shadow:0 0 22px currentColor}.free-a{width:36px;height:36px;background:#79e1d8;color:#79e1d8;right:8%;top:39%}.free-b{width:11px;height:11px;background:#59bede;color:#59bede;left:15%;bottom:22%;animation-delay:-2.2s}
        .hero-symbol{position:relative;z-index:5;width:146px;height:146px;border-radius:31px;display:grid;place-items:center;background:linear-gradient(145deg,#0d4f68,#0a3d55);box-shadow:0 18px 36px rgba(0,20,32,.38),0 0 0 1px rgba(187,244,245,.28),inset 0 0 28px rgba(59,207,218,.16);animation:float 5.6s ease-in-out infinite}
        .hero-symbol img{width:112px;height:112px;object-fit:contain}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        .section{padding:48px 0}
        .section h2{margin:0;color:#0b3554;font-size:clamp(36px,4vw,52px);line-height:1.05;letter-spacing:-.045em;font-weight:780}
        .section-copy{max-width:940px;margin:13px 0 0;color:#456b80;font-size:18px;line-height:1.52}
        .essence-map{margin-top:30px;display:grid;grid-template-columns:minmax(210px,.9fr) 74px minmax(160px,.65fr) 74px minmax(220px,1fr);align-items:center;gap:8px}
        .essence-list{display:grid;gap:10px}
        .essence-pill{min-height:58px;display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:15px;background:#f3f9fb;border:1px solid #dfedf2;color:#174764;font-weight:780;box-shadow:0 7px 17px rgba(18,88,113,.04)}
        .icon-bubble{width:38px;height:38px;display:grid;place-items:center;flex:0 0 38px;border-radius:50%;background:#e2f6f7;color:#0983a6}.icon-bubble .icon{width:23px;height:23px}
        .essence-center{min-height:150px;border-radius:22px;border:1px solid #d4e8ee;background:linear-gradient(145deg,#eef9fb,#e5f4f7);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:16px;text-align:center;color:#0c4562;font-weight:850;font-size:20px;line-height:1.06;box-shadow:0 13px 28px rgba(20,89,110,.07)}
        .essence-center img{width:62px;height:62px;object-fit:contain}
        .connector{width:100%;height:220px;overflow:visible}.connector path{fill:none;stroke:#2e9bc1;stroke-width:2.1;stroke-linecap:round;vector-effect:non-scaling-stroke}.connector-reverse path{stroke:#16aaa9}
        .mobile-flow-arrow{display:none;color:#2e9bc1;place-items:center;margin:0 auto}.mobile-flow-arrow .icon{width:27px;height:27px}
        .cards-row{display:grid;grid-template-columns:1fr 1.08fr;gap:16px}
        .info-card{position:relative;overflow:hidden;min-height:350px;border-radius:20px;border:1px solid #dbeaf0;background:#fff;box-shadow:0 12px 24px rgba(18,78,102,.05)}
        .vision-card{padding:24px 24px 0}.vision-card h3{max-width:420px;margin:16px 0 0;font-size:clamp(28px,3.2vw,40px);line-height:1.12;letter-spacing:-.03em;color:#1a5777;font-weight:560}
        .landscape-wrap{position:absolute;left:0;right:0;bottom:0;height:168px;overflow:hidden}.landscape-art{width:100%;height:100%;display:block}
        .why-card{padding:24px}.why-card h3{margin:8px 0 19px;font-size:clamp(28px,3.1vw,40px);line-height:1.04;letter-spacing:-.036em;color:#0c3554;font-weight:780}
        .benefit-list{display:grid;gap:12px}.benefit-item{display:grid;grid-template-columns:40px 1fr;align-items:center;gap:12px;color:#3f6479;font-size:16px;line-height:1.36}.benefit-item .icon-bubble{background:transparent;color:#0780a2}
        .integrated{background:linear-gradient(180deg,#fbfdfe,#eef8fb);border-top:1px solid #e0eef3;border-bottom:1px solid #e0eef3}
        .integrated-flow{margin-top:30px;display:grid;grid-template-columns:minmax(190px,220px) 46px minmax(330px,410px) 46px minmax(190px,220px);align-items:center;justify-content:center;gap:12px}
        .source-list{display:grid;gap:11px}.source-card{min-height:56px;display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:15px;background:#fff;border:1px solid #d7eaf1;box-shadow:0 8px 18px rgba(15,82,108,.05);font-weight:780;color:#1e4a65}.source-card .icon-bubble{background:#e8f8f8}
        .flow-arrow-wrap{display:grid;place-items:center;color:#269ab3}.flow-arrow-wrap .icon{width:30px;height:30px}
        .hub-card{border:1px solid #bddfe9;border-radius:20px;background:linear-gradient(145deg,#edf9fc,#def3f8);padding:15px;box-shadow:0 18px 34px rgba(14,87,111,.08)}
        .hub-brand{display:flex;align-items:center;justify-content:center;gap:9px;margin-bottom:11px;color:#0b4663;font-size:19px;font-weight:860}.hub-brand img{width:42px;height:42px;object-fit:contain}
        .hub-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.hub-item{min-height:104px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;padding:10px;border:1px solid #d7e9ef;border-radius:13px;background:#fff;text-align:center;color:#17445f;font-size:13px;font-weight:780;line-height:1.2}.hub-item .icon{color:#0b89aa}
        .outcome-card{text-align:center;padding:22px 16px;border-radius:18px;background:linear-gradient(145deg,#e8faf8,#d9f2ef);border:1px solid #c3e7e3;color:#153e58;box-shadow:0 12px 24px rgba(14,88,112,.05)}
        .outcome-card .icon-bubble{margin:0 auto 10px}.outcome-card strong{display:block;font-size:24px;line-height:1.05}.outcome-card p{margin:10px 0 0;color:#44697d;font-size:14px;line-height:1.4}
        .journey{position:relative;overflow:hidden;padding:40px 0 54px;background:linear-gradient(135deg,#edf8fb,#f9fcfb)}
        .journey-inner{position:relative;z-index:3;display:flex;align-items:center;justify-content:space-between;gap:28px}.journey h2{margin:4px 0 0;color:#0b3554;font-size:clamp(30px,3.6vw,44px);line-height:1.07;letter-spacing:-.04em}.journey .primary-btn{flex:none;background:#07597a;color:#fff;box-shadow:none;white-space:nowrap}.footer-waves{position:absolute;inset:auto 0 0;width:100%;height:150px;z-index:1;pointer-events:none}
        .footer{background:#fff;padding:18px 0}.footer-inner{display:grid;grid-template-columns:170px 1fr auto;align-items:center;gap:18px;color:#587184;font-size:12px}.footer-inner img{width:145px;height:auto}.footer-inner .version{white-space:nowrap;color:#476578}
        @media(max-width:940px){
          .desktop-nav{display:none}.mobile-menu{display:block}.container{width:min(100% - 40px,760px)}
          .hero-inner{min-height:0;grid-template-columns:1fr;gap:28px;padding:44px 0 34px}.hero-orbit{justify-self:center;width:min(390px,88vw)}.hero-copy{text-align:left}.hero h1{font-size:clamp(44px,9vw,62px)}
          .essence-map{grid-template-columns:1fr;gap:14px}.essence-left,.essence-right{grid-template-columns:1fr}.connector{display:none}.mobile-flow-arrow{display:grid}.essence-center{width:min(230px,100%);margin:0 auto}.essence-list{width:min(520px,100%);margin-inline:auto}
          .cards-row{grid-template-columns:1fr}.vision-card{min-height:330px}.why-card{min-height:0}
          .integrated-flow{grid-template-columns:1fr;max-width:560px;margin-inline:auto}.flow-arrow-wrap .icon{transform:rotate(90deg)}.hub-card,.outcome-card{width:100%}
          .journey-inner{align-items:flex-start;flex-direction:column}.journey .primary-btn{white-space:normal}
          .footer-inner{grid-template-columns:1fr auto}.footer-inner>span:nth-child(2){grid-column:1/-1;grid-row:2}.footer-inner img{width:132px}
        }
        @media(max-width:560px){
          .landing-shell{padding:0}.page{border:0;border-radius:0;box-shadow:none}.container{width:min(100% - 30px,500px)}
          .header{height:76px}.brand-link img{width:158px}.login-top{min-height:42px;padding:0 13px;font-size:14px}.mobile-menu summary{width:36px;height:38px}.mobile-panel{right:-2px;width:min(220px,calc(100vw - 30px))}
          .hero{border-radius:0 0 24px 24px}.hero-inner{padding:34px 0 28px}.hero h1{font-size:clamp(40px,12vw,52px)}.hero-copy>p:not(.eyebrow){font-size:17px;margin:19px 0 24px}.primary-btn{width:100%;padding:0 18px}.hero-orbit{width:min(300px,88vw)}.hero-symbol{width:108px;height:108px;border-radius:24px}.hero-symbol img{width:80px;height:80px}.orb-a{width:23px;height:23px}.free-a{width:28px;height:28px}
          .section{padding:40px 0}.section h2{font-size:34px}.section-copy{font-size:16px}.essence-map{margin-top:24px}.essence-pill{font-size:15px}.essence-center{min-height:135px}.vision-card,.why-card{padding:22px}.vision-card{min-height:320px}.vision-card h3{font-size:30px}.why-card h3{font-size:29px}.benefit-item{font-size:15px}
          .hub-grid{grid-template-columns:1fr 1fr}.hub-item{min-height:98px;font-size:12px;padding:8px}.source-card{font-size:15px}.outcome-card strong{font-size:22px}
          .journey{padding:34px 0 95px}.journey h2{font-size:31px}.footer-waves{height:115px}.footer-inner{grid-template-columns:1fr;justify-items:start}.footer-inner>span:nth-child(2){grid-column:auto;grid-row:auto}.footer-inner .version{font-size:11px}
        }
        @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.orbit,.free-orb,.hero-symbol{animation:none}.primary-btn{transition:none}}
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
            <Link href="/login" className="login-top">Entrar <ArrowRight /></Link>
            <details className="mobile-menu">
              <summary aria-label="Abrir menu"><span className="hamburger"><span /></span></summary>
              <nav className="mobile-panel" aria-label="Navegação móvel">
                <a href="#essencia">Nossa essência</a>
                <a href="#visao-integrada">Visão integrada</a>
              </nav>
            </details>
          </div>
        </header>

        <section className="hero" id="inicio">
          <div className="hero-inner container">
            <div className="hero-copy">
              <p className="eyebrow">Pessoas no centro da transformação</p>
              <h1>Consciência que transforma.<span>Energia que conecta.</span></h1>
              <p>Uma metodologia de desenvolvimento humano e organizacional que revela potenciais, amplia perspectivas e fortalece relações.</p>
              <Link href="/login" className="primary-btn">Entrar no Lifenergy Digital <ArrowRight /></Link>
            </div>
            <HeroOrbit />
          </div>
        </section>

        <section className="section" id="essencia">
          <div className="container">
            <p className="eyebrow">Nossa essência</p>
            <h2>Desenvolvimento que começa de dentro.</h2>
            <p className="section-copy">Lifenergy Digital integra conhecimento, tecnologia e sensibilidade para apoiar mudanças reais. Tornamos visíveis os padrões que orientam escolhas e relações, criando espaço para novos caminhos.</p>

            <div className="essence-map" aria-label="Conhecimento, tecnologia e sensibilidade conectados à Lifenergy Digital e a padrões, escolhas, relações e novos caminhos">
              <div className="essence-list essence-left">
                {essenceLeft.map((item) => (
                  <div className="essence-pill" key={item.label}>
                    <span className="icon-bubble">{item.icon}</span><span>{item.label}</span>
                  </div>
                ))}
              </div>
              <EssenceConnector />
              <div className="mobile-flow-arrow"><ArrowDown /></div>
              <div className="essence-center">
                <Image src="/lifenergy-symbol.png" alt="" width={220} height={220} />
                <span>Lifenergy<br />Digital</span>
              </div>
              <EssenceConnector reverse />
              <div className="mobile-flow-arrow"><ArrowDown /></div>
              <div className="essence-list essence-right">
                {essenceRight.map((item, index) => (
                  <div className="essence-pill" key={index}>
                    <span className="icon-bubble">{item.icon}</span><span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="porque-lifenergy">
          <div className="container cards-row">
            <article className="info-card vision-card">
              <p className="eyebrow">Visão integrada</p>
              <h3>“Pessoas mais conscientes constroem organizações mais produtivas.”</h3>
              <div className="landscape-wrap"><LandscapeArt /></div>
            </article>

            <article className="info-card why-card">
              <p className="eyebrow">Por que Lifenergy Digital</p>
              <h3>Clareza para compreender.<br />Direção para transformar.</h3>
              <div className="benefit-list">
                {benefits.map((item) => (
                  <div className="benefit-item" key={item.text}>
                    <span className="icon-bubble">{item.icon}</span><span>{item.text}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="section integrated" id="visao-integrada">
          <div className="container">
            <p className="eyebrow">Conexões que geram perspectiva</p>
            <h2>Visão integrada.</h2>
            <p className="section-copy">Lifenergy Digital organiza e cruza informações dos sistemas envolvidos para identificar padrões, ampliar perspectivas e orientar ações de desenvolvimento humano e organizacional.</p>

            <div className="integrated-flow" aria-label="Pessoas, organizações e contexto ético e legal conectados ao Lifenergy Digital, resultando em uma leitura integrada">
              <div className="source-list">
                <div className="source-card"><span className="icon-bubble"><PeopleIcon /></span><span>Pessoas</span></div>
                <div className="source-card"><span className="icon-bubble"><BuildingIcon /></span><span>Organizações</span></div>
                <div className="source-card"><span className="icon-bubble"><ShieldIcon /></span><span>Contexto ético e legal</span></div>
              </div>
              <div className="flow-arrow-wrap"><ArrowRight /></div>
              <div className="hub-card">
                <div className="hub-brand"><Image src="/lifenergy-symbol.png" alt="" width={140} height={140} /><span>Lifenergy Digital</span></div>
                <div className="hub-grid">
                  {hubItems.map((item) => (
                    <div className="hub-item" key={item.text}>{item.icon}<span>{item.text}</span></div>
                  ))}
                </div>
              </div>
              <div className="flow-arrow-wrap"><ArrowRight /></div>
              <div className="outcome-card">
                <span className="icon-bubble"><ChartIcon /></span>
                <strong>Uma leitura integrada</strong>
                <p>Informações conectadas para apoiar decisões e caminhos de desenvolvimento.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="journey">
          <FooterWaves />
          <div className="container journey-inner">
            <div>
              <p className="eyebrow">Lifenergy Digital</p>
              <h2>Acesse sua jornada de desenvolvimento.</h2>
            </div>
            <Link href="/login" className="primary-btn">Entrar no Lifenergy Digital <ArrowRight /></Link>
          </div>
        </section>

        <footer className="footer">
          <div className="container footer-inner">
            <Image src="/lifenergy-logo.png" alt="Lifenergy" width={960} height={230} />
            <span>© 2026 Lifenergy. Desenvolvimento Humano e Organizacional.</span>
            <AppVersion className="version" />
          </div>
        </footer>
      </div>
    </main>
  );
}
