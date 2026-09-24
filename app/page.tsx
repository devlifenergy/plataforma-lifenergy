import Image from "next/image";
import Link from "next/link";

type IconProps = {
  className?: string;
};

function ArrowRightIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m13 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PersonIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 12a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm0 2.25c-4.48 0-8.25 2.5-8.25 5.75 0 .83.67 1.5 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5c0-3.25-3.77-5.75-8.25-5.75Z" />
    </svg>
  );
}

function GroupIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8.25 11a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Zm7.5 0a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5ZM3.5 19.25c0-2.3 2.34-4.25 5.25-4.25S14 16.95 14 19.25c0 .69-.56 1.25-1.25 1.25h-8c-.69 0-1.25-.56-1.25-1.25Zm7.75 1.25c.5-.73.75-1.55.75-2.45 0-.95-.28-1.85-.8-2.65.74-.25 1.56-.4 2.43-.4 3.18 0 5.87 1.95 5.87 4.25 0 .69-.56 1.25-1.25 1.25h-7Z" />
    </svg>
  );
}

function CompassIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="m10 14 1.7-4.7L16.5 8l-1.3 4.8L10 14Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BarsIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <rect x="4" y="12" width="3.5" height="8" rx="1" />
      <rect x="10.25" y="8" width="3.5" height="12" rx="1" />
      <rect x="16.5" y="4" width="3.5" height="16" rx="1" />
    </svg>
  );
}

function BuildingIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M5 20.5A1.5 1.5 0 0 1 3.5 19V7.75c0-.57.32-1.09.82-1.34l6.75-3.38A1.5 1.5 0 0 1 13.25 4.38V7h5.25A1.5 1.5 0 0 1 20 8.5V19a1.5 1.5 0 0 1-1.5 1.5H5Zm2-2.5h2v-2H7v2Zm0-4h2v-2H7v2Zm0-4h2V8H7v2Zm4 8h2v-2h-2v2Zm0-4h2v-2h-2v2Zm0-4h2V8h-2v2Zm4 8h2v-2h-2v2Zm0-4h2v-2h-2v2Z" />
    </svg>
  );
}

function BrainIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M9.5 4.5c-2.2 0-4 1.8-4 4 0 .42.07.83.19 1.2A3.75 3.75 0 0 0 4.5 17c0 1.93 1.57 3.5 3.5 3.5h1.5V4.5Zm5 0c2.2 0 4 1.8 4 4 0 .42-.07.83-.19 1.2A3.75 3.75 0 0 1 19.5 17c0 1.93-1.57 3.5-3.5 3.5h-1.5V4.5Zm-5 5H8m1.5 5H7.5m7-5H16m-1.5 5H16.5M12 4.5v16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const methodologySteps = [
  {
    number: "1.",
    title: "Diagnosticar",
    description: "Autoconhecimento e consciência",
    icon: PersonIcon,
  },
  {
    number: "2.",
    title: "Decodificar",
    description: "Conexões mais saudáveis e eficazes",
    icon: GroupIcon,
  },
  {
    number: "3.",
    title: "Desenvolver",
    description: "Clareza de propósito e escolhas",
    icon: CompassIcon,
  },
  {
    number: "4.",
    title: "Durabilizar",
    description: "Resultados sustentáveis para pessoas e organizações",
    icon: BarsIcon,
  },
];

const audiences = [
  {
    title: "Líderes",
    description: "Que buscam mais consciência, repertório e impacto positivo em suas equipes.",
    icon: PersonIcon,
  },
  {
    title: "Profissionais de Recursos Humanos",
    description: "Que desejam fortalecer pessoas, cultura e desenvolvimento organizacional.",
    icon: GroupIcon,
  },
  {
    title: "Consultores",
    description: "Que querem ampliar suas ferramentas e potencializar seus resultados.",
    icon: GroupIcon,
  },
  {
    title: "Organizações e equipes",
    description: "Que acreditam no desenvolvimento humano como base para resultados sustentáveis.",
    icon: BuildingIcon,
  },
];

const benefits = [
  {
    title: "Autoconhecimento",
    description: "Amplia a consciência, fortalece competências e impulsiona escolhas mais alinhadas.",
    icon: BrainIcon,
  },
  {
    title: "Desenvolvimento relacional",
    description: "Melhora a comunicação, a colaboração e a construção de relações mais saudáveis.",
    icon: GroupIcon,
  },
  {
    title: "Fortalecimento organizacional",
    description: "Contribui para culturas mais humanas, engajadas e preparadas para o futuro.",
    icon: BarsIcon,
  },
];

const highlightWords = ["Pessoas", "Conexões", "Potencial", "Resultados"];

