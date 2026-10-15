/** Questionário do gestor – cinco blocos, armazenados nos cinco campos textuais já existentes. */
export const PDI_MOTIVES = [
  "Desenvolvimento contínuo, sem urgência específica",
  "Preparação para promoção ou mudança de função",
  "Ajuste de performance/comportamento",
  "Onboarding recente (menos de 6 meses no cargo)",
  "Sucessão planejada para posição-chave",
  "Outro",
] as const;
export const PDI_TENURES = ["Menos de 6 meses", "6 meses a 2 anos", "2 a 5 anos", "Mais de 5 anos"] as const;
export const PDI_RATINGS = [
  ["technical", "Domina tecnicamente as atividades do cargo"],
  ["deadlines", "Cumpre prazos e entregas com consistência"],
  ["change", "Adapta-se bem a mudanças de rotina/processo"],
  ["meetings", "Participa ativamente de reuniões e alinhamentos"],
  ["communication", "Registra e comunica pendências de forma clara"],
] as const;
export const PDI_ADAPTATION = [
  "Totalmente adaptado", "Parcialmente adaptado, com pontos a desenvolver",
  "Ainda em adaptação (cargo recente)", "Não adaptado, com dificuldades recorrentes",
] as const;
export const PDI_CHALLENGES = [
  "Comunicação com a equipe/outras áreas", "Gestão de tempo e prioridades",
  "Sobrecarga de demandas", "Clareza sobre papel e responsabilidades",
  "Relacionamento interpessoal", "Domínio técnico ou de ferramentas",
  "Tomada de decisão sob pressão", "Proatividade / iniciativa", "Outro",
] as const;
export const PDI_FREQUENCIES = ["Raramente", "Ocasionalmente", "Frequentemente", "Constantemente"] as const;
export const PDI_COMPETENCIES = [
  "Comunicação clara", "Organização e gestão do tempo", "Clareza de papel",
  "Qualidade e conformidade", "Colaboração", "Foco no cliente",
  "Gestão de pessoas e prioridades (se aplicável a papel de liderança)",
  "Tomada de decisão (se aplicável a papel de liderança)", "Visão de indicadores e resultados",
] as const;
export const PDI_CAREERS = [
  "Manter-se no cargo atual, aprofundando competências",
  "Preparar para promoção horizontal (mesmo nível, outra área)",
  "Preparar para promoção vertical (liderança)",
  "Preparar para maior especialização técnica", "Ainda não definido",
] as const;
export const PDI_SUCCESSION = ["Sim", "Não, ainda em definição", "Não aplicável"] as const;

export type PdiContextText = {
  context_summary: string | null;
  current_situation: string | null;
  current_challenges: string | null;
  development_priorities: string | null;
  career_direction: string | null;
};

export function serializeCorporateQuestionnaire(data: FormData): PdiContextText {
  const get = (name: string) => String(data.get(name) ?? "").trim();
  const choice = (name: string, values: readonly string[], required = true) => {
    const value = get(name);
    if (!values.includes(value) && (required || value)) throw new Error(`Preencha corretamente: ${name}.`);
    return value;
  };
  const scale = (name: string) => {
    const value = get(name);
    if (!/^[1-5]$/.test(value)) throw new Error(`Selecione uma nota entre 1 e 5 para ${name}.`);
    return value;
  };
  const motive = choice("q_motive", PDI_MOTIVES);
  const motiveOther = motive === "Outro" ? get("q_motive_other").slice(0, 120) : "";
  if (motive === "Outro" && !motiveOther) throw new Error("Descreva o outro motivo do PDI.");
  const tenure = choice("q_tenure", PDI_TENURES);
  const ratings = PDI_RATINGS.map(([key, label]) => `${label}: ${scale(`q_rating_${key}`)}/5`);
  const adaptation = choice("q_adaptation", PDI_ADAPTATION);
  const selectedChallenges = data.getAll("q_challenge").map(String);
  if (new Set(selectedChallenges).size !== selectedChallenges.length || selectedChallenges.some((v) => !PDI_CHALLENGES.includes(v as typeof PDI_CHALLENGES[number]))) {
    throw new Error("Seleção de desafios inválida.");
  }
  const challengeLines = selectedChallenges.map((name) => {
    const frequency = choice(`q_frequency_${name}`, PDI_FREQUENCIES);
    const other = name === "Outro" ? get("q_challenge_other").slice(0, 120) : "";
    if (name === "Outro" && !other) throw new Error("Descreva o desafio adicional.");
    return `${name === "Outro" ? `Outro: ${other}` : name}: ${frequency}`;
  });
  const competencies = data.getAll("q_competency").map(String);
  if (competencies.length > 3 || new Set(competencies).size !== competencies.length || competencies.some((v) => !PDI_COMPETENCIES.includes(v as typeof PDI_COMPETENCIES[number]))) {
    throw new Error("Escolha no máximo três competências prioritárias.");
  }
  const priorityLines = competencies.map((name) => `${name}: urgência ${scale(`q_urgency_${name}`)}/5`);
  const career = choice("q_career", PDI_CAREERS);
  const succession = choice("q_succession", PDI_SUCCESSION);
  const successionName = succession === "Sim" ? get("q_succession_name").slice(0, 180) : "";
  if (succession === "Sim" && !successionName) throw new Error("Informe a posição ou trilha de sucessão mapeada.");
  const readiness = scale("q_readiness");
  return {
    context_summary: `Motivo do PDI: ${motive === "Outro" ? `Outro: ${motiveOther}` : motive}\nTempo no cargo: ${tenure}`,
    current_situation: `${ratings.join("\n")}\nAdaptação às rotinas: ${adaptation}`,
    current_challenges: challengeLines.join("\n") || "Nenhum desafio assinalado pelo gestor.",
    development_priorities: priorityLines.join("\n") || "Nenhuma competência prioritária selecionada pelo gestor.",
    career_direction: `Direcionamento previsto (12 meses): ${career}\nSucessão: ${succession === "Sim" ? `Sim — ${successionName}` : succession}\nProntidão para próximo passo: ${readiness}/5`,
  };
}

