import Image from "next/image";
import Link from "next/link";
import { AppVersion } from "@/components/AppVersion";

const lifenergyFlow = [
  {
    title: "Diagnosticar",
    description:
      "Mapeia a realidade atual e oferece clareza sobre o ponto de partida da jornada.",
  },
  {
    title: "Decodificar",
    description:
      "Revela padrões, crenças e causas, criando consciência para agir com mais precisão.",
  },
  {
    title: "Desenvolver",
    description:
      "Transforma achados em oportunidades concretas de evolução pessoal e organizacional.",
  },
  {
    title: "Durabilizar",
    description:
      "Integra descobertas às rotinas, aos ritos, à cultura e aos resultados sustentáveis.",
  },
];

const journeySteps = [
  "Configure a empresa",
  "Cadastre aplicadores",
  "Crie links de aplicação",
  "Colete respostas",
  "Gere relatórios",
  "Desenvolva PDIs",
  "Acompanhe a evolução",
];

const resources = [
  {
    title: "Aplicação on-line",
    description:
      "Criação de links individuais para conduzir avaliações com segurança, clareza e rastreabilidade.",
  },
  {
    title: "Relatórios e PDIs",
    description:
      "Geração de relatórios relacionais e planos de desenvolvimento a partir das respostas coletadas.",
  },
  {
    title: "Bibliotecas inteligentes",
    description:
      "Organização de documentos, referências técnicas, conteúdos institucionais e materiais de apoio.",
  },
  {
    title: "Gestão de licenças",
    description:
      "Controle de modalidades contratadas, utilizadas e disponíveis para novas gerações de documentos.",
  },
];

const audiences = [
  {
    title: "Empresas",
    description:
      "Para organizações que desejam compreender padrões relacionais e fortalecer cultura, gestão e desenvolvimento humano.",
  },
  {
    title: "Consultores e aplicadores",
    description:
      "Para profissionais autorizados que conduzem jornadas Lifenergy com método, organização e consistência.",
  },
  {
    title: "Gestores",
    description:
      "Para líderes que precisam transformar dados comportamentais em ações práticas de desenvolvimento.",
  },
];

