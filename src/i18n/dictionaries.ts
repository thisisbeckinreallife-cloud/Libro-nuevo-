export type Lang = "es" | "en";

export type Dict = {
  nav: {
    tagline: string;
    book: string;
    method: string;
    lara: string;
    extracts: string;
    faq: string;
    cta: string;
  };
  hero: {
    eyebrow: string;
    h1Line1: string;
    h1Line2: string;
    h1Line3Prefix: string;
    h1Line3Number: string;
    ledePre: string;
    ledeEm: string;
    ctaPrimary: string;
    ctaGhost: string;
    trustYears: string;
    trustWomen: string;
    bookAria: string;
    dragHint: string;
    coverBlurb: string;
    coverMark: string;
    coverTitleLine1: string;
    coverTitleLine2: string;
    coverTopline: string;
    coverAuthor: string;
    backLabel: string;
    backExcerptLabel: string;
    backIsbn: string;
    backPrice: string;
    metaLeft: string;
    metaRight: string;
  };
  hook: {
    label: string;
    pre: string;
    em1: string;
    mid: string;
    em2: string;
    post: string;
    attr: string;
  };
  book: {
    secNum: string;
    label: string;
    h2Line1: string;
    h2Line2Prefix: string;
    h2Line2Em: string;
    h2Line2Suffix: string;
    p1: string;
    p2Pre: string;
    p2Em: string;
    factsLabels: { k: string; v: string }[];
  };
  problem: {
    secNum: string;
    h2a: string;
    h2aEm: string;
    h2b: string;
    cards: { n: string; title: [string, string, string]; body: string }[];
  };
  insight: {
    label: string;
    h2: [string, string, string, string, string]; // "You don't need", "strike", ". ", "identity", " that…"
    body: {
      pre: string;
      strong: string;
      mid?: string;
      strong2?: string;
      post: string;
      em?: string;
      tail?: string;
    }[];
  };
  transformation: {
    secNum: string;
    h2Pre: string;
    h2PreEm: string;
    h2Mid: string;
    h2Post: string;
    h2PostEm: string;
    h2Tail: string;
    before: { label: string; title: string; items: string[] };
    after: {
      label: string;
      titlePre: string;
      titleEm: string;
      items: string[];
    };
  };
  authority: {
    label: string;
    h2Line1: string;
    h2Line2Pre: string;
    h2Line2Em: string;
    h2Line3: string;
    p1: string;
    p2Pre: string;
    p2Em: string;
    creds: {
      title: string;
      desc: string;
    }[];
    portraitRole: string;
    portraitEdition: string;
  };
  diff: {
    secNum: string;
    h2Pre: string;
    h2Em: string;
    h2Post: string;
    cells: {
      n: string;
      h4Pre: string;
      h4Em: string;
      h4Post: string;
      p: string;
    }[];
  };
  extracts: {
    label: string;
    h2Line1: string;
    h2Line2Pre: string;
    h2Line2Em: string;
    items: { chapter: string; pre: string; em: string; post: string }[];
  };
  proof: {
    label: string;
    h2Pre: string;
    h2Em: string;
    count: string;
    countSmall: string;
    cards: {
      quote: string;
      name: string;
      role: string;
      initial: string;
    }[];
    pressLabel: string;
  };
  buy: {
    secNum: string;
    h2Line1Pre: string;
    h2Line1Em: string;
    h2Line2: string;
    p: string;
    featuredTag: string;
    featuredFormat: string;
    featuredDetail: string;
    ebookFormat: string;
    ebookDetail: string;
    cta: string;
    note: string;
    priceFlag: string;
    bonusStack: {
      label: string;
      intro: string;
      items: { titlePre: string; titleEm: string; detail: string }[];
      foot: string;
    };
  };
  depth: {
    secNum: string;
    h2Line1: string;
    h2Line2Pre: string;
    h2Line2Em: string;
    items: { n: string; titlePre: string; titleEm: string; titlePost: string; desc: string }[];
  };
  faq: {
    label: string;
    h2Pre: string;
    h2Em: string;
    h2Post: string;
    blurb: string;
    items: { q: string; a: string }[];
  };
  final: {
    mono: string;
    h2Pre: string;
    h2Em: string;
    h2Post: string;
    p: string;
    ctaPrimary: string;
    ctaGhost: string;
  };
  footer: {
    book: string;
    author: string;
    contact: string;
    rights: string;
  };
  sticky: {
    title: string;
    cta: string;
  };
  slots: {
    label: string;
    of: string;
    progressAria: string;
    staticLine: string;
    remainingSuffix: string;
    subcopy: string;
    updatedJustNow: string;
    updatedSecondsAgo: string;
  };
  registration: {
    eyebrow: string;
    h1Pre: string;
    h1Em: string;
    intro: string;
    editionLine: string;
    emailLabel: string;
    emailPrivacy: string;
    nameLabel: string;
    nameOptional: string;
    consentLabel: string;
    submit: string;
    errorEmailExists: string;
    errorGeneric: string;
    errorRateLimit: string;
    errorInvalidEmail: string;
    errorNeedsConsent: string;
    confirmedH1: string;
    confirmedBody: string;
    confirmedCta: string;
  };
  workbook: {
    eyebrow: string;
    h1: string;
    intro: string;
    sections: Record<
      "diagnostico" | "funeral" | "proxima-vida" | "lunes",
      { title: string; description: string; cta: string }
    >;
    diagnostico: {
      h1: string;
      intro: string;
      doneTitle: string;
      doneIntro: string;
      restart: string;
      continueLater: string;
      questions: {
        id: string;
        kind: "slider" | "yesno";
        question: string;
        hint?: string;
        minLabel?: string;
        maxLabel?: string;
      }[];
      antCaption: string;
    };
    funeral: {
      h1: string;
      intro: string;
      placeholder: string;
      bury: string;
      burying: string;
      empty: string;
      cemeteryTitle: string;
    };
    proximaVida: {
      h1: string;
      intro: string;
      addMilestone: string;
      labelPlaceholder: string;
      monthLabels: string[];
      done: string;
      pending: string;
      delete: string;
      empty: string;
    };
    lunes: {
      h1: string;
      intro: string;
      noteLabel: string;
      notePlaceholder: string;
      markDone: string;
      markPending: string;
      columnPending: string;
      columnDone: string;
      doneAt: string;
      items: { id: string; title: string; framing: string }[];
    };
    common: {
      back: string;
      saving: string;
      saved: string;
      savedJustNow: string;
      savedAgo: string;
    };
  };
  resena: {
    eyebrow: string;
    h1Pre: string;
    h1Em: string;
    intro: string;
    steps: { title: string; body: string }[];
    amazonCta: string;
    amazonSoon: string;
    uploadLabel: string;
    uploadHint: string;
    uploadBlocked: string;
    previewAlt: string;
    emailLabel: string;
    emailOptional: string;
    submit: string;
    footNote: string;
    errors: {
      tooBig: string;
      badType: string;
      empty: string;
      duplicate: string;
      rateLimit: string;
      invalidEmail: string;
      generic: string;
    };
    reward: {
      eyebrow: string;
      h1Pre: string;
      h1Em: string;
      intro: string;
      ebookLabel: string;
      ebookTitlePre: string;
      ebookTitleEm: string;
      ebookBody: string;
      audioLabel: string;
      audioTitlePre: string;
      audioTitleEm: string;
      audioBody: string;
      download: string;
      remaining: string;
      exhausted: string;
      soon: string;
      footNote: string;
    };
  };
};

