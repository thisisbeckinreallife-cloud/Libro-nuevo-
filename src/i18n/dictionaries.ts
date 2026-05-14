export type Lang = "es" | "en";

export type OfertaPricingOffer = {
  status: "live";
  statusLabel: string;
  name: string;
  subtitle: string;
  priceAmount: string;
  priceCurrency: string;
  priceCaption: string;
  priceAnchor: string;
  features: string[];
  cta: string;
};

export type OfertaDict = {
  hero: {
    eyebrow: string;
    /**
     * Split into three parts so the middle word renders inside an
     * `<em>` (italic + magenta). Reads as a single sentence.
     */
    headlinePre: string;
    headlineEm: string;
    headlinePost: string;
    subheadline: string;
    /** Label of the in-hero pill CTA. Anchors to #pricing. */
    heroCta: string;
    trustMicrocopy: string;
    imageAlt: string;
  };
  pricing: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    offer: OfertaPricingOffer;
  };
  trust: {
    eyebrow: string;
    stats: { num: string; label: string; hasStars?: boolean }[];
  };
  reviews: {
    eyebrow: string;
    headline: string;
    items: {
      text: string;
      name: string;
      role: string;
      initial: string;
      verifiedLabel: string;
    }[];
  };
  lara: {
    eyebrow: string;
    headline: string;
    bio: string;
    quote: string;
    bullets: string[];
    imageAlt: string;
  };
  inside: {
    eyebrow: string;
    headline: string;
    intro: string;
    items: { title: string; detail: string; bonus?: boolean }[];
  };
  guarantee: {
    main: string;
    sep: string;
    fineprint: string;
  };
  faq: {
    eyebrow: string;
    headline: string;
    items: { question: string; answer: string }[];
  };
  finalCta: {
    headline: string;
    subheadline: string;
    cta: string;
    stickyMobileCta: string;
  };
};

export type Dict = {
  oferta: OfertaDict;
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
    dragHintMobile: string;
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
    // Digital offer (12€) — Stripe checkout. Pre-orden of the bundle
    // ebook + audiolibro that lives at /biblioteca after payment.
    digital: {
      tag: string;          // small badge above the digital block
      h: string;            // headline ("Pack digital · 12€")
      detail: string;       // 1-line summary of what's inside
      bullets: string[];    // 2-3 micro-features below
      cta: string;          // button label
      ctaPending: string;   // shown while POST /api/checkout is in flight
      ctaUnavailable: string; // shown if Stripe returns 503 (not configured yet)
      orSep: string;        // "o si prefieres papel:" between digital + amazon
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
    uploadLabel: string;
    uploadHint: string;
    previewAlt: string;
    emailLabel: string;
    submit: string;
    footNote: string;
    errors: {
      tooBig: string;
      badType: string;
      empty: string;
      duplicate: string;
      rateLimit: string;
      invalidEmail: string;
      needsEmail: string;
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
      preparing: string;
      remaining: string;
      exhausted: string;
      emailFallback: string;
      genericError: string;
      footNote: string;
    };
  };
  biblioteca: {
    eyebrow: string;
    h1Pre: string;
    h1Em: string;
    welcomeWithName: string; // "Bienvenido, {name}"
    welcomeAnon: string;     // shown if no name on the Purchase
    intro: string;
    bookmark: string;        // hint to save the URL
    pendingTitle: string;    // shown while waiting for the webhook
    pendingBody: string;
    pendingHint: string;
    notFoundTitle: string;
    notFoundBody: string;
    refundedTitle: string;
    refundedBody: string;
    ebook: {
      label: string;
      titlePre: string;
      titleEm: string;
      body: string;
      download: string;
      pending: string;       // shown while ebook URL not yet set
      pendingDetail: string;
    };
    audio: {
      label: string;
      titlePre: string;
      titleEm: string;
      body: string;
      download: string;
      duration: string;      // "5h 10m"
    };
    workbook: {
      eyebrow: string;       // "Incluido con tu compra"
      h: string;             // section title
      body: string;          // 1-2 line description
      items: string[];       // 4 mini-tile labels
      cta: string;           // button label
    };
    footNote: string;
  };
};