function DecorativeOrbit() {
  return (
    <div aria-hidden="true" className="relative h-[360px] w-[360px] sm:h-[430px] sm:w-[430px]">
      <div className="absolute inset-8 rounded-full border border-[#98D6D1]/45" />
      <div className="absolute inset-20 rounded-full border border-[#205167]/15" />
      <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-[2.2rem] bg-[#205167] shadow-2xl shadow-[#205167]/20" />
      <span className="absolute left-[42%] top-[11%] h-14 w-14 rounded-full bg-[#98D6D1]" />
      <span className="absolute left-[22%] top-[26%] h-11 w-11 rounded-full bg-[#98D6D1]/85" />
      <span className="absolute left-[18%] top-[47%] h-10 w-10 rounded-full bg-[#98D6D1]/75" />
      <span className="absolute bottom-[18%] left-[35%] h-12 w-12 rounded-full bg-[#98D6D1]/70" />
      <span className="absolute bottom-[23%] right-[30%] h-10 w-10 rounded-full bg-[#98D6D1]/60" />
      <span className="absolute right-[18%] top-[39%] h-9 w-9 rounded-full bg-[#98D6D1]/55" />
      <span className="absolute right-[28%] top-[21%] h-8 w-8 rounded-full bg-[#98D6D1]/45" />
      <span className="absolute left-[50%] top-[50%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80" />
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#205167]">
      <section className="relative isolate overflow-hidden bg-[#F7FBFA]">
        <div className="absolute -left-28 top-24 -z-10 h-72 w-72 rounded-full bg-[#98D6D1]/45 blur-3xl" />
        <div className="absolute -right-24 top-16 -z-10 h-80 w-80 rounded-full bg-[#98D6D1]/35 blur-3xl" />
        <div className="absolute bottom-[-7rem] right-[18%] -z-10 h-64 w-64 rounded-full bg-[#205167]/10 blur-3xl" />

        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <Link href="/" aria-label="Lifenergy Digital - início" className="block">
            <Image
              src="/lifenergy-logo-completo-azul.png"
              alt="Lifenergy"
              width={210}
              height={56}
              priority
              className="h-auto w-40 sm:w-48"
            />
          </Link>

          <Link
            href="/login"
            className="rounded-full bg-[#205167] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#205167]/15 transition hover:-translate-y-0.5 hover:bg-[#173f50] sm:px-6"
          >
            Entrar no Lifenergy Digital
          </Link>
        </header>

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-12 lg:grid-cols-[1.03fr_0.97fr] lg:px-10 lg:pb-32 lg:pt-20">
          <div>
            <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-[#2C7585]">
              <span className="h-px w-10 bg-[#2C7585]" />
              Desenvolvimento relacional com método e cuidado
            </p>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-[-0.045em] text-[#205167] sm:text-6xl lg:text-7xl">
              Lifenergy Digital
            </h1>

            <p className="mt-7 max-w-2xl text-2xl font-medium leading-9 text-[#205167] sm:text-3xl">
              Um ambiente digital para conduzir jornadas de desenvolvimento relacional com clareza, profundidade e consistência.
            </p>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Organize aplicações, acompanhe respostas, gere relatórios, desenvolva PDIs e apoie decisões sobre pessoas, cultura e comportamento.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/login"
                className="rounded-full bg-[#205167] px-7 py-3.5 text-center text-sm font-bold text-white shadow-xl shadow-[#205167]/20 transition hover:-translate-y-0.5 hover:bg-[#173f50]"
              >
                Entrar no Lifenergy Digital
              </Link>
              <a
                href="#metodologia"
                className="rounded-full border border-[#205167]/20 bg-white/70 px-7 py-3.5 text-center text-sm font-bold text-[#205167] transition hover:-translate-y-0.5 hover:border-[#98D6D1] hover:bg-white"
              >
                Conheça a metodologia
              </a>
            </div>
          </div>

          <div className="mx-auto hidden lg:block">
            <DecorativeOrbit />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#2C7585]">O que é</p>
            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#205167] sm:text-5xl">
              Um sistema de apoio à aplicação da metodologia Lifenergy.
            </h2>
          </div>
          <div className="self-end">
            <p className="text-lg leading-8 text-slate-600">
              O Lifenergy Digital reúne em um só ambiente a criação de jornadas, a coleta de respostas, a organização de dados, a geração de documentos técnicos e a construção de planos de desenvolvimento.
            </p>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              A experiência foi desenhada para preservar o cuidado humano da metodologia e transformar informações comportamentais em caminhos práticos de evolução.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {resources.map((resource) => (
            <article key={resource.title} className="rounded-[2rem] border border-[#205167]/10 bg-[#F7FBFA] p-7 shadow-sm shadow-[#205167]/5">
              <div className="mb-7 h-2 w-16 rounded-full bg-[#98D6D1]" />
              <h3 className="text-xl font-semibold text-[#205167]">{resource.title}</h3>
              <p className="mt-4 leading-7 text-slate-600">{resource.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="metodologia" className="bg-[#205167] px-6 py-24 text-white lg:py-28">
        <div className="mx-auto max-w-7xl lg:px-4">
          <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#98D6D1]">Conheça a metodologia</p>
              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">
                Metodologia Lifenergy – Ciclo 4D
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-white/78">
              Conecta, Desenvolve, Harmoniza e Sustenta. O Ciclo 4D organiza a jornada em quatro movimentos que ampliam consciência, transformam achados em oportunidades e apoiam a consolidação da cultura e dos resultados.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {lifenergyFlow.map((step, index) => (
              <article key={step.title} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 backdrop-blur">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#98D6D1] text-sm font-bold text-[#205167]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-8 text-2xl font-semibold">{step.title}</h3>
                <p className="mt-4 leading-7 text-white/75">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F7FBFA] px-6 py-24 lg:py-28">
        <div className="mx-auto max-w-7xl lg:px-4">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#2C7585]">Uma jornada guiada</p>
              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#205167] sm:text-5xl">
                Do primeiro acesso à evolução acompanhada.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                Cada etapa foi pensada para reduzir dispersão, dar clareza ao processo e apoiar o trabalho de quem conduz jornadas de desenvolvimento.
              </p>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-[#205167]/8 ring-1 ring-[#205167]/8">
              <div className="grid gap-3 sm:grid-cols-2">
                {journeySteps.map((step, index) => (
                  <div key={step} className="flex items-center gap-4 rounded-2xl border border-[#205167]/8 bg-[#F7FBFA] p-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#98D6D1] text-sm font-bold text-[#205167]">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-[#205167]">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#2C7585]">Para quem é</p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#205167] sm:text-5xl">
            Cuidado, método e gestão para diferentes contextos.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {audiences.map((audience) => (
            <article key={audience.title} className="rounded-[2rem] border border-[#205167]/10 bg-white p-8 shadow-lg shadow-[#205167]/6">
              <h3 className="text-2xl font-semibold text-[#205167]">{audience.title}</h3>
              <p className="mt-5 leading-7 text-slate-600">{audience.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24 lg:pb-28">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#98D6D1] px-8 py-16 text-center text-[#205167] shadow-2xl shadow-[#205167]/10 sm:px-12 lg:px-20">
          <p className="text-xs font-bold uppercase tracking-[0.28em]">Lifenergy Digital</p>
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">
            Acesse sua jornada de desenvolvimento.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#205167]/80">
            Entre para gerenciar aplicações, acompanhar respostas e utilizar os recursos disponíveis para sua organização.
          </p>
          <Link
            href="/login"
            className="mt-9 inline-block rounded-full bg-[#205167] px-8 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#173f50]"
          >
            Entrar no Lifenergy Digital
          </Link>
        </div>
      </section>

      <footer className="bg-[#102F3D] px-6 py-8 text-white/65">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs sm:flex-row lg:px-4">
          <p>© {new Date().getFullYear()} Lifenergy. Desenvolvimento humano e organizacional.</p>
          <AppVersion />
        </div>
      </footer>
    </main>
  );
}