function NavLinks() {
  return (
    <nav className="hidden items-center gap-8 text-[15px] font-medium text-[#1F3058] lg:flex">
      <a href="#metodologia" className="transition hover:text-[#0E7FA0]">Metodologia</a>
      <a href="#para-quem" className="transition hover:text-[#0E7FA0]">Para quem é</a>
      <a href="#beneficios" className="transition hover:text-[#0E7FA0]">Benefícios</a>
      <Link href="/biblioteca-tecnica" className="transition hover:text-[#0E7FA0]">Biblioteca Técnica</Link>
    </nav>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#EEF5F8] text-[#15254E]">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_78%_18%,rgba(87,214,240,0.22),transparent_20%),linear-gradient(180deg,#EFF6F9_0%,#EAF3F7_100%)]">
        <div className="mx-auto max-w-7xl px-6 pb-12 pt-5 lg:px-8 xl:px-10">
          <header className="flex items-center justify-between gap-6 py-2">
            <Link href="/" aria-label="Lifenergy Digital - início" className="shrink-0">
              <Image
                src="/lifenergy-logo-azul.png"
                alt="Lifenergy"
                width={236}
                height={61}
                priority
                className="h-auto w-[170px] sm:w-[210px]"
              />
            </Link>

            <NavLinks />

            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#66708F] px-6 text-[15px] font-semibold text-[#21325B] transition hover:border-[#21325B] hover:bg-white/60"
            >
              Entrar
            </Link>
          </header>

          <div className="grid items-center gap-10 pb-6 pt-8 lg:grid-cols-[0.97fr_1.03fr] lg:pt-10">
            <div className="max-w-[560px]">
              <p className="mb-5 flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.38em] text-[#214C78] sm:text-[13px]">
                <span className="h-px w-10 bg-[#28B9D8]" />
                Pessoas no centro da transformação
              </p>

              <h1 className="max-w-[560px] text-[52px] font-semibold leading-[0.94] tracking-[-0.06em] text-[#0D0F3F] sm:text-[64px] lg:text-[78px]">
                Consciência que transforma.
                <span className="mt-2 block text-[#1C8DAE]">Energia que conecta.</span>
              </h1>

              <p className="mt-6 max-w-[560px] text-[20px] leading-8 text-[#2A3558]/90">
                Uma metodologia de desenvolvimento humano e organizacional que revela potenciais, amplia perspectivas e fortalece relações.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4 text-[13px] font-semibold uppercase tracking-[0.34em] text-[#273868]">
                {highlightWords.map((word, index) => (
                  <div key={word} className="flex items-center gap-4">
                    <span>{word}</span>
                    {index < highlightWords.length - 1 ? <span className="h-1.5 w-1.5 rounded-full bg-[#44D1DA]" /> : null}
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <a
                  href="#metodologia"
                  className="inline-flex items-center justify-center gap-3 rounded-[22px] bg-[#69F0E1] px-7 py-4 text-[15px] font-semibold text-[#0C2448] shadow-[0_18px_30px_-20px_rgba(73,207,199,0.75)] transition hover:-translate-y-0.5 hover:brightness-95"
                >
                  Conhecer a metodologia
                  <ArrowRightIcon />
                </a>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-3 rounded-[22px] border border-[#7B86A5] bg-white/55 px-7 py-4 text-[15px] font-semibold text-[#22325C] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/80"
                >
                  Acessar a Lifenergy Digital
                  <ArrowRightIcon />
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[620px]">
              <div className="absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_center,rgba(92,229,247,0.35),transparent_60%)] blur-2xl" />
              <Image
                src="/home-hero-visual.png"
                alt="Ilustração da Lifenergy Digital"
                width={553}
                height={470}
                className="relative z-10 h-auto w-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section id="metodologia" className="mx-auto max-w-7xl px-6 pb-10 pt-4 lg:px-8 xl:px-10">
        <div className="rounded-[28px] border border-[#C7E8F3] bg-white/40 p-6 shadow-[0_10px_40px_-34px_rgba(30,65,120,0.35)] backdrop-blur sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="mb-5 flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.34em] text-[#214C78] sm:text-[13px]">
                <span className="h-px w-10 bg-[#28B9D8]" />
                Conheça a metodologia
              </p>

              <h2 className="text-[34px] font-semibold leading-tight tracking-[-0.04em] text-[#0E1844] sm:text-[44px]">
                Metodologia Lifenergy - Ciclo 4D
              </h2>

              <p className="mt-4 max-w-[560px] text-[20px] leading-8 text-[#2D3557]/92">
                Um caminho integrado para desenvolver autoconhecimento, relações, direção e desenvolvimento organizacional, gerando evolução consistente para pessoas e organizações.
              </p>

              <a
                href="#para-quem"
                className="mt-8 inline-flex items-center gap-3 rounded-[22px] border border-[#7B86A5] bg-white/80 px-6 py-4 text-[15px] font-semibold text-[#22325C] transition hover:bg-white"
              >
                Saiba mais sobre a metodologia
                <ArrowRightIcon />
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {methodologySteps.map((step) => {
                const Icon = step.icon;
                return (
                  <article
                    key={step.title}
                    className="flex min-h-[240px] flex-col items-center justify-start rounded-full border border-[#8ED9EE] bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.2)_100%)] px-5 py-8 text-center"
                  >
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-[#DDF6FA] text-[#117FA1]">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 text-[14px] font-bold uppercase tracking-[0.18em] text-[#15335F]">
                      {step.number} {step.title}
                    </h3>
                    <p className="mt-4 text-[17px] leading-6 text-[#29415E]">{step.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="para-quem" className="mx-auto max-w-7xl px-6 py-4 lg:px-8 xl:px-10">
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.7fr]">
          <div className="rounded-[28px] bg-transparent p-1">
            <h2 className="text-[32px] font-semibold leading-tight tracking-[-0.04em] text-[#0E1844] sm:text-[42px]">
              Para quem é
            </h2>
            <div className="mt-4 h-1 w-14 rounded-full bg-[#27BED8]" />
            <p className="mt-5 max-w-[320px] text-[19px] leading-8 text-[#2D3557]/92">
              A Lifenergy Digital atende diferentes perfis que desejam evoluir, gerar impacto e construir resultados mais humanos e sustentáveis.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {audiences.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-[22px] border border-[#CBE8F2] bg-white/55 p-6 shadow-[0_8px_24px_-24px_rgba(17,48,92,0.45)] backdrop-blur">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-[#E6F7FA] text-[#0C87A8]">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-[18px] font-semibold leading-6 text-[#14234D]">{item.title}</h3>
                  <p className="mt-4 text-[16px] leading-7 text-[#2D3557]/92">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="beneficios" className="mx-auto max-w-7xl px-6 pb-4 pt-5 lg:px-8 xl:px-10">
        <div className="grid gap-4 lg:grid-cols-[0.72fr_2.28fr]">
          <div className="rounded-[22px] border border-[#CBE8F2] bg-white/55 p-6 shadow-[0_8px_24px_-24px_rgba(17,48,92,0.45)] backdrop-blur">
            <h2 className="max-w-[230px] text-[26px] font-semibold leading-tight tracking-[-0.03em] text-[#14234D]">
              Benefícios que geram impacto real
            </h2>
            <div className="mt-5 h-1 w-14 rounded-full bg-[#27BED8]" />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article key={benefit.title} className="rounded-[22px] border border-[#CBE8F2] bg-white/55 p-6 shadow-[0_8px_24px_-24px_rgba(17,48,92,0.45)] backdrop-blur">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-[#E6F7FA] text-[#0C87A8]">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-[18px] font-semibold leading-6 text-[#14234D]">{benefit.title}</h3>
                  <p className="mt-4 text-[16px] leading-7 text-[#2D3557]/92">{benefit.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-0 pt-6 lg:px-8 xl:px-10">
        <div className="relative overflow-hidden rounded-t-[28px] sm:rounded-[28px]">
          <Image
            src="/home-footer-landscape.png"
            alt="Paisagem de montanhas ao amanhecer"
            width={1199}
            height={217}
            className="h-[310px] w-full object-cover sm:h-[280px]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,24,48,0.78)_0%,rgba(2,24,48,0.28)_55%,rgba(2,24,48,0.12)_100%)]" />
          <div className="absolute inset-0 grid items-center gap-6 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:p-12">
            <div className="max-w-[520px] text-white">
              <p className="text-[12px] font-bold uppercase tracking-[0.38em] text-[#D4F5FF]">Dê o próximo passo</p>
              <h2 className="mt-3 text-[36px] font-semibold leading-tight tracking-[-0.04em] sm:text-[48px]">
                Acesse a Lifenergy Digital
              </h2>
              <p className="mt-4 text-[20px] leading-8 text-white/92">
                Explore conteúdos, ferramentas e experiências para acelerar o seu desenvolvimento e gerar um impacto positivo no mundo.
              </p>
            </div>

            <div>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-3 rounded-[22px] bg-[#69F0E1] px-8 py-4 text-[15px] font-semibold text-[#0C2448] shadow-[0_18px_30px_-20px_rgba(73,207,199,0.75)] transition hover:-translate-y-0.5 hover:brightness-95"
              >
                Acessar a Lifenergy Digital
                <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#D9E9F2] bg-[#EEF5F8] px-6 py-6 text-sm text-[#324564] lg:px-8 xl:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Lifenergy. Desenvolvimento humano e organizacional.</p>
          <div className="flex items-center gap-4">
            <Link href="/biblioteca-tecnica" className="transition hover:text-[#0E7FA0]">Biblioteca Técnica</Link>
            <Link href="/login" className="transition hover:text-[#0E7FA0]">Entrar</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