export const dict: Record<Lang, Dict> = {
  es: {
    oferta: {
      hero: {
        eyebrow: "El método Arkwright · Lara Lawn",
        headlinePre: "No es disciplina. Es ",
        headlineEm: "identidad",
        headlinePost: ".",
        subheadline:
          "Subiste tarifa una vez y volviste a la anterior en dos meses. El manual que reescribe ese techo en un fin de semana.",
        heroCta: "Ver el método",
        trustMicrocopy:
          "+10.000 mujeres aplicando el método · 10 años de investigación · 4,9 / 5",
        imageAlt: "Portada de El método Arkwright de Lara Lawn",
      },
      pricing: {
        eyebrow: "El precio absurdo",
        headline: "Todo el sistema. Un pago. Acceso para siempre.",
        subheadline:
          "El audiolibro suelto en Audible: 24,95 €. El workbook suelto en la web de Lara: 49 €. La consultoría privada de Lara: 4.800 € por programa, lista de espera. Hoy, los tres formatos juntos, por menos que el audiolibro a solas. La razón del precio: queremos que entre la mujer correcta, no la mujer que puede pagar.",
        offer: {
          status: "live",
          statusLabel: "Disponible hoy",
          name: "El método Arkwright · Pack completo",
          subtitle: "Ebook + audiolibro + workbook online",
          priceAmount: "12",
          priceCurrency: "€",
          priceCaption: "Pago único · acceso inmediato · 30 días de garantía",
          priceAnchor: "Valor desglosado: 165 €",
          features: [
            "Reescribes el termostato al que vuelve tu cuenta — manual de 25 capítulos",
            "Aplicas las 9 operaciones del método en un fin de semana — workbook guiado",
            "Escuchas a Lara mientras conduces o paseas — 5h 34min de audiolibro",
            "Desbloqueas su primer libro entero (ebook + audio 6h 15min) al dejar reseña",
            "Te quedas con todo aunque pidas la devolución a los 30 días",
            "Pago único de 12 € — sin suscripción, sin upsells, sin letra pequeña",
          ],
          cta: "Acceder — 12 €",
        },
      },
      trust: {
        eyebrow: "Por qué este método ya no es una hipótesis",
        stats: [
          { num: "10.000+", label: "Mujeres aplicando el método" },
          { num: "10 años", label: "De investigación clínica y de campo" },
          { num: "38.000", label: "Copias del primer libro vendidas" },
          { num: "4,9 / 5", label: "Valoración media de lectoras", hasStars: true },
        ],
      },
      reviews: {
        eyebrow: "Lectoras que ya cruzaron al otro lado",
        headline: "Lo que cambió de verdad cuando subieron el termostato.",
        items: [
          {
            text: "Subí mis tarifas un 60% el lunes después de terminar el workbook. Tres clientes dijeron que sí sin parpadear. El cuarto dejé que se fuera.",
            name: "Marta R.",
            role: "Diseñadora UX · Madrid",
            initial: "M",
            verifiedLabel: "Lectora verificada",
          },
          {
            text: "Seis años cobrando lo mismo. Leí el capítulo del termostato un sábado. Reescribí la propuesta el domingo. Cerré 4.200 € el martes.",
            name: "Inés M.",
            role: "Consultora freelance · Valencia",
            initial: "I",
            verifiedLabel: "Lectora verificada",
          },
          {
            text: "No es un libro para subrayar. Es un libro para decidir. Me levanté de una mesa que llevaba diez años aguantando. No he vuelto.",
            name: "Carolina P.",
            role: "Arquitecta · Bilbao",
            initial: "C",
            verifiedLabel: "Lectora verificada",
          },
          {
            text: "Trabajaba el doble por la mitad y lo justificaba con currículum. El primer ejercicio del workbook me dejó tres horas en blanco. A la semana renegocié el contrato entero.",
            name: "Patricia L.",
            role: "Abogada · Barcelona",
            initial: "P",
            verifiedLabel: "Lectora verificada",
          },
          {
            text: "Pensé que era otro libro de autoayuda. No lo es. Es un manual operativo. Hice las cuatro dinámicas en un fin de semana y subí mi hora un 45%.",
            name: "Sara V.",
            role: "Coach ejecutiva · Sevilla",
            initial: "S",
            verifiedLabel: "Lectora verificada",
          },
          {
            text: "Lo escuché en audio paseando al perro. Tres capítulos. Llegué a casa, abrí la propuesta que llevaba dos meses parada, y la mandé con un 40% más. Aceptaron en 48 horas.",
            name: "Elena G.",
            role: "Arquitecta de software · Bilbao",
            initial: "E",
            verifiedLabel: "Lectora verificada",
          },
        ],
      },
      lara: {
        eyebrow: "La autora",
        headline:
          "Doce años, más de 25.000 € en formación, y una sola pregunta.",
        bio:
          "18 años. Más de 25.000 €. Cientos de libros. Una sola pregunta: ¿por qué personas inteligentes que saben exactamente qué hacer no lo hacen? ¿Por qué volvemos a los mismos patrones? ¿Por qué nos saboteamos justo cuando estamos a punto de conseguirlo? ¿Por qué el cambio nunca se sostiene? Estudié en Harvard. En Duke. Devoré todo lo que encontré sobre neurociencia, epigenética, psicología del comportamiento. Y finalmente lo entendí. El problema no era la estrategia. No era la disciplina. No era la fuerza de voluntad. El problema era la identidad. Tu subconsciente tiene una imagen de quién eres. Un termostato interno. Y cada vez que intentas ser alguien que no coincide con esa imagen, te devuelve al punto de partida. Por eso las afirmaciones no funcionan. Por eso el coaching no dura. Por eso sigues en el mismo sitio aunque sabes perfectamente qué deberías hacer. Cuando entendí esto, dejé de intentar cambiar mi vida. Y empecé a cambiar quién era.",
        quote:
          "No tienes un problema de dinero. Tienes un problema de identidad. Y la identidad sí se reescribe.",
        bullets: [
          "Arquitecta de identidades · 10 años de investigación clínica y de campo",
          "+10.000 mujeres en programas y cartas privadas",
          "38.000+ copias vendidas del primer libro en España y LATAM",
          "Consultora privada con lista de espera a 4.800 € por programa",
        ],
        imageAlt: "Retrato de Lara Lawn",
      },
      inside: {
        eyebrow: "Lo que reescribe el termostato",
        headline: "Tres formatos. Una sola pieza. Cero esperas.",
        intro:
          "El método Arkwright no se lee — se aplica. Por eso entra en tres formatos coordinados: el ebook para entender el marco, el audiolibro para que tu subconsciente lo oiga mientras conduces, y el workbook para que la mano firme decisiones nuevas. El audiolibro suelto en Audible: ~25 €. El workbook suelto en la consultoría: 49 €. Los tres, hoy, por 12 €. Esto es lo que entra en tu biblioteca privada en cuanto Stripe confirma el pago.",
        items: [
          {
            title: "Ebook completo · 25 capítulos",
            detail: "PDF + EPUB. Las 9 operaciones, los protocolos, los marcos. Listo para Kindle, iPad, móvil o impresión casera. Valor: 39 €.",
          },
          {
            title: "Audiolibro · 5h 34min",
            detail: "17 capítulos marcados. Voz Despina, castellano España. Reproducible en web, Sonos, CarPlay y Android Auto. Suelto en Audible: ~25 €. Valor: 39 €.",
          },
          {
            title: "Workbook online · 4 dinámicas",
            detail: "Diagnóstico, Funeral, Próxima vida y Lunes. Tu progreso queda guardado entre dispositivos. Idéntico al que entrega Lara en consultoría privada de 4.800 €. Valor: 49 €.",
          },
          {
            title: "BONUS · Primer libro en ebook",
            detail: "“No eres tú, es tu subconsciente”. 38.000 copias vendidas. Se desbloquea al dejar tu reseña en Amazon. Valor: 18 €.",
            bonus: true,
          },
          {
            title: "BONUS · Audiolibro del primer libro",
            detail: "6h 15min. Versión íntegra. Se desbloquea junto con el ebook bonus en cuanto subes tu reseña. Valor: 20 €.",
            bonus: true,
          },
          {
            title: "BONUS · Comunidad de lectoras",
            detail: "Hilo privado mensual con Lara para preguntas sobre el método (próximamente). Sin coste recurrente.",
            bonus: true,
          },
        ],
      },
      guarantee: {
        main: "30 días de garantía sin preguntas · te devolvemos los 12 € si decides que no",
        sep: "·",
        fineprint:
          "Si pides la devolución, te quedas con el ebook, con el audiolibro y con el progreso del workbook. Yo me quedo sin los 12 €. El riesgo es entero mío — el tuyo es abrirlo. Y el riesgo real no es perder 12 €: es seguir cobrando el mismo número doce meses más. — Lara",
      },
      faq: {
        eyebrow: "Antes de comprar",
        headline: "Lo que te estás preguntando ahora mismo.",
        items: [
          {
            question: "¿Cómo accedo después de pagar?",
            answer:
              "Esa no es la pregunta importante — la pregunta importante es por qué llevas meses sin pulsar el botón en otras páginas. Aquí no hay fricción: en cuanto Stripe confirma el pago se abre tu biblioteca privada con el ebook, el audiolibro y el workbook listos para usar. Recibes además un email con todos los enlaces para entrar desde otro dispositivo. Sin esperas, sin códigos, sin envíos físicos. El proceso entero, desde que pulsas el botón hasta que abres el primer capítulo, tarda menos de 60 segundos.",
          },
          {
            question: "¿Y si lo abro y siento que no es para mí?",
            answer:
              "Entonces yo pierdo y tú ganas. Escribes una línea al email de soporte dentro de los 30 días y te devolvemos los 12 € enteros. No pedimos motivo, no hay encuesta, no hay fricción. Y te quedas con lo descargado: ebook, audio y el progreso del workbook. La devolución no anula el material que ya bajaste. Yo prefiero perder 12 € antes que tener una lectora que no debería estar aquí — y prefiero perderlos antes que dejarte fuera por miedo a equivocarte.",
          },
          {
            question: "¿En qué dispositivos puedo leer y escuchar?",
            answer:
              "En todos los que ya tienes. El ebook funciona en iPhone, Android, iPad, Kindle, Mac y Windows en PDF y EPUB. El audiolibro se reproduce desde el navegador, en Sonos, en CarPlay, en Android Auto y en cualquier app que acepte streaming web. El workbook es online, responsive y guarda tu progreso entre sesiones. Empezar en el móvil, terminar en el portátil. Sin sincronizar nada, sin descargar nada extra.",
          },
          {
            question: "Soy nueva en estos temas, ¿voy a entender el libro?",
            answer:
              "La pregunta real es otra: no es si vas a entenderlo — es si vas a aplicarlo. El método Arkwright no asume que vengas de nada previo. No es neurociencia académica y no es espiritualidad: es un manual operativo escrito para mujeres ocupadas. Los primeros tres capítulos te dan el marco completo del termostato y de las 9 operaciones. El workbook te lleva paso a paso por el diagnóstico antes de cualquier ejercicio profundo. Si sabes leer un email, sabes leer este libro. Lo que decide el resultado no es tu base previa — es que abras el workbook el lunes.",
          },
          {
            question: "Ya leí “No eres tú, es tu subconsciente”. ¿Esto repite lo mismo?",
            answer:
              "Si volver a leer lo mismo hubiera bastado, ya estarías cobrando otro número. El primer libro abrió la pregunta — por qué tu subconsciente lleva años decidiendo por ti. El método Arkwright es el manual técnico para reescribirlo: las 9 operaciones, los protocolos exactos, el workbook con las cuatro dinámicas. Si leíste el primero, este es exactamente el paso que estabas esperando. El bonus, además, te devuelve el primer libro entero en ebook y audio cuando dejes la reseña — así tienes los dos marcos uno al lado del otro.",
          },
          {
            question: "¿Por qué solo edición digital y no tapa blanda ni edición coleccionista?",
            answer:
              "Porque la mujer que necesita este método no necesita esperar a un envío — necesita abrirlo hoy. Una edición física obligaría a triplicar el precio, sumar envíos y romper la promesa de 12 € y de garantía total. Hoy solo existe el pack digital — y esta es la única página donde se vende. Si en algún momento hubiera una edición física, las lectoras de este pack lo sabrán primero, sin tener que apuntarse a nada.",
          },
        ],
      },
      finalCta: {
        headline:
          "Doce euros, o doce meses más cobrando el mismo número. Tú decides cuál sale más caro.",
        subheadline:
          "12 € es menos que una cena pedida por Glovo. Menos que una entrada de cine para dos. Menos que un mes de Spotify Family. Si dejas pasar la oferta y dentro de un año sigues en la misma tarifa, el coste no son 12 € — son los miles que no facturaste por no haber tocado el termostato. Pago único · acceso inmediato · 30 días de garantía · te quedas con lo descargado.",
        cta: "Empezar ya — 12 €",
        stickyMobileCta: "Acceder al pack · 12 €",
      },
    },
    nav: {
      tagline: "Arquitecta de identidades",
      book: "La oferta",
      method: "El método",
      lara: "Sobre Lara",
      extracts: "Reseñas",
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
      dragHintMobile: "↔  arrastra",
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
        { k: "Formato", v: "Ebook + audiolibro · digital" },
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
      h2Line1Pre: "El método entero, ",
      h2Line1Em: "digital",
      h2Line2: "y accesible al instante.",
      p: "Pack ebook + audiolibro descargable nada más pagar. El libro completo en PDF y la versión narrada con 17 capítulos marcados (5h 34m). Sin esperas, sin envíos.",
      featuredTag: "Más elegido",
      featuredFormat: "Tapa dura + eBook",
      featuredDetail: "Primera edición · Envío internacional",
      ebookFormat: "eBook",
      ebookDetail: "Kindle + ePub · Lectura inmediata",
      cta: "Edición en papel · Próximamente",
      note: "Edición digital disponible ahora · papel en preparación",
      priceFlag: "precio",
      bonusStack: {
        label: "Incluido con tu compra",
        intro: "Comprando ahora también te llevas:",
        items: [
          {
            titlePre: "",
            titleEm: "No eres tú, es tu subconsciente",
            detail:
              "El primer libro de Lara en formato ebook · desbloqueado al dejar tu reseña.",
          },
          {
            titlePre: "Audiolibro ",
            titleEm: "No eres tú, es tu subconsciente",
            detail:
              "La versión narrada del primer libro de Lara · desbloqueado al dejar tu reseña.",
          },
        ],
        foot: "Tras comprar, recibirás un enlace para reclamarlos en tu biblioteca.",
      },
      digital: {
        tag: "Oferta digital · 12€",
        h: "Pack ebook + audiolibro · acceso inmediato.",
        detail:
          "El libro completo en PDF/EPUB y la versión narrada con 17 capítulos marcados (5h 34m). Para descargar al instante tras pagar.",
        bullets: [
          "Pago seguro por Stripe — Apple Pay y Google Pay disponibles.",
          "Biblioteca privada accesible desde cualquier dispositivo.",
          "Sin DRM. Sin caducidad. Sin reproductor obligado.",
        ],
        cta: "Comprar pack digital · 12€",
        ctaPending: "Abriendo pago…",
        ctaUnavailable: "Próximamente disponible",
        orSep: "Y la edición en papel:",
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
        "Deja tu reseña honesta en Amazon, sube la captura y desbloquea al instante el primer libro de Lara en ebook y en audiolibro.",
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
          title: "Súbela con tu email",
          body: "Al subir la captura se abren las descargas automáticamente. Te mandamos también un recordatorio por email con los enlaces.",
        },
      ],
      amazonCta: "Ir a la reseña en Amazon",
      uploadLabel: "Arrastra o selecciona tu captura",
      uploadHint: "JPG, PNG o WEBP · máx. 5 MB",
      previewAlt: "Vista previa de la captura",
      emailLabel: "Email",
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
        invalidEmail: "Ese email no parece válido.",
        needsEmail: "Añade tu email para recibir los enlaces de descarga.",
        generic: "Algo ha salido mal al subir. Vuelve a intentarlo.",
      },
      reward: {
        eyebrow: "Reseña recibida",
        h1Pre: "Gracias. Ya puedes ",
        h1Em: "descargar.",
        intro:
          "Tu captura se ha guardado. Estas dos descargas son tuyas — cada archivo admite hasta 2 descargas en las próximas 24 horas. También te las enviamos por email.",
        ebookLabel: "Ebook · Libro 01",
        ebookTitlePre: "",
        ebookTitleEm: "No eres tú, es tu subconsciente",
        ebookBody:
          "El primer libro de Lara Lawn. Lectura directa, marco fundacional para leer el Arkwright Method con más profundidad.",
        audioLabel: "Audiolibro · Libro 01",
        audioTitlePre: "",
        audioTitleEm: "No eres tú, es tu subconsciente — narrado.",
        audioBody:
          "La versión en audio del primer libro de Lara. Para escucharlo mientras conduces, paseas o entrenas.",
        download: "Descargar",
        preparing: "Preparando…",
        remaining: "{n} descargas disponibles",
        exhausted: "Descarga agotada para este enlace",
        emailFallback:
          "Te hemos enviado el enlace a tu email. Llega en unos minutos.",
        genericError: "Algo ha salido mal. Reintenta en un momento.",
        footNote:
          "Guarda esta página. El enlace deja de funcionar en 24 horas; los archivos se quedan en tu dispositivo.",
      },
    },
    biblioteca: {
      eyebrow: "Tu biblioteca",
      h1Pre: "Tu copia digital, ",
      h1Em: "lista para descargar.",
      welcomeWithName: "Bienvenida, {name}.",
      welcomeAnon: "Bienvenida.",
      intro:
        "Tu compra está confirmada. Descarga el ebook y el audiolibro tantas veces como necesites — cada archivo admite hasta 5 descargas con este enlace.",
      bookmark:
        "Guarda esta URL en favoritos: vuelve cuando quieras desde cualquier dispositivo.",
      pendingTitle: "Estamos confirmando tu pago…",
      pendingBody:
        "Stripe nos avisa por webhook en cuestión de segundos. Si esta página se queda esperando más de un minuto, revisa el correo: el recibo automático lleva el enlace.",
      pendingHint: "Reintentando…",
      notFoundTitle: "Enlace no válido",
      notFoundBody:
        "No encontramos una compra asociada a este enlace. Si acabas de pagar, espera un minuto y recarga. Si el problema persiste, escríbenos.",
      refundedTitle: "Esta compra fue reembolsada",
      refundedBody:
        "El acceso digital se canceló al procesar el reembolso. Si crees que es un error, escríbenos.",
      ebook: {
        label: "Ebook · The Arkwright Method",
        titlePre: "El libro completo, ",
        titleEm: "para leer en cualquier dispositivo.",
        body:
          "PDF optimizado para Kindle, iPad y lectura en pantalla. Formato fijo, igual al físico.",
        download: "Descargar ebook",
        pending: "Próximamente disponible",
        pendingDetail:
          "Estamos preparando la versión digital. Cuando esté lista podrás descargarla desde aquí — el acceso es vitalicio.",
      },
      audio: {
        label: "Audiolibro · The Arkwright Method",
        titlePre: "Cinco horas de ",
        titleEm: "el método narrado.",
        body:
          "MP3 navegable. Voz en español, mismo texto íntegro del libro. Reproducible en cualquier app de podcast o reproductor.",
        download: "Descargar audiolibro",
        duration: "5h 10m · MP3",
      },
      workbook: {
        eyebrow: "Incluido con tu compra",
        h: "Tus ejercicios del workbook.",
        body:
          "Cuatro operaciones para aplicar el método. Tu progreso se guarda automáticamente y puedes volver desde cualquier dispositivo.",
        items: ["Diagnóstico", "Funeral", "Lunes", "Próxima vida"],
        cta: "Entrar al workbook",
      },
      footNote:
        "Las descargas se cuentan por archivo (máx. 5 por copia). Si tienes problemas, contacta con nosotros respondiendo al recibo de Stripe.",
    },
  },
  en: {
    oferta: {
      hero: {
        eyebrow: "The Arkwright Method · Lara Lawn",
        headlinePre: "It isn't discipline. It's ",
        headlineEm: "identity",
        headlinePost: ".",
        subheadline:
          "You raised your rate once and went back to the old one within two months. The manual that rewrites that ceiling over one weekend.",
        heroCta: "See the method",
        trustMicrocopy:
          "+10,000 women applying the method · 10 years of research · 4.9 / 5",
        imageAlt: "Cover of The Arkwright Method by Lara Lawn",
      },
      pricing: {
        eyebrow: "The absurd price",
        headline: "The full system. One payment. Lifetime access.",
        subheadline:
          "The audiobook alone on Audible: 24.95 €. The workbook alone on Lara's site: 49 €. Her private consultancy: 4,800 € per program, waitlist. Today, all three formats together, for less than the audiobook on its own. The reason for the price: we want the right woman to walk in, not just the one who can afford it.",
        offer: {
          status: "live",
          statusLabel: "Available today",
          name: "The Arkwright Method · Full pack",
          subtitle: "Ebook + audiobook + online workbook",
          priceAmount: "12",
          priceCurrency: "€",
          priceCaption: "One-time payment · instant access · 30-day guarantee",
          priceAnchor: "Itemised value: 165 €",
          features: [
            "Rewrite the thermostat your account returns to — 25-chapter manual",
            "Run the 9 operations of the method in one weekend — guided workbook",
            "Listen while you drive or walk — 5h 34min audiobook",
            "Unlock her entire first book (ebook + 6h 15min audio) when you leave a review",
            "Keep everything even if you request the refund within 30 days",
            "One-time 12 € — no subscription, no upsells, no fine print",
          ],
          cta: "Get access — 12 €",
        },
      },
      trust: {
        eyebrow: "Why this method is no longer a hypothesis",
        stats: [
          { num: "10,000+", label: "Women applying the method" },
          { num: "10 years", label: "Of clinical and field research" },
          { num: "38,000", label: "Copies sold of the first book" },
          { num: "4.9 / 5", label: "Average reader rating", hasStars: true },
        ],
      },
      reviews: {
        eyebrow: "Readers who already crossed over",
        headline: "What actually changed once they turned up the thermostat.",
        items: [
          {
            text: "Raised my rates 60% the Monday after finishing the workbook. Three clients said yes without blinking. The fourth one I let walk.",
            name: "Marta R.",
            role: "UX designer · Madrid",
            initial: "M",
            verifiedLabel: "Verified reader",
          },
          {
            text: "Six years charging the same. Read the thermostat chapter on a Saturday. Rewrote my proposal on Sunday. Closed 4,200 € on Tuesday.",
            name: "Inés M.",
            role: "Freelance consultant · Valencia",
            initial: "I",
            verifiedLabel: "Verified reader",
          },
          {
            text: "Not a book to underline. A book to decide. Got up from a table I'd been sitting at for ten years. Haven't been back.",
            name: "Carolina P.",
            role: "Architect · Bilbao",
            initial: "C",
            verifiedLabel: "Verified reader",
          },
          {
            text: "Worked twice as hard for half the money and dressed it up as résumé. The first workbook exercise left me staring at the wall for three hours. A week later I renegotiated the entire contract.",
            name: "Patricia L.",
            role: "Lawyer · Barcelona",
            initial: "P",
            verifiedLabel: "Verified reader",
          },
          {
            text: "Thought it was another self-help book. It isn't. It's an operating manual. Did the four exercises in a weekend and raised my hourly rate 45%.",
            name: "Sara V.",
            role: "Executive coach · Sevilla",
            initial: "S",
            verifiedLabel: "Verified reader",
          },
          {
            text: "Listened to it walking the dog. Three chapters. Got home, opened a proposal that had been parked for two months, and sent it with 40% more. They accepted in 48 hours.",
            name: "Elena G.",
            role: "Software architect · Bilbao",
            initial: "E",
            verifiedLabel: "Verified reader",
          },
        ],
      },
      lara: {
        eyebrow: "The author",
        headline:
          "Twelve years, more than 25,000 € in training, and one single question.",
        bio:
          "Eighteen years. More than 25,000 €. Hundreds of books. One single question: why do intelligent people who know exactly what to do not do it? Why do we return to the same patterns? Why do we sabotage ourselves right when we're about to make it? Why does change never hold? I studied at Harvard. At Duke. I devoured everything I could find on neuroscience, epigenetics, behavioural psychology. And eventually I understood. The problem wasn't strategy. It wasn't discipline. It wasn't willpower. The problem was identity. Your subconscious holds an image of who you are. An internal thermostat. And every time you try to be someone who doesn't match that image, it sends you back to the starting point. That's why affirmations don't work. That's why coaching doesn't last. That's why you stay in the same place even though you know perfectly well what you should do. When I understood this, I stopped trying to change my life. And I started changing who I was.",
        quote:
          "You don't have a money problem. You have an identity problem. And identity can be rewritten.",
        bullets: [
          "Identity Architect · 10 years of clinical and field research",
          "+10,000 women in programs and private letters",
          "38,000+ copies sold of her first book in Spain and LATAM",
          "Private consultant with a waitlist at 4,800 € per program",
        ],
        imageAlt: "Portrait of Lara Lawn",
      },
      inside: {
        eyebrow: "What rewrites the thermostat",
        headline: "Three formats. One single piece. Zero waiting.",
        intro:
          "The Arkwright Method is not read — it's applied. That's why it ships in three coordinated formats: the ebook so your mind grasps the framework, the audiobook so your subconscious hears it while you drive, and the workbook so your hand signs new decisions. The audiobook alone on Audible: ~25 €. The workbook alone in the consultancy: 49 €. All three, today, for 12 €. Here is what enters your private library the moment Stripe confirms the payment.",
        items: [
          {
            title: "Full ebook · 25 chapters",
            detail: "PDF + EPUB. The 9 operations, the protocols, the frameworks. Ready for Kindle, iPad, mobile or home printing. Value: 39 €.",
          },
          {
            title: "Audiobook · 5h 34min",
            detail: "17 bookmarked chapters. Despina voice, Castilian Spanish. Plays on web, Sonos, CarPlay and Android Auto. Standalone on Audible: ~25 €. Value: 39 €.",
          },
          {
            title: "Online workbook · 4 exercises",
            detail: "Diagnosis, Funeral, Next Life and Monday. Your progress is saved across devices. Identical to the one Lara delivers in her 4,800 € private consultancy. Value: 49 €.",
          },
          {
            title: "BONUS · First book as ebook",
            detail: "“It's not you, it's your subconscious.” 38,000 copies sold. Unlocked when you leave your Amazon review. Value: 18 €.",
            bonus: true,
          },
          {
            title: "BONUS · Audiobook of the first book",
            detail: "6h 15min. Full version. Unlocked together with the bonus ebook as soon as you upload your review. Value: 20 €.",
            bonus: true,
          },
          {
            title: "BONUS · Readers' community",
            detail: "Private monthly thread with Lara for method questions (coming soon). No recurring cost.",
            bonus: true,
          },
        ],
      },
      guarantee: {
        main: "30-day no-questions guarantee · we refund the 12 € if you decide it isn't for you",
        sep: "·",
        fineprint:
          "If you ask for the refund, you keep the ebook, the audiobook and the workbook progress. I lose the 12 €. The risk is entirely mine — yours is opening it. And the real risk isn't losing 12 €: it's spending another twelve months charging the same number. — Lara",
      },
      faq: {
        eyebrow: "Before you buy",
        headline: "What you're asking yourself right now.",
        items: [
          {
            question: "How do I get access after paying?",
            answer:
              "That isn't the real question — the real question is why you've gone months without pressing the button on other pages. Here there's no friction: the moment Stripe confirms the payment your private library opens with the ebook, the audiobook and the workbook ready to use. You also receive an email with every link so you can come in from another device. No waiting, no codes, no physical shipping. The whole process, from pressing the button to opening the first chapter, takes under 60 seconds.",
          },
          {
            question: "And if I open it and feel it's not for me?",
            answer:
              "Then I lose and you win. You send one line to the support email within 30 days and we refund the entire 12 €. We don't ask why, there's no survey, no friction. And you keep everything you downloaded: ebook, audio and workbook progress. The refund does not erase what you already pulled down. I'd rather lose 12 € than have a reader who shouldn't be here — and I'd rather lose them than keep you outside out of fear of getting it wrong.",
          },
          {
            question: "Which devices can I read and listen on?",
            answer:
              "All of the ones you already own. The ebook works on iPhone, Android, iPad, Kindle, Mac and Windows in PDF and EPUB. The audiobook plays in the browser, on Sonos, on CarPlay, on Android Auto and in any app that accepts web streaming. The workbook is online, responsive and saves your progress across sessions. Start on the phone, finish on the laptop. Nothing to sync, nothing extra to download.",
          },
          {
            question: "I'm new to these topics — will I follow the book?",
            answer:
              "The real question is the other one: not whether you'll follow it — but whether you'll apply it. The Arkwright Method assumes no prior background. It isn't academic neuroscience and it isn't spirituality: it's an operating manual written for busy women. The first three chapters give you the full thermostat framework and the 9 operations. The workbook walks you step by step through the diagnosis before any deeper exercise. If you can read an email, you can read this book. What decides the outcome isn't your starting point — it's whether you open the workbook on Monday.",
          },
          {
            question: "I already read “It's not you, it's your subconscious.” Does this repeat?",
            answer:
              "If re-reading the same thing had been enough, you'd already be charging another number. The first book opened the question — why your subconscious has been deciding for you for years. The Arkwright Method is the technical manual to rewrite it: the 9 operations, the exact protocols, the workbook with the four exercises. If you read the first one, this is exactly the step you were waiting for. The bonus, on top, gives you the whole first book back in ebook and audio when you leave the review — so you have both frameworks side by side.",
          },
          {
            question: "Why digital-only and no paperback or collector's edition?",
            answer:
              "Because the woman who needs this method doesn't need to wait for a parcel — she needs to open it today. A physical edition would force us to triple the price, add shipping and break the promise of 12 € plus a full guarantee. Today the digital pack is the only thing that exists — and this is the only page where it sells. If a physical edition ever launches, the readers of this pack will hear first, without signing up for anything.",
          },
        ],
      },
      finalCta: {
        headline:
          "Twelve euros, or twelve more months charging the same number. You decide which one costs more.",
        subheadline:
          "12 € is less than a Deliveroo dinner. Less than two cinema tickets. Less than one month of Spotify Family. If you skip the offer and a year from now you're still at the same rate, the cost isn't 12 € — it's the thousands you didn't invoice because you never touched the thermostat. One-time payment · instant access · 30-day guarantee · you keep what you downloaded.",
        cta: "Start now — 12 €",
        stickyMobileCta: "Get the pack · 12 €",
      },
    },
    nav: {
      tagline: "Identity architect",
      book: "The offer",
      method: "The method",
      lara: "About Lara",
      extracts: "Reviews",
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
      dragHintMobile: "↔  drag",
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
        { k: "Format", v: "Ebook + audiobook · digital" },
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
      h2Line1Pre: "The full method, ",
      h2Line1Em: "digital",
      h2Line2: "and instantly accessible.",
      p: "Ebook + audiobook bundle, downloadable the second you pay. The full book as a PDF and the narrated version with 17 marked chapters (5h 34m). No waits, no shipping.",
      featuredTag: "Most chosen",
      featuredFormat: "Hardcover + eBook",
      featuredDetail: "First edition · International shipping",
      ebookFormat: "eBook",
      ebookDetail: "Kindle + ePub · Instant read",
      cta: "Paper edition · Coming soon",
      note: "Digital edition available now · paper edition in the works",
      priceFlag: "price",
      bonusStack: {
        label: "Included with your purchase",
        intro: "Order now and you also get:",
        items: [
          {
            titlePre: "",
            titleEm: "It's Not You, It's Your Subconscious",
            detail:
              "Lara's first book as an ebook · unlocked when you leave your review.",
          },
          {
            titlePre: "Audiobook ",
            titleEm: "It's Not You, It's Your Subconscious",
            detail:
              "The narrated version of Lara's first book · unlocked when you leave your review.",
          },
        ],
        foot: "After paying you'll receive a link to redeem them from your library.",
      },
      digital: {
        tag: "Digital offer · €12",
        h: "Ebook + audiobook bundle · instant access.",
        detail:
          "The full book as a PDF/EPUB and the narrated version with 17 marked chapters (5h 34m). Downloadable the moment you pay.",
        bullets: [
          "Secure checkout via Stripe — Apple Pay and Google Pay supported.",
          "Private library, accessible from any device.",
          "No DRM. No expiry. No mandatory player.",
        ],
        cta: "Buy digital bundle · €12",
        ctaPending: "Opening checkout…",
        ctaUnavailable: "Coming soon",
        orSep: "And the paper edition:",
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
        "Leave an honest review on Amazon, upload the screenshot, and instantly unlock Lara's first book as both an ebook and an audiobook.",
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
          title: "Upload with your email",
          body: "Uploading the screenshot instantly opens the downloads. We also email you the links as a backup.",
        },
      ],
      amazonCta: "Open the Amazon review",
      uploadLabel: "Drag or choose your screenshot",
      uploadHint: "JPG, PNG or WEBP · 5 MB max",
      previewAlt: "Screenshot preview",
      emailLabel: "Email",
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
        invalidEmail: "That email doesn't look valid.",
        needsEmail: "Please add your email to receive the download links.",
        generic: "Something went wrong while uploading. Please try again.",
      },
      reward: {
        eyebrow: "Review received",
        h1Pre: "Thank you. You can now ",
        h1Em: "download.",
        intro:
          "Your screenshot is saved. These two downloads are yours — each file allows up to 2 downloads in the next 24 hours. We've also sent them to your email.",
        ebookLabel: "Ebook · Book 01",
        ebookTitlePre: "",
        ebookTitleEm: "It's Not You, It's Your Subconscious",
        ebookBody:
          "Lara Lawn's first book. A direct read and the foundational frame that lets you read The Arkwright Method deeper.",
        audioLabel: "Audiobook · Book 01",
        audioTitlePre: "",
        audioTitleEm: "It's Not You, It's Your Subconscious — narrated.",
        audioBody:
          "The audio version of Lara's first book. For listening while driving, walking or training.",
        download: "Download",
        preparing: "Preparing…",
        remaining: "{n} downloads left",
        exhausted: "No downloads left on this link",
        emailFallback:
          "We've just emailed you this download. It lands in a couple of minutes.",
        genericError: "Something went wrong. Try again in a moment.",
        footNote:
          "Bookmark this page. The link expires in 24 hours; the files stay on your device.",
      },
    },
    biblioteca: {
      eyebrow: "Your library",
      h1Pre: "Your digital copy, ",
      h1Em: "ready to download.",
      welcomeWithName: "Welcome, {name}.",
      welcomeAnon: "Welcome.",
      intro:
        "Your purchase is confirmed. Download the ebook and the audiobook as many times as you need — each file allows up to 5 downloads with this link.",
      bookmark:
        "Bookmark this URL: come back any time, from any device.",
      pendingTitle: "Confirming your payment…",
      pendingBody:
        "Stripe pings us via webhook within seconds. If this page hangs longer than a minute, check your inbox — the receipt has the link.",
      pendingHint: "Retrying…",
      notFoundTitle: "Invalid link",
      notFoundBody:
        "We couldn't find a purchase tied to this link. If you just paid, wait a minute and reload. If it persists, write to us.",
      refundedTitle: "This purchase was refunded",
      refundedBody:
        "Digital access was revoked when the refund went through. If this is a mistake, write to us.",
      ebook: {
        label: "Ebook · The Arkwright Method",
        titlePre: "The full book, ",
        titleEm: "ready for any device.",
        body:
          "PDF optimised for Kindle, iPad and on-screen reading. Fixed-format, identical to print.",
        download: "Download ebook",
        pending: "Coming soon",
        pendingDetail:
          "We're finalising the digital edition. Once it's ready you'll download it here — access is for life.",
      },
      audio: {
        label: "Audiobook · The Arkwright Method",
        titlePre: "Five hours of ",
        titleEm: "the method, narrated.",
        body:
          "Navigable MP3. Spanish narration, the full book read aloud. Plays in any podcast app or media player.",
        download: "Download audiobook",
        duration: "5h 10m · MP3",
      },
      workbook: {
        eyebrow: "Included with your purchase",
        h: "Your workbook exercises.",
        body:
          "Four operations to apply the method. Your progress saves automatically and you can return from any device.",
        items: ["Diagnosis", "Funeral", "Monday", "Next life"],
        cta: "Enter the workbook",
      },
      footNote:
        "Downloads are counted per file (max 5 per copy). If you have trouble, reply to your Stripe receipt and we'll help.",
    },
  },
};
