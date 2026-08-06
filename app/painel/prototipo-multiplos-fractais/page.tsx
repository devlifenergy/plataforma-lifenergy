"use client";

import { useMemo, useState, type ReactNode } from "react";

const allFractals = [
  {
    number: 1,
    activity: "Com que você compara o dinheiro? Cite três opções.",
    copiedActivity: "Com que você compara o dinheiro? Cite três opções.",
    answers: [
      {
        order: "Primeira resposta",
        text: "Segurança",
        importance: "Maior importância — 3",
        justification:
          "Porque o dinheiro representa estabilidade e tranquilidade para tomar decisões.",
      },
      {
        order: "Segunda resposta",
        text: "Liberdade",
        importance: "Média importância — 2",
        justification:
          "Porque permite escolhas, mas depende de responsabilidade para ser bem utilizado.",
      },
      {
        order: "Terceira resposta",
        text: "Responsabilidade",
        importance: "Menor importância — 1",
        justification:
          "Porque é importante, mas apareceu depois das ideias de segurança e liberdade.",
      },
    ],
    reflection:
      "Senti que minha relação com o dinheiro está muito ligada à necessidade de segurança e estabilidade.",
  },
  {
    number: 2,
    activity:
      "Você conseguiu um grande ganho no mercado financeiro. Cite três ações que faria.",
    copiedActivity:
      "Você conseguiu um grande ganho no mercado financeiro. Cite três ações que faria.",
    answers: [
      {
        order: "Primeira resposta",
        text: "Comprar uma casa",
        importance: "Maior importância — 3",
        justification:
          "Porque representa proteção, realização e base para a minha família.",
      },
      {
        order: "Segunda resposta",
        text: "Investir parte do dinheiro",
        importance: "Média importância — 2",
        justification:
          "Porque seria uma forma de preservar o ganho e gerar tranquilidade futura.",
      },
      {
        order: "Terceira resposta",
        text: "Fazer uma viagem",
        importance: "Menor importância — 1",
        justification:
          "Porque seria prazeroso, mas menos prioritário do que estabilidade e investimento.",
      },
    ],
    reflection:
      "Percebi que penso primeiro em estabilidade antes de pensar em prazer ou consumo.",
  },
  {
    number: 3,
    activity: "Cite três aspectos que seus amigos pensam de você.",
    copiedActivity: "Cite três aspectos que seus amigos pensam de você.",
    answers: [
      {
        order: "Primeira resposta",
        text: "Confiável",
        importance: "Maior importância — 3",
        justification:
          "Porque acredito que meus amigos contam comigo em momentos importantes.",
      },
      {
        order: "Segunda resposta",
        text: "Reservado",
        importance: "Menor importância — 1",
        justification:
          "Porque isso aparece em mim, mas não define totalmente quem eu sou.",
      },
      {
        order: "Terceira resposta",
        text: "Organizado",
        importance: "Média importância — 2",
        justification:
          "Porque é uma característica percebida no meu comportamento diário.",
      },
    ],
    reflection:
      "Senti que foi uma tarefa mais pessoal e me fez pensar em como sou percebido pelos outros.",
  },
];

const flowSteps = [
  "Ler em voz alta a atividade apresentada pelo aplicador.",
  "Digitar manualmente a atividade no campo indicado.",
  "Registrar três respostas, uma em cada campo.",
  "Selecionar a resposta de maior importância.",
  "Selecionar a resposta de menor importância.",
  "Confirmar a resposta restante como média importância.",
  "Justificar cada resposta e a importância atribuída.",
  "Registrar a reflexão individual após a tarefa.",
  "Revisar o resumo daquele fractal antes de seguir.",
];

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-bold leading-tight text-[#0F2A43] md:text-3xl">
        {title}
      </h2>
      <p className="mt-3 max-w-5xl text-base leading-7 text-slate-700 md:text-[17px]">
        {description}
      </p>
    </div>
  );
}

function MiniLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700 md:text-base">
      {children}
    </span>
  );
}

