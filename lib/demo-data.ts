// lib/demo-data.ts
export const loadDemoData = () => {
  const demoUser = {
    email: "demo@sillon.com",
    password: "password", // Pour la démo, un mot de passe simple
    prenom: "Utilisateur",
    nom: "Démo",
    createdAt: new Date().toISOString(),
  }

  const demoSubjects = [
    { id: 1, name: "Mathématiques", icon: "📐", color: "blue", chapters: 3, progress: 65 },
    { id: 2, name: "Physique", icon: "⚛️", color: "purple", chapters: 2, progress: 70 },
    { id: 3, name: "Histoire", icon: "📜", color: "orange", chapters: 4, progress: 50 },
    { id: 4, name: "Biologie", icon: "🧬", color: "green", chapters: 2, progress: 75 },
  ]

  const demoChapters = {
    Mathématiques: [
      {
        id: 101,
        name: "Algèbre Linéaire",
        difficulty: "Difficile",
        revisions: 2,
        timeSpent: 90,
        knowledge: 60,
        content: `L'algèbre linéaire est la branche des mathématiques qui s'intéresse à l'étude des vecteurs, des espaces vectoriels (également appelés espaces linéaires), des transformations linéaires (également appelées applications linéaires ou opérateurs linéaires) et des systèmes d'équations linéaires. Les vecteurs sont des éléments qui peuvent être additionnés entre eux et multipliés par des scalaires. Les espaces vectoriels sont des collections de vecteurs qui satisfont à certains axiomes. Les transformations linéaires sont des fonctions qui préservent l'addition des vecteurs et la multiplication par un scalaire. Les matrices sont des outils fondamentaux en algèbre linéaire pour représenter les transformations linéaires et résoudre les systèmes d'équations.`,
      },
      {
        id: 102,
        name: "Calcul Différentiel",
        difficulty: "Moyen",
        revisions: 3,
        timeSpent: 120,
        knowledge: 75,
        content: `Le calcul différentiel est une branche des mathématiques qui étudie les taux de changement des fonctions. Il s'agit de l'une des deux branches traditionnelles du calcul, l'autre étant le calcul intégral. Le concept central du calcul différentiel est la dérivée d'une fonction. La dérivée d'une fonction en un point donné représente la pente de la tangente à la courbe de la fonction à ce point, ou le taux de changement instantané de la fonction. Les dérivées sont utilisées pour trouver les maxima et minima des fonctions, pour analyser le mouvement, et pour modéliser des phénomènes physiques et économiques.`,
      },
      {
        id: 103,
        name: "Probabilités",
        difficulty: "Facile",
        revisions: 1,
        timeSpent: 45,
        knowledge: 80,
        content: `Les probabilités sont une branche des mathématiques qui étudie le hasard et l'incertitude. Elles fournissent un cadre pour quantifier la vraisemblance d'événements. Un événement est un ensemble de résultats possibles d'une expérience aléatoire. La probabilité d'un événement est un nombre entre 0 et 1, où 0 signifie que l'événement est impossible et 1 signifie qu'il est certain. Les concepts clés incluent l'espace des événements, les événements mutuellement exclusifs, les événements indépendants, et les probabilités conditionnelles. Les probabilités sont largement utilisées en statistique, en finance, en science des données et dans de nombreux autres domaines.`,
      },
    ],
    Physique: [
      {
        id: 201,
        name: "Mécanique Classique",
        difficulty: "Moyen",
        revisions: 2,
        timeSpent: 100,
        knowledge: 70,
        content: `La mécanique classique est une théorie physique décrivant le mouvement des corps macroscopiques, depuis les projectiles jusqu'aux parties de machines, ainsi que les objets astronomiques, tels que les vaisseaux spatiaux, les planètes, les étoiles et les galaxies. Elle est l'une des plus anciennes et des plus vastes branches de la physique, et elle est basée sur les lois du mouvement de Newton et la loi de la gravitation universelle. Les concepts fondamentaux incluent la force, la masse, l'accélération, l'énergie cinétique et potentielle, et le moment.`,
      },
      {
        id: 202,
        name: "Électromagnétisme",
        difficulty: "Difficile",
        revisions: 1,
        timeSpent: 80,
        knowledge: 60,
        content: `L'électromagnétisme est la branche de la physique qui étudie les interactions entre les champs électriques et les champs magnétiques. Ces deux champs ne sont pas indépendants mais sont les deux facettes d'un même phénomène : le champ électromagnétique. Les lois de l'électromagnétisme sont résumées par les équations de Maxwell, qui décrivent comment les champs électriques et magnétiques sont générés par des charges et des courants, et comment ils se propagent dans l'espace. L'électromagnétisme est à la base de nombreuses technologies modernes, y compris l'électricité, l'électronique, les communications sans fil et l'optique.`,
      },
    ],
    Histoire: [
      {
        id: 301,
        name: "Révolution Française",
        difficulty: "Facile",
        revisions: 3,
        timeSpent: 70,
        knowledge: 85,
        content: `La Révolution française est une période de bouleversements sociaux et politiques majeurs en France, qui a duré de 1789 à 1799. Elle a mis fin à la monarchie absolue et à la société d'ordres, et a conduit à l'établissement de la Première République. Les causes incluent des problèmes économiques, des inégalités sociales et l'influence des idées des Lumières. Des événements clés sont la prise de la Bastille, la Déclaration des Droits de l'Homme et du Citoyen, la Terreur et le coup d'État de Napoléon Bonaparte.`,
      },
      {
        id: 302,
        name: "Guerres Mondiales",
        difficulty: "Moyen",
        revisions: 2,
        timeSpent: 110,
        knowledge: 65,
        content: `Les Guerres Mondiales désignent principalement la Première Guerre Mondiale (1914-1918) et la Seconde Guerre Mondiale (1939-1945). La Première Guerre Mondiale a été déclenchée par des tensions impérialistes et nationalistes en Europe, et a vu l'introduction de nouvelles technologies militaires. La Seconde Guerre Mondiale, encore plus dévastatrice, a impliqué des idéologies totalitaires et a culminé avec l'Holocauste et l'utilisation de la bombe atomique. Ces conflits ont profondément remodelé la carte politique mondiale et ont eu un impact durable sur la société.`,
      },
      {
        id: 303,
        name: "Antiquité Romaine",
        difficulty: "Difficile",
        revisions: 1,
        timeSpent: 90,
        knowledge: 55,
        content: `L'Antiquité Romaine couvre la période de l'histoire de Rome, de sa fondation légendaire en 753 av. J.-C. à la chute de l'Empire Romain d'Occident en 476 ap. J.-C. Elle est divisée en trois grandes périodes : la Monarchie, la République et l'Empire. Rome a développé un vaste empire grâce à sa puissance militaire et son organisation politique et administrative. Sa culture, son droit, son architecture et sa langue (le latin) ont eu une influence considérable sur la civilisation occidentale.`,
      },
      {
        id: 304,
        name: "Moyen Âge",
        difficulty: "Moyen",
        revisions: 0,
        timeSpent: 0,
        knowledge: 40,
        content: `Le Moyen Âge est la période de l'histoire européenne qui s'étend de la chute de l'Empire Romain d'Occident (476 ap. J.-C.) à la Renaissance (vers le XVe siècle). Cette période est souvent divisée en Haut Moyen Âge, Moyen Âge Central et Bas Moyen Âge. Elle est caractérisée par l'émergence du féodalisme, l'influence dominante de l'Église chrétienne, les croisades, la construction de cathédrales, et le développement des premières universités.`,
      },
    ],
    Biologie: [
      {
        id: 401,
        name: "La Cellule",
        difficulty: "Facile",
        revisions: 2,
        timeSpent: 60,
        knowledge: 90,
        content: `La cellule est l'unité fondamentale de la vie. Il existe deux types principaux de cellules : les cellules procaryotes (sans noyau défini, comme les bactéries) et les cellules eucaryotes (avec un noyau et des organites, comme les cellules animales et végétales). Chaque cellule contient du matériel génétique (ADN), une membrane plasmique qui la sépare de son environnement, et un cytoplasme où se déroulent les réactions chimiques essentielles à la vie. Les organites comme les mitochondries (production d'énergie) et le réticulum endoplasmique (synthèse de protéines et lipides) ont des fonctions spécifiques.`,
      },
      {
        id: 402,
        name: "Génétique",
        difficulty: "Difficile",
        revisions: 1,
        timeSpent: 100,
        knowledge: 50,
        content: `La génétique est la science de l'hérédité et de la variation des êtres vivants. Elle étudie comment les caractéristiques sont transmises des parents à la progéniture. L'ADN (acide désoxyribonucléique) est la molécule qui porte l'information génétique sous forme de gènes. Un gène est un segment d'ADN qui code pour une protéine ou une fonction spécifique. Les concepts clés incluent la réplication de l'ADN, la transcription (ADN en ARN), la traduction (ARN en protéine), les mutations, et les lois de Mendel sur l'hérédité.`,
      },
    ],
  }

  // Generate events for the current week and next week for demo
  const today = new Date()
  const currentDayOfWeek = today.getDay() // 0 for Sunday, 1 for Monday
  const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek // Days to subtract to get to Monday

  const mondayThisWeek = new Date(today)
  mondayThisWeek.setDate(today.getDate() + diffToMonday)
  mondayThisWeek.setHours(0, 0, 0, 0)

  const mondayNextWeek = new Date(mondayThisWeek)
  mondayNextWeek.setDate(mondayThisWeek.getDate() + 7)

  const formatDateForEvent = (date: Date) => date.toISOString().split("T")[0]

  const demoEvents = [
    // This week
    {
      id: 1,
      title: "Révision Algèbre",
      subject: "Mathématiques",
      date: formatDateForEvent(
        new Date(mondayThisWeek.getFullYear(), mondayThisWeek.getMonth(), mondayThisWeek.getDate() + 1),
      ), // Tuesday
      startTime: "10:00",
      endTime: "11:30",
      color: "bg-blue-500",
      type: "revision",
    },
    {
      id: 2,
      title: "Cours Électromagnétisme",
      subject: "Physique",
      date: formatDateForEvent(
        new Date(mondayThisWeek.getFullYear(), mondayThisWeek.getMonth(), mondayThisWeek.getDate() + 2),
      ), // Wednesday
      startTime: "14:00",
      endTime: "16:00",
      color: "bg-green-500",
      type: "cours",
    },
    {
      id: 3,
      title: "Examen Histoire",
      subject: "Histoire",
      date: formatDateForEvent(
        new Date(mondayThisWeek.getFullYear(), mondayThisWeek.getMonth(), mondayThisWeek.getDate() + 4),
      ), // Friday
      startTime: "09:00",
      endTime: "12:00",
      color: "bg-red-500",
      type: "examen",
    },
    {
      id: 4,
      title: "Révision Biologie",
      subject: "Biologie",
      date: formatDateForEvent(
        new Date(mondayThisWeek.getFullYear(), mondayThisWeek.getMonth(), mondayThisWeek.getDate() + 0),
      ), // Monday
      startTime: "16:00",
      endTime: "17:00",
      color: "bg-blue-500",
      type: "revision",
    },
    // Next week
    {
      id: 5,
      title: "Cours de Génétique",
      subject: "Biologie",
      date: formatDateForEvent(
        new Date(mondayNextWeek.getFullYear(), mondayNextWeek.getMonth(), mondayNextWeek.getDate() + 1),
      ), // Next Tuesday
      startTime: "09:00",
      endTime: "10:30",
      color: "bg-green-500",
      type: "cours",
    },
    {
      id: 6,
      title: "Révision Probabilités",
      subject: "Mathématiques",
      date: formatDateForEvent(
        new Date(mondayNextWeek.getFullYear(), mondayNextWeek.getMonth(), mondayNextWeek.getDate() + 3),
      ), // Next Thursday
      startTime: "13:00",
      endTime: "14:00",
      color: "bg-blue-500",
      type: "revision",
    },
  ]

  const demoSessions = [
    {
      id: 1,
      subject: "Mathématiques",
      chapter: "Algèbre Linéaire",
      duration: 3600,
      feedback: "moyen",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2).toISOString(), // 2 days ago
    },
    {
      id: 2,
      subject: "Physique",
      chapter: "Mécanique Classique",
      duration: 2700,
      feedback: "facile",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1).toISOString(), // 1 day ago
    },
    {
      id: 3,
      subject: "Histoire",
      chapter: "Révolution Française",
      duration: 1800,
      feedback: "difficile",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString(), // Today
    },
  ]

  localStorage.setItem("isLoggedIn", "true")
  localStorage.setItem("userEmail", demoUser.email)
  localStorage.setItem("isDemoMode", "true")
  localStorage.setItem("users", JSON.stringify([demoUser]))
  localStorage.setItem("subjects", JSON.stringify(demoSubjects))
  localStorage.setItem("events", JSON.stringify(demoEvents))
  localStorage.setItem("sessions", JSON.stringify(demoSessions))

  // Save chapters per subject
  for (const subjectName in demoChapters) {
    localStorage.setItem(
      `chapters_${subjectName}`,
      JSON.stringify(demoChapters[subjectName as keyof typeof demoChapters]),
    )
  }
}

export const clearDemoData = () => {
  localStorage.removeItem("isLoggedIn")
  localStorage.removeItem("userEmail")
  localStorage.removeItem("isDemoMode")
  localStorage.removeItem("users")
  localStorage.removeItem("subjects")
  localStorage.removeItem("events")
  localStorage.removeItem("sessions")
  // Clear all chapter data
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("chapters_")) {
      localStorage.removeItem(key)
    }
  })
}