export const dict: Record<Lang, Dict> = {
  es: {
    nav: {
      tagline: "Arquitecta de identidades",
      book: "El libro",
      method: "El método",
      lara: "Sobre Lara",
      extracts: "Extractos",
      faq: "FAQ",
      cta: "Comprar",
    },
    hero: {
      eyebrow: "Un nuevo libro · Primavera 2026",
      h1Line1: "La mayor",
      h1Line2: "oportunidad",
      h1Line3Prefix: "desde ",
      h1Line3Number: "1760.",
      ledePre:
        "Tu identidad y tu entorno ya decidieron cuánto vas a ganar el resto de tu vida. ",
      ledeEm: "Este libro explica cómo cambiarlo.",
      ctaPrimary: "Reservar el libro",
      ctaGhost: "Leer un extracto",
      trustYears: "10 años de investigación",
      trustWomen: "10.000 mujeres",
      bookAria: "Libro 3D — arrastra para rotar",
      dragHint: "Arrastra para girar",
      coverBlurb:
        "\u201cEn 1760, una máquina decidió quién sería rico durante doscientos años. Hoy está ocurriendo otra vez. Y casi nadie lo está viendo.\u201d",
      coverMark: "N°01",
      coverTitleLine1: "The Arkwright",
      coverTitleLine2: "Method",
      coverTopline: "Lara Lawn · 2026",
      coverAuthor: "How identity decides income",
      backLabel: "N°01 · Lara Lawn",
      backExcerptLabel: "— de la introducción",
      backIsbn: "ISBN · pending",
      backPrice: "€ —",
      metaLeft: "N°01 · La serie Arkwright",
      metaRight: "Desplaza",
    },
    hook: {
      label: "Una advertencia antes de empezar",
      pre: "En 1760, una máquina decidió quién sería rico durante los siguientes ",
      em1: "doscientos años",
      mid: ". Hoy está ocurriendo ",
      em2: "otra vez",
      post: ". Y casi nadie lo está viendo.",
      attr: "— Introducción, pág. 11",
    },
    book: {
      secNum: "01 / El libro",
      label: "Presentación",
      h2Line1: "No es otro libro",
      h2Line2Prefix: "de ",
      h2Line2Em: "autoayuda.",
      h2Line2Suffix: "",
      p1: "Es un manual de arquitectura interna. Un análisis frío —neurocientífico, conductual y estructural— de las tres variables que determinan, antes de cualquier esfuerzo, cuánto vas a ganar, a quién vas a amar y quién vas a llegar a ser.",
      p2Pre:
        "Escrito para quien ya lo intentó todo y sospecha que el problema no era la estrategia. Era el ",
      p2Em: "termostato.",
      factsLabels: [
        { k: "Título", v: "The Arkwright Method" },
        { k: "Autora", v: "Lara Lawn" },
        { k: "Publicación", v: "Primera edición · 2026" },
        { k: "Idiomas", v: "ES / EN" },
        { k: "Formato", v: "Tapa dura + eBook" },
        { k: "Basado en", v: "10 años de investigación aplicada" },
        { k: "Para", v: "Los que empiezan otra vez" },
      ],
    },
    problem: {
      secNum: "02 / El diagnóstico",
      h2a: "Hiciste todo ",
      h2aEm: "bien.",
      h2b: "Y aún así, no se sostiene.",
      cards: [
        {
          n: "01",
          title: ["El ", "techo invisible", ""],
          body: "Facturas más, ganas más, aprendes más —y siempre vuelves al mismo punto. No es mala suerte. Es un setpoint subconsciente que tu sistema nervioso protege con más fuerza que tu ambición.",
        },
        {
          n: "02",
          title: ["La ", "identidad heredada", ""],
          body: "No eliges quién crees ser. Lo instalan: padres, entorno, tres o cuatro escenas que no recuerdas. Después pasas veinte años optimizando dentro de una caja que nunca abriste.",
        },
        {
          n: "03",
          title: ["La ", "ventana que se cierra", ""],
          body: "Estamos en una transición económica equivalente a la Revolución Industrial. Quien refactorice su identidad ahora, entra. Quien no, queda a un lado para el resto del siglo.",
        },
      ],
    },
    insight: {
      label: "El insight central",
      h2: [
        "No necesitas ",
        "más disciplina",
        ". Necesitas una ",
        "identidad",
        " que no sabotee lo que ya sabes hacer.",
      ],
      body: [
        {
          pre: "Durante dos siglos creímos que bastaba con ",
          strong: "saber qué hacer",
          post:
            ". Los resultados dependían del esfuerzo, la información y el carácter. Esa historia terminó.",
        },
        {
          pre: "Hoy sabemos, con datos, que la ",
          strong: "identidad subconsciente",
          post:
            " —cómo te percibes, qué crees merecer, quién crees ser— actúa como un termostato que devuelve a cero cualquier salto que hagas. ",
          em: "Hasta que lo reprogramas.",
        },
      ],
    },
    transformation: {
      secNum: "03 / La transformación",
      h2Pre: "De ",
      h2PreEm: "esforzarte",
      h2Mid: " en lo equivocado, a ",
      h2Post: "sostener",
      h2PostEm: "",
      h2Tail: " lo correcto sin esfuerzo.",
      before: {
        label: "Antes del método",
        title: "La vida que ya conoces",
        items: [
          "Empiezas con fuerza · vuelves al mismo número",
          "Estrategias que funcionan a otros, no a ti",
          "Dudas que confundes con humildad",
          "Miedo a pedir lo que vales",
          "Voz interna que corrige antes de hablar",
        ],
      },
      after: {
        label: "Después del método",
        titlePre: "La vida que tu identidad ",
        titleEm: "sostiene sola",
        items: [
          "Techo económico que por fin se mueve",
          "Decisiones coherentes, sin negociación interna",
          "Precio que no tienes que justificar",
          "Relaciones que respetan quién eres ahora",
          "Claridad estructural · no motivación prestada",
        ],
      },
    },
    authority: {
      label: "04 / La autora",
      h2Line1: "No soy coach.",
      h2Line2Pre: "Soy ",
      h2Line2Em: "arquitecta",
      h2Line3: "de identidades.",
      p1: "Diez años rediseñando —a nivel subconsciente— cómo piensan, deciden y facturan mujeres que ya lo tenían casi todo menos coherencia interna.",
      p2Pre: "Este libro es la destilación de ese trabajo. No motivación. ",
      p2Em: "Arquitectura.",
      creds: [
        { title: "Harvard", desc: "Formación en neurociencia aplicada" },
        { title: "Duke University", desc: "Programa de conducta y decisión" },
        { title: "+10.000 mujeres", desc: "A través del método en programas privados" },
        { title: "Podcast · radio nacional", desc: "Y canal de YouTube con +X suscriptores" },
      ],
      portraitRole: "Portrait · Lara Lawn",
      portraitEdition: "Editorial B&W",
    },
    diff: {
      secNum: "05 / Por qué este libro",
      h2Pre: "Lo que ",
      h2Em: "no",
      h2Post: " vas a encontrar aquí.",
      cells: [
        {
          n: "N°01",
          h4Pre: "Ni ",
          h4Em: "frases",
          h4Post: " que suenan bien.",
          p: "Cada idea está respaldada por investigación, no por emoción fácil.",
        },
        {
          n: "N°02",
          h4Pre: "Ni ",
          h4Em: "fórmulas",
          h4Post: " que ya probaste.",
          p: "Si fueran suficientes, ya habrían funcionado. El problema está un nivel por debajo.",
        },
        {
          n: "N°03",
          h4Pre: "Ni ",
          h4Em: "diagnósticos",
          h4Post: " sin salida.",
          p: "Cada capítulo termina con una operación real sobre tu identidad. No con una reflexión.",
        },
        {
          n: "N°04",
          h4Pre: "Ni ",
          h4Em: "promesas",
          h4Post: " cómodas.",
          p: "Este libro asume que eres capaz de leer una verdad y sostenerla.",
        },
      ],
    },
    extracts: {
      label: "Extractos · Pre-lectura",
      h2Line1: "Tres páginas para entender",
      h2Line2Pre: "si este libro es ",
      h2Line2Em: "para ti.",
      items: [
        {
          chapter: "Capítulo 02 · El termostato",
          pre: "Nadie pierde lo que tiene. Perdemos lo que nuestra identidad ",
          em: "no reconoce",
          post:
            " como propio. Por eso tantas mujeres brillantes construyen y devuelven —construyen y devuelven— durante años enteros, sin sospechar que están obedeciendo a una persona que ya no son.",
        },
        {
          chapter: "Capítulo 04 · La escena fundadora",
          pre: "En algún lugar entre los cinco y los once años, alguien pronunció una frase que tu cerebro interpretó como ley. No la recuerdas. La estás obedeciendo ahora mismo, al leer esto, ",
          em: "con la respiración.",
          post: "",
        },
        {
          chapter: "Capítulo 09 · Arkwright",
          pre: "La Revolución Industrial no hizo ricos a los que trabajaban más. Hizo ricos a los que ",
          em: "entendieron la máquina antes que los demás",
          post: ". Esa escena se está repitiendo. Y el precio de llegar tarde ya no se mide en dinero: se mide en siglos.",
        },
      ],
    },
    proof: {
      label: "Validación · Testimonios del método",
      h2Pre: "Hablan las que ",
      h2Em: "ya cruzaron.",
      count: "10.000",
      countSmall: "mujeres · 10 años · 1 método",
      cards: [
        {
          quote:
            "\u201cLlevaba ocho años facturando lo mismo aunque cambié de sector tres veces. Con Lara entendí que no era el mercado. Era yo. En cuatro meses multipliqué por 3.\u201d",
          name: "María C.",
          role: "Consultora estratégica · Madrid",
          initial: "M",
        },
        {
          quote:
            "\u201cNunca había leído algo que me dejara sin excusas con esta elegancia. Lara no te convence: te desnuda.\u201d",
          name: "Andrea V.",
          role: "Fundadora · Ciudad de México",
          initial: "A",
        },
        {
          quote:
            "\u201cLo subrayé entero. Volví a subrayarlo. Es el primer libro en años que no habla al lector —le habla a lo que el lector esconde.\u201d",
          name: "Inés B.",
          role: "Directora creativa · Barcelona",
          initial: "I",
        },
      ],
      pressLabel: "Apariciones · Prensa",
    },
    buy: {
      secNum: "06 / Adquirir",
      h2Line1Pre: "El libro ",
      h2Line1Em: "físico",
      h2Line2: "que no vas a prestar.",
      p: "Primera edición en tapa dura. Encuadernación cosida, papel crema, marcador de tela. Pensado para subrayarse entero y volverse a abrir en dos años.",
      featuredTag: "Más elegido",
      featuredFormat: "Tapa dura + eBook",
      featuredDetail: "Primera edición · Envío internacional",
      ebookFormat: "eBook",
      ebookDetail: "Kindle + ePub · Lectura inmediata",
      cta: "Comprar en Amazon",
      note: "Edición limitada · Lanzamiento 2026",
      priceFlag: "precio",
      bonusStack: {
        label: "Incluido con tu pre-orden",
        intro: "Comprando ahora también te llevas:",
        items: [
          {
            titlePre: "",
            titleEm: "No eres tú, es tu subconsciente",
            detail:
              "El primer libro de Lara en formato ebook · desbloqueado al dejar tu reseña.",
          },
          {
            titlePre: "Audio ",
            titleEm: "RSB",
            detail:
              "Guía sonora complementaria al libro · desbloqueado al dejar tu reseña.",
          },
        ],
        foot: "Dentro del libro físico encontrarás el QR para reclamarlos.",
      },
    },
    depth: {
      secNum: "07 / Profundidad",
      h2Line1: "Nueve operaciones",
      h2Line2Pre: "sobre tu ",
      h2Line2Em: "identidad.",
      items: [
        { n: "01", titlePre: "El ", titleEm: "termostato", titlePost: "", desc: "Por qué tu ingreso vuelve siempre al mismo número." },
        { n: "02", titlePre: "La ", titleEm: "escena fundadora", titlePost: "", desc: "La frase que instalaron antes de los once años —y cómo localizarla." },
        { n: "03", titlePre: "La ", titleEm: "identidad económica", titlePost: "", desc: "Lo que crees merecer se paga. Literalmente." },
        { n: "04", titlePre: "El ", titleEm: "entorno como código", titlePost: "", desc: "Tu entorno decide por ti mientras crees que eliges." },
        { n: "05", titlePre: "El ", titleEm: "cuerpo que firma", titlePost: "", desc: "Por qué tu sistema nervioso vetoiza la vida que dices querer." },
        { n: "06", titlePre: "La ", titleEm: "decisión limpia", titlePost: "", desc: "Cómo dejar de negociar contigo cada mañana." },
        { n: "07", titlePre: "El ", titleEm: "precio sin disculpa", titlePost: "", desc: "Pedir lo que vales sin bajar la voz." },
        { n: "08", titlePre: "La ", titleEm: "mesa nueva", titlePost: "", desc: "A quién dejar de mirar para verte a ti misma." },
        { n: "09", titlePre: "", titleEm: "Arkwright", titlePost: "", desc: "La ventana histórica que se cierra mientras dudas." },
      ],
    },
    faq: {
      label: "08 / FAQ",
      h2Pre: "Lo que ",
      h2Em: "preguntan",
      h2Post: " antes de comprar.",
      blurb: "Respuestas directas, sin marketing suave.",
      items: [
        {
          q: "¿Es otro libro de autoayuda?",
          a: "No. Es un ensayo de arquitectura de identidad, con base en neurociencia aplicada, psicología conductual e historia económica. Si buscabas frases motivacionales, este libro te va a incomodar.",
        },
        {
          q: "¿Necesito haber leído otros libros de Lara?",
          a: "No. Es la puerta de entrada más limpia a su trabajo —y a la vez, lo más avanzado que ha publicado hasta hoy.",
        },
        {
          q: "¿Cuánto tiempo voy a tardar en leerlo?",
          a: "De seis a diez horas. Pero el libro está diseñado para volver. La mayoría lo subraya en el primer mes y lo vuelve a abrir al sexto.",
        },
        {
          q: "¿Tiene ejercicios o es sólo lectura?",
          a: "Cada capítulo termina con una operación —no un ejercicio de libreta. Se hace una vez. Se hace bien. No se repite para complacer.",
        },
        {
          q: "¿Está escrito para mujeres?",
          a: "El método nació trabajando con mujeres, y esa mirada está presente. El libro funciona para cualquier persona dispuesta a leerse sin privilegios.",
        },
        {
          q: "¿Hay edición en inglés?",
          a: "Sí. El libro se publica simultáneamente en español e inglés.",
        },
      ],
    },
    final: {
      mono: "Última llamada antes de la máquina",
      h2Pre: "La próxima ",
      h2Em: "revolución",
      h2Post: " no te va a avisar.",
      p: "Este libro existe para que no la mires desde fuera. Léelo ahora, mientras la ventana aún está abierta.",
      ctaPrimary: "Adquirir el libro",
      ctaGhost: "Leer un extracto antes",
    },
    footer: {
      book: "Libro",
      author: "Autora",
      contact: "Contacto",
      rights: "Todos los derechos reservados",
    },
    sticky: {
      title: "The Arkwright Method",
      cta: "Comprar",
    },
    slots: {
      label: "Workbook Oficial reservado",
      of: "de",
      progressAria: "Reservas del Workbook Oficial",
      staticLine: "Primera edición limitada a 100 ejemplares físicos",
      remainingSuffix: "· quedan {n}",
      subcopy:
        "Cada ejemplar físico de la primera edición incluye un código único. Sólo los primeros 100 ejemplares dan acceso al Workbook.",
      updatedJustNow: "actualizado ahora",
      updatedSecondsAgo: "actualizado hace {s}s",
    },
    registration: {
      eyebrow: "Primera edición · Código único",
      h1Pre: "Bienvenida. Has desbloqueado el ",
      h1Em: "Workbook Oficial",
      intro:
        "Un cuaderno privado que te guía a aplicar el método del libro. Te damos acceso privado y te enviamos la confirmación por email.",
      editionLine: "Primera edición · 1 de 100 códigos únicos",
      emailLabel: "Email",
      emailPrivacy: "Sólo para enviarte el Workbook. No lo compartiremos.",
      nameLabel: "¿Cómo quieres que te llamemos?",
      nameOptional: "Opcional",
      consentLabel:
        "Acepto recibir la confirmación y las actualizaciones del Workbook Oficial. Puedo darme de baja en cualquier momento.",
      submit: "Activar mi Workbook",
      errorEmailExists:
        "Este email ya ha activado su Workbook. Entra con el mismo correo para acceder.",
      errorGeneric:
        "No hemos podido completar el registro. Tu código sigue siendo válido. Vuelve a intentarlo.",
      errorRateLimit:
        "Demasiados intentos en poco tiempo. Espera un momento y vuelve a intentarlo.",
      errorInvalidEmail: "Introduce un email válido.",
      errorNeedsConsent: "Necesitamos tu consentimiento para activar el Workbook.",
      confirmedH1: "Tu ejemplar está registrado",
      confirmedBody:
        "Te estamos abriendo el Workbook Oficial. Revisa tu email por la confirmación en los próximos minutos.",
      confirmedCta: "Entrar al Workbook",
    },
    workbook: {
      eyebrow: "Primera edición · Workbook Oficial",
      h1: "Tu Workbook",
      intro:
        "Cuatro prácticas pensadas para que el método del libro entre en tu vida real, no sólo en tu cabeza.",
      sections: {
        diagnostico: {
          title: "¿Qué hormiga eres hoy?",
          description:
            "Seis preguntas cortas que retratan tu punto de partida. Sin respuestas correctas, sólo honestidad.",
          cta: "Empezar",
        },
        funeral: {
          title: "El funeral",
          description:
            "Escribes lo que estás dispuesta a enterrar: identidades, creencias, acuerdos viejos. Se disuelve en ceniza y queda archivado.",
          cta: "Oficiar",
        },
        "proxima-vida": {
          title: "Tu próxima vida",
          description:
            "Doce meses, hitos que tú arrastras en la línea del tiempo. Tu próximo año, en serio, visible.",
          cta: "Construir",
        },
        lunes: {
          title: "Los 7 lunes",
          description:
            "Siete acciones concretas del capítulo 13. Ninguna glamurosa. Cada una mueve algo real.",
          cta: "Empezar el lunes",
        },
      },
      diagnostico: {
        h1: "¿Qué hormiga eres hoy?",
        intro:
          "Seis tarjetas. Respondes sin pensar demasiado. Al final te devolvemos un retrato — no un puntaje — de tu punto de partida.",
        doneTitle: "Esta es tu hormiga",
        doneIntro:
          "El libro lo dice en el epílogo: la hormiga Cephalotes atratus se tira al vacío y sabe volver a casa. Esto eres tú hoy.",
        restart: "Volver a responder",
        continueLater: "Terminar después",
        antCaption: "Tu punto de partida · guardado",
        questions: [
          {
            id: "horas-por-precio",
            kind: "slider",
            question: "¿Cuántas horas estás vendiendo hoy por cada euro que te llega?",
            hint: "0 = ninguna (pasivo). 10 = todas (hora-por-hora).",
            minLabel: "ninguna",
            maxLabel: "todas",
          },
          {
            id: "colchon",
            kind: "slider",
            question: "Si dejaras de facturar mañana, ¿cuántos meses aguantas?",
            hint: "0 = cero meses. 10 = más de doce.",
            minLabel: "0 meses",
            maxLabel: "12+",
          },
          {
            id: "quien-te-definio",
            kind: "yesno",
            question:
              "¿Todavía arrastras la etiqueta que un profesor o tu familia te puso antes de los 14?",
          },
          {
            id: "cuerpo-contrae",
            kind: "yesno",
            question:
              "¿Tu cuerpo se contrae físicamente cuando piensas en pedir el doble por tu trabajo?",
          },
          {
            id: "tribu-alarga",
            kind: "slider",
            question:
              "¿Cuánto te alarga o te limita el círculo con el que más tiempo pasas?",
            hint: "0 = me empuja hacia abajo. 10 = me empuja hacia arriba.",
            minLabel: "abajo",
            maxLabel: "arriba",
          },
          {
            id: "lunes-esta-semana",
            kind: "yesno",
            question:
              "¿Sabes ya qué acción pequeña y poco glamurosa harías este lunes si tuvieras que mover una sola pieza?",
          },
        ],
      },
      funeral: {
        h1: "El funeral",
        intro:
          "El capítulo 6 se llama así. Escribe lo que estás dispuesta a enterrar hoy: una creencia heredada, una identidad prestada, un acuerdo viejo. Una cosa por entrada.",
        placeholder: "Hoy entierro…",
        bury: "Enterrar",
        burying: "Enterrando…",
        empty: "Aún no has enterrado nada.",
        cemeteryTitle: "Lo que dejaste atrás",
      },
      proximaVida: {
        h1: "Tu próxima vida",
        intro:
          "Doce meses. Arrastra los hitos hasta su mes. Puedes editarlos, marcarlos como alcanzados o borrarlos.",
        addMilestone: "Añadir hito",
        labelPlaceholder: "Ej: 5 000 €/mes de forma recurrente",
        monthLabels: [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic",
        ],
        done: "Alcanzado",
        pending: "Pendiente",
        delete: "Borrar",
        empty: "Aún no has añadido hitos. Pulsa “Añadir hito”.",
      },
      lunes: {
        h1: "Los 7 lunes",
        intro:
          "El libro lo dice sin anestesia: “Hace falta que sea lunes.” Aquí están siete acciones concretas. Ninguna es glamurosa. Marca cada una cuando la hagas — y, si quieres, cuéntanos cómo fue.",
        noteLabel: "Cuéntamelo",
        notePlaceholder: "¿Cómo fue? ¿Qué pasó después?",
        markDone: "Marcar como hecho",
        markPending: "Deshacer",
        columnPending: "Pendiente",
        columnDone: "Hecho",
        doneAt: "Hecho",
        items: [
          {
            id: "transferencia",
            title: "Configurar una transferencia automática",
            framing:
              "Una cantidad pequeña, fija, a una cuenta distinta. El primer lunes.",
          },
          {
            id: "subir-tarifa",
            title: "Subir tu tarifa donde antes callabas",
            framing:
              "Un cliente, una web, un presupuesto. El número nuevo, escrito.",
          },
          {
            id: "email-no-te-atreves",
            title: "Mandar el email que llevas semanas evitando",
            framing:
              "Ya sabes cuál. El que pondrías si supieras que va a salir bien.",
          },
          {
            id: "decir-un-numero",
            title: "Decir un número en voz alta sin disculparte",
            framing:
              "A un cliente, a tu socia, a ti misma en el espejo. Sin atenuantes.",
          },
          {
            id: "despedir-cliente",
            title: "Soltar al cliente, la amistad o la suscripción que te drena",
            framing: "La que lleva años. La que tú sabes. Esa.",
          },
          {
            id: "treinta-minutos",
            title: "Dedicar 30 minutos a una sola cosa",
            framing:
              "Sin móvil. Sin pestaña nueva. Cronómetro. Sólo esa cosa.",
          },
          {
            id: "escribir-tribu",
            title: "Escribir el nombre de 3 personas de tu tribu futura",
            framing:
              "Las que existen pero aún no están cerca. El primer paso es tener la lista.",
          },
        ],
      },
      common: {
        back: "Volver al Workbook",
        saving: "Guardando…",
        saved: "Guardado",
        savedJustNow: "guardado ahora",
        savedAgo: "guardado hace {s}s",
      },
    },
    resena: {
      eyebrow: "Reseña + recompensa",
      h1Pre: "Escribe tu reseña, llévate ",
      h1Em: "los dos regalos.",
      intro:
        "Deja tu reseña honesta en Amazon, sube la captura y desbloquea al instante el primer libro de Lara en ebook y el audio RSB.",
      steps: [
        {
          title: "Deja tu reseña en Amazon",
          body: "Abre la ficha del libro, puntúa con honestidad y publica tu reseña. Cualquier valoración es válida — pedimos sinceridad, no cinco estrellas.",
        },
        {
          title: "Haz una captura de pantalla",
          body: "Cuando Amazon confirme que la reseña está publicada, captura la pantalla con tu móvil. La captura nunca se publica — queda privada en el servidor de Lara.",
        },
        {
          title: "Súbela aquí",
          body: "Añade la captura y, si quieres, tu email para recibir avisos de nuevas ediciones. Al subirla se abren las descargas automáticamente.",
        },
      ],
      amazonCta: "Ir a la reseña en Amazon",
      amazonSoon: "Próximamente disponible en Amazon",
      uploadLabel: "Arrastra o selecciona tu captura",
      uploadHint: "JPG, PNG o WEBP · máx. 5 MB",
      uploadBlocked: "Las recompensas estarán disponibles muy pronto",
      previewAlt: "Vista previa de la captura",
      emailLabel: "Email",
      emailOptional: "opcional",
      submit: "Subir y desbloquear",
      footNote:
        "Tu captura se usa sólo para verificar la reseña. No se comparte con terceros.",
      errors: {
        tooBig: "El archivo supera los 5 MB. Comprime o recorta la imagen.",
        badType: "Sube una imagen (JPG, PNG o WEBP).",
        empty: "Selecciona una captura antes de enviar.",
        duplicate:
          "Esa captura ya se había subido. Sube una distinta o contacta con Lara si crees que es un error.",
        rateLimit:
          "Demasiados intentos en poco tiempo. Espera unos minutos y vuelve a probar.",
        invalidEmail: "Ese email no parece válido. Déjalo vacío si prefieres.",
        generic: "Algo ha salido mal al subir. Vuelve a intentarlo.",
      },
      reward: {
        eyebrow: "Reseña recibida",
        h1Pre: "Gracias. Ya puedes ",
        h1Em: "descargar.",
        intro:
          "Tu captura se ha guardado. Estas dos descargas son tuyas — cada archivo admite hasta 2 descargas en las próximas 24 horas.",
        ebookLabel: "Ebook · Libro 01",
        ebookTitlePre: "",
        ebookTitleEm: "No eres tú, es tu subconsciente",
        ebookBody:
          "El primer libro de Lara Lawn. Lectura directa, marco fundacional para leer el Arkwright Method con más profundidad.",
        audioLabel: "Audio · Complemento",
        audioTitlePre: "Audio ",
        audioTitleEm: "RSB",
        audioBody:
          "Sesión sonora guiada que funciona como ancla física del método. Idealmente para escuchar la primera semana tras leer el libro.",
        download: "Descargar",
        remaining: "{n} descargas disponibles",
        exhausted: "Descarga agotada para este enlace",
        soon: "Próximamente disponible · vuelve en unos días",
        footNote:
          "Guarda esta página. El enlace deja de funcionar en 24 horas; los archivos se quedan en tu dispositivo.",
      },
    },
  },
  en: {
    nav: {
      tagline: "Identity architect",
      book: "The book",
      method: "The method",
      lara: "About Lara",
      extracts: "Extracts",
      faq: "FAQ",
      cta: "Order",
    },
    hero: {
      eyebrow: "A new book · Spring 2026",
      h1Line1: "The biggest",
      h1Line2: "opportunity",
      h1Line3Prefix: "since ",
      h1Line3Number: "1760.",
      ledePre:
        "Your identity and your environment have already decided how much you'll earn for the rest of your life. ",
      ledeEm: "This book explains how to rewrite it.",
      ctaPrimary: "Pre-order",
      ctaGhost: "Read an extract",
      trustYears: "10 years of research",
      trustWomen: "10,000 women",
      bookAria: "3D book — drag to rotate",
      dragHint: "Drag to rotate",
      coverBlurb:
        "\u201cIn 1760, a machine decided who would be rich for two hundred years. It's happening again. And almost no one is looking.\u201d",
      coverMark: "N°01",
      coverTitleLine1: "The Arkwright",
      coverTitleLine2: "Method",
      coverTopline: "Lara Lawn · 2026",
      coverAuthor: "How identity decides income",
      backLabel: "N°01 · Lara Lawn",
      backExcerptLabel: "— from the introduction",
      backIsbn: "ISBN · pending",
      backPrice: "€ —",
      metaLeft: "N°01 · The Arkwright series",
      metaRight: "Scroll",
    },
    hook: {
      label: "A warning before you begin",
      pre: "In 1760, a machine decided who would be rich for the next ",
      em1: "two hundred years",
      mid: ". It's happening ",
      em2: "again",
      post: ". And almost no one is looking.",
      attr: "— Introduction, p. 11",
    },
    book: {
      secNum: "01 / The book",
      label: "Overview",
      h2Line1: "This is not another",
      h2Line2Prefix: "",
      h2Line2Em: "self-help",
      h2Line2Suffix: " book.",
      p1: "It's a manual of inner architecture. A cold —neuroscientific, behavioural and structural— analysis of the three variables that decide, before any effort, how much you'll earn, who you'll love, and who you'll become.",
      p2Pre:
        "Written for those who've tried it all and suspect the problem was never the strategy. It was the ",
      p2Em: "thermostat.",
      factsLabels: [
        { k: "Title", v: "The Arkwright Method" },
        { k: "Author", v: "Lara Lawn" },
        { k: "Release", v: "First edition · 2026" },
        { k: "Languages", v: "ES / EN" },
        { k: "Format", v: "Hardcover + eBook" },
        { k: "Based on", v: "10 years of applied research" },
        { k: "For", v: "Those starting again" },
      ],
    },
    problem: {
      secNum: "02 / The diagnosis",
      h2a: "You did ",
      h2aEm: "everything",
      h2b: " right. And still, nothing holds.",
      cards: [
        {
          n: "01",
          title: ["The ", "invisible ceiling", ""],
          body: "You invoice more, earn more, learn more —and always return to the same point. It's not bad luck. It's a subconscious setpoint your nervous system protects harder than your ambition.",
        },
        {
          n: "02",
          title: ["The ", "inherited identity", ""],
          body: "You don't choose who you think you are. It gets installed: parents, environment, three or four scenes you don't remember. Then you spend twenty years optimising inside a box you never opened.",
        },
        {
          n: "03",
          title: ["The ", "closing window", ""],
          body: "We're living through an economic shift the size of the Industrial Revolution. Those who refactor their identity now step in. Those who don't stay on the sidelines for the rest of the century.",
        },
      ],
    },
    insight: {
      label: "The core insight",
      h2: [
        "You don't need ",
        "more discipline",
        ". You need an ",
        "identity",
        " that stops sabotaging what you already know how to do.",
      ],
      body: [
        {
          pre: "For two centuries we believed it was enough to ",
          strong: "know what to do",
          post:
            ". Results depended on effort, information and character. That story is over.",
        },
        {
          pre: "We now know, with data, that ",
          strong: "subconscious identity",
          post:
            " —how you perceive yourself, what you believe you deserve, who you think you are— operates as a thermostat that pulls back any leap you make. ",
          em: "Until you rewrite it.",
        },
      ],
    },
    transformation: {
      secNum: "03 / The transformation",
      h2Pre: "From ",
      h2PreEm: "pushing",
      h2Mid: " in the wrong direction, to ",
      h2Post: "holding",
      h2PostEm: "",
      h2Tail: " the right one without force.",
      before: {
        label: "Before the method",
        title: "The life you already know",
        items: [
          "Start strong · return to the same number",
          "Strategies that work for others, not for you",
          "Doubt you confuse with humility",
          "Fear of charging what you're worth",
          "Inner voice that corrects before you speak",
        ],
      },
      after: {
        label: "After the method",
        titlePre: "The life your identity ",
        titleEm: "holds on its own",
        items: [
          "An income ceiling that finally moves",
          "Coherent decisions, no internal negotiation",
          "A price you don't need to justify",
          "Relationships that respect who you are now",
          "Structural clarity · not borrowed motivation",
        ],
      },
    },
    authority: {
      label: "04 / The author",
      h2Line1: "I'm not a coach.",
      h2Line2Pre: "I'm an ",
      h2Line2Em: "architect",
      h2Line3: "of identities.",
      p1: "Ten years redesigning —at the subconscious level— how women who already had nearly everything except inner coherence think, decide and earn.",
      p2Pre: "This book is the distillation of that work. Not motivation. ",
      p2Em: "Architecture.",
      creds: [
        { title: "Harvard", desc: "Applied neuroscience training" },
        { title: "Duke University", desc: "Behaviour & decision program" },
        { title: "+10,000 women", desc: "Through the method in private programs" },
        { title: "National radio podcast", desc: "And YouTube channel with +X subscribers" },
      ],
      portraitRole: "Portrait · Lara Lawn",
      portraitEdition: "Editorial B&W",
    },
    diff: {
      secNum: "05 / Why this book",
      h2Pre: "What you ",
      h2Em: "won't",
      h2Post: " find in here.",
      cells: [
        {
          n: "N°01",
          h4Pre: "No ",
          h4Em: "pretty",
          h4Post: " phrases.",
          p: "Every idea is backed by research, not by easy emotion.",
        },
        {
          n: "N°02",
          h4Pre: "No ",
          h4Em: "formulas",
          h4Post: " you've tried.",
          p: "If they were enough, they'd have worked already. The problem sits one level below.",
        },
        {
          n: "N°03",
          h4Pre: "No ",
          h4Em: "diagnoses",
          h4Post: " without exit.",
          p: "Each chapter ends with a real operation on your identity. Not with a reflection.",
        },
        {
          n: "N°04",
          h4Pre: "No ",
          h4Em: "comfortable",
          h4Post: " promises.",
          p: "This book assumes you can read a truth and hold it.",
        },
      ],
    },
    extracts: {
      label: "Extracts · Pre-reading",
      h2Line1: "Three pages to know if",
      h2Line2Pre: "this book is ",
      h2Line2Em: "for you.",
      items: [
        {
          chapter: "Chapter 02 · The thermostat",
          pre: "No one loses what they have. We lose what our identity ",
          em: "doesn't recognise",
          post:
            " as ours. That's why so many brilliant women build and return it, build and return it, for years —never suspecting they're obeying someone they no longer are.",
        },
        {
          chapter: "Chapter 04 · The founding scene",
          pre: "Somewhere between the ages of five and eleven, someone spoke a sentence your brain interpreted as law. You don't remember it. You're obeying it right now, as you read this, ",
          em: "with your breath.",
          post: "",
        },
        {
          chapter: "Chapter 09 · Arkwright",
          pre: "The Industrial Revolution didn't make rich those who worked harder. It made rich those who ",
          em: "understood the machine before anyone else",
          post: ". That scene is repeating. And the price of being late is no longer measured in money: it's measured in centuries.",
        },
      ],
    },
    proof: {
      label: "Validation · Testimonies of the method",
      h2Pre: "The voices of those who ",
      h2Em: "already crossed.",
      count: "10,000",
      countSmall: "women · 10 years · 1 method",
      cards: [
        {
          quote:
            "\u201cI'd been invoicing the same for eight years across three sectors. With Lara I understood it wasn't the market. It was me. In four months I 3×'d.\u201d",
          name: "María C.",
          role: "Strategy consultant · Madrid",
          initial: "M",
        },
        {
          quote:
            "\u201cI'd never read something that left me out of excuses this elegantly. Lara doesn't convince you: she undresses you.\u201d",
          name: "Andrea V.",
          role: "Founder · Mexico City",
          initial: "A",
        },
        {
          quote:
            "\u201cI underlined it all. Then underlined it again. The first book in years that doesn't speak to the reader —it speaks to what the reader hides.\u201d",
          name: "Inés B.",
          role: "Creative director · Barcelona",
          initial: "I",
        },
      ],
      pressLabel: "Featured in · Press",
    },
    buy: {
      secNum: "06 / Order",
      h2Line1Pre: "The ",
      h2Line1Em: "physical",
      h2Line2: "book you won't lend.",
      p: "First hardcover edition. Sewn binding, cream paper, fabric marker. Designed to be underlined whole and reopened two years later.",
      featuredTag: "Most chosen",
      featuredFormat: "Hardcover + eBook",
      featuredDetail: "First edition · International shipping",
      ebookFormat: "eBook",
      ebookDetail: "Kindle + ePub · Instant read",
      cta: "Order on Amazon",
      note: "Limited edition · 2026 release",
      priceFlag: "price",
      bonusStack: {
        label: "Included with your pre-order",
        intro: "Order now and you also get:",
        items: [
          {
            titlePre: "",
            titleEm: "It's Not You, It's Your Subconscious",
            detail:
              "Lara's first book as an ebook · unlocked when you leave your review.",
          },
          {
            titlePre: "",
            titleEm: "RSB audio",
            detail:
              "Companion audio guide for the method · unlocked when you leave your review.",
          },
        ],
        foot: "Inside the physical book you'll find the QR to redeem both.",
      },
    },
    depth: {
      secNum: "07 / Depth",
      h2Line1: "Nine operations",
      h2Line2Pre: "on your ",
      h2Line2Em: "identity.",
      items: [
        { n: "01", titlePre: "The ", titleEm: "thermostat", titlePost: "", desc: "Why your income always returns to the same figure." },
        { n: "02", titlePre: "The ", titleEm: "founding scene", titlePost: "", desc: "The sentence installed before age eleven —and how to find it." },
        { n: "03", titlePre: "The ", titleEm: "economic identity", titlePost: "", desc: "What you believe you deserve gets paid. Literally." },
        { n: "04", titlePre: "The ", titleEm: "environment as code", titlePost: "", desc: "Your environment decides for you while you think you're choosing." },
        { n: "05", titlePre: "The ", titleEm: "body that signs", titlePost: "", desc: "Why your nervous system vetoes the life you say you want." },
        { n: "06", titlePre: "The ", titleEm: "clean decision", titlePost: "", desc: "How to stop negotiating with yourself every morning." },
        { n: "07", titlePre: "The ", titleEm: "unapologetic price", titlePost: "", desc: "Charging what you're worth without lowering your voice." },
        { n: "08", titlePre: "The ", titleEm: "new table", titlePost: "", desc: "Who to stop watching so you can finally see yourself." },
        { n: "09", titlePre: "", titleEm: "Arkwright", titlePost: "", desc: "The historical window closing while you hesitate." },
      ],
    },
    faq: {
      label: "08 / FAQ",
      h2Pre: "What people ",
      h2Em: "ask",
      h2Post: " before buying.",
      blurb: "Direct answers, no soft marketing.",
      items: [
        {
          q: "Is this another self-help book?",
          a: "No. It's an essay on identity architecture, grounded in applied neuroscience, behavioural psychology and economic history. If you came looking for motivational quotes, this book will make you uncomfortable.",
        },
        {
          q: "Do I need to have read her other work?",
          a: "No. It's the cleanest entry point to her work —and, at once, the most advanced thing she's published so far.",
        },
        {
          q: "How long will it take me to read?",
          a: "Six to ten hours. But the book is designed to be revisited. Most underline it in the first month and reopen it by month six.",
        },
        {
          q: "Are there exercises or is it just reading?",
          a: "Each chapter ends with an operation —not a journaling exercise. You do it once. You do it properly. You don't repeat it to please.",
        },
        {
          q: "Is it written for women?",
          a: "The method was born working with women, and that lens is present. The book works for anyone willing to read themselves without privilege.",
        },
        {
          q: "Is there an English edition?",
          a: "Yes. The book is released simultaneously in Spanish and English.",
        },
      ],
    },
    final: {
      mono: "Last call before the machine",
      h2Pre: "The next ",
      h2Em: "revolution",
      h2Post: " won't announce itself.",
      p: "This book exists so you don't watch it from the outside. Read it now, while the window is still open.",
      ctaPrimary: "Get the book",
      ctaGhost: "Read an extract first",
    },
    footer: {
      book: "Book",
      author: "Author",
      contact: "Contact",
      rights: "All rights reserved",
    },
    sticky: {
      title: "The Arkwright Method",
      cta: "Order",
    },
    slots: {
      label: "Official Workbook reserved",
      of: "of",
      progressAria: "Official Workbook reservations",
      staticLine: "First edition limited to 100 physical copies",
      remainingSuffix: "· {n} remaining",
      subcopy:
        "Every first-edition physical copy contains a unique code. Only the first 100 copies unlock the Workbook.",
      updatedJustNow: "updated just now",
      updatedSecondsAgo: "updated {s}s ago",
    },
    registration: {
      eyebrow: "First edition · Unique code",
      h1Pre: "Welcome. You just unlocked the ",
      h1Em: "Official Workbook",
      intro:
        "A private companion that guides you to apply the method from the book. We'll grant you private access and email you the confirmation.",
      editionLine: "First edition · 1 of 100 unique codes",
      emailLabel: "Email",
      emailPrivacy:
        "Only to send you the Workbook. We will not share it.",
      nameLabel: "What should we call you?",
      nameOptional: "Optional",
      consentLabel:
        "I agree to receive the confirmation and updates about the Official Workbook. I can unsubscribe any time.",
      submit: "Activate my Workbook",
      errorEmailExists:
        "This email has already activated its Workbook. Use the same address to sign in.",
      errorGeneric:
        "We could not complete the registration. Your code is still valid — please try again.",
      errorRateLimit:
        "Too many attempts. Please wait a moment and try again.",
      errorInvalidEmail: "Please enter a valid email.",
      errorNeedsConsent: "We need your consent to activate the Workbook.",
      confirmedH1: "Your copy is registered",
      confirmedBody:
        "We're opening your Official Workbook. Check your email for the confirmation in the next few minutes.",
      confirmedCta: "Enter the Workbook",
    },
    workbook: {
      eyebrow: "First edition · Official Workbook",
      h1: "Your Workbook",
      intro:
        "Four practices designed to move the book's method from your head into your real life.",
      sections: {
        diagnostico: {
          title: "What ant are you today?",
          description:
            "Six short questions that sketch your starting point. No right answers, only honesty.",
          cta: "Begin",
        },
        funeral: {
          title: "The funeral",
          description:
            "Write what you're ready to bury: identities, beliefs, old agreements. It dissolves into ash and stays archived.",
          cta: "Officiate",
        },
        "proxima-vida": {
          title: "Your next life",
          description:
            "Twelve months. Milestones you drag onto the timeline. Your next year, visible.",
          cta: "Build",
        },
        lunes: {
          title: "The 7 Mondays",
          description:
            "Seven concrete actions from chapter 13. None of them glamorous. Each one moves something real.",
          cta: "Start Monday",
        },
      },
      diagnostico: {
        h1: "What ant are you today?",
        intro:
          "Six cards. Answer without overthinking. At the end you get a portrait — not a score — of where you stand.",
        doneTitle: "This is your ant",
        doneIntro:
          "The epilogue: Cephalotes atratus throws herself into the void and still finds her way home. That's you, today.",
        restart: "Answer again",
        continueLater: "Finish later",
        antCaption: "Your starting point · saved",
        questions: [
          {
            id: "horas-por-precio",
            kind: "slider",
            question: "How many hours are you selling today for each euro that comes in?",
            hint: "0 = none (passive). 10 = all (hour-for-hour).",
            minLabel: "none",
            maxLabel: "all",
          },
          {
            id: "colchon",
            kind: "slider",
            question: "If you stopped invoicing tomorrow, how many months could you last?",
            hint: "0 = zero months. 10 = more than twelve.",
            minLabel: "0 months",
            maxLabel: "12+",
          },
          {
            id: "quien-te-definio",
            kind: "yesno",
            question:
              "Do you still carry the label a teacher or family member gave you before you turned 14?",
          },
          {
            id: "cuerpo-contrae",
            kind: "yesno",
            question:
              "Does your body physically contract when you think about asking for double for your work?",
          },
          {
            id: "tribu-alarga",
            kind: "slider",
            question:
              "How much does your closest circle lift you up or pull you down?",
            hint: "0 = pulls me down. 10 = lifts me up.",
            minLabel: "down",
            maxLabel: "up",
          },
          {
            id: "lunes-esta-semana",
            kind: "yesno",
            question:
              "Do you already know the small, unglamorous action you'd take this Monday if you had to move one piece?",
          },
        ],
      },
      funeral: {
        h1: "The funeral",
        intro:
          "Chapter 6. Write what you're ready to bury today: an inherited belief, a borrowed identity, an old agreement. One thing per entry.",
        placeholder: "Today I bury…",
        bury: "Bury",
        burying: "Burying…",
        empty: "You haven't buried anything yet.",
        cemeteryTitle: "What you left behind",
      },
      proximaVida: {
        h1: "Your next life",
        intro:
          "Twelve months. Drag each milestone to its month. You can edit, mark as reached, or delete.",
        addMilestone: "Add milestone",
        labelPlaceholder: "e.g. recurring €5,000/mo",
        monthLabels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        done: "Reached",
        pending: "Pending",
        delete: "Delete",
        empty: "No milestones yet. Tap “Add milestone”.",
      },
      lunes: {
        h1: "The 7 Mondays",
        intro:
          "The book says it without anaesthesia: “It needs to be Monday.” Here are seven concrete actions. None is glamorous. Mark each one when you do it — and tell us how it went if you'd like.",
        noteLabel: "Tell me about it",
        notePlaceholder: "How did it go? What happened next?",
        markDone: "Mark as done",
        markPending: "Undo",
        columnPending: "Pending",
        columnDone: "Done",
        doneAt: "Done",
        items: [
          {
            id: "transferencia",
            title: "Set up an automatic transfer",
            framing: "A small, fixed amount, to a different account. First Monday.",
          },
          {
            id: "subir-tarifa",
            title: "Raise your rate where you used to stay quiet",
            framing: "One client, one website, one quote. The new number, written down.",
          },
          {
            id: "email-no-te-atreves",
            title: "Send the email you've been avoiding for weeks",
            framing: "You know which one. The one you'd send if you knew it'd go well.",
          },
          {
            id: "decir-un-numero",
            title: "Say a number out loud without apologising",
            framing: "To a client, a partner, yourself in the mirror. No softeners.",
          },
          {
            id: "despedir-cliente",
            title: "Let go of the client, friendship or subscription that drains you",
            framing: "The one that's been going on for years. You know. That one.",
          },
          {
            id: "treinta-minutos",
            title: "Spend 30 minutes on one single thing",
            framing: "No phone. No new tab. Timer. Only that thing.",
          },
          {
            id: "escribir-tribu",
            title: "Write the names of 3 people in your future tribe",
            framing: "People who exist but aren't close yet. Step one is having the list.",
          },
        ],
      },
      common: {
        back: "Back to Workbook",
        saving: "Saving…",
        saved: "Saved",
        savedJustNow: "saved just now",
        savedAgo: "saved {s}s ago",
      },
    },
    resena: {
      eyebrow: "Review + reward",
      h1Pre: "Write your review, get ",
      h1Em: "both gifts.",
      intro:
        "Leave an honest review on Amazon, upload the screenshot, and instantly unlock Lara's first book as an ebook plus the RSB audio.",
      steps: [
        {
          title: "Leave your review on Amazon",
          body: "Open the book's listing, rate it honestly, publish. Any rating works — we want truth, not five stars.",
        },
        {
          title: "Take a screenshot",
          body: "Once Amazon confirms the review is live, capture the screen on your phone. The screenshot stays private on Lara's server — never published.",
        },
        {
          title: "Upload it here",
          body: "Add the screenshot and, optionally, your email to hear about future editions. Uploading instantly opens the downloads.",
        },
      ],
      amazonCta: "Open the Amazon review",
      amazonSoon: "Coming soon on Amazon",
      uploadLabel: "Drag or choose your screenshot",
      uploadHint: "JPG, PNG or WEBP · 5 MB max",
      uploadBlocked: "Rewards will be available very soon",
      previewAlt: "Screenshot preview",
      emailLabel: "Email",
      emailOptional: "optional",
      submit: "Upload and unlock",
      footNote:
        "Your screenshot is only used to verify the review. It's never shared.",
      errors: {
        tooBig: "File is over 5 MB. Compress or crop the image.",
        badType: "Please upload an image (JPG, PNG or WEBP).",
        empty: "Please choose a screenshot before submitting.",
        duplicate:
          "That screenshot was already uploaded. Please use a different one, or contact Lara if this looks wrong.",
        rateLimit:
          "Too many attempts in a short window. Wait a few minutes and try again.",
        invalidEmail: "That email doesn't look valid. Leave it empty if you prefer.",
        generic: "Something went wrong while uploading. Please try again.",
      },
      reward: {
        eyebrow: "Review received",
        h1Pre: "Thank you. You can now ",
        h1Em: "download.",
        intro:
          "Your screenshot is saved. These two downloads are yours — each file allows up to 2 downloads in the next 24 hours.",
        ebookLabel: "Ebook · Book 01",
        ebookTitlePre: "",
        ebookTitleEm: "It's Not You, It's Your Subconscious",
        ebookBody:
          "Lara Lawn's first book. A direct read and the foundational frame that lets you read The Arkwright Method deeper.",
        audioLabel: "Audio · Companion",
        audioTitlePre: "",
        audioTitleEm: "RSB audio",
        audioBody:
          "A guided sonic session that works as a physical anchor for the method. Ideal for the first week after reading the book.",
        download: "Download",
        remaining: "{n} downloads left",
        exhausted: "No downloads left on this link",
        soon: "Coming soon · check back in a few days",
        footNote:
          "Bookmark this page. The link expires in 24 hours; the files stay on your device.",
      },
    },
  },
};
