import type { Course } from "./types";

export const courses: Course[] = [
  {
    id: "foundations",
    art: "dawn",
    title: { en: "The seven‑day beginning", es: "Siete días para empezar" },
    subtitle: { en: "A gentle foundation in meditation", es: "Una base amable en la meditación" },
    description: {
      en: "One short practice a day for a week. No perfect posture, no empty mind required. Just a small appointment with yourself.",
      es: "Una práctica corta al día durante una semana. No hace falta una postura perfecta ni una mente vacía. Solo una pequeña cita contigo.",
    },
    days: [
      {
        title: { en: "Arrive", es: "Llegar" },
        sessionId: "morning-tide",
        note: {
          en: "Start with five minutes and one word for the day.",
          es: "Empieza con cinco minutos y una palabra para el día.",
        },
      },
      {
        title: { en: "Pause in the middle", es: "Pausar en el medio" },
        sessionId: "midday-reset",
        note: {
          en: "A two-minute reset between tasks.",
          es: "Un reinicio de dos minutos entre tareas.",
        },
      },
      {
        title: { en: "Follow the breath", es: "Seguir la respiración" },
        sessionId: "ocean-breath",
        note: {
          en: "Learn a longer exhale you can use anywhere.",
          es: "Aprende una exhalación más larga para usar en cualquier lugar.",
        },
      },
      {
        title: { en: "Move slowly", es: "Moverse despacio" },
        sessionId: "walking",
        note: {
          en: "Take the practice off the cushion and into the world.",
          es: "Lleva la práctica fuera del cojín y al mundo.",
        },
      },
      {
        title: { en: "Notice what is good", es: "Notar lo bueno" },
        sessionId: "gratitude-glow",
        note: {
          en: "Three ordinary things, warmed by attention.",
          es: "Tres cosas cotidianas, calentadas por la atención.",
        },
      },
      {
        title: { en: "Soften the voice", es: "Suavizar la voz" },
        sessionId: "self-kindness",
        note: {
          en: "Practice the tone you would use with a friend.",
          es: "Practica el tono que usarías con un amigo.",
        },
      },
      {
        title: { en: "Rest completely", es: "Descansar por completo" },
        sessionId: "full-body-unwind",
        note: {
          en: "Close the week with a full body scan.",
          es: "Cierra la semana con un escaneo corporal completo.",
        },
      },
    ],
  },
  {
    id: "sleep-reset",
    art: "night",
    title: { en: "Sleep, softly", es: "Dormir, suavemente" },
    subtitle: { en: "Seven nights to a slower evening", es: "Siete noches hacia una tarde más lenta" },
    description: {
      en: "A week of winding down. Learn what your body needs at the end of the day, and borrow a little structure without turning bedtime into a project.",
      es: "Una semana de desaceleración. Aprende lo que tu cuerpo necesita al final del día y toma prestada un poco de estructura sin convertir la hora de dormir en un proyecto.",
    },
    days: [
      {
        title: { en: "Put the day down", es: "Bajar el día" },
        sessionId: "evening-release",
        note: {
          en: "Review gently. Leave what can wait.",
          es: "Repasa con suavidad. Deja lo que puede esperar.",
        },
      },
      {
        title: { en: "Let the body lead", es: "Deja que el cuerpo guíe" },
        sessionId: "full-body-unwind",
        note: {
          en: "A slow scan from head to toe.",
          es: "Un recorrido lento de la cabeza a los pies.",
        },
      },
      {
        title: { en: "Drift", es: "Deriva" },
        sessionId: "deep-sleep",
        note: {
          en: "The full bedtime practice, with the lights low.",
          es: "La práctica completa para dormir, con las luces bajas.",
        },
      },
      {
        title: { en: "A grey-day kindness", es: "Amabilidad para un día gris" },
        sessionId: "rainy-reset",
        note: {
          en: "For nights when the mind is heavy.",
          es: "Para las noches en que la mente pesa.",
        },
      },
      {
        title: { en: "A story for small listeners", es: "Un cuento para pequeños oyentes" },
        sessionId: "little-cloud",
        note: {
          en: "Share it, or keep it for yourself.",
          es: "Compártelo, o guárdalo para ti.",
        },
      },
      {
        title: { en: "Stay with the sound", es: "Quédate con el sonido" },
        sessionId: "ocean-at-dusk",
        note: {
          en: "No guidance. Just waves and a sleep timer.",
          es: "Sin guía. Solo olas y un temporizador.",
        },
      },
      {
        title: { en: "A softer landing", es: "Un aterrizaje más suave" },
        sessionId: "night-garden",
        note: {
          en: "Let the night garden take it from here.",
          es: "Deja que el jardín nocturno siga desde aquí.",
        },
      },
    ],
  },
  {
    id: "soften-anxiety",
    art: "rain",
    title: { en: "Soften the spiral", es: "Suavizar la espiral" },
    subtitle: { en: "Five practices for a racing mind", es: "Cinco prácticas para una mente acelerada" },
    description: {
      en: "Not a cure, and not a substitute for care. A set of small, concrete practices to use when anxiety takes up more room than you would like.",
      es: "No es una cura ni un sustituto de la atención profesional. Un conjunto de prácticas pequeñas y concretas para cuando la ansiedad ocupa más espacio del que quisieras.",
    },
    days: [
      {
        title: { en: "Come back to the room", es: "Vuelve a la habitación" },
        sessionId: "anxiety-sos",
        note: {
          en: "Three minutes of grounding through the senses.",
          es: "Tres minutos de anclaje a través de los sentidos.",
        },
      },
      {
        title: { en: "Lengthen the exhale", es: "Alarga la exhalación" },
        sessionId: "ocean-breath",
        note: {
          en: "A rhythmic breath with a longer letting-go.",
          es: "Una respiración rítmica con un soltar más largo.",
        },
      },
      {
        title: { en: "Change the tone", es: "Cambia el tono" },
        sessionId: "self-kindness",
        note: {
          en: "The inner critic is not the only voice available.",
          es: "El crítico interior no es la única voz disponible.",
        },
      },
      {
        title: { en: "Let the weather be", es: "Deja que el clima sea" },
        sessionId: "rainy-reset",
        note: {
          en: "Stop fighting the grey and borrow its rhythm.",
          es: "Deja de pelear con el gris y toma prestado su ritmo.",
        },
      },
      {
        title: { en: "Leave the day behind", es: "Deja el día atrás" },
        sessionId: "evening-release",
        note: {
          en: "A gentle end-of-day review.",
          es: "Un repaso suave del final del día.",
        },
      },
    ],
  },
  {
    id: "focus-ritual",
    art: "sand",
    title: { en: "The focus ritual", es: "El ritual del foco" },
    subtitle: { en: "Five days of clearer attention", es: "Cinco días de atención más clara" },
    description: {
      en: "Attention is not a switch. It is a practice of leaving and returning. Build a small ritual around the work that matters this week.",
      es: "La atención no es un interruptor. Es una práctica de irse y volver. Construye un pequeño ritual alrededor del trabajo que importa esta semana.",
    },
    days: [
      {
        title: { en: "Clear the desk", es: "Despeja el escritorio" },
        sessionId: "focus-primer",
        note: {
          en: "Choose one thing before you open anything.",
          es: "Elige una cosa antes de abrir nada.",
        },
      },
      {
        title: { en: "Stand behind your voice", es: "Sostén tu voz" },
        sessionId: "courage-speak",
        note: {
          en: "For the meeting you are already thinking about.",
          es: "Para la reunión que ya estás pensando.",
        },
      },
      {
        title: { en: "Begin before the noise", es: "Empieza antes del ruido" },
        sessionId: "morning-tide",
        note: {
          en: "Five minutes before the inbox.",
          es: "Cinco minutos antes de la bandeja de entrada.",
        },
      },
      {
        title: { en: "One honest pause", es: "Una pausa honesta" },
        sessionId: "midday-reset",
        note: {
          en: "Two minutes between the morning and the afternoon.",
          es: "Dos minutos entre la mañana y la tarde.",
        },
      },
      {
        title: { en: "Settle the system", es: "Asienta el sistema" },
        sessionId: "focus-rain",
        note: {
          en: "A 25-minute sound block for one real task.",
          es: "Un bloque de sonido de 25 minutos para una tarea real.",
        },
      },
    ],
  },
  {
    id: "kindness",
    art: "meadow",
    title: { en: "A softer inner world", es: "Un mundo interior más suave" },
    subtitle: { en: "Five days of self-compassion", es: "Cinco días de autocompasión" },
    description: {
      en: "For people who are very good at being kind to everyone else. A week of turning some of that generosity inward.",
      es: "Para quienes son muy buenos siendo amables con los demás. Una semana de girar parte de esa generosidad hacia dentro.",
    },
    days: [
      {
        title: { en: "Speak as a friend", es: "Habla como un amigo" },
        sessionId: "self-kindness",
        note: {
          en: "Borrow the tone you use with someone you love.",
          es: "Toma prestado el tono que usas con alguien que amas.",
        },
      },
      {
        title: { en: "Warm the ordinary", es: "Calienta lo cotidiano" },
        sessionId: "gratitude-glow",
        note: {
          en: "Three small things, without denying the hard.",
          es: "Tres cosas pequeñas, sin negar lo difícil.",
        },
      },
      {
        title: { en: "Walk without proving", es: "Camina sin demostrar" },
        sessionId: "walking",
        note: {
          en: "No pace to keep. No one to impress.",
          es: "Sin ritmo que seguir. Sin nadie a quien impresionar.",
        },
      },
      {
        title: { en: "A story for the small self", es: "Un cuento para el yo pequeño" },
        sessionId: "little-cloud",
        note: {
          en: "Sometimes the child in us needs the story too.",
          es: "A veces el niño dentro de nosotros también necesita el cuento.",
        },
      },
      {
        title: { en: "Put the day down", es: "Baja el día" },
        sessionId: "evening-release",
        note: {
          en: "You do not have to earn your rest.",
          es: "No tienes que ganarte el descanso.",
        },
      },
    ],
  },
  {
    id: "three-day-reset",
    art: "mountain",
    title: { en: "Three-day reset", es: "Reinicio de tres días" },
    subtitle: { en: "A small return when life is loud", es: "Un pequeño regreso cuando la vida es ruidosa" },
    description: {
      en: "When you have three days and not three weeks. One practice each day: ground, close, and rest.",
      es: "Cuando tienes tres días y no tres semanas. Una práctica cada día: ancla, cierra y descansa.",
    },
    days: [
      {
        title: { en: "Ground", es: "Ancla" },
        sessionId: "anxiety-sos",
        note: {
          en: "Start with what is concrete.",
          es: "Empieza por lo concreto.",
        },
      },
      {
        title: { en: "Close", es: "Cierra" },
        sessionId: "unwind-work",
        note: {
          en: "Make a clean line between work and your own time.",
          es: "Traza una línea clara entre el trabajo y tu tiempo.",
        },
      },
      {
        title: { en: "Rest", es: "Descansa" },
        sessionId: "deep-sleep",
        note: {
          en: "Let the body take the last word.",
          es: "Deja que el cuerpo tenga la última palabra.",
        },
      },
    ],
  },
];

export const courseById = new Map(courses.map((course) => [course.id, course]));