/** Reconstitui os campos da tela a partir das descrições armazenadas, sem migration. */
export function parseCorporateQuestionnaire(context?: Partial<PdiContextText> | null): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = (value: string | null | undefined) => String(value ?? "").split("\n").map(v => v.trim());
  const colonValue = (line: string, prefix: string) => line.startsWith(`${prefix}: `) ? line.slice(prefix.length + 2) : "";
  for (const line of lines(context?.context_summary)) {
    const motive = colonValue(line, "Motivo do PDI");
    if (motive) {
      result.q_motive = motive.startsWith("Outro: ") ? "Outro" : motive;
      if (motive.startsWith("Outro: ")) result.q_motive_other = motive.slice(7);
    }
    const tenure = colonValue(line, "Tempo no cargo");
    if (tenure) result.q_tenure = tenure;
  }
  for (const line of lines(context?.current_situation)) {
    for (const [key, label] of PDI_RATINGS) {
      const match = colonValue(line, label).match(/^([1-5])\/5$/);
      if (match) result[`q_rating_${key}`] = match[1];
    }
    const adaptation = colonValue(line, "Adaptação às rotinas");
    if (adaptation) result.q_adaptation = adaptation;
  }
  for (const line of lines(context?.current_challenges)) {
    for (const name of PDI_CHALLENGES) {
      const match = name === "Outro" ? line.match(/^Outro: (.+): (Raramente|Ocasionalmente|Frequentemente|Constantemente)$/)
        : line.startsWith(`${name}: `) ? [line, "", line.slice(name.length + 2)] : null;
      if (match && PDI_FREQUENCIES.includes(match[2] as typeof PDI_FREQUENCIES[number])) {
        result[`q_challenge_${name}`] = "1";
        result[`q_frequency_${name}`] = match[2];
        if (name === "Outro") result.q_challenge_other = match[1];
      }
    }
  }
  for (const line of lines(context?.development_priorities)) {
    for (const name of PDI_COMPETENCIES) {
      const match = colonValue(line, name).match(/^urgência ([1-5])\/5$/);
      if (match) {
        result[`q_competency_${name}`] = "1";
        result[`q_urgency_${name}`] = match[1];
      }
    }
  }
  for (const line of lines(context?.career_direction)) {
    const career = colonValue(line, "Direcionamento previsto (12 meses)");
    if (career) result.q_career = career;
    const succession = colonValue(line, "Sucessão");
    if (succession) {
      result.q_succession = succession.startsWith("Sim — ") ? "Sim" : succession;
      if (succession.startsWith("Sim — ")) result.q_succession_name = succession.slice(6);
    }
    const ready = colonValue(line, "Prontidão para próximo passo").match(/^([1-5])\/5$/);
    if (ready) result.q_readiness = ready[1];
  }
  return result;
}
