import type { Receitas } from "@/core/tipos";

/**
 * Receitas por item (corte ou acompanhamento), indexadas pelo `id`.
 * Cada item traz uma receita PADRÃO (simples, do dia a dia) e uma
 * PARA IMPRESSIONAR (mais elaborada). Quantidades são por porção/peça —
 * ajuste conforme o total calculado.
 *
 * ⚠️ CONTEÚDO PARA REVISÃO — receitas de referência; ajuste a gosto.
 */
export const RECEITAS: Record<string, Receitas> = {
  // ─────────────────────────── BOVINA ───────────────────────────
  contrafile: {
    padrao: {
      titulo: "Contrafilé na brasa",
      tempo: "20 min",
      ingredientes: ["Bifes de contrafilé (2–3 cm)", "Sal grosso", "Pimenta-do-reino"],
      passos: [
        "Tempere com sal grosso 30 min antes.",
        "Sele em fogo alto, ~3 min de cada lado.",
        "Deixe descansar 3 min antes de servir.",
      ],
    },
    impressionar: {
      titulo: "Contrafilé com manteiga de alho e ervas",
      tempo: "30 min",
      ingredientes: [
        "Contrafilé em peça",
        "Sal grosso",
        "Manteiga",
        "Alho",
        "Alecrim e tomilho",
      ],
      passos: [
        "Sele a peça por todos os lados na brasa forte.",
        "Finalize no calor indireto até o ponto desejado.",
        "Pincele com manteiga derretida com alho e ervas.",
        "Descanse 5 min e fatie em medalhões.",
      ],
    },
  },
  alcatra: {
    padrao: {
      titulo: "Alcatra em bifes",
      tempo: "20 min",
      ingredientes: ["Bifes de alcatra", "Sal grosso", "Pimenta"],
      passos: [
        "Tempere com sal grosso e deixe tomar gosto.",
        "Grelhe em fogo alto até dourar dos dois lados.",
        "Sirva ao ponto, fatiando contra as fibras.",
      ],
    },
    impressionar: {
      titulo: "Baby beef de alcatra com chimichurri",
      tempo: "35 min",
      ingredientes: [
        "Miolo de alcatra em peça",
        "Sal grosso",
        "Salsa, orégano e alho",
        "Azeite e vinagre",
        "Pimenta calabresa",
      ],
      passos: [
        "Sele a peça e termine no calor indireto.",
        "Misture as ervas, alho, azeite e vinagre (chimichurri).",
        "Descanse a carne 5 min e fatie fina.",
        "Regue com o chimichurri na hora de servir.",
      ],
    },
  },
  fraldinha: {
    padrao: {
      titulo: "Fraldinha grelhada",
      tempo: "20 min",
      ingredientes: ["Fraldinha", "Sal grosso", "Pimenta-do-reino"],
      passos: [
        "Tempere e leve à brasa forte.",
        "Grelhe ~4 min de cada lado, mantendo mal a médio.",
        "Fatie sempre contra as fibras.",
      ],
    },
    impressionar: {
      titulo: "Fraldinha marinada no shoyu e alho",
      tempo: "2 h (com marinada)",
      ingredientes: [
        "Fraldinha",
        "Shoyu",
        "Alho amassado",
        "Mel",
        "Gengibre ralado",
      ],
      passos: [
        "Marine a carne por 1–2 h na mistura.",
        "Seque, sele em fogo alto e pincele a marinada reduzida.",
        "Descanse e fatie fino contra as fibras.",
      ],
    },
  },
  maminha: {
    padrao: {
      titulo: "Maminha assada",
      tempo: "40 min",
      ingredientes: ["Maminha em peça", "Sal grosso", "Alho"],
      passos: [
        "Tempere a peça com sal e alho.",
        "Asse no calor indireto virando a cada 15 min.",
        "Fatie fina quando atingir o ponto.",
      ],
    },
    impressionar: {
      titulo: "Maminha recheada com provolone",
      tempo: "1 h",
      ingredientes: [
        "Maminha",
        "Provolone em fatias",
        "Bacon",
        "Alho e ervas",
        "Sal grosso",
      ],
      passos: [
        "Abra uma bolsa na peça e recheie com queijo e bacon.",
        "Amarre com barbante e tempere por fora.",
        "Asse no indireto até o queijo derreter.",
        "Descanse e fatie em rodelas.",
      ],
    },
  },
  picanha: {
    padrao: {
      titulo: "Picanha na grelha",
      tempo: "30 min",
      ingredientes: ["Picanha", "Sal grosso"],
      passos: [
        "Corte em bifes grossos no sentido das fibras.",
        "Sal grosso e fogo alto, selando a gordura primeiro.",
        "Grelhe até o ponto e fatie contra as fibras.",
      ],
    },
    impressionar: {
      titulo: "Picanha em peça com crosta de sal",
      tempo: "45 min",
      ingredientes: [
        "Picanha inteira",
        "Sal grosso",
        "Alecrim",
        "Manteiga",
      ],
      passos: [
        "Faça cortes na gordura em xadrez.",
        "Sele a gordura e asse no indireto com alecrim.",
        "Pincele manteiga ao final para crosta dourada.",
        "Descanse 5 min e fatie fino.",
      ],
    },
  },
  "picanha-maturada": {
    padrao: {
      titulo: "Picanha maturada ao ponto",
      tempo: "30 min",
      ingredientes: ["Picanha maturada", "Sal grosso"],
      passos: [
        "Use só sal grosso para valorizar o sabor da maturação.",
        "Sele a gordura e grelhe em fogo alto.",
        "Sirva mal a médio, fatiando fino.",
      ],
    },
    impressionar: {
      titulo: "Picanha maturada com flor de sal e manteiga noisette",
      tempo: "40 min",
      ingredientes: [
        "Picanha maturada",
        "Flor de sal",
        "Manteiga",
        "Tomilho",
      ],
      passos: [
        "Sele a peça e finalize no indireto.",
        "Doure a manteiga com tomilho até cheiro de avelã.",
        "Fatie, regue com a manteiga e finalize com flor de sal.",
      ],
    },
  },
  "bife-ancho": {
    padrao: {
      titulo: "Ancho na brasa",
      tempo: "20 min",
      ingredientes: ["Bife ancho (3 cm)", "Sal grosso"],
      passos: [
        "Sele em fogo forte para formar crosta.",
        "Grelhe ~4 min de cada lado (mal a médio).",
        "Descanse antes de fatiar.",
      ],
    },
    impressionar: {
      titulo: "Ancho selado com manteiga de café",
      tempo: "30 min",
      ingredientes: [
        "Bife ancho",
        "Sal grosso",
        "Manteiga",
        "Café moído",
        "Açúcar mascavo",
      ],
      passos: [
        "Misture manteiga, café e mascavo.",
        "Sele o ancho e finalize ao ponto.",
        "Cubra com a manteiga de café ainda quente.",
      ],
    },
  },
  chorizo: {
    padrao: {
      titulo: "Chorizo grelhado",
      tempo: "20 min",
      ingredientes: ["Bife de chorizo", "Sal grosso"],
      passos: [
        "Tempere com sal grosso.",
        "Grelhe em fogo alto, virando uma vez.",
        "Sirva mal a médio.",
      ],
    },
    impressionar: {
      titulo: "Chorizo com chimichurri argentino",
      tempo: "30 min",
      ingredientes: [
        "Bife de chorizo",
        "Salsa e orégano",
        "Alho",
        "Azeite e vinagre de vinho",
        "Pimenta calabresa",
      ],
      passos: [
        "Prepare o chimichurri e deixe descansar 20 min.",
        "Grelhe o chorizo ao ponto e descanse.",
        "Regue generosamente com o chimichurri.",
      ],
    },
  },
  entranha: {
    padrao: {
      titulo: "Entranha rápida",
      tempo: "12 min",
      ingredientes: ["Entranha", "Sal grosso"],
      passos: [
        "Seque bem a carne e tempere com sal.",
        "Brasa muito forte, ~2 min de cada lado.",
        "Fatie fino na diagonal.",
      ],
    },
    impressionar: {
      titulo: "Entranha com molho de limão e ervas",
      tempo: "20 min",
      ingredientes: [
        "Entranha",
        "Sal grosso",
        "Suco de limão",
        "Salsa e cebolinha",
        "Azeite",
      ],
      passos: [
        "Grelhe rápido em fogo forte.",
        "Misture limão, ervas e azeite.",
        "Fatie e regue com o molho na hora.",
      ],
    },
  },
  "costela-bovina": {
    padrao: {
      titulo: "Costela no fogo baixo",
      tempo: "5 h",
      ingredientes: ["Costela bovina", "Sal grosso"],
      passos: [
        "Tempere com sal grosso.",
        "Asse no calor indireto e baixo por 4–6 h.",
        "Pincele a própria gordura de vez em quando.",
      ],
    },
    impressionar: {
      titulo: "Costela no bafo com cerveja",
      tempo: "6 h",
      ingredientes: [
        "Costela bovina",
        "Sal grosso e pimenta",
        "Cerveja",
        "Cebola e alho",
        "Papel-alumínio",
      ],
      passos: [
        "Tempere e doure a costela na brasa.",
        "Embrulhe com cebola, alho e cerveja no alumínio.",
        "Asse no indireto por 5–6 h até desmanchar.",
        "Abra o pacote e doure mais 15 min.",
      ],
    },
  },
  "short-rib": {
    padrao: {
      titulo: "Short rib na brasa",
      tempo: "30 min",
      ingredientes: ["Costela premium (short rib)", "Sal grosso"],
      passos: [
        "Tempere com sal grosso.",
        "Grelhe na brasa direta, virando para dourar.",
        "Sirva ao ponto, fatiando entre os ossos.",
      ],
    },
    impressionar: {
      titulo: "Short rib glaceado",
      tempo: "45 min",
      ingredientes: [
        "Short rib",
        "Sal grosso",
        "Mel",
        "Mostarda dijon",
        "Molho shoyu",
      ],
      passos: [
        "Misture mel, mostarda e shoyu.",
        "Asse a costela e pincele o glace nos últimos minutos.",
        "Caramelize na brasa e fatie.",
      ],
    },
  },
  "peito-bovino": {
    padrao: {
      titulo: "Brisket assado lento",
      tempo: "6 h",
      ingredientes: ["Peito bovino", "Sal grosso", "Pimenta-do-reino"],
      passos: [
        "Tempere generosamente com sal e pimenta.",
        "Asse no indireto e baixo (~110 °C) por horas.",
        "Descanse 30 min e fatie fino contra as fibras.",
      ],
    },
    impressionar: {
      titulo: "Brisket defumado com rub",
      tempo: "8 h",
      ingredientes: [
        "Peito bovino",
        "Páprica defumada",
        "Açúcar mascavo",
        "Alho e cebola em pó",
        "Pimenta e sal",
      ],
      passos: [
        "Cubra a peça com o rub e deixe descansar 1 h.",
        "Defume em fogo baixo até casca escura (bark).",
        "Embrulhe e termine até ficar macio.",
        "Descanse bem antes de fatiar.",
      ],
    },
  },
  cupim: {
    padrao: {
      titulo: "Cupim na brasa",
      tempo: "4 h",
      ingredientes: ["Cupim", "Sal grosso"],
      passos: [
        "Tempere com sal grosso.",
        "Asse no indireto por 3–4 h até amaciar.",
        "Fatie fino para servir.",
      ],
    },
    impressionar: {
      titulo: "Cupim recheado com alho e bacon",
      tempo: "5 h",
      ingredientes: [
        "Cupim",
        "Alho",
        "Bacon",
        "Cerveja",
        "Sal grosso",
      ],
      passos: [
        "Faça furos e recheie com alho e bacon.",
        "Embrulhe no alumínio com cerveja.",
        "Asse no indireto por horas até desmanchar.",
        "Doure por fora antes de fatiar.",
      ],
    },
  },

  // ─────────────────────────── SUÍNA ───────────────────────────
  "costela-suina": {
    padrao: {
      titulo: "Costelinha na grelha",
      tempo: "1 h",
      ingredientes: ["Costela suína", "Sal", "Alho"],
      passos: [
        "Tempere com sal e alho.",
        "Asse no indireto até ficar macia.",
        "Doure na brasa direta no final.",
      ],
    },
    impressionar: {
      titulo: "Costela suína ao barbecue",
      tempo: "2 h",
      ingredientes: [
        "Costela suína",
        "Páprica e mascavo",
        "Molho barbecue",
        "Mostarda",
        "Sal e pimenta",
      ],
      passos: [
        "Cubra com rub de páprica e mascavo.",
        "Asse no indireto embrulhada por ~1,5 h.",
        "Pincele barbecue e caramelize na brasa.",
      ],
    },
  },
  "picanha-suina": {
    padrao: {
      titulo: "Picanha suína grelhada",
      tempo: "30 min",
      ingredientes: ["Picanha suína", "Sal grosso"],
      passos: [
        "Mantenha a capa de gordura e tempere com sal.",
        "Sele a gordura e asse no indireto.",
        "Fatie quando bem passada (suíno não vai mal passado).",
      ],
    },
    impressionar: {
      titulo: "Picanha suína com mostarda e mel",
      tempo: "40 min",
      ingredientes: [
        "Picanha suína",
        "Mostarda",
        "Mel",
        "Alho",
        "Sal e pimenta",
      ],
      passos: [
        "Tempere e pincele a mistura de mostarda e mel.",
        "Asse no indireto pincelando mais glace.",
        "Caramelize a capa e fatie.",
      ],
    },
  },
  "copa-lombo": {
    padrao: {
      titulo: "Copa-lombo em bifes",
      tempo: "25 min",
      ingredientes: ["Copa-lombo em bifes", "Sal", "Alho"],
      passos: [
        "Tempere com sal e alho.",
        "Grelhe em fogo médio até dourar.",
        "Sirva bem passado e suculento.",
      ],
    },
    impressionar: {
      titulo: "Copa-lombo marinado em vinho e ervas",
      tempo: "3 h (com marinada)",
      ingredientes: [
        "Copa-lombo em peça",
        "Vinho tinto",
        "Alho e cebola",
        "Louro e alecrim",
        "Sal e pimenta",
      ],
      passos: [
        "Marine a peça por 2 h.",
        "Asse no indireto regando com a marinada.",
        "Descanse e fatie em medalhões.",
      ],
    },
  },
  "carre-suino": {
    padrao: {
      titulo: "Carré suíno grelhado",
      tempo: "30 min",
      ingredientes: ["Carré suíno (bifes com osso)", "Sal", "Pimenta"],
      passos: [
        "Tempere com sal e pimenta.",
        "Sele e termine no indireto sem ressecar.",
        "Sirva suculento, bem passado.",
      ],
    },
    impressionar: {
      titulo: "Carré suíno com crosta de ervas e mostarda",
      tempo: "45 min",
      ingredientes: [
        "Carré suíno em peça",
        "Mostarda dijon",
        "Farinha panko",
        "Alecrim e tomilho",
        "Alho",
      ],
      passos: [
        "Pincele mostarda e cubra com panko e ervas.",
        "Asse no indireto até a crosta dourar.",
        "Descanse e corte entre os ossos.",
      ],
    },
  },
  pernil: {
    padrao: {
      titulo: "Pernil assado",
      tempo: "3 h",
      ingredientes: ["Pernil", "Sal", "Alho", "Limão"],
      passos: [
        "Marine com sal, alho e limão.",
        "Asse no indireto e coberto até ficar macio.",
        "Doure no final e desfie ou fatie.",
      ],
    },
    impressionar: {
      titulo: "Pernil à pururuca",
      tempo: "4 h",
      ingredientes: [
        "Pernil com pele",
        "Sal grosso",
        "Alho e laranja",
        "Cerveja",
        "Louro",
      ],
      passos: [
        "Marine a carne (não a pele) por horas.",
        "Asse lentamente regando com cerveja e laranja.",
        "No fim, seque a pele e aumente o fogo para pururucar.",
      ],
    },
  },

  // ─────────────────────────── AVES ───────────────────────────
  "coxa-sobrecoxa": {
    padrao: {
      titulo: "Frango temperado na grelha",
      tempo: "40 min",
      ingredientes: ["Coxa e sobrecoxa", "Sal", "Alho", "Limão"],
      passos: [
        "Tempere com sal, alho e limão.",
        "Asse com a pele para baixo primeiro.",
        "Vire e termine no indireto até a pele dourar.",
      ],
    },
    impressionar: {
      titulo: "Frango na mostarda e mel",
      tempo: "50 min",
      ingredientes: [
        "Coxa e sobrecoxa",
        "Mostarda",
        "Mel",
        "Páprica",
        "Alho",
      ],
      passos: [
        "Marine no tempero por 30 min.",
        "Asse no indireto pincelando o glace.",
        "Caramelize a pele na brasa no final.",
      ],
    },
  },
  "asa-frango": {
    padrao: {
      titulo: "Asinhas na brasa",
      tempo: "30 min",
      ingredientes: ["Asinhas de frango", "Sal", "Pimenta"],
      passos: [
        "Tempere com sal e pimenta.",
        "Asse virando até dourar por igual.",
        "Sirva crocante.",
      ],
    },
    impressionar: {
      titulo: "Asinhas buffalo",
      tempo: "40 min",
      ingredientes: [
        "Asinhas de frango",
        "Molho de pimenta",
        "Manteiga",
        "Alho em pó",
        "Sal",
      ],
      passos: [
        "Asse as asinhas até crocantes.",
        "Misture manteiga derretida com o molho de pimenta.",
        "Envolva as asinhas no molho e sirva.",
      ],
    },
  },
  "coracao-frango": {
    padrao: {
      titulo: "Coração no espeto",
      tempo: "20 min",
      ingredientes: ["Coração de frango", "Sal grosso"],
      passos: [
        "Espete e tempere com sal grosso.",
        "Brasa alta, virando sempre.",
        "Sirva assim que dourar por fora.",
      ],
    },
    impressionar: {
      titulo: "Coração marinado no alho e shoyu",
      tempo: "1 h (com marinada)",
      ingredientes: [
        "Coração de frango",
        "Shoyu",
        "Alho",
        "Pimenta",
        "Cebolinha",
      ],
      passos: [
        "Marine os corações por 30–40 min.",
        "Espete e grelhe em fogo alto.",
        "Finalize com cebolinha picada.",
      ],
    },
  },

  // ───────────────────────── EMBUTIDOS ─────────────────────────
  "linguica-toscana": {
    padrao: {
      titulo: "Linguiça na brasa",
      tempo: "25 min",
      ingredientes: ["Linguiça toscana"],
      passos: [
        "Asse inteira em fogo médio.",
        "Vire para dourar por igual.",
        "Fure só no final para não secar.",
      ],
    },
    impressionar: {
      titulo: "Linguiça na cerveja",
      tempo: "35 min",
      ingredientes: ["Linguiça toscana", "Cerveja", "Cebola", "Pimenta"],
      passos: [
        "Cozinhe rápido na cerveja com cebola.",
        "Termine na brasa para dourar e pegar fumaça.",
        "Sirva com a cebola refogada.",
      ],
    },
  },
  "linguica-frango": {
    padrao: {
      titulo: "Linguiça de frango grelhada",
      tempo: "20 min",
      ingredientes: ["Linguiça de frango"],
      passos: [
        "Asse em fogo médio, virando sempre.",
        "Cuidado que assa mais rápido que a suína.",
        "Sirva dourada.",
      ],
    },
    impressionar: {
      titulo: "Linguiça de frango com mel e mostarda",
      tempo: "25 min",
      ingredientes: [
        "Linguiça de frango",
        "Mel",
        "Mostarda",
        "Páprica",
      ],
      passos: [
        "Asse a linguiça por igual.",
        "Pincele a mistura de mel e mostarda no final.",
        "Caramelize rapidamente na brasa.",
      ],
    },
  },

  // ───────────────────────── CORDEIRO ─────────────────────────
  "carre-cordeiro": {
    padrao: {
      titulo: "Carré de cordeiro na brasa",
      tempo: "25 min",
      ingredientes: ["Carré de cordeiro", "Sal", "Alecrim"],
      passos: [
        "Tempere com sal e alecrim.",
        "Sele os lados e termine no indireto.",
        "Sirva mal passado, cortando entre os ossos.",
      ],
    },
    impressionar: {
      titulo: "Carré com crosta de ervas e mostarda",
      tempo: "35 min",
      ingredientes: [
        "Carré de cordeiro",
        "Mostarda dijon",
        "Farinha panko",
        "Alecrim, tomilho e salsa",
        "Alho",
      ],
      passos: [
        "Sele o carré rapidamente.",
        "Pincele mostarda e cubra com panko e ervas.",
        "Finalize no indireto até a crosta dourar.",
        "Descanse e corte em costeletas.",
      ],
    },
  },

  // ─────────────────────── ACOMPANHAMENTOS ──────────────────────
  "pao-de-alho": {
    padrao: {
      titulo: "Pão de alho na grelha",
      tempo: "15 min",
      ingredientes: ["Pão de alho", "Papel-alumínio"],
      passos: [
        "Asse nas bordas da grelha, fora do fogo direto.",
        "Vire até dourar por igual.",
        "Sirva quente.",
      ],
    },
    impressionar: {
      titulo: "Pão de alho caseiro com requeijão",
      tempo: "30 min",
      ingredientes: [
        "Pão francês ou baguete",
        "Manteiga",
        "Alho",
        "Requeijão",
        "Salsa e queijo ralado",
      ],
      passos: [
        "Misture manteiga, alho, requeijão e salsa.",
        "Recheie os cortes do pão e polvilhe queijo.",
        "Embrulhe no alumínio e asse até derreter.",
        "Abra e doure por cima.",
      ],
    },
  },
  vinagrete: {
    padrao: {
      titulo: "Vinagrete tradicional",
      tempo: "15 min",
      ingredientes: [
        "Tomate",
        "Cebola",
        "Pimentão",
        "Vinagre e azeite",
        "Salsa",
      ],
      passos: [
        "Pique tudo em cubos pequenos.",
        "Tempere com vinagre, azeite e sal.",
        "Deixe gelar por 30 min antes de servir.",
      ],
    },
    impressionar: {
      titulo: "Vinagrete de manga e pimenta",
      tempo: "20 min",
      ingredientes: [
        "Manga firme",
        "Cebola roxa",
        "Pimenta dedo-de-moça",
        "Coentro",
        "Limão e azeite",
      ],
      passos: [
        "Corte manga, cebola e pimenta em cubinhos.",
        "Tempere com limão, azeite e sal.",
        "Finalize com coentro e leve à geladeira.",
      ],
    },
  },
  farofa: {
    padrao: {
      titulo: "Farofa na manteiga",
      tempo: "15 min",
      ingredientes: ["Farinha de mandioca", "Manteiga", "Cebola", "Sal"],
      passos: [
        "Refogue a cebola na manteiga.",
        "Acrescente a farinha aos poucos, mexendo.",
        "Toste até dourar e ajuste o sal.",
      ],
    },
    impressionar: {
      titulo: "Farofa de bacon e ovos",
      tempo: "25 min",
      ingredientes: [
        "Farinha de mandioca",
        "Bacon",
        "Ovos",
        "Cebola e alho",
        "Manteiga e cebolinha",
      ],
      passos: [
        "Frite o bacon e reserve a gordura.",
        "Mexa os ovos e refogue cebola e alho.",
        "Junte a farinha e toste; volte o bacon.",
        "Finalize com cebolinha.",
      ],
    },
  },
  arroz: {
    padrao: {
      titulo: "Arroz branco soltinho",
      tempo: "20 min",
      ingredientes: ["Arroz", "Alho", "Óleo", "Sal", "Água quente"],
      passos: [
        "Refogue o alho no óleo.",
        "Junte o arroz e a água quente com sal.",
        "Cozinhe em fogo baixo tampado até secar.",
      ],
    },
    impressionar: {
      titulo: "Arroz biro-biro",
      tempo: "30 min",
      ingredientes: [
        "Arroz cozido",
        "Bacon",
        "Batata palha",
        "Ovos",
        "Cebolinha e milho",
      ],
      passos: [
        "Frite o bacon e mexa os ovos.",
        "Misture o arroz com bacon, ovos e milho.",
        "Finalize com batata palha e cebolinha na hora.",
      ],
    },
  },
  "queijo-coalho": {
    padrao: {
      titulo: "Queijo coalho na brasa",
      tempo: "10 min",
      ingredientes: ["Espetos de queijo coalho"],
      passos: [
        "Doure rápido na brasa, virando os lados.",
        "Sirva ainda quente, antes de endurecer.",
      ],
    },
    impressionar: {
      titulo: "Queijo coalho com melaço e orégano",
      tempo: "15 min",
      ingredientes: ["Queijo coalho", "Melaço (ou mel)", "Orégano"],
      passos: [
        "Grelhe o queijo até dourar.",
        "Regue com melaço e polvilhe orégano.",
        "Sirva imediatamente.",
      ],
    },
  },
  "abacaxi-grelhado": {
    padrao: {
      titulo: "Abacaxi grelhado com canela",
      tempo: "15 min",
      ingredientes: ["Abacaxi em fatias", "Açúcar", "Canela"],
      passos: [
        "Polvilhe açúcar e canela nas fatias.",
        "Grelhe até caramelizar dos dois lados.",
        "Sirva morno.",
      ],
    },
    impressionar: {
      titulo: "Abacaxi caramelizado com sorvete",
      tempo: "20 min",
      ingredientes: [
        "Abacaxi em fatias",
        "Açúcar mascavo",
        "Manteiga",
        "Canela",
        "Sorvete de creme",
      ],
      passos: [
        "Derreta manteiga e mascavo até virar calda.",
        "Grelhe o abacaxi e regue com a calda.",
        "Sirva com uma bola de sorvete.",
      ],
    },
  },
};

/** Busca as receitas de um item (corte ou acompanhamento) pelo id. */
export function buscarReceitas(id: string | undefined): Receitas | undefined {
  return id ? RECEITAS[id] : undefined;
}