function SummaryTable({ fractal }: { fractal: (typeof allFractals)[number] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full min-w-[760px] border-collapse text-left text-[15px] md:text-base">
        <thead className="bg-slate-50 text-[#0F2A43]">
          <tr>
            <th className="px-4 py-3 font-bold">Ordem</th>
            <th className="px-4 py-3 font-bold">Resposta registrada</th>
            <th className="px-4 py-3 font-bold">Importância atribuída</th>
            <th className="px-4 py-3 font-bold">Justificativa</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 text-slate-700">
          {fractal.answers.map((answer) => (
            <tr key={`${fractal.number}-${answer.order}`}>
              <td className="px-4 py-4 font-semibold text-[#0F2A43]">{answer.order}</td>
              <td className="px-4 py-4">{answer.text}</td>
              <td className="px-4 py-4">{answer.importance}</td>
              <td className="px-4 py-4 leading-7">{answer.justification}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyFractalColumn({ number }: { number: number }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-slate-500">
      <p className="font-semibold text-slate-600">Fractal {number}</p>
      <p className="mt-1 text-sm leading-6">Não aplicado neste link.</p>
    </div>
  );
}

export default function PrototipoMultiplosFractaisPage() {
  const [fractalCount, setFractalCount] = useState<1 | 2 | 3>(3);
  const visibleFractals = useMemo(() => allFractals.slice(0, fractalCount), [fractalCount]);

  return (
    <section className="space-y-8 pb-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
          Protótipo visual · Release 1.2.0
        </p>

        <h1 className="text-3xl font-bold leading-tight text-[#0F2A43] md:text-4xl">
          Múltiplos Fractais por Link
        </h1>

        <p className="mt-4 max-w-5xl text-base leading-7 text-slate-700 md:text-[17px]">
          Esta tela detalha o fluxo proposto para criar um único link com 1, 2 ou 3 Fractais de Comportamento. O protótipo é visual, serve para validação do time e não altera o banco de dados.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#B98A2E]">
              Regra 1
            </p>
            <p className="mt-2 text-base font-semibold text-[#0F2A43]">
              O aplicador escolhe quantos fractais deseja usar.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#B98A2E]">
              Regra 2
            </p>
            <p className="mt-2 text-base font-semibold text-[#0F2A43]">
              Somente os campos necessários ficam abertos.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#B98A2E]">
              Regra 3
            </p>
            <p className="mt-2 text-base font-semibold text-[#0F2A43]">
              Cada fractal mantém reflexão final própria.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <SectionHeader
          eyebrow="Visão do aplicador"
          title="Escolha da quantidade exata de fractais"
          description="Em vez de exibir sempre três campos e permitir campos vazios, o sistema pergunta quantos fractais o aplicador deseja aplicar no link. Depois disso, abre somente a quantidade correspondente de campos obrigatórios."
        />

        <div className="mt-6 rounded-2xl border border-[#B98A2E]/30 bg-[#B98A2E]/10 p-5">
          <MiniLabel>Quantidade de Fractais de Comportamento neste link *</MiniLabel>
          <div className="grid gap-3 sm:grid-cols-3">
            {[1, 2, 3].map((count) => {
              const selected = fractalCount === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => setFractalCount(count as 1 | 2 | 3)}
                  className={`rounded-2xl border px-5 py-4 text-left transition ${
                    selected
                      ? "border-[#0F2D4A] bg-[#0F2D4A] text-white shadow-sm"
                      : "border-slate-300 bg-white text-[#0F2A43] hover:border-[#B98A2E]"
                  }`}
                >
                  <span className="block text-lg font-bold">{count} {count === 1 ? "Fractal" : "Fractais"}</span>
                  <span className={`mt-1 block text-sm leading-5 ${selected ? "text-white/85" : "text-slate-600"}`}>
                    O formulário abrirá {count} {count === 1 ? "atividade" : "atividades"} para o avaliado.
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <MiniLabel>Nome do avaliado</MiniLabel>
            <input
              value="João Pereira"
              readOnly
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-700 md:text-[17px]"
            />

            <div className="mt-4">
              <MiniLabel>E-mail</MiniLabel>
              <input
                value="joao@email.com"
                readOnly
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-700 md:text-[17px]"
              />
            </div>

            <div className="mt-4 rounded-xl bg-white p-4 text-base leading-7 text-slate-700">
              <p className="font-semibold text-[#0F2A43]">Regra de validação</p>
              <p className="mt-2">
                Se o aplicador escolher {fractalCount} {fractalCount === 1 ? "fractal" : "fractais"}, todos os {fractalCount} {fractalCount === 1 ? "campo aberto será obrigatório" : "campos abertos serão obrigatórios"} antes de criar o link.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {visibleFractals.map((fractal, index) => (
              <label key={fractal.number} className="block rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <MiniLabel>Fractal {index + 1} de {fractalCount} — atividade definida pelo aplicador *</MiniLabel>
                <textarea
                  value={fractal.activity}
                  readOnly
                  rows={2}
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-base leading-7 text-slate-700 md:text-[17px]"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <SectionHeader
          eyebrow="Visão do avaliado"
          title={`Fluxo sequencial com ${fractalCount} ${fractalCount === 1 ? "fractal" : "fractais"}`}
          description="O avaliado receberá o mesmo link, mas o formulário exibirá exatamente a quantidade definida pelo aplicador. Cada fractal repete a dinâmica atual: copiar manualmente a tarefa, responder, classificar, justificar, refletir e revisar."
        />

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {visibleFractals.map((fractal, index) => (
            <div key={fractal.number} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B98A2E]">
                Fractal {index + 1} de {fractalCount}
              </p>
              <h3 className="mt-2 text-xl font-bold text-[#0F2A43]">
                Tarefa {index + 1}
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-700">
                {fractal.activity}
              </p>
            </div>
          ))}
          {Array.from({ length: 3 - fractalCount }).map((_, index) => (
            <EmptyFractalColumn key={`empty-${index}`} number={fractalCount + index + 1} />
          ))}
        </div>

        <div className="mt-7 rounded-2xl border border-[#B98A2E]/30 bg-[#B98A2E]/10 p-5">
          <p className="text-base font-bold text-[#0F2A43] md:text-lg">
            Validação metodológica repetida em cada fractal
          </p>
          <ol className="mt-4 grid gap-3 text-base leading-7 text-slate-700 md:grid-cols-2 md:text-[17px]">
            {flowSteps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0F2D4A] text-sm font-bold text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <SectionHeader
          eyebrow="Exemplo de tela durante a tarefa"
          title="Obrigatoriedade de digitar a atividade em cada fractal"
          description="O avaliado não deve avançar sem digitar a atividade correspondente ao fractal atual. No formulário real, a função copiar/colar continuará bloqueada no campo de digitação manual da atividade."
        />

        {visibleFractals.map((fractal, index) => (
          <div key={`copy-${fractal.number}`} className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B98A2E]">
              Fractal {index + 1} de {fractalCount} · Passo de cópia manual
            </p>
            <h3 className="mt-2 text-2xl font-bold text-[#0F2A43]">
              Leia a atividade e digite no campo indicado
            </h3>

            <div className="mt-5 rounded-xl bg-white p-4 text-base leading-7 text-slate-700 md:text-[17px]">
              <p className="font-semibold text-[#0F2A43]">Atividade apresentada pelo aplicador</p>
              <p className="mt-2">{fractal.activity}</p>
            </div>

            <label className="mt-5 block">
              <MiniLabel>Digite aqui a atividade que você leu *</MiniLabel>
              <textarea
                value={fractal.copiedActivity}
                readOnly
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-base leading-7 text-slate-700 md:text-[17px]"
              />
            </label>

            <p className="mt-3 text-base leading-7 text-slate-600">
              Para seguir, clique em continuar.
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <SectionHeader
          eyebrow="Resumo por fractal"
          title="O quadro de resumo mantém a reflexão individual"
          description="Ao final de cada atividade, antes de avançar para o próximo fractal, o avaliado revisa o quadro daquele fractal. A reflexão aparece dentro do próprio resumo da tarefa."
        />

        <div className="mt-6 space-y-7">
          {visibleFractals.map((fractal, index) => (
            <article key={`summary-${fractal.number}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B98A2E]">
                Resumo do Fractal {index + 1} de {fractalCount}
              </p>
              <h3 className="mt-2 text-2xl font-bold text-[#0F2A43]">
                Revisão da tarefa {index + 1}
              </h3>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl bg-white p-4">
                  <p className="font-semibold text-[#0F2A43]">Atividade apresentada</p>
                  <p className="mt-2 text-base leading-7 text-slate-700">{fractal.activity}</p>
                </div>
                <div className="rounded-xl bg-white p-4">
                  <p className="font-semibold text-[#0F2A43]">Atividade digitada pelo avaliado</p>
                  <p className="mt-2 text-base leading-7 text-slate-700">{fractal.copiedActivity}</p>
                </div>
              </div>

              <div className="mt-5">
                <SummaryTable fractal={fractal} />
              </div>

              <div className="mt-5 rounded-xl border border-[#B98A2E]/30 bg-white p-4">
                <p className="font-semibold text-[#0F2A43]">
                  Agora pare, pense e escreva como você está sentindo-se após essa tarefa.
                </p>
                <p className="mt-2 text-base leading-7 text-slate-700 md:text-[17px]">
                  {fractal.reflection}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <SectionHeader
          eyebrow="Resumo final antes do envio"
          title="Exemplo do quadro final consolidado"
          description="O quadro final mostra apenas os fractais escolhidos pelo aplicador. As respostas aparecem na ordem em que foram registradas, e a importância aparece como informação associada a cada resposta."
        />

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-xl font-bold text-[#0F2A43]">Dados do avaliado</h3>
          <div className="mt-4 grid gap-3 text-base leading-7 text-slate-700 md:grid-cols-2 md:text-[17px]">
            <p><strong>Nome:</strong> João Pereira</p>
            <p><strong>E-mail:</strong> joao@email.com</p>
            <p><strong>Data de nascimento:</strong> 10/04/1985</p>
            <p><strong>Naturalidade:</strong> Recife/PE</p>
          </div>
        </div>

        <div className="mt-6 space-y-7">
          {visibleFractals.map((fractal, index) => (
            <article key={`final-${fractal.number}`} className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-2xl font-bold text-[#0F2A43]">Fractal {index + 1} de {fractalCount}</h3>
              <p className="mt-3 text-base leading-7 text-slate-700 md:text-[17px]">
                <strong>Atividade:</strong> {fractal.activity}
              </p>
              <p className="mt-2 text-base leading-7 text-slate-700 md:text-[17px]">
                <strong>Atividade digitada:</strong> {fractal.copiedActivity}
              </p>

              <div className="mt-5">
                <SummaryTable fractal={fractal} />
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="font-semibold text-[#0F2A43]">Reflexão registrada</p>
                <p className="mt-2 text-base leading-7 text-slate-700 md:text-[17px]">
                  {fractal.reflection}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-7 rounded-2xl border border-[#0F2D4A]/20 bg-[#0F2D4A]/5 p-5">
          <p className="text-lg font-bold text-[#0F2A43]">Confirmação final</p>
          <p className="mt-2 text-base leading-7 text-slate-700 md:text-[17px]">
            Revise suas respostas, importâncias, justificativas e reflexões. Caso queira alterar alguma informação, utilize a opção de voltar. Ao enviar, sua avaliação será concluída.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <SectionHeader
          eyebrow="Modelo de exportação futura"
          title="Uma linha por avaliado, com blocos por fractal"
          description="A exportação futura preserva a decisão aprovada: uma linha por avaliado. Os campos dos fractais não aplicados ficam vazios."
        />

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[980px] border-collapse text-left text-[15px] md:text-base">
            <thead className="bg-slate-50 text-[#0F2A43]">
              <tr>
                <th className="px-4 py-3 font-bold">Avaliado</th>
                <th className="px-4 py-3 font-bold">Qtde. fractais</th>
                <th className="px-4 py-3 font-bold">Fractal 1</th>
                <th className="px-4 py-3 font-bold">Respostas F1</th>
                <th className="px-4 py-3 font-bold">Reflexão F1</th>
                <th className="px-4 py-3 font-bold">Fractal 2</th>
                <th className="px-4 py-3 font-bold">Respostas F2</th>
                <th className="px-4 py-3 font-bold">Reflexão F2</th>
                <th className="px-4 py-3 font-bold">Fractal 3</th>
                <th className="px-4 py-3 font-bold">Respostas F3</th>
                <th className="px-4 py-3 font-bold">Reflexão F3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              <tr>
                <td className="px-4 py-4 font-semibold text-[#0F2A43]">João Pereira</td>
                <td className="px-4 py-4">{fractalCount}</td>
                <td className="px-4 py-4">{visibleFractals[0]?.activity ?? ""}</td>
                <td className="px-4 py-4">{visibleFractals[0]?.answers.map((answer) => answer.text).join("; ") ?? ""}</td>
                <td className="px-4 py-4">{visibleFractals[0]?.reflection ?? ""}</td>
                <td className="px-4 py-4">{visibleFractals[1]?.activity ?? ""}</td>
                <td className="px-4 py-4">{visibleFractals[1]?.answers.map((answer) => answer.text).join("; ") ?? ""}</td>
                <td className="px-4 py-4">{visibleFractals[1]?.reflection ?? ""}</td>
                <td className="px-4 py-4">{visibleFractals[2]?.activity ?? ""}</td>
                <td className="px-4 py-4">{visibleFractals[2]?.answers.map((answer) => answer.text).join("; ") ?? ""}</td>
                <td className="px-4 py-4">{visibleFractals[2]?.reflection ?? ""}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
