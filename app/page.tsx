import Image from "next/image";
import Link from "next/link";

type Hotspot = {
  href: string;
  label: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

const hotspots: Hotspot[] = [
  { href: "/login", label: "Entrar", left: 83.1, top: 1.6, width: 7.0, height: 3.0 },
  { href: "#metodologia", label: "Metodologia", left: 32.0, top: 1.6, width: 9.0, height: 3.0 },
  { href: "#para-quem", label: "Para quem é", left: 41.6, top: 1.6, width: 9.4, height: 3.0 },
  { href: "#beneficios", label: "Benefícios", left: 52.0, top: 1.6, width: 9.1, height: 3.0 },
  { href: "/biblioteca-tecnica", label: "Biblioteca Técnica", left: 62.7, top: 1.6, width: 11.9, height: 3.0 },
  { href: "#metodologia", label: "Conhecer a metodologia", left: 6.6, top: 33.0, width: 20.0, height: 4.1 },
  { href: "/login", label: "Acessar a Lifenergy Digital", left: 27.8, top: 33.0, width: 21.0, height: 4.1 },
  { href: "#para-quem", label: "Saiba mais sobre a metodologia", left: 4.4, top: 52.1, width: 21.4, height: 3.4 },
  { href: "/login", label: "Acessar a Lifenergy Digital", left: 43.0, top: 87.2, width: 22.2, height: 5.0 },
];

function HotspotLink({ hotspot }: { hotspot: Hotspot }) {
  const style = {
    left: `${hotspot.left}%`,
    top: `${hotspot.top}%`,
    width: `${hotspot.width}%`,
    height: `${hotspot.height}%`,
  };

  return (
    <Link
      href={hotspot.href}
      aria-label={hotspot.label}
      title={hotspot.label}
      style={style}
      className="absolute rounded-2xl outline-none transition focus-visible:ring-4 focus-visible:ring-[#69F0E1]/80"
    >
      <span className="sr-only">{hotspot.label}</span>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#EEF7FA] text-[#0E1844]">
      <div className="mx-auto w-full max-w-[1199px]">
        <div className="relative">
          <Image
            src="/home-lifenergy-final.png"
            alt="Lifenergy Digital — Consciência que transforma. Energia que conecta."
            width={1199}
            height={1312}
            priority
            className="block h-auto w-full select-none"
          />

          {hotspots.map((hotspot) => (
            <HotspotLink key={`${hotspot.href}-${hotspot.label}-${hotspot.top}`} hotspot={hotspot} />
          ))}

          <section className="sr-only">
            <h1>Consciência que transforma. Energia que conecta.</h1>
            <p>
              Uma metodologia de desenvolvimento humano e organizacional que revela potenciais,
              amplia perspectivas e fortalece relações.
            </p>

            <h2 id="metodologia">Metodologia Lifenergy - Ciclo 4D</h2>
            <p>
              Um caminho integrado para desenvolver autoconhecimento, relações, direção e
              desenvolvimento organizacional, gerando evolução consistente para pessoas e organizações.
            </p>
            <ol>
              <li>Diagnosticar: Autoconhecimento e consciência.</li>
              <li>Decodificar: Conexões mais saudáveis e eficazes.</li>
              <li>Desenvolver: Clareza de propósito e escolhas.</li>
              <li>Durabilizar: Resultados sustentáveis para pessoas e organizações.</li>
            </ol>

            <h2 id="para-quem">Para quem é</h2>
            <p>
              Líderes, Profissionais de Recursos Humanos, Consultores, Organizações e equipes.
            </p>

            <h2 id="beneficios">Benefícios que geram impacto real</h2>
            <p>
              Autoconhecimento, desenvolvimento relacional e fortalecimento organizacional.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
