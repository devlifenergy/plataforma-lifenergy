import Link from "next/link";
import { AppVersion } from "@/components/AppVersion";

const pillars = [
  { number: "01", title: "Diagnosticar", description: "Identifique padrões comportamentais e compreenda o momento de pessoas e equipes." },
  { number: "02", title: "Desenvolver", description: "Transforme informações em jornadas de desenvolvimento humano mais conscientes." },
  { number: "03", title: "Evoluir", description: "Acompanhe resultados e fortaleça culturas organizacionais de forma consistente." },
];

const benefits = [
  "Leitura estruturada de padrões comportamentais",
  "Jornadas aplicáveis a pessoas, equipes e organizações",
  "Dados organizados para apoiar decisões mais humanas",
  "Metodologia integrada a uma experiência digital segura",
];

function BrandMark() {
  return <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full border border-[#d7b66a]/45 bg-[#173850] text-sm font-bold text-[#e5c87f] shadow-[inset_0_0_0_4px_rgba(229,200,127,0.08)]">L</span>;
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f6f1] text-[#153047]">
      <section className="relative isolate min-h-[720px] overflow-hidden bg-[#102e43] text-white">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_35%,rgba(211,173,83,0.18),transparent_27%),linear-gradient(115deg,#102e43_0%,#12364e_62%,#0c2638_100%)]" />
        <div className="absolute -right-20 top-32 -z-10 h-[430px] w-[430px] rounded-full border border-[#d7b66a]/15" />
        <div className="absolute -right-3 top-52 -z-10 h-[280px] w-[280px] rounded-full border border-[#d7b66a]/20" />

        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3" aria-label="Lifenergy Digital - Início">
            <BrandMark />
            <span>
              <span className="block text-lg font-semibold tracking-[0.16em] text-[#e8cc86]">LIFENERGY</span>
              <span className="block text-[9px] uppercase tracking-[0.32em] text-white/55">Desenvolvimento humano</span>
            </span>
          </Link>
          <Link href="/login" className="rounded-full border border-[#e5c87f]/65 px-5 py-2.5 text-sm font-semibold text-[#f1d994] transition hover:bg-[#e5c87f] hover:text-[#102e43] sm:px-6">
            Entrar na Plataforma
          </Link>
        </header>

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-32 lg:pt-28">
          <div>
            <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#e5c87f]"><span className="h-px w-10 bg-[#e5c87f]" />Pessoas no centro da transformação</p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.08] tracking-[-0.035em] sm:text-6xl lg:text-7xl">Consciência que transforma. Energia que conecta.</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d9e2e8]">Uma metodologia de desenvolvimento humano e organizacional que revela potenciais, amplia perspectivas e fortalece relações.</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/login" className="rounded-full bg-[#d9b861] px-7 py-3.5 text-center text-sm font-bold text-[#102e43] shadow-[0_12px_30px_-12px_rgba(217,184,97,0.7)] transition hover:-translate-y-0.5 hover:bg-[#e7cb83]">Entrar na Plataforma</Link>
              <a href="#metodologia" className="px-5 py-3 text-center text-sm font-semibold text-white/80 transition hover:text-white">Conheça a metodologia →</a>
            </div>
          </div>

          <div className="relative mx-auto hidden h-[440px] w-full max-w-[480px] lg:block" aria-hidden="true">
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d7b66a]/30" />
            <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[42%] border border-[#d7b66a]/25" />
            <div className="absolute left-1/2 top-1/2 grid h-36 w-36 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#d9b861]/10 shadow-[0_0_80px_rgba(217,184,97,0.18)]"><span className="text-6xl font-light text-[#e5c87f]">L</span></div>
            <span className="absolute left-1/2 top-4 h-3 w-3 rounded-full bg-[#d9b861] shadow-[0_0_24px_6px_rgba(217,184,97,0.28)]" />
            <span className="absolute bottom-8 left-14 h-3 w-3 rounded-full bg-[#d9b861] shadow-[0_0_24px_6px_rgba(217,184,97,0.28)]" />
            <span className="absolute bottom-8 right-14 h-3 w-3 rounded-full bg-[#d9b861] shadow-[0_0_24px_6px_rgba(217,184,97,0.28)]" />
          </div>
        </div>
      </section>

      <section id="metodologia" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div><p className="text-xs font-bold uppercase tracking-[0.28em] text-[#a17824]">Nossa essência</p><h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.025em] text-[#102e43] sm:text-5xl">Desenvolvimento que começa de dentro.</h2></div>
          <p className="max-w-2xl self-end text-lg leading-8 text-slate-600">A Lifenergy integra conhecimento, tecnologia e sensibilidade para apoiar mudanças reais. Tornamos visíveis os padrões que orientam escolhas e relações, criando espaço para novos caminhos.</p>
        </div>
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-[#153047]/10 bg-[#153047]/10 md:grid-cols-3">
          {pillars.map((pillar) => <article key={pillar.number} className="bg-[#fbfaf6] p-8 lg:p-10"><span className="text-sm font-semibold text-[#b08734]">{pillar.number}</span><h3 className="mt-12 text-2xl font-semibold text-[#102e43]">{pillar.title}</h3><p className="mt-4 leading-7 text-slate-600">{pillar.description}</p></article>)}
        </div>
      </section>

      <section className="bg-[#e9e5da]">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2 lg:px-10 lg:py-28">
          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] bg-[#173850] p-10 text-white"><div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full border border-[#d9b861]/25" /><div className="absolute -bottom-6 -right-4 h-48 w-48 rounded-full border border-[#d9b861]/25" /><p className="relative text-xs font-bold uppercase tracking-[0.28em] text-[#e5c87f]">Visão integrada</p><p className="relative mt-24 max-w-sm text-3xl font-medium leading-tight">Pessoas mais conscientes constroem organizações mais vivas.</p></div>
          <div className="self-center"><p className="text-xs font-bold uppercase tracking-[0.28em] text-[#a17824]">Por que Lifenergy</p><h2 className="mt-5 text-4xl font-semibold tracking-[-0.025em] text-[#102e43]">Clareza para compreender. Direção para transformar.</h2><ul className="mt-8 space-y-5">{benefits.map((benefit) => <li key={benefit} className="flex gap-4 text-slate-700"><span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#c5a24d] text-xs font-bold text-white">✓</span><span className="leading-6">{benefit}</span></li>)}</ul></div>
        </div>
      </section>

      <section className="bg-[#102e43] px-6 py-20 text-center text-white lg:py-24"><p className="text-xs font-bold uppercase tracking-[0.28em] text-[#e5c87f]">Lifenergy Digital</p><h2 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">Acesse sua jornada de desenvolvimento.</h2><Link href="/login" className="mt-9 inline-block rounded-full bg-[#d9b861] px-8 py-3.5 text-sm font-bold text-[#102e43] transition hover:bg-[#e7cb83]">Entrar na Plataforma</Link></section>

      <footer className="bg-[#0b2435] px-6 py-8 text-white/55"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs sm:flex-row lg:px-4"><p>© {new Date().getFullYear()} Lifenergy. Desenvolvimento Humano e Organizacional.</p><AppVersion /></div></footer>
    </main>
  );
}
