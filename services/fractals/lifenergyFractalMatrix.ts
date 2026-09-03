export type LifenergyFractalMatrixFractal = {
  id: string;
  title: string;
  text: string;
};

export type LifenergyFractalMatrixConnectionPoint = {
  id: string;
  title: string;
  fractals: LifenergyFractalMatrixFractal[];
};

export type LifenergyFractalMatrixVortex = {
  id: string;
  title: string;
  connectionPoints: LifenergyFractalMatrixConnectionPoint[];
};

// Fonte canônica: Tabela de Selecao Lifenergy(1).xlsx, aba "Tabela".
// Não corrigir, reescrever, padronizar ou reordenar os textos abaixo.
export const LIFENERGY_FRACTAL_MATRIX: LifenergyFractalMatrixVortex[] = [
  {
    id: "v1",
    title: "Relacionamento consigo",
    connectionPoints: [
      {
        id: "v1_p1",
        title: "Físico",
        fractals: [
          {
            id: "v1_p1_f1",
            title: "1. Olhe-se no espelho! Identifique três aspectos que você ama. Hierarquize e justifique.",
            text: "1. Olhe-se no espelho! Identifique três aspectos que você ama. Hierarquize e justifique.",
          },
          {
            id: "v1_p1_f2",
            title: "2. O que as pessoas acham de você fisicamente? Dê três opções. Hierarquize suas respostas e justifique.",
            text: "2. O que as pessoas acham de você fisicamente? Dê três opções. Hierarquize suas respostas e justifique.",
          },
          {
            id: "v1_p1_f3",
            title: "3. Coloque três tipos de roupas diferentes. Em uma palavra, que sentimento despertou-lhe cada uma? Hierarquize suas respostas e justifique.",
            text: "3. Coloque três tipos de roupas diferentes. Em uma palavra, que sentimento despertou-lhe cada uma? Hierarquize suas respostas e justifique.",
          },
          {
            id: "v1_p1_f4",
            title: "4. Na primeira oportunidade que você estiver praticando o seu esporte favorito, identifique os três mais fortes sentimentos que ele lhe desperta. Hierarquize e justifique.",
            text: "4. Na primeira oportunidade que você estiver praticando o seu esporte favorito, identifique os três mais fortes sentimentos que ele lhe desperta. Hierarquize e justifique.",
          },
          {
            id: "v1_p1_f5",
            title: "5. Cite três atividades de lazer que você gosta de realizar sozinho, com amigos e com a família. Hierarquize e justifique.",
            text: "5. Cite três atividades de lazer que você gosta de realizar sozinho, com amigos e com a família. Hierarquize e justifique.",
          },
        ],
      },
      {
        id: "v1_p2",
        title: "Espiritual ",
        fractals: [
          {
            id: "v1_p2_f1",
            title: "1. Pare na janela onde você pode observar uma paisagem favorita. Ignore o seu corpo físico. Quem é você realmente? Se dê três alternativas. Hierarquize suas respostas e justifique.",
            text: "1. Pare na janela onde você pode observar uma paisagem favorita. Ignore o seu corpo físico. Quem é você realmente? Se dê três alternativas. Hierarquize suas respostas e justifique.",
          },
          {
            id: "v1_p2_f2",
            title: "2. Sente-se confortavelmente em seu lugar preferido onde não seja interrompido. Feche os olhos, respire fundo e se pergunte: \"Quais os meus principais três níveis de iluminação?\". Responda conforme você entender o que é iluminação. Hierarquize e justifique.",
            text: "2. Sente-se confortavelmente em seu lugar preferido onde não seja interrompido. Feche os olhos, respire fundo e se pergunte: \"Quais os meus principais três níveis de iluminação?\". Responda conforme você entender o que é iluminação. Hierarquize e justifique.",
          },
          {
            id: "v1_p2_f3",
            title: "3. Sua missão no mundo está dividida em três partes. Cite, hierarquize e justifique.",
            text: "3. Sua missão no mundo está dividida em três partes. Cite, hierarquize e justifique.",
          },
          {
            id: "v1_p2_f4",
            title: "4. Nesse final de semana, deite-se no chão, olhe para o céu e reflita sobre o tamanho do universo e a sua participação nele. Identifique as três principais palavras que surgem na sua mente em relação ao tamanho do universo. Hierarquize e justifique.",
            text: "4. Nesse final de semana, deite-se no chão, olhe para o céu e reflita sobre o tamanho do universo e a sua participação nele. Identifique as três principais palavras que surgem na sua mente em relação ao tamanho do universo. Hierarquize e justifique.",
          },
          {
            id: "v1_p2_f5",
            title: "5. O que as pessoas acham de você espiritualmente? Dê três opções. Hierarquize suas respostas e justifique.",
            text: "5. O que as pessoas acham de você espiritualmente? Dê três opções. Hierarquize suas respostas e justifique.",
          },
        ],
      },
      {
        id: "v1_p3",
        title: "Sentimento ",
        fractals: [
          {
            id: "v1_p3_f1",
            title: "1. Que sentimentos você acha que as pessoas sentem por você? Hierarquize sua resposta e justifique.",
            text: "1. Que sentimentos você acha que as pessoas sentem por você? Hierarquize sua resposta e justifique.",
          },
          {
            id: "v1_p3_f2",
            title: "2. Nesta semana, ande descalço na areia, grama ou terra por 15 minutos e localize os três principais sentimentos que você experimentou. Coloque em ordem de intensidade e justifique.",
            text: "2. Nesta semana, ande descalço na areia, grama ou terra por 15 minutos e localize os três principais sentimentos que você experimentou. Coloque em ordem de intensidade e justifique.",
          },
          {
            id: "v1_p3_f3",
            title: "3. Observe pessoas num ato de protesto. Quais os três principais sentimentos que os manifestantes lhe despertam? Hierarquize suas respostas e justifique.",
            text: "3. Observe pessoas num ato de protesto. Quais os três principais sentimentos que os manifestantes lhe despertam? Hierarquize suas respostas e justifique.",
          },
          {
            id: "v1_p3_f4",
            title: "4. Procure uma foto ou o site do seu maior concorrente/adversário. Demore um pouco lembrando passagens suas com ele. Pare um pouco e identifique que sentimentos você vive nesta relação. Enumere os três mais significativos para você. Herarquize e justifique.",
            text: "4. Procure uma foto ou o site do seu maior concorrente/adversário. Demore um pouco lembrando passagens suas com ele. Pare um pouco e identifique que sentimentos você vive nesta relação. Enumere os três mais significativos para você. Herarquize e justifique.",
          },
        ],
      },
      {
        id: "v1_p4",
        title: "Financeiro",
        fractals: [
          {
            id: "v1_p4_f1",
            title: "1. Suponha que você joga na Mega-Sena e ganha. Cite as 3 primeiras coisas que faria com o dinheiro. Hierarquize e justifique.",
            text: "1. Suponha que você joga na Mega-Sena e ganha. Cite as 3 primeiras coisas que faria com o dinheiro. Hierarquize e justifique.",
          },
          {
            id: "v1_p4_f2",
            title: "2. Com que você compara o dinheiro? Cite três opções. Hierarquize e justifique.",
            text: "2. Com que você compara o dinheiro? Cite três opções. Hierarquize e justifique.",
          },
          {
            id: "v1_p4_f3",
            title: "3. Pegue uma folha de papel e faça um desenho que represente o seu orçamento mensal. Separe a figura desenhada em partes. Hierarquize e justifique as partes do desenho.",
            text: "3. Pegue uma folha de papel e faça um desenho que represente o seu orçamento mensal. Separe a figura desenhada em partes. Hierarquize e justifique as partes do desenho.",
          },
          {
            id: "v1_p4_f4",
            title: "4. Comumente, como as pessoas lhe veem em relação ao dinheiro? Dê três opções, hierarquize e justifique.",
            text: "4. Comumente, como as pessoas lhe veem em relação ao dinheiro? Dê três opções, hierarquize e justifique.",
          },
          {
            id: "v1_p4_f5",
            title: "5. Você pode gastar o seu dinheiro na compra de um carro de luxo e de vários outros artigos de luxo que lhe dao conforto. Os seus vizeinhos e amigos comuntam que você é esnobe e esbanjador. Hierarquize e justifique as possibilidades abaixo; . para mostrar que você pode . para sarisfazer a sua familia . porque você viu utilidadee na compra",
            text: "5. Você pode gastar o seu dinheiro na compra de um carro de luxo e de vários outros artigos de luxo que lhe dao conforto. Os seus vizeinhos e amigos comuntam que você é esnobe e esbanjador. Hierarquize e justifique as possibilidades abaixo; . para mostrar que você pode . para sarisfazer a sua familia . porque você viu utilidadee na compra",
          },
        ],
      },
      {
        id: "v1_p5",
        title: "Profissional ",
        fractals: [
          {
            id: "v1_p5_f1",
            title: "1. Que três qualidades profissionais os outros consideram que você tem? Cite, hierarquize e justifique.",
            text: "1. Que três qualidades profissionais os outros consideram que você tem? Cite, hierarquize e justifique.",
          },
          {
            id: "v1_p5_f2",
            title: "2. Você necessita defender a sua profissão para um grupo de colegas. Cite trêsargumentos que justifiquem você ter esta profissão. Hierarquize e justifique.",
            text: "2. Você necessita defender a sua profissão para um grupo de colegas. Cite trêsargumentos que justifiquem você ter esta profissão. Hierarquize e justifique.",
          },
          {
            id: "v1_p5_f3",
            title: "3. Imagine que você acaba de receber ou se dar um prêmio de uma viagem pelo seu trabalho. Quais são as três principais emoções que você experimenta? Ordene a partir da mais relevante e justifique.",
            text: "3. Imagine que você acaba de receber ou se dar um prêmio de uma viagem pelo seu trabalho. Quais são as três principais emoções que você experimenta? Ordene a partir da mais relevante e justifique.",
          },
          {
            id: "v1_p5_f4",
            title: "4. Ao acordar pela manhã, você tem três razões para pular da cama. Enumere-as. Hierarquize e justifique.",
            text: "4. Ao acordar pela manhã, você tem três razões para pular da cama. Enumere-as. Hierarquize e justifique.",
          },
        ],
      },
      {
        id: "v1_p6",
        title: "Intelectual ",
        fractals: [
          {
            id: "v1_p6_f1",
            title: "1. A inteligência artificial tornou se assunto bastante relevante. Assista a um vídeo que trate de inteligência artificial e de seus benefícios para a empresa. Enumere três evidências que lhe chamaram a atenção, hierarquize e justifique.",
            text: "1. A inteligência artificial tornou se assunto bastante relevante. Assista a um vídeo que trate de inteligência artificial e de seus benefícios para a empresa. Enumere três evidências que lhe chamaram a atenção, hierarquize e justifique.",
          },
          {
            id: "v1_p6_f2",
            title: "2. Assista, nesta semana, uma palestra on-line ou uma \"live\" sobre empreendedorismo e/ou cultura organizacional em tempos desafiadores. Elenque três aspectos que lhe chamaram a atenção hierarquize e justifique.",
            text: "2. Assista, nesta semana, uma palestra on-line ou uma \"live\" sobre empreendedorismo e/ou cultura organizacional em tempos desafiadores. Elenque três aspectos que lhe chamaram a atenção hierarquize e justifique.",
          },
          {
            id: "v1_p6_f3",
            title: "3. Revisite online um museu ou um local cultural que você já tenha visitado pessoalmente. Enumere três diferenças entre a visita presencial e a online que lhe incrementaram o conhecimento. Hierarquize e Justifique.",
            text: "3. Revisite online um museu ou um local cultural que você já tenha visitado pessoalmente. Enumere três diferenças entre a visita presencial e a online que lhe incrementaram o conhecimento. Hierarquize e Justifique.",
          },
          {
            id: "v1_p6_f4",
            title: "4. A minha intelectualidade constante passa pelo conhecimento, intuição e ação. Na sua forma habitual de ser, cite três episódios vividos recentemente em que prevaleceu a intuição. Hierarquize e justifique.",
            text: "4. A minha intelectualidade constante passa pelo conhecimento, intuição e ação. Na sua forma habitual de ser, cite três episódios vividos recentemente em que prevaleceu a intuição. Hierarquize e justifique.",
          },
        ],
      },
    ],
  },
  {
    id: "v2",
    title: "Relacionamento com o outro",
    connectionPoints: [
      {
        id: "v2_p1",
        title: "Pais ",
        fractals: [
          {
            id: "v2_p1_f1",
            title: "1. No próximo encontro com seus pais ou com quem os representa, pergunte como foi o contexto do seu nascimento. Escute atentamente a história. Registre três episódios que lhe chamaram a atenção. Hierarquize e justifique.",
            text: "1. No próximo encontro com seus pais ou com quem os representa, pergunte como foi o contexto do seu nascimento. Escute atentamente a história. Registre três episódios que lhe chamaram a atenção. Hierarquize e justifique.",
          },
          {
            id: "v2_p1_f2",
            title: "2. Tire um tempinho a tardinha e vá de surpresa, levando um bolo para tomar um café, à casa dos seus pais. Cite três sentimentos que fluíram nesse encontro. Hierarquize e justifique.",
            text: "2. Tire um tempinho a tardinha e vá de surpresa, levando um bolo para tomar um café, à casa dos seus pais. Cite três sentimentos que fluíram nesse encontro. Hierarquize e justifique.",
          },
          {
            id: "v2_p1_f3",
            title: "3. Convide seus pais para assistir juntamente com a sua família nuclear, ao show musical de um cantor especial que você admira. No momento da apresentação, observe todos os seus familiares e verifique que significado cada um tem para você. Identifique os três sentimentos mais frequentes que você teve. Hierarquize e justifique.",
            text: "3. Convide seus pais para assistir juntamente com a sua família nuclear, ao show musical de um cantor especial que você admira. No momento da apresentação, observe todos os seus familiares e verifique que significado cada um tem para você. Identifique os três sentimentos mais frequentes que você teve. Hierarquize e justifique.",
          },
          {
            id: "v2_p1_f4",
            title: "4. O que você acha que seus pais pensam de você? Dê três possibilidades. Hierarquize e justifique",
            text: "4. O que você acha que seus pais pensam de você? Dê três possibilidades. Hierarquize e justifique",
          },
        ],
      },
      {
        id: "v2_p2",
        title: "Cojuges ",
        fractals: [
          {
            id: "v2_p2_f1",
            title: "1. Acompanhe seu/sua companheiro(a) ao cabeleireiro no próximo final de semana. Fique esperando e pague-lheas contas. Nessa atividade, observe três coisas interessantes nele (a) que há muito você não via. Hierarquize e justifique.",
            text: "1. Acompanhe seu/sua companheiro(a) ao cabeleireiro no próximo final de semana. Fique esperando e pague-lheas contas. Nessa atividade, observe três coisas interessantes nele (a) que há muito você não via. Hierarquize e justifique.",
          },
          {
            id: "v2_p2_f2",
            title: "2. Junto com seu/sua parceiro(a), olhem e comentem as fotos do momento em que vocêsconsagraram a união. Quais as três referências mais fortes que os uniu? Hierarquize e justifique.",
            text: "2. Junto com seu/sua parceiro(a), olhem e comentem as fotos do momento em que vocêsconsagraram a união. Quais as três referências mais fortes que os uniu? Hierarquize e justifique.",
          },
          {
            id: "v2_p2_f3",
            title: "3. Converse com seu parceiro(a) amoroso(a) e combinem de tomar sol juntos por 30 minutos nesta semana. Quais os sentimentos mais relevantes que vieram à tona nesse momento? Hierarquize e justifique.",
            text: "3. Converse com seu parceiro(a) amoroso(a) e combinem de tomar sol juntos por 30 minutos nesta semana. Quais os sentimentos mais relevantes que vieram à tona nesse momento? Hierarquize e justifique.",
          },
          {
            id: "v2_p2_f4",
            title: "4. Enumere três características que você acha que seu cônjuge acha de você. Hierarquize e justifique.",
            text: "4. Enumere três características que você acha que seu cônjuge acha de você. Hierarquize e justifique.",
          },
        ],
      },
      {
        id: "v2_p3",
        title: "Filhos ",
        fractals: [
          {
            id: "v2_p3_f1",
            title: "1.Olhe algumas fotos antigas com seu(s) filho(s) e descubra três aspectos que mais os unia. Hierarquize e justifique.",
            text: "1.Olhe algumas fotos antigas com seu(s) filho(s) e descubra três aspectos que mais os unia. Hierarquize e justifique.",
          },
          {
            id: "v2_p3_f2",
            title: "2. Vá com seus filhos, no final de semana, fazer três atividades que você fazia quando estava na idade deles. Hierarquize e justifique",
            text: "2. Vá com seus filhos, no final de semana, fazer três atividades que você fazia quando estava na idade deles. Hierarquize e justifique",
          },
          {
            id: "v2_p3_f3",
            title: "3. Coloque uma música e dance com seu filho(a) ou imagine a cena. Quais os sentimentos mais importantes que lhe ocorreram? Ordene e justifique.",
            text: "3. Coloque uma música e dance com seu filho(a) ou imagine a cena. Quais os sentimentos mais importantes que lhe ocorreram? Ordene e justifique.",
          },
          {
            id: "v2_p3_f4",
            title: "4. O que seus filhos pensam de você como pai/mãe e como ser humano? Cite três idéias. Hierarquize e justifique.",
            text: "4. O que seus filhos pensam de você como pai/mãe e como ser humano? Cite três idéias. Hierarquize e justifique.",
          },
          {
            id: "v2_p3_f5",
            title: "5. Reúna a sua família. Desperte o interesse nos seus filhos para eles escutarem a sua história empresarial que você contará para eles. Quais os três aspectos que mais chamaram a atenção deles? Hierarquize e justifique.",
            text: "5. Reúna a sua família. Desperte o interesse nos seus filhos para eles escutarem a sua história empresarial que você contará para eles. Quais os três aspectos que mais chamaram a atenção deles? Hierarquize e justifique.",
          },
        ],
      },
      {
        id: "v2_p4",
        title: "Amigos ",
        fractals: [
          {
            id: "v2_p4_f1",
            title: "1. Convide seu amigo mais próximo para o café da manhã do sábado. Você percebe que ele está alegre. Identifique três possibilidades que estão lhe deixando seu amigo neste estado. Hierarquize e justifique.",
            text: "1. Convide seu amigo mais próximo para o café da manhã do sábado. Você percebe que ele está alegre. Identifique três possibilidades que estão lhe deixando seu amigo neste estado. Hierarquize e justifique.",
          },
          {
            id: "v2_p4_f2",
            title: "2. Convide alguns amigos de infância e busque relembrar as passagens de infância que os deixavam alegres. Cite três delas. Hierarquize e justifique.",
            text: "2. Convide alguns amigos de infância e busque relembrar as passagens de infância que os deixavam alegres. Cite três delas. Hierarquize e justifique.",
          },
          {
            id: "v2_p4_f3",
            title: "3. Procure nas redes sociais por um(a) amigo(a) especial da sua infância e estabeleça um contato de recordação dos bons momentos que tiveram. Cite três recordações desse encontro. Hierarquize e justifique.",
            text: "3. Procure nas redes sociais por um(a) amigo(a) especial da sua infância e estabeleça um contato de recordação dos bons momentos que tiveram. Cite três recordações desse encontro. Hierarquize e justifique.",
          },
          {
            id: "v2_p4_f4",
            title: "4. Cite três aspectos mais frequentes que seus amigos pensam de você. Hierarquize e justifique.",
            text: "4. Cite três aspectos mais frequentes que seus amigos pensam de você. Hierarquize e justifique.",
          },
          {
            id: "v2_p4_f5",
            title: "5. Escolha um livro ou um artigo para ler neste mês que trate da gestão no mundo VUCA e discuta com um empresário amigo seu que se interessa pelo assunto. Ao final da tarefa, enumere três aspectos que impactam na atual gestão e são coincidentes entre vocês. Hierarquize e justifique.",
            text: "5. Escolha um livro ou um artigo para ler neste mês que trate da gestão no mundo VUCA e discuta com um empresário amigo seu que se interessa pelo assunto. Ao final da tarefa, enumere três aspectos que impactam na atual gestão e são coincidentes entre vocês. Hierarquize e justifique.",
          },
        ],
      },
      {
        id: "v2_p5",
        title: "Subordinados ",
        fractals: [
          {
            id: "v2_p5_f1",
            title: "1. Reúna três subordinados e depois de compartilhar alguma história sua de sucesso e conquista profissional, peça para cada um deles contar a sua. Selecione três pontos significativos das histórias e verbalize sua apreciação. Hierarquize e justifique.",
            text: "1. Reúna três subordinados e depois de compartilhar alguma história sua de sucesso e conquista profissional, peça para cada um deles contar a sua. Selecione três pontos significativos das histórias e verbalize sua apreciação. Hierarquize e justifique.",
          },
          {
            id: "v2_p5_f2",
            title: "2. Convide três funcionários para almoçar com você nessa semana e converse sobre temas cotidianos. Escolha três passagens interessantes sobre eles que você observou neste encontro. Relacione, hierarquize e justifique.",
            text: "2. Convide três funcionários para almoçar com você nessa semana e converse sobre temas cotidianos. Escolha três passagens interessantes sobre eles que você observou neste encontro. Relacione, hierarquize e justifique.",
          },
          {
            id: "v2_p5_f3",
            title: "3. Ligue para todos os gerentes e supervisores que fazem aniversário nessa semana ou mês, dando parabéns e agradecendo pela dedicação à empresa. Enumere três aspectos mais marcantes na conduta receptiva dos seus subordinados à sua ligação. Hierarquize e justifique.",
            text: "3. Ligue para todos os gerentes e supervisores que fazem aniversário nessa semana ou mês, dando parabéns e agradecendo pela dedicação à empresa. Enumere três aspectos mais marcantes na conduta receptiva dos seus subordinados à sua ligação. Hierarquize e justifique.",
          },
          {
            id: "v2_p5_f4",
            title: "4. Programe um treinamento para os seus colaboradores de forma que você possa acompanhar um dia de suas atividades. Para a fase de avaliação, estabeleça indicadores fundamentados nesses quesitos: No atingimento de meta compatível com o objetivo do projeto traçado. No cronograma de tempo estabelecido. No adequado encaixe com as outras partes do projeto desenvolvidos pelos outros colaboradores. Eleja um colaborador e observe o seu perfil. Cite três pontos significativos que você considerou observando o atingimento da meta e o perfil do seu colaborador. Hierarquize e justifique.",
            text: "4. Programe um treinamento para os seus colaboradores de forma que você possa acompanhar um dia de suas atividades. Para a fase de avaliação, estabeleça indicadores fundamentados nesses quesitos: No atingimento de meta compatível com o objetivo do projeto traçado. No cronograma de tempo estabelecido. No adequado encaixe com as outras partes do projeto desenvolvidos pelos outros colaboradores. Eleja um colaborador e observe o seu perfil. Cite três pontos significativos que você considerou observando o atingimento da meta e o perfil do seu colaborador. Hierarquize e justifique.",
          },
        ],
      },
      {
        id: "v2_p6",
        title: "Parceiros ",
        fractals: [
          {
            id: "v2_p6_f1",
            title: "1. Você está montando um programa de Responsabilidade Social para sua empresa. É um sonho seu acalentado há muito tempo e que vem crescendo a cada dia. Você precisa de parceiros para desenvolver esse projeto com você. Enumere três características essenciais que você precisa encontrar neles. Hierarquize e justifique.",
            text: "1. Você está montando um programa de Responsabilidade Social para sua empresa. É um sonho seu acalentado há muito tempo e que vem crescendo a cada dia. Você precisa de parceiros para desenvolver esse projeto com você. Enumere três características essenciais que você precisa encontrar neles. Hierarquize e justifique.",
          },
          {
            id: "v2_p6_f2",
            title: "2. Enumere três aspectos relevantes na parceria estabelecida entre a sua empresa com outra. Hierarquize e justifique.",
            text: "2. Enumere três aspectos relevantes na parceria estabelecida entre a sua empresa com outra. Hierarquize e justifique.",
          },
          {
            id: "v2_p6_f3",
            title: "3. Um dos seus parceiros provocou prejuízo financeiro e moral na empresa, o que lhe constrangeu pessoalmente diante dos demais parceiros. Cite três ações que você precisa desenvolver neste caso. Hierarquize e justifique.",
            text: "3. Um dos seus parceiros provocou prejuízo financeiro e moral na empresa, o que lhe constrangeu pessoalmente diante dos demais parceiros. Cite três ações que você precisa desenvolver neste caso. Hierarquize e justifique.",
          },
          {
            id: "v2_p6_f4",
            title: "4. Qual a impressão que os seus parceiros têm de você? Hierarquize e justifique.",
            text: "4. Qual a impressão que os seus parceiros têm de você? Hierarquize e justifique.",
          },
          {
            id: "v2_p6_f5",
            title: "5. Trabalhando na empresa da sua família, o fundador lhe escolhe para sucessor, dando-lhe oportunidade de se tornar sócio. Sua irmã e sua mãe ficam contra e resolvem criar caso. Acham que, mesmo sem trabalharem na empresa, elas têm direito a partes iguais de ações e na retirada dos lucros. Não entendem a transitoriedade do negócio e a necessidade de revitalizá-lo com novas parcerias. Entendem tudo como herança e desconhecem o enriquecimento da família pelo progresso que a empresa vem tendo com você como parceiro. Cite três momentos em que você vem vivendo esta experiência. Hierarquize e justifique.",
            text: "5. Trabalhando na empresa da sua família, o fundador lhe escolhe para sucessor, dando-lhe oportunidade de se tornar sócio. Sua irmã e sua mãe ficam contra e resolvem criar caso. Acham que, mesmo sem trabalharem na empresa, elas têm direito a partes iguais de ações e na retirada dos lucros. Não entendem a transitoriedade do negócio e a necessidade de revitalizá-lo com novas parcerias. Entendem tudo como herança e desconhecem o enriquecimento da família pelo progresso que a empresa vem tendo com você como parceiro. Cite três momentos em que você vem vivendo esta experiência. Hierarquize e justifique.",
          },
        ],
      },
    ],
  },
  {
    id: "v3",
    title: "Relacionamento com o todo",
    connectionPoints: [
      {
        id: "v3_p1",
        title: "Familiar ",
        fractals: [
          {
            id: "v3_p1_f1",
            title: "1. Quais as profissões mais comuns de familiares ascendentes nas suas quatro últimas gerações? Enumere três tipos de influências profissionais transgeracionais que voce identificou. Hierarquize e justifique.",
            text: "1. Quais as profissões mais comuns de familiares ascendentes nas suas quatro últimas gerações? Enumere três tipos de influências profissionais transgeracionais que voce identificou. Hierarquize e justifique.",
          },
          {
            id: "v3_p1_f2",
            title: "2. Você é bem-sucedido empresarialmente. Consegue fazer seus negócios properarem.Os outros empresarios o adiram e buscam a sua companhia e seus conselhos. Você é convidado por órgãos expressivos do empresariado para fazer palestras e participar de grupos. Você é casado, tem esposa e filhos adolescentes. Cite três situações em que você reconhece o ativo familiar no seu negócio. Hierarquize e justifique.",
            text: "2. Você é bem-sucedido empresarialmente. Consegue fazer seus negócios properarem.Os outros empresarios o adiram e buscam a sua companhia e seus conselhos. Você é convidado por órgãos expressivos do empresariado para fazer palestras e participar de grupos. Você é casado, tem esposa e filhos adolescentes. Cite três situações em que você reconhece o ativo familiar no seu negócio. Hierarquize e justifique.",
          },
          {
            id: "v3_p1_f3",
            title: "3. Olhe para seu rosto no espelho e identifique três características físicas que são similares aos dos seus irmãos, pais, filhos ou parentes próximos.Hierarquize e justifique.",
            text: "3. Olhe para seu rosto no espelho e identifique três características físicas que são similares aos dos seus irmãos, pais, filhos ou parentes próximos.Hierarquize e justifique.",
          },
          {
            id: "v3_p1_f4",
            title: "4. Seus pais precisaram que você os ajudasse profissionalmente nas empresas e/ou trabalhos para dar continuidade. Cite três influências que hoje são evidentes e que você passou para a sua família nuclear. Hierarquize e justifique.",
            text: "4. Seus pais precisaram que você os ajudasse profissionalmente nas empresas e/ou trabalhos para dar continuidade. Cite três influências que hoje são evidentes e que você passou para a sua família nuclear. Hierarquize e justifique.",
          },
        ],
      },
      {
        id: "v3_p2",
        title: "Social ",
        fractals: [
          {
            id: "v3_p2_f1",
            title: "1. Experimente observar alguém desconhecido que estiver na sua frente. Quais os três principais sentimentos que ele desperta em você? Hierarquize e justifique.",
            text: "1. Experimente observar alguém desconhecido que estiver na sua frente. Quais os três principais sentimentos que ele desperta em você? Hierarquize e justifique.",
          },
          {
            id: "v3_p2_f2",
            title: "2. Pergunte para alguma pessoa próxima qual eram suas três brincadeiras preferidas quando criança e que a levava a passar horas sem desligar. Reita, hierarquize e justifique.",
            text: "2. Pergunte para alguma pessoa próxima qual eram suas três brincadeiras preferidas quando criança e que a levava a passar horas sem desligar. Reita, hierarquize e justifique.",
          },
          {
            id: "v3_p2_f3",
            title: "3. Estando acompanhado numa festa de entrega de prêmios a pessoas notáveis, três evidências lhe chamam a atenção. Quais são elas? Hierarquize e justifique.",
            text: "3. Estando acompanhado numa festa de entrega de prêmios a pessoas notáveis, três evidências lhe chamam a atenção. Quais são elas? Hierarquize e justifique.",
          },
          {
            id: "v3_p2_f4",
            title: "4. Uma empresa que precisava diminuir o seu turnover desenvolveu um projeto de responsabilidade social onde um dos itens era fornecer o café da manhã para os colaboradores do chão de fábrica acompanhados da família. Depois de seis meses, o resultado foi a diminuição do absenteísmo, dos atestados médicos e do turnover. Enumere três comportamentos consequentes dessa atitude (a empresa oferecer café da manhã para os colaboradores e familiares). Hierarquize e justifique.",
            text: "4. Uma empresa que precisava diminuir o seu turnover desenvolveu um projeto de responsabilidade social onde um dos itens era fornecer o café da manhã para os colaboradores do chão de fábrica acompanhados da família. Depois de seis meses, o resultado foi a diminuição do absenteísmo, dos atestados médicos e do turnover. Enumere três comportamentos consequentes dessa atitude (a empresa oferecer café da manhã para os colaboradores e familiares). Hierarquize e justifique.",
          },
        ],
      },
      {
        id: "v3_p3",
        title: "Institucional",
        fractals: [
          {
            id: "v3_p3_f1",
            title: "1. Compare uma empresa conhecida com três objetos da sua preferência. Hiererquize e justifique.",
            text: "1. Compare uma empresa conhecida com três objetos da sua preferência. Hiererquize e justifique.",
          },
          {
            id: "v3_p3_f2",
            title: "2. Vá a um templo/igreja/local de sua preferência e converse com seu Deus/Criador/Guia sobre sua vida. Cite três passagens desta conversa. Hierarquize e justifique. .",
            text: "2. Vá a um templo/igreja/local de sua preferência e converse com seu Deus/Criador/Guia sobre sua vida. Cite três passagens desta conversa. Hierarquize e justifique. .",
          },
          {
            id: "v3_p3_f3",
            title: "3. Nesta semana, tente encontrar um amigo, pessoalmente ou online, do seu tempo do ensino fundamental. Procure relembrar três episódios que marcaram aquela época. Hierarquize e justifique",
            text: "3. Nesta semana, tente encontrar um amigo, pessoalmente ou online, do seu tempo do ensino fundamental. Procure relembrar três episódios que marcaram aquela época. Hierarquize e justifique",
          },
          {
            id: "v3_p3_f4",
            title: "4. Um grupo de empresários do agronegócio de uma região se reuniu objetivando desenvolver o setor produtivo. Eles organizaram um rede de empresas e conseguiram fomentar a \"criação do valor compartilhado\" reetido na cultura organizacional das empresas da rede. Criaram um programa de desenvolvimento de intraempreendedorismo e responsabilidade social interna. Cite três possibilidades resultantes destas ações. Hierarquize e justifique.",
            text: "4. Um grupo de empresários do agronegócio de uma região se reuniu objetivando desenvolver o setor produtivo. Eles organizaram um rede de empresas e conseguiram fomentar a \"criação do valor compartilhado\" reetido na cultura organizacional das empresas da rede. Criaram um programa de desenvolvimento de intraempreendedorismo e responsabilidade social interna. Cite três possibilidades resultantes destas ações. Hierarquize e justifique.",
          },
        ],
      },
      {
        id: "v3_p4",
        title: "Processos de vida ",
        fractals: [
          {
            id: "v3_p4_f1",
            title: "1. Quando você pensa em três situações que possam lhe ajudar na criação dos seus filhos, você realmente está se referindo a que? Hierarquize e Justifique.",
            text: "1. Quando você pensa em três situações que possam lhe ajudar na criação dos seus filhos, você realmente está se referindo a que? Hierarquize e Justifique.",
          },
          {
            id: "v3_p4_f2",
            title: "2. Dentro da situação de isolamento social na pandemia de 2020, você precisou cumprir uma programação feita por você próprio. Cite três aprendizados seus que você levará para o resto da vida. Hierarquize e justifique.",
            text: "2. Dentro da situação de isolamento social na pandemia de 2020, você precisou cumprir uma programação feita por você próprio. Cite três aprendizados seus que você levará para o resto da vida. Hierarquize e justifique.",
          },
          {
            id: "v3_p4_f3",
            title: "3. Na próxima reunião de board/área, observe os participantes da reunião por cinco minutos e procure classificar três colegas de acordo com a escala sociométrica: o membro isolado, o membro engajado e a estrela de popularidade. hierarquize e justifique.",
            text: "3. Na próxima reunião de board/área, observe os participantes da reunião por cinco minutos e procure classificar três colegas de acordo com a escala sociométrica: o membro isolado, o membro engajado e a estrela de popularidade. hierarquize e justifique.",
          },
          {
            id: "v3_p4_f4",
            title: "4. Cite três ideias que você acha que os outros têm da sua vida e do seu sucesso. Hierarquize e justifique.",
            text: "4. Cite três ideias que você acha que os outros têm da sua vida e do seu sucesso. Hierarquize e justifique.",
          },
        ],
      },
      {
        id: "v3_p5",
        title: "Principios éticos ",
        fractals: [
          {
            id: "v3_p5_f1",
            title: "1. Você precisa fazer uma longa viagem e só pode levar três referências. Enumere, hierarquize e justifique.",
            text: "1. Você precisa fazer uma longa viagem e só pode levar três referências. Enumere, hierarquize e justifique.",
          },
          {
            id: "v3_p5_f2",
            title: "2. Você possui legalmente empresa(s), imóveis, aplicações e muitos outros recursos. Quais as três motivações que mais lhe induziram no seu processo de aquisições? Hierarquize e justifique.",
            text: "2. Você possui legalmente empresa(s), imóveis, aplicações e muitos outros recursos. Quais as três motivações que mais lhe induziram no seu processo de aquisições? Hierarquize e justifique.",
          },
          {
            id: "v3_p5_f3",
            title: "3. Você conseguiu um grande ganho no mercado financeiro. Foi uma aplicação muito bem sucedida. Como você lida com essa situação? Dê três possibilidades. Hierarquize e justifique.",
            text: "3. Você conseguiu um grande ganho no mercado financeiro. Foi uma aplicação muito bem sucedida. Como você lida com essa situação? Dê três possibilidades. Hierarquize e justifique.",
          },
          {
            id: "v3_p5_f4",
            title: "4. Momento de gratidão: Trace os limites de um espaço físico de gratidão em um lugar da sala. Coloque nesse espaço um objeto que represente você. Separe outros objetos ao seu redor que representem pessoas que você acha que magoou. Disponha estes objetos nesse espaço na distância que elas estejam do objeto que representa você. Examine cada pessoa no contexto representado pelos objetos. Examine o objeto que você escolheu para representar cada uma. Observe a distância para representar cada uma. Cite algumas qualidades que cada uma tem. Lembre-se da dificuldade que você teve de superar o que aconteceu e a distância do tempo do acontecimento. Veja a sua maturidade naquele acontecimento. Veja a sua maturidade naquela época e imagine se você hoje, com tudo que você e o outro já aprenderam, como vocês poderiam resolver esta situação. Neste momento, tente desenvolver um sentimento positivo por cada uma que lhe conduza a gratidão pelos fatos ocorridos. Monte fisicamente um cenário onde vocês possam estar se reencontrando. Esteja um tempinho vivendo, neste cenário, o sentimento e a gratidão. Se você seguiu as instruções entregando-se ao exercício, você deverá estar mais \"leve\". Está?",
            text: "4. Momento de gratidão: Trace os limites de um espaço físico de gratidão em um lugar da sala. Coloque nesse espaço um objeto que represente você. Separe outros objetos ao seu redor que representem pessoas que você acha que magoou. Disponha estes objetos nesse espaço na distância que elas estejam do objeto que representa você. Examine cada pessoa no contexto representado pelos objetos. Examine o objeto que você escolheu para representar cada uma. Observe a distância para representar cada uma. Cite algumas qualidades que cada uma tem. Lembre-se da dificuldade que você teve de superar o que aconteceu e a distância do tempo do acontecimento. Veja a sua maturidade naquele acontecimento. Veja a sua maturidade naquela época e imagine se você hoje, com tudo que você e o outro já aprenderam, como vocês poderiam resolver esta situação. Neste momento, tente desenvolver um sentimento positivo por cada uma que lhe conduza a gratidão pelos fatos ocorridos. Monte fisicamente um cenário onde vocês possam estar se reencontrando. Esteja um tempinho vivendo, neste cenário, o sentimento e a gratidão. Se você seguiu as instruções entregando-se ao exercício, você deverá estar mais \"leve\". Está?",
          },
        ],
      },
      {
        id: "v3_p6",
        title: "Finitude",
        fractals: [
          {
            id: "v3_p6_f1",
            title: "1. \"A vida é uma preparação para a morte\", diz um pai moribundo ao seu filho sucessor nos negócios. Cite três possibilidades de entendimento dessa afirmação. Hierarquize e justifique.",
            text: "1. \"A vida é uma preparação para a morte\", diz um pai moribundo ao seu filho sucessor nos negócios. Cite três possibilidades de entendimento dessa afirmação. Hierarquize e justifique.",
          },
          {
            id: "v3_p6_f2",
            title: "2. No último velório que você foi, cite três fatores que lhe chamaram a atenção na morte. Hierarquize e justifique.",
            text: "2. No último velório que você foi, cite três fatores que lhe chamaram a atenção na morte. Hierarquize e justifique.",
          },
          {
            id: "v3_p6_f3",
            title: "3. Relembre a morte de um parente profundamente querido. Naquele momento o que você entendeu da vida? Evidencie três possibilidades. Hierarquize e justifique",
            text: "3. Relembre a morte de um parente profundamente querido. Naquele momento o que você entendeu da vida? Evidencie três possibilidades. Hierarquize e justifique",
          },
          {
            id: "v3_p6_f4",
            title: "4. Com 81 anos, o que você espera estar fazendo? Cite três alternativas possíveis. Hierarquize e justifique.",
            text: "4. Com 81 anos, o que você espera estar fazendo? Cite três alternativas possíveis. Hierarquize e justifique.",
          },
          {
            id: "v3_p6_f5",
            title: "5. \"A cor da vida é a cor da morte\", disse uma velha senhora. Baseado nessa afirmação, quais são as três principais cores de sua vida? Hierarquize e justifique.",
            text: "5. \"A cor da vida é a cor da morte\", disse uma velha senhora. Baseado nessa afirmação, quais são as três principais cores de sua vida? Hierarquize e justifique.",
          },
          {
            id: "v3_p6_f6",
            title: "6. Cite três momentos do processo de sucessão que você adota, que se relacionem com você, com o sucessor e com o processo. Hierarquize e justifique.",
            text: "6. Cite três momentos do processo de sucessão que você adota, que se relacionem com você, com o sucessor e com o processo. Hierarquize e justifique.",
          },
        ],
      },
    ],
  },
];

export function findFractalMatrixItem(vortexId: string, connectionPointId: string, fractalId: string) {
  const vortex = LIFENERGY_FRACTAL_MATRIX.find((item) => item.id === vortexId);
  const connectionPoint = vortex?.connectionPoints.find((item) => item.id === connectionPointId);
  const fractal = connectionPoint?.fractals.find((item) => item.id === fractalId);

  if (!vortex || !connectionPoint || !fractal) return null;

  return { vortex, connectionPoint, fractal };
}
