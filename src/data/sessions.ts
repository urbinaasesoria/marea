import type { Session } from "./types";

/**
 * All practices are original Marea content, written for this product.
 * They are intentionally non-clinical: they support rest and attention,
 * and never replace medical or mental-health care.
 */
export const sessions: Session[] = [
  {
    id: "morning-tide",
    category: "meditation",
    kind: "guided",
    minutes: 5,
    level: "beginner",
    art: "dawn",
    featured: true,
    soundPreset: "dawn-mist",
    title: { en: "Morning tide", es: "Marea de la mañana" },
    subtitle: { en: "Begin before the day begins", es: "Empieza antes de que empiece el día" },
    description: {
      en: "A gentle five-minute arrival. Set down the night, notice what is already here, and choose one word to carry into the day.",
      es: "Una llegada suave de cinco minutos. Suelta la noche, nota lo que ya está aquí y elige una palabra para llevar contigo.",
    },
    tags: [
      { en: "Morning", es: "Mañana" },
      { en: "Intention", es: "Intención" },
      { en: "5 min", es: "5 min" },
    ],
    steps: [
      {
        seconds: 25,
        text: {
          en: "Find a seat that lets your spine feel tall and your shoulders feel heavy. Let your hands rest wherever they are comfortable.",
          es: "Encuentra una postura en la que la espalda se sienta alta y los hombros pesados. Deja las manos donde estén cómodas.",
        },
      },
      {
        seconds: 35,
        bell: true,
        text: {
          en: "Close your eyes, or soften your gaze toward the floor. Take one slow breath in through your nose... and let it go with a long sigh.",
          es: "Cierra los ojos o suaviza la mirada hacia el suelo. Toma un aire lento por la nariz... y suéltalo con un suspiro largo.",
        },
      },
      {
        seconds: 45,
        text: {
          en: "Notice the first place your attention lands. Maybe it is the cool air at your nostrils, or the weight of your body in the chair. There is no right place. Just this one.",
          es: "Nota el primer lugar donde llega tu atención. Quizá el aire fresco en la nariz o el peso del cuerpo en la silla. No hay un lugar correcto. Solo este.",
        },
      },
      {
        seconds: 45,
        text: {
          en: "Now widen your attention to the room around you. Sounds arriving and leaving. Light on your eyelids. You do not have to name any of it. Simply let it be here.",
          es: "Ahora amplía la atención a la habitación. Los sonidos que llegan y se van. La luz en los párpados. No tienes que nombrar nada. Deja que esté aquí.",
        },
      },
      {
        seconds: 50,
        text: {
          en: "Ask yourself quietly: what would make today feel a little more spacious? Do not search for an answer. Let the question sit like a stone in a clear stream.",
          es: "Pregúntate en voz baja: ¿qué haría que el día de hoy se sintiera un poco más amplio? No busques una respuesta. Deja la pregunta posarse como una piedra en un arroyo claro.",
        },
      },
      {
        seconds: 50,
        text: {
          en: "Perhaps a word arrives: patience. Softness. Enough. If a word feels right, hold it gently. If nothing comes, that is welcome too.",
          es: "Quizá llegue una palabra: paciencia. Suavidad. Suficiente. Si una palabra se siente bien, sostenla con cuidado. Si no llega ninguna, también está bien.",
        },
      },
      {
        seconds: 45,
        text: {
          en: "Bring to mind one small thing you are looking forward to today. A cup of coffee. A conversation. The light at the end of the afternoon. Let yourself feel it for a moment.",
          es: "Trae a la mente algo pequeño que esperas con ganas hoy. Una taza de café. Una conversación. La luz al final de la tarde. Permítete sentirlo un momento.",
        },
      },
      {
        seconds: 25,
        bell: true,
        text: {
          en: "Take one more full breath. As you exhale, let the day begin without rushing it. When you are ready, open your eyes.",
          es: "Toma un último aire completo. Al exhalar, deja que el día empiece sin prisa. Cuando quieras, abre los ojos.",
        },
      },
    ],
  },
  {
    id: "unhook-stress",
    category: "meditation",
    kind: "guided",
    minutes: 10,
    level: "all",
    art: "mountain",
    soundPreset: "still-lake",
    title: { en: "Unhook from stress", es: "Suelta el estrés" },
    subtitle: { en: "Put down what you are carrying", es: "Deja lo que estás cargando" },
    description: {
      en: "A longer practice for a full head and a tight chest. We will let the body lead, soften the grip of thoughts, and practice coming back.",
      es: "Una práctica más larga para una cabeza llena y el pecho apretado. Dejaremos que el cuerpo guíe, aflojaremos el agarre de los pensamientos y practicaremos el regreso.",
    },
    tags: [
      { en: "Stress", es: "Estrés" },
      { en: "Body scan", es: "Escaneo corporal" },
      { en: "10 min", es: "10 min" },
    ],
    steps: [
      {
        seconds: 45,
        text: {
          en: "Sit or lie down in a way that lets your body be fully held. Let the surface beneath you take your weight. You do not have to hold yourself up for these few minutes.",
          es: "Siéntate o recuéstate de una forma en la que el cuerpo esté completamente sostenido. Deja que la superficie bajo ti reciba tu peso. No tienes que sostenerte durante estos minutos.",
        },
      },
      {
        seconds: 60,
        bell: true,
        text: {
          en: "Take three slow breaths. On each exhale, imagine your shoulders sliding a little further away from your ears. Nothing to fix. Just a little more room.",
          es: "Toma tres respiraciones lentas. En cada exhalación, imagina que los hombros se alejan un poco más de las orejas. Nada que arreglar. Solo un poco más de espacio.",
        },
      },
      {
        seconds: 70,
        text: {
          en: "Bring your attention to your jaw. Notice if it is set, or working quietly. Let your tongue rest at the bottom of your mouth. Allow the jaw to be soft.",
          es: "Lleva la atención a la mandíbula. Nota si está apretada o trabajando en silencio. Deja la lengua descansar en la parte baja de la boca. Permite que la mandíbula se ablande.",
        },
      },
      {
        seconds: 70,
        text: {
          en: "Now the belly. Place a hand there if that feels kind. Feel it rise and fall on its own. The breath does not need your management. It only needs your company.",
          es: "Ahora el abdomen. Coloca una mano ahí si se siente amable. Siente cómo sube y baja por sí solo. La respiración no necesita que la administres. Solo necesita tu compañía.",
        },
      },
      {
        seconds: 70,
        text: {
          en: "A thought may arrive about everything you still have to do. Instead of following it, label it softly: planning. Then come back to the next breath. And the next.",
          es: "Puede llegar un pensamiento sobre todo lo que aún tienes que hacer. En lugar de seguirlo, nómbralo con suavidad: planear. Luego vuelve a la siguiente respiración. Y a la siguiente.",
        },
      },
      {
        seconds: 70,
        text: {
          en: "If your mind has wandered, that is not a mistake. The moment you notice is the practice. Return without a story about how you should be doing this better.",
          es: "Si tu mente se ha ido, no es un error. El momento en que lo notas es la práctica. Regresa sin una historia sobre cómo deberías estar haciéndolo mejor.",
        },
      },
      {
        seconds: 75,
        text: {
          en: "Let your attention rest in the space around your heart. You might silently say: this is hard, and I am here. No need to solve it. Just a moment of honesty and company.",
          es: "Deja que la atención descanse en el espacio alrededor del corazón. Puedes decir en silencio: esto es difícil, y estoy aquí. No hace falta resolverlo. Solo un momento de honestidad y compañía.",
        },
      },
      {
        seconds: 65,
        text: {
          en: "Feel your feet, your hands, the back of your body. The breath is slower now, or maybe not. Either is fine. You are not performing calm. You are making room for what is real.",
          es: "Siente los pies, las manos, la parte posterior del cuerpo. La respiración está más lenta ahora, o quizá no. Cualquiera está bien. No estás interpretando la calma. Estás haciendo espacio para lo real.",
        },
      },
      {
        seconds: 55,
        text: {
          en: "Before you move, notice one thing that feels even slightly less tight than when you began. A jaw. A shoulder. A thought you are no longer holding quite so tightly.",
          es: "Antes de moverte, nota una cosa que se sienta aunque sea un poco menos apretada que al principio. Una mandíbula. Un hombro. Un pensamiento que ya no sostienes con tanta fuerza.",
        },
      },
      {
        seconds: 20,
        bell: true,
        text: {
          en: "Take a slow breath in. Let it out with a sigh. Return to your day carrying a little less. When you are ready, open your eyes.",
          es: "Toma un aire lento. Suéltalo con un suspiro. Vuelve a tu día cargando un poco menos. Cuando quieras, abre los ojos.",
        },
      },
    ],
  },
  {
    id: "anxiety-sos",
    category: "meditation",
    kind: "guided",
    minutes: 3,
    level: "beginner",
    art: "rain",
    featured: true,
    soundPreset: "soft-rain",
    title: { en: "Anxiety SOS", es: "SOS ansiedad" },
    subtitle: { en: "Three minutes to come back", es: "Tres minutos para volver" },
    description: {
      en: "When the mind is racing, small and concrete is kinder than big and philosophical. Ground through the senses, then breathe with a longer exhale.",
      es: "Cuando la mente corre, lo pequeño y concreto es más amable que lo grande y filosófico. Ancla los sentidos y luego respira con una exhalación más larga.",
    },
    tags: [
      { en: "Anxiety", es: "Ansiedad" },
      { en: "Grounding", es: "Anclaje" },
      { en: "3 min", es: "3 min" },
    ],
    steps: [
      {
        seconds: 20,
        text: {
          en: "You are here. Whatever brought you to this moment, you do not have to explain it. Let your feet press gently into the ground.",
          es: "Estás aquí. Lo que sea que te haya traído a este momento, no tienes que explicarlo. Presiona suavemente los pies contra el suelo.",
        },
      },
      {
        seconds: 30,
        text: {
          en: "Look around and name three things you can see. Let your eyes rest on each one, even for a second. You are telling your body where you are.",
          es: "Mira a tu alrededor y nombra tres cosas que puedes ver. Deja que los ojos descansen en cada una, aunque sea un segundo. Le estás diciendo a tu cuerpo dónde estás.",
        },
      },
      {
        seconds: 30,
        text: {
          en: "Now two things you can hear. Maybe a hum, a voice, the sound of your own breath. Let the sounds come to you instead of reaching for them.",
          es: "Ahora dos cosas que puedes oír. Quizá un zumbido, una voz, el sonido de tu propia respiración. Deja que los sonidos vengan a ti en lugar de buscarlos.",
        },
      },
      {
        seconds: 30,
        bell: true,
        text: {
          en: "Breathe in through your nose for four. Hold for four. Breathe out slowly for six. Again: in for four... hold... out for six.",
          es: "Inhala por la nariz cuatro tiempos. Sostén cuatro. Exhala despacio seis. Otra vez: inhala cuatro... sostén... exhala seis.",
        },
      },
      {
        seconds: 30,
        text: {
          en: "One more round. A longer exhale is a gentle signal to the body that it is safe enough to soften. In for four... hold... and out for six.",
          es: "Una ronda más. Una exhalación más larga es una señal suave de que es suficientemente seguro ablandarse. Inhala cuatro... sostén... y exhala seis.",
        },
      },
      {
        seconds: 30,
        text: {
          en: "Now let the breath be natural. Feel the place where your body meets the ground, the chair, the bed. You are supported right now.",
          es: "Ahora deja que la respiración sea natural. Siente el lugar donde tu cuerpo se encuentra con el suelo, la silla, la cama. Estás sostenido ahora mismo.",
        },
      },
      {
        seconds: 20,
        bell: true,
        text: {
          en: "You do not have to feel calm to be okay. You only have to be here. Take one more breath, and carry this steadiness with you.",
          es: "No tienes que sentirte en calma para estar bien. Solo tienes que estar aquí. Toma un último aire y lleva contigo esta estabilidad.",
        },
      },
    ],
  },
  {
    id: "deep-sleep",
    category: "sleep",
    kind: "guided",
    minutes: 12,
    level: "all",
    art: "night",
    featured: true,
    soundPreset: "night-garden-bed",
    title: { en: "Drift into sleep", es: "Deriva al descanso" },
    subtitle: { en: "Let the day dissolve", es: "Deja que el día se disuelva" },
    description: {
      en: "A slow descent for bedtime. We release the day from the body, one region at a time, and leave the mind with somewhere gentle to land.",
      es: "Un descenso lento para la hora de dormir. Soltamos el día del cuerpo, una zona a la vez, y le damos a la mente un lugar suave donde posarse.",
    },
    tags: [
      { en: "Sleep", es: "Dormir" },
      { en: "Body scan", es: "Escaneo corporal" },
      { en: "12 min", es: "12 min" },
    ],
    steps: [
      {
        seconds: 55,
        text: {
          en: "Lie down and let the bed take all of your weight. There is nothing left to hold. Let your arms rest away from your body, palms turned gently upward.",
          es: "Recuéstate y deja que la cama reciba todo tu peso. No queda nada que sostener. Deja los brazos descansar lejos del cuerpo, con las palmas suavemente hacia arriba.",
        },
      },
      {
        seconds: 65,
        bell: true,
        text: {
          en: "Let your eyes close. Feel the small movements of your breath in the belly. No need to deepen it. Just let it be a little slower than the day.",
          es: "Cierra los ojos. Siente los pequeños movimientos de la respiración en el abdomen. No hace falta hacerla más profunda. Solo un poco más lenta que el día.",
        },
      },
      {
        seconds: 75,
        text: {
          en: "Bring your attention to your feet. Let them grow heavy. The toes, the soles, the ankles. Whatever happened today, your feet carried you through it.",
          es: "Lleva la atención a los pies. Deja que se vuelvan pesados. Los dedos, las plantas, los tobillos. Lo que haya pasado hoy, tus pies te sostuvieron.",
        },
      },
      {
        seconds: 75,
        text: {
          en: "Let the heaviness move up through the calves and knees, the long bones of the legs. Let your legs sink into the mattress as if they were made of warm sand.",
          es: "Deja que la pesadez suba por las pantorrillas y las rodillas, los huesos largos de las piernas. Deja que las piernas se hundan en el colchón como si fueran de arena tibia.",
        },
      },
      {
        seconds: 75,
        text: {
          en: "Notice your hips and lower back. This is where many of us carry the day. With each exhale, imagine setting a little of it down. Nothing to protect right now.",
          es: "Nota las caderas y la espalda baja. Aquí es donde muchos cargamos el día. Con cada exhalación, imagina que dejas un poco de eso. Nada que proteger ahora.",
        },
      },
      {
        seconds: 75,
        text: {
          en: "Let the belly soften. The chest. The shoulders. Let them be heavier than they have been all day. The bed is doing the work now.",
          es: "Deja que el abdomen se ablande. El pecho. Los hombros. Déjalos más pesados de lo que han estado todo el día. La cama está haciendo el trabajo ahora.",
        },
      },
      {
        seconds: 75,
        text: {
          en: "Soften your hands, one finger at a time. Then your jaw. The space between your eyebrows. The muscles around your eyes. Let your face forget itself.",
          es: "Ablanda las manos, un dedo a la vez. Luego la mandíbula. El espacio entre las cejas. Los músculos alrededor de los ojos. Deja que la cara se olvide de sí misma.",
        },
      },
      {
        seconds: 80,
        text: {
          en: "If a thought appears, imagine it as a cloud moving across a dark sky. You do not have to follow it or push it away. Let it pass. Return to the weight of your body.",
          es: "Si aparece un pensamiento, imagínalo como una nube que cruza un cielo oscuro. No tienes que seguirlo ni empujarlo. Déjalo pasar. Vuelve al peso de tu cuerpo.",
        },
      },
      {
        seconds: 80,
        text: {
          en: "There is nothing else to do tonight. Tomorrow will arrive when it arrives. For now, you are allowed to rest without earning it. Sleep can take it from here.",
          es: "No hay nada más que hacer esta noche. Mañana llegará cuando llegue. Por ahora, tienes permiso de descansar sin tener que ganártelo. El sueño puede seguir desde aquí.",
        },
      },
      {
        seconds: 45,
        bell: true,
        text: {
          en: "Let the breath breathe you. Let the body be heavy. Let the mind grow quiet. Goodnight.",
          es: "Deja que la respiración te respire. Deja que el cuerpo sea pesado. Deja que la mente se aquiete. Buenas noches.",
        },
      },
    ],
  },
  {
    id: "focus-primer",
    category: "focus",
    kind: "guided",
    minutes: 5,
    level: "all",
    art: "sand",
    soundPreset: "clear-water",
    title: { en: "Clear focus", es: "Foco claro" },
    subtitle: { en: "One task, one breath", es: "Una tarea, una respiración" },
    description: {
      en: "A short pre-work ritual. Clear the residue of the last thing, choose the next thing, and set a boundary around your attention.",
      es: "Un ritual breve antes de trabajar. Limpia el residuo de lo anterior, elige lo siguiente y pon un límite alrededor de tu atención.",
    },
    tags: [
      { en: "Focus", es: "Foco" },
      { en: "Work", es: "Trabajo" },
      { en: "5 min", es: "5 min" },
    ],
    steps: [
      {
        seconds: 30,
        text: {
          en: "Sit at the edge of your chair with both feet on the floor. Let your hands rest open on your lap. You are between one thing and the next.",
          es: "Siéntate al borde de la silla con los pies en el suelo. Deja las manos abiertas sobre el regazo. Estás entre una cosa y la siguiente.",
        },
      },
      {
        seconds: 40,
        bell: true,
        text: {
          en: "Take a slow breath in. As you exhale, imagine clearing the desk of your mind. Not erasing anything. Just pushing the clutter to one side.",
          es: "Toma un aire lento. Al exhalar, imagina que despejas el escritorio de tu mente. No borras nada. Solo empujas el desorden hacia un lado.",
        },
      },
      {
        seconds: 50,
        text: {
          en: "Ask yourself: what is the one thing that would make this hour feel worthwhile? Not the whole day. Just this next stretch of time.",
          es: "Pregúntate: ¿cuál es la única cosa que haría que esta hora valga la pena? No todo el día. Solo este próximo tramo de tiempo.",
        },
      },
      {
        seconds: 50,
        text: {
          en: "Name it silently, in plain words. Then imagine placing it in the center of the space in front of you. Everything else can wait at the edges.",
          es: "Nómbrala en silencio, con palabras sencillas. Luego imagina que la colocas en el centro del espacio frente a ti. Todo lo demás puede esperar en los bordes.",
        },
      },
      {
        seconds: 45,
        text: {
          en: "Notice any urgency to begin. Let the breath be a little longer than the urge. You do not have to start in a hurry to start well.",
          es: "Nota cualquier urgencia por empezar. Deja que la respiración sea un poco más larga que el impulso. No tienes que empezar con prisa para empezar bien.",
        },
      },
      {
        seconds: 40,
        text: {
          en: "Choose one small first action. Open the document. Write the first line. Make the call. Something concrete enough that your body knows what to do.",
          es: "Elige una primera acción pequeña. Abre el documento. Escribe la primera línea. Haz la llamada. Algo lo bastante concreto para que tu cuerpo sepa qué hacer.",
        },
      },
      {
        seconds: 30,
        text: {
          en: "If your attention wanders later, that is not a failure. It is an invitation to return. Each return is a repetition, and repetition is how focus grows.",
          es: "Si más tarde tu atención se va, no es un fracaso. Es una invitación a volver. Cada regreso es una repetición, y la repetición es cómo crece el foco.",
        },
      },
      {
        seconds: 25,
        bell: true,
        text: {
          en: "One more breath. Then begin with the first small thing. The rest can follow.",
          es: "Un último aire. Luego empieza con la primera cosa pequeña. El resto puede seguir.",
        },
      },
    ],
  },
  {
    id: "self-kindness",
    category: "meditation",
    kind: "guided",
    minutes: 8,
    level: "all",
    art: "meadow",
    soundPreset: "meadow-air",
    title: { en: "A kinder voice", es: "Una voz más amable" },
    subtitle: { en: "Speak to yourself as a friend", es: "Háblate como a un amigo" },
    description: {
      en: "A practice for the inner critic. We turn toward the part of you that is trying hard, and offer it the tone you would offer someone you love.",
      es: "Una práctica para el crítico interior. Nos giramos hacia la parte de ti que se esfuerza y le ofrecemos el tono que le darías a alguien que amas.",
    },
    tags: [
      { en: "Self-compassion", es: "Autocompasión" },
      { en: "Healing", es: "Sanación" },
      { en: "8 min", es: "8 min" },
    ],
    steps: [
      {
        seconds: 45,
        text: {
          en: "Let your body settle. Place one hand over your heart and one hand on your belly, if that feels comfortable. Feel the warmth of your own hands.",
          es: "Deja que el cuerpo se asiente. Coloca una mano sobre el corazón y otra en el abdomen, si se siente cómodo. Siente el calor de tus propias manos.",
        },
      },
      {
        seconds: 55,
        bell: true,
        text: {
          en: "Bring to mind a moment when you were hard on yourself. Not the biggest wound. Something ordinary. A mistake, a missed email, a tone you wish you had used.",
          es: "Trae a la mente un momento en el que fuiste duro contigo. No la herida más grande. Algo cotidiano. Un error, un correo olvidado, un tono que desearías haber usado.",
        },
      },
      {
        seconds: 60,
        text: {
          en: "Notice how the moment lives in your body. A tightness, a heat, a sinking. Let it be there without making it bigger. You are not the feeling. You are the one noticing it.",
          es: "Nota cómo vive ese momento en tu cuerpo. Una tensión, un calor, un hundimiento. Déjalo estar sin hacerlo más grande. No eres la emoción. Eres quien la nota.",
        },
      },
      {
        seconds: 65,
        text: {
          en: "Now imagine a friend sitting beside you, telling you exactly what happened. What would you say to them? Perhaps: that sounds really hard. I am sorry. I am here.",
          es: "Ahora imagina que un amigo se sienta a tu lado y te cuenta exactamente lo que pasó. ¿Qué le dirías? Quizá: eso suena muy difícil. Lo siento. Estoy aquí.",
        },
      },
      {
        seconds: 65,
        text: {
          en: "Offer those same words to yourself, silently. Let them be simple. You do not have to believe them completely for them to count. Say: this is hard. I am here.",
          es: "Ofrécele esas mismas palabras a ti mismo, en silencio. Deja que sean sencillas. No tienes que creerlas del todo para que cuenten. Di: esto es difícil. Estoy aquí.",
        },
      },
      {
        seconds: 65,
        text: {
          en: "Add one more phrase if it feels true: may I be gentle with myself. Or: I am allowed to be human. Choose the words that do not feel like a lie.",
          es: "Añade una frase más si se siente verdadera: que pueda ser amable conmigo. O: tengo permiso de ser humano. Elige las palabras que no se sientan como una mentira.",
        },
      },
      {
        seconds: 60,
        text: {
          en: "Notice that you are not doing this alone. Every person you pass today has made mistakes and wished they had done better. Imperfection is not a private shame. It is a shared weather.",
          es: "Nota que no estás haciendo esto solo. Cada persona que cruces hoy ha cometido errores y ha deseado hacerlo mejor. La imperfección no es una vergüenza privada. Es un clima compartido.",
        },
      },
      {
        seconds: 45,
        text: {
          en: "Let the hands on your body be a small anchor. Whenever the inner critic gets loud today, you can return to this gesture, this breath, this tone.",
          es: "Deja que las manos sobre el cuerpo sean un pequeño ancla. Cuando el crítico interior se vuelva ruidoso hoy, puedes volver a este gesto, a esta respiración, a este tono.",
        },
      },
      {
        seconds: 20,
        bell: true,
        text: {
          en: "Take one slow breath. Let your shoulders drop. You are allowed to be a work in progress. When you are ready, open your eyes.",
          es: "Toma un aire lento. Deja caer los hombros. Tienes permiso de ser una obra en proceso. Cuando quieras, abre los ojos.",
        },
      },
    ],
  },
  {
    id: "gratitude-glow",
    category: "meditation",
    kind: "guided",
    minutes: 5,
    level: "beginner",
    art: "ember",
    soundPreset: "warm-light",
    title: { en: "Gratitude glow", es: "Brillo de gratitud" },
    subtitle: { en: "Warm the ordinary", es: "Calienta lo cotidiano" },
    description: {
      en: "Gratitude does not require a perfect life. This practice finds three ordinary things and lets them warm you from the inside.",
      es: "La gratitud no requiere una vida perfecta. Esta práctica encuentra tres cosas cotidianas y deja que te calienten por dentro.",
    },
    tags: [
      { en: "Gratitude", es: "Gratitud" },
      { en: "Evening", es: "Tarde" },
      { en: "5 min", es: "5 min" },
    ],
    steps: [
      {
        seconds: 30,
        text: {
          en: "Sit comfortably and let your eyes close. Take a breath in through your nose, and let it out through your mouth as if you were fogging a window.",
          es: "Siéntate cómodamente y cierra los ojos. Toma aire por la nariz y suéltalo por la boca como si empañaras una ventana.",
        },
      },
      {
        seconds: 45,
        bell: true,
        text: {
          en: "Bring to mind one thing your body did for you today. It carried you, blinked for you, healed something without asking. Thank it silently.",
          es: "Trae a la mente una cosa que tu cuerpo hizo por ti hoy. Te llevó, parpadeó por ti, sanó algo sin pedir permiso. Dále las gracias en silencio.",
        },
      },
      {
        seconds: 50,
        text: {
          en: "Now one person who made your day a little lighter. It does not have to be profound. The person who held a door, sent a message, made you laugh.",
          es: "Ahora una persona que hizo tu día un poco más ligero. No tiene que ser profundo. Quien te sostuvo la puerta, envió un mensaje, te hizo reír.",
        },
      },
      {
        seconds: 50,
        text: {
          en: "One place or thing that gave you comfort. A mug in your hands. A chair. A tree outside your window. Let the feeling of it fill your chest.",
          es: "Un lugar o una cosa que te dio consuelo. Una taza entre las manos. Una silla. Un árbol frente a tu ventana. Deja que la sensación llene el pecho.",
        },
      },
      {
        seconds: 50,
        text: {
          en: "Notice if your mind wants to argue: but there is so much that is hard. You do not have to deny the hard. Gratitude is simply another room in the same house.",
          es: "Nota si tu mente quiere discutir: pero hay tanto que es difícil. No tienes que negar lo difícil. La gratitud es simplemente otra habitación en la misma casa.",
        },
      },
      {
        seconds: 45,
        text: {
          en: "Let the warmth of these three things stay in your body. Maybe it is a softness in the chest, a loosening in the hands, a small smile you did not plan.",
          es: "Deja que el calor de estas tres cosas permanezca en tu cuerpo. Quizá una suavidad en el pecho, un aflojamiento en las manos, una pequeña sonrisa que no planeaste.",
        },
      },
      {
        seconds: 40,
        text: {
          en: "Before you finish, silently offer something back. A wish for someone else to feel this too. May you have a soft place to land today.",
          es: "Antes de terminar, ofrece algo en silencio. Un deseo de que otra persona también lo sienta. Que tengas un lugar suave donde posarte hoy.",
        },
      },
      {
        seconds: 20,
        bell: true,
        text: {
          en: "Take one more breath. Carry this warmth with you. When you are ready, open your eyes.",
          es: "Toma un último aire. Lleva este calor contigo. Cuando quieras, abre los ojos.",
        },
      },
    ],
  },
  {
    id: "ocean-breath",
    category: "breath",
    kind: "guided",
    minutes: 7,
    level: "all",
    art: "ocean",
    soundPreset: "tide-breath",
    title: { en: "Ocean breath", es: "Respiración océano" },
    subtitle: { en: "Let the breath move like water", es: "Deja que el aire se mueva como el agua" },
    description: {
      en: "A rhythmic breathing practice with a long, unforced exhale. Follow the visual tide or simply close your eyes and listen.",
      es: "Una práctica de respiración rítmica con una exhalación larga y sin esfuerzo. Sigue la marea visual o simplemente cierra los ojos y escucha.",
    },
    tags: [
      { en: "Breathwork", es: "Respiración" },
      { en: "Calm", es: "Calma" },
      { en: "7 min", es: "7 min" },
    ],
    steps: [
      {
        seconds: 45,
        text: {
          en: "Sit comfortably with your back supported. Rest one hand on your lower ribs. Let your breath arrive without making it perform.",
          es: "Siéntate cómodamente con la espalda apoyada. Descansa una mano en las costillas bajas. Deja que la respiración llegue sin hacerla actuar.",
        },
      },
      {
        seconds: 50,
        bell: true,
        text: {
          en: "We will breathe in for four, and out for six. The exhale is longer, like a wave pulling back from the shore. Try it with me now.",
          es: "Vamos a inhalar cuatro tiempos y exhalar seis. La exhalación es más larga, como una ola que se retira de la orilla. Prueba conmigo ahora.",
        },
      },
      {
        seconds: 70,
        text: {
          en: "In through the nose, two, three, four... and out through the mouth, two, three, four, five, six. Again, without forcing. Let the next breath be a little smoother.",
          es: "Inhala por la nariz, dos, tres, cuatro... y exhala por la boca, dos, tres, cuatro, cinco, seis. Otra vez, sin forzar. Deja que el siguiente aire sea un poco más suave.",
        },
      },
      {
        seconds: 75,
        text: {
          en: "If you feel light-headed, return to your natural breath. This is not a test. The rhythm is here to support you, not to be perfected.",
          es: "Si te sientes mareado, vuelve a tu respiración natural. Esto no es una prueba. El ritmo está aquí para sostenerte, no para perfeccionarlo.",
        },
      },
      {
        seconds: 80,
        text: {
          en: "Imagine the inhale arriving like water moving up the sand. The exhale returning to the sea. Nothing to hold. Nothing to keep.",
          es: "Imagina que la inhalación llega como el agua que sube por la arena. La exhalación regresa al mar. Nada que retener. Nada que guardar.",
        },
      },
      {
        seconds: 80,
        text: {
          en: "If your mind drifts to a task or a conversation, let it be a wave that passes through. Come back to the hand on your ribs. Feel the body breathe.",
          es: "Si tu mente se va a una tarea o a una conversación, deja que sea una ola que pasa. Vuelve a la mano en las costillas. Siente cómo respira el cuerpo.",
        },
      },
      {
        seconds: 45,
        text: {
          en: "Take three more rounds at your own pace. In for four... out for six. In... out. Let the last exhale be the longest.",
          es: "Toma tres rondas más a tu propio ritmo. Inhala cuatro... exhala seis. Inhala... exhala. Deja que la última exhalación sea la más larga.",
        },
      },
      {
        seconds: 35,
        bell: true,
        text: {
          en: "Let go of the count now. Sit for a moment in the quiet after the tide. Notice how your body feels. When you are ready, open your eyes.",
          es: "Suelta la cuenta ahora. Siéntate un momento en el silencio después de la marea. Nota cómo se siente el cuerpo. Cuando quieras, abre los ojos.",
        },
      },
    ],
  },
  {
    id: "unwind-work",
    category: "meditation",
    kind: "guided",
    minutes: 6,
    level: "all",
    art: "dusk",
    soundPreset: "afterglow",
    title: { en: "Close the workday", es: "Cierra la jornada" },
    subtitle: { en: "Leave work at the door", es: "Deja el trabajo en la puerta" },
    description: {
      en: "A transition ritual for the end of the day. Shake off the pace of work, name what is unfinished, and cross a gentle line into your own time.",
      es: "Un ritual de transición para el final del día. Sacúdete el ritmo del trabajo, nombra lo que queda pendiente y cruza una línea suave hacia tu propio tiempo.",
    },
    tags: [
      { en: "Work", es: "Trabajo" },
      { en: "Transition", es: "Transición" },
      { en: "6 min", es: "6 min" },
    ],
    steps: [
      {
        seconds: 40,
        text: {
          en: "Stand or sit near the door of your workspace. This is the threshold. Before you cross it, take one full breath and let your shoulders drop.",
          es: "Ponte de pie o siéntate cerca de la puerta de tu espacio de trabajo. Este es el umbral. Antes de cruzarlo, toma un aire completo y deja caer los hombros.",
        },
      },
      {
        seconds: 45,
        bell: true,
        text: {
          en: "Think of the pace you have been keeping. Fast, maybe. Fragmented. Let your body remember a slower rhythm now. Sway gently from side to side.",
          es: "Piensa en el ritmo que has mantenido. Rápido, quizá. Fragmentado. Deja que el cuerpo recuerde un ritmo más lento ahora. Méceme suavemente de lado a lado.",
        },
      },
      {
        seconds: 50,
        text: {
          en: "Name what is unfinished, silently. There may be several things. You do not have to finish them today. They will still be there tomorrow, and you are allowed to leave.",
          es: "Nombra lo que queda sin terminar, en silencio. Puede haber varias cosas. No tienes que terminarlas hoy. Seguirán ahí mañana, y tienes permiso de irte.",
        },
      },
      {
        seconds: 50,
        text: {
          en: "Now think of one thing that went right today. However small. A problem solved, a kind word, a moment of focus. Let it count.",
          es: "Ahora piensa en una cosa que salió bien hoy. Por pequeña que sea. Un problema resuelto, una palabra amable, un momento de concentración. Deja que cuente.",
        },
      },
      {
        seconds: 50,
        text: {
          en: "Imagine stepping over a threshold into a different room. The work stays on one side. On this side, there is no inbox, no metric, no one to impress.",
          es: "Imagina que cruzas un umbral hacia una habitación diferente. El trabajo se queda de un lado. De este lado no hay bandeja de entrada, ni métricas, ni nadie a quien impresionar.",
        },
      },
      {
        seconds: 45,
        text: {
          en: "Ask: what do I need in the next hour? Maybe food. Maybe silence. Maybe a walk without your phone. Let the answer be simple and true.",
          es: "Pregunta: ¿qué necesito en la próxima hora? Quizá comida. Quizá silencio. Quizá una caminata sin el teléfono. Deja que la respuesta sea simple y verdadera.",
        },
      },
      {
        seconds: 40,
        text: {
          en: "Take one more breath at the threshold. Say silently: the day is done. I am allowed to be a person again.",
          es: "Toma un último aire en el umbral. Di en silencio: el día terminó. Tengo permiso de ser persona otra vez.",
        },
      },
      {
        seconds: 20,
        bell: true,
        text: {
          en: "Cross the line. Let your shoulders soften. Your time starts now.",
          es: "Cruza la línea. Deja que los hombros se ablanden. Tu tiempo empieza ahora.",
        },
      },
    ],
  },
  {
    id: "walking",
    category: "movement",
    kind: "guided",
    minutes: 6,
    level: "beginner",
    art: "forest",
    soundPreset: "forest-path",
    title: { en: "Walking meditation", es: "Meditación caminando" },
    subtitle: { en: "The path is the practice", es: "El camino es la práctica" },
    description: {
      en: "Eyes open, feet on the ground. A slow walking practice for the hallway, the park, or the way back to your desk.",
      es: "Ojos abiertos, pies en el suelo. Una práctica lenta para el pasillo, el parque o el regreso a tu escritorio.",
    },
    tags: [
      { en: "Movement", es: "Movimiento" },
      { en: "Outside", es: "Aire libre" },
      { en: "6 min", es: "6 min" },
    ],
    steps: [
      {
        seconds: 30,
        text: {
          en: "Begin walking at a slower pace than usual. Let your eyes stay soft, taking in the path ahead without fixing on anything.",
          es: "Empieza a caminar más despacio de lo habitual. Deja los ojos suaves, mirando el camino sin fijarte en nada.",
        },
      },
      {
        seconds: 50,
        bell: true,
        text: {
          en: "Feel the sole of one foot meeting the ground. The heel, the arch, the toes. Then the other foot. You are not walking to get anywhere. You are walking to arrive here.",
          es: "Siente la planta de un pie al encontrarse con el suelo. El talón, el arco, los dedos. Luego el otro pie. No caminas para llegar a ningún lado. Caminas para llegar aquí.",
        },
      },
      {
        seconds: 55,
        text: {
          en: "Notice the swing of your arms and the small rotation in your hips. The body knows how to do this. Let it lead while you simply keep company.",
          es: "Nota el balanceo de los brazos y la pequeña rotación de las caderas. El cuerpo sabe hacer esto. Deja que guíe mientras tú simplemente le acompañas.",
        },
      },
      {
        seconds: 55,
        text: {
          en: "Now widen your attention to what is around you. Light through leaves. The sound of your footsteps. Air on the back of your neck. Let it all come in.",
          es: "Ahora amplía la atención a lo que te rodea. La luz entre las hojas. El sonido de tus pasos. El aire en la nuca. Deja que todo entre.",
        },
      },
      {
        seconds: 55,
        text: {
          en: "When a thought arrives, let it walk beside you for a moment. You do not have to stop and talk to it. Keep walking. It may fall behind.",
          es: "Cuando llegue un pensamiento, deja que camine a tu lado un momento. No tienes que detenerte a hablar con él. Sigue caminando. Puede quedarse atrás.",
        },
      },
      {
        seconds: 50,
        text: {
          en: "Feel the pace of your body as a kind of honesty. However fast or slow you are moving is exactly right. There is no one to keep up with.",
          es: "Siente el ritmo de tu cuerpo como una forma de honestidad. Sin importar lo rápido o lento que vayas, es exactamente correcto. No hay nadie a quien seguir el paso.",
        },
      },
      {
        seconds: 40,
        text: {
          en: "Before you stop, notice one thing you would have missed if you had been rushing. A color. A sound. A small movement.",
          es: "Antes de detenerte, nota una cosa que te habrías perdido si hubieras ido con prisa. Un color. Un sonido. Un pequeño movimiento.",
        },
      },
      {
        seconds: 25,
        bell: true,
        text: {
          en: "Slow down for one last step. Then stand still. Let the walk end without closing anything. You can carry this pace into the rest of your day.",
          es: "Baja el ritmo para un último paso. Luego quédate quieto. Deja que la caminata termine sin cerrar nada. Puedes llevar este ritmo al resto del día.",
        },
      },
    ],
  },
  {
    id: "little-cloud",
    category: "family",
    kind: "story",
    minutes: 8,
    level: "beginner",
    art: "sky",
    soundPreset: "cloud-song",
    title: { en: "The little cloud", es: "La nube pequeña" },
    subtitle: { en: "A bedtime story for small listeners", es: "Un cuento para dormir para pequeños oyentes" },
    description: {
      en: "A soft story about a small cloud looking for the perfect place to rest. Written for children, lovely for anyone who needs a gentle ending.",
      es: "Un cuento suave sobre una nube pequeña que busca el lugar perfecto para descansar. Escrito para niños, hermoso para cualquiera que necesite un final amable.",
    },
    tags: [
      { en: "Kids", es: "Niños" },
      { en: "Bedtime", es: "Hora de dormir" },
      { en: "8 min", es: "8 min" },
    ],
    steps: [
      {
        seconds: 45,
        text: {
          en: "Once, high above a quiet village, there was a little cloud who could not decide where to sleep. It had floated all day, over hills and houses, and now the sky was turning pink.",
          es: "Hubo una vez, muy alto sobre un pueblo tranquilo, una nube pequeña que no sabía dónde dormir. Había flotado todo el día sobre colinas y casas, y ahora el cielo se volvía rosado.",
        },
      },
      {
        seconds: 50,
        bell: true,
        text: {
          en: "The little cloud drifted over a garden. The flowers were closing their petals. \"You could rest here,\" said a sleepy sunflower. But the cloud wanted somewhere softer.",
          es: "La nube pequeña pasó sobre un jardín. Las flores cerraban sus pétalos. \"Podrías descansar aquí\", dijo un girasol somnoliento. Pero la nube quería un lugar más suave.",
        },
      },
      {
        seconds: 50,
        text: {
          en: "It floated over a lake that held the whole sky in its face. The water said, \"Lie on me. I will rock you.\" The cloud dipped one wispy toe in, but the water was a little too cool.",
          es: "Pasó sobre un lago que sostenía todo el cielo en su cara. El agua dijo: \"Recuéstate sobre mí. Te meceré\". La nube mojó un dedo de vapor, pero el agua estaba un poco fría.",
        },
      },
      {
        seconds: 50,
        text: {
          en: "It floated over a mountain. The mountain was strong and old. \"I have held many clouds,\" it rumbled. \"You are welcome here.\" But the cloud was not ready to be still.",
          es: "Pasó sobre una montaña. La montaña era fuerte y antigua. \"He sostenido muchas nubes\", retumbó. \"Eres bienvenida aquí\". Pero la nube no estaba lista para quedarse quieta.",
        },
      },
      {
        seconds: 50,
        text: {
          en: "The sky grew darker and the stars came out, one by one, like tiny night-lights. The little cloud began to feel very small and very tired.",
          es: "El cielo se oscureció y las estrellas salieron, una a una, como pequeñas luces nocturnas. La nube pequeña empezó a sentirse muy pequeña y muy cansada.",
        },
      },
      {
        seconds: 50,
        text: {
          en: "Just then, the moon leaned close and whispered, \"You do not have to find the perfect place. Any place is perfect if you let yourself rest there.\"",
          es: "Justo entonces, la luna se acercó y susurró: \"No tienes que encontrar el lugar perfecto. Cualquier lugar es perfecto si te permites descansar en él\".",
        },
      },
      {
        seconds: 50,
        text: {
          en: "The little cloud looked down and saw a small house with one warm window. Inside, a child was being tucked into bed. The window light made a soft golden pillow on the grass.",
          es: "La nube pequeña miró hacia abajo y vio una casa pequeña con una ventana cálida. Dentro, un niño se metía en la cama. La luz de la ventana hacía una almohada dorada y suave sobre la hierba.",
        },
      },
      {
        seconds: 55,
        text: {
          en: "The cloud settled onto the golden light. It was warm. It was soft. It was exactly the right size. The stars blinked slowly, and the village breathed in and out.",
          es: "La nube se posó sobre la luz dorada. Era cálida. Era suave. Era exactamente del tamaño correcto. Las estrellas parpadearon despacio y el pueblo respiró hacia dentro y hacia fuera.",
        },
      },
      {
        seconds: 55,
        text: {
          en: "The little cloud yawned a tiny cloud yawn. \"Tomorrow,\" it thought, \"I will float again. But tonight, I will stay.\" And it did.",
          es: "La nube pequeña bostezó un pequeño bostezo de nube. \"Mañana\", pensó, \"flotaré otra vez. Pero esta noche me quedo\". Y se quedó.",
        },
      },
      {
        seconds: 55,
        bell: true,
        text: {
          en: "If you are listening with your eyes closed, let your body be as soft as that little cloud. The day is done. The night is here. You can rest now. Goodnight.",
          es: "Si escuchas con los ojos cerrados, deja que tu cuerpo sea tan suave como esa nube pequeña. El día terminó. La noche está aquí. Puedes descansar ahora. Buenas noches.",
        },
      },
    ],
  },
  {
    id: "rainy-reset",
    category: "meditation",
    kind: "guided",
    minutes: 8,
    level: "all",
    art: "rain",
    soundPreset: "soft-rain",
    title: { en: "Rainy day reset", es: "Reinicio de lluvia" },
    subtitle: { en: "Let the weather do some of the work", es: "Deja que el clima haga parte del trabajo" },
    description: {
      en: "A quiet practice to be with grey skies and low energy. We stop fighting the weather and borrow its rhythm instead.",
      es: "Una práctica tranquila para estar con cielos grises y poca energía. Dejamos de pelear con el clima y tomamos prestado su ritmo.",
    },
    tags: [
      { en: "Low mood", es: "Ánimo bajo" },
      { en: "Rain", es: "Lluvia" },
      { en: "8 min", es: "8 min" },
    ],
    steps: [
      {
        seconds: 50,
        text: {
          en: "Find a place where you can hear the rain, or the quiet of a grey day. Let your body be heavy. You do not have to be bright today.",
          es: "Encuentra un lugar donde puedas oír la lluvia, o el silencio de un día gris. Deja que el cuerpo sea pesado. No tienes que estar radiante hoy.",
        },
      },
      {
        seconds: 60,
        bell: true,
        text: {
          en: "Listen to the rain as if it were a friend keeping you company. It is not asking you to feel better. It is simply here, and so are you.",
          es: "Escucha la lluvia como si fuera un amigo que te acompaña. No te está pidiendo que te sientas mejor. Simplemente está aquí, y tú también.",
        },
      },
      {
        seconds: 65,
        text: {
          en: "Notice where you are holding the effort to be okay. The forehead. The shoulders. The stomach. Let each place soften by a fraction.",
          es: "Nota dónde sostienes el esfuerzo de estar bien. La frente. Los hombros. El estómago. Deja que cada lugar se ablande una fracción.",
        },
      },
      {
        seconds: 65,
        text: {
          en: "If sadness is here, let it be a weather system passing through. You are the sky, not the storm. The sky does not have to fix the rain.",
          es: "Si la tristeza está aquí, deja que sea un sistema de clima que pasa. Tú eres el cielo, no la tormenta. El cielo no tiene que arreglar la lluvia.",
        },
      },
      {
        seconds: 65,
        text: {
          en: "Breathe in for five. Out for seven. With each exhale, imagine the rain washing a small stone in your chest. Not removing it. Just making it smoother.",
          es: "Inhala cinco tiempos. Exhala siete. Con cada exhalación, imagina que la lluvia lava una piedra pequeña en tu pecho. No la quita. Solo la hace más suave.",
        },
      },
      {
        seconds: 60,
        text: {
          en: "Think of one small comfort you can give yourself after this. A blanket. A warm drink. A message to someone who makes you feel less alone. Not a solution. A kindness.",
          es: "Piensa en un pequeño consuelo que puedas darte después. Una manta. Una bebida caliente. Un mensaje a alguien que te hace sentir menos solo. No una solución. Una amabilidad.",
        },
      },
      {
        seconds: 55,
        text: {
          en: "Let the next breath be a little slower. The rain is still falling. You are still here. Both of these things are allowed.",
          es: "Deja que la siguiente respiración sea un poco más lenta. La lluvia sigue cayendo. Tú sigues aquí. Las dos cosas están permitidas.",
        },
      },
      {
        seconds: 50,
        text: {
          en: "When you are ready, open your eyes. Nothing has to be fixed. You have kept yourself company through a grey moment, and that is enough.",
          es: "Cuando quieras, abre los ojos. No hay nada que arreglar. Te has acompañado durante un momento gris, y eso es suficiente.",
        },
      },
    ],
  },
  {
    id: "courage-speak",
    category: "focus",
    kind: "guided",
    minutes: 4,
    level: "all",
    art: "mountain",
    soundPreset: "clear-water",
    title: { en: "Before you speak", es: "Antes de hablar" },
    subtitle: { en: "Steady for the room", es: "Estable para la sala" },
    description: {
      en: "A pre-conversation practice for presentations, hard talks, and moments when you want to be seen. Ground, lengthen, and find your real voice.",
      es: "Una práctica previa a una conversación para presentaciones, charlas difíciles y momentos en los que quieres ser visto. Ancla, alarga y encuentra tu voz real.",
    },
    tags: [
      { en: "Confidence", es: "Confianza" },
      { en: "Speaking", es: "Hablar" },
      { en: "4 min", es: "4 min" },
    ],
    steps: [
      {
        seconds: 30,
        text: {
          en: "Stand with both feet under your hips. Press them into the floor and feel the ground push back. You are not small. You are supported.",
          es: "Ponte de pie con los pies bajo las caderas. Presiónalos contra el suelo y siente cómo el suelo empuja de vuelta. No eres pequeño. Estás sostenido.",
        },
      },
      {
        seconds: 40,
        bell: true,
        text: {
          en: "Roll your shoulders back and let your arms hang. Lift the crown of your head as if a string were pulling it gently upward. Let your jaw be loose.",
          es: "Gira los hombros hacia atrás y deja caer los brazos. Levanta la coronilla como si una cuerda tirara suavemente hacia arriba. Deja la mandíbula suelta.",
        },
      },
      {
        seconds: 45,
        text: {
          en: "Breathe in for four, out for six. Do this three times. A longer exhale tells your voice that it does not have to rush.",
          es: "Inhala cuatro, exhala seis. Hazlo tres veces. Una exhalación más larga le dice a tu voz que no tiene que apresurarse.",
        },
      },
      {
        seconds: 45,
        text: {
          en: "Bring to mind the room you are about to enter. See it emptied of judgment. The people there are not waiting for you to be perfect. They are waiting for you to be present.",
          es: "Trae a la mente la sala a la que estás a punto de entrar. Véala vacía de juicio. Las personas no esperan que seas perfecto. Esperan que estés presente.",
        },
      },
      {
        seconds: 45,
        text: {
          en: "Say silently: I do not need to impress anyone. I only need to say the true thing. Let your next exhale be a little longer.",
          es: "Di en silencio: no necesito impresionar a nadie. Solo necesito decir lo verdadero. Deja que tu siguiente exhalación sea un poco más larga.",
        },
      },
      {
        seconds: 35,
        text: {
          en: "Feel your feet again. Soften your eyes. Let your shoulders drop one last time. Confidence is not a feeling you wait for. It is a place you stand.",
          es: "Siente los pies otra vez. Suaviza los ojos. Deja caer los hombros una última vez. La confianza no es un sentimiento que esperas. Es un lugar donde te plantas.",
        },
      },
      {
        seconds: 25,
        bell: true,
        text: {
          en: "Take one more breath. Then walk in with your whole body. You are ready enough.",
          es: "Toma un último aire. Luego entra con todo el cuerpo. Estás suficientemente listo.",
        },
      },
    ],
  },
  {
    id: "full-body-unwind",
    category: "sleep",
    kind: "guided",
    minutes: 15,
    level: "all",
    art: "dusk",
    soundPreset: "night-garden-bed",
    title: { en: "Full body unwind", es: "Relajación del cuerpo" },
    subtitle: { en: "A slow scan from head to toe", es: "Un recorrido lento de la cabeza a los pies" },
    description: {
      en: "A complete body scan for deep rest. Move through the body with curiosity, releasing effort you did not know you were making.",
      es: "Un escaneo corporal completo para un descanso profundo. Recorre el cuerpo con curiosidad, soltando el esfuerzo que no sabías que estabas haciendo.",
    },
    tags: [
      { en: "Body scan", es: "Escaneo corporal" },
      { en: "Deep rest", es: "Descanso profundo" },
      { en: "15 min", es: "15 min" },
    ],
    steps: [
      {
        seconds: 65,
        text: {
          en: "Lie down and let yourself be fully supported. Feel the length of your body from head to feet. Let your hands rest a little away from your sides.",
          es: "Recuéstate y déjate sostener por completo. Siente la longitud del cuerpo de la cabeza a los pies. Deja las manos un poco separadas de los costados.",
        },
      },
      {
        seconds: 70,
        bell: true,
        text: {
          en: "Take a slow breath in. On the exhale, let your body sink a little deeper. We will move through the body slowly. There is nowhere else to be.",
          es: "Toma un aire lento. Al exhalar, deja que el cuerpo se hunda un poco más. Recorreremos el cuerpo despacio. No hay ningún otro lugar donde estar.",
        },
      },
      {
        seconds: 80,
        text: {
          en: "Begin at the top of your head. Notice your scalp, your forehead, the tiny muscles around your eyes. Let them smooth out. Let your eyelids be heavy.",
          es: "Empieza en la parte superior de la cabeza. Nota el cuero cabelludo, la frente, los pequeños músculos alrededor de los ojos. Déjalos alisarse. Deja que los párpados pesen.",
        },
      },
      {
        seconds: 80,
        text: {
          en: "Move to your jaw and tongue. Let your mouth be slightly open. Feel the space between the back of your teeth. Your face has done enough today.",
          es: "Pasa a la mandíbula y la lengua. Deja la boca ligeramente abierta. Siente el espacio entre los dientes posteriores. Tu cara ha hecho suficiente hoy.",
        },
      },
      {
        seconds: 80,
        text: {
          en: "Now your neck and throat. Let them be soft. Inhale into the back of your neck, and let the exhale travel down through your shoulders.",
          es: "Ahora el cuello y la garganta. Déjalos suaves. Inhala hacia la parte posterior del cuello y deja que la exhalación viaje por los hombros.",
        },
      },
      {
        seconds: 80,
        text: {
          en: "Your shoulders. Let them fall away from your ears. Your upper arms, elbows, forearms, hands. Feel each hand become heavier than the last.",
          es: "Los hombros. Déjalos caer lejos de las orejas. Los brazos superiores, los codos, los antebrazos, las manos. Siente cada mano volverse más pesada que la anterior.",
        },
      },
      {
        seconds: 80,
        text: {
          en: "Your chest and ribcage. Feel the breath moving in and out without effort. Your heart, doing its steady work, asking for nothing from you right now.",
          es: "El pecho y las costillas. Siente la respiración entrar y salir sin esfuerzo. Tu corazón, haciendo su trabajo constante, sin pedirte nada ahora.",
        },
      },
      {
        seconds: 80,
        text: {
          en: "Your belly and lower back. Let the belly rise and fall. Let the lower back release into the surface beneath you. Nothing to brace against.",
          es: "El abdomen y la espalda baja. Deja que el abdomen suba y baje. Deja que la espalda baja se suelte sobre la superficie. Nada contra lo que tensarse.",
        },
      },
      {
        seconds: 80,
        text: {
          en: "Your hips, your thighs, the long muscles of your legs. Feel them grow warm and heavy. Your knees. Your calves. Your ankles.",
          es: "Las caderas, los muslos, los músculos largos de las piernas. Siente cómo se vuelven cálidos y pesados. Las rodillas. Las pantorrillas. Los tobillos.",
        },
      },
      {
        seconds: 80,
        text: {
          en: "Your feet. The heels, the soles, the toes. Let them be completely still. Feel the whole body now, as one quiet shape, resting.",
          es: "Los pies. Los talones, las plantas, los dedos. Déjalos completamente quietos. Siente todo el cuerpo ahora, como una forma silenciosa, descansando.",
        },
      },
      {
        seconds: 75,
        text: {
          en: "If any area still feels tight, send it a little warmth on the next exhale. You do not have to force it open. Just let it know it is included.",
          es: "Si alguna zona todavía se siente tensa, envíale un poco de calor en la siguiente exhalación. No tienes que forzarla a abrirse. Solo déjale saber que está incluida.",
        },
      },
      {
        seconds: 50,
        bell: true,
        text: {
          en: "Rest here as long as you like. The body knows how to receive rest. Let it. When you are ready, return slowly.",
          es: "Descansa aquí todo lo que quieras. El cuerpo sabe recibir el descanso. Déjalo. Cuando estés listo, vuelve despacio.",
        },
      },
    ],
  },
  {
    id: "midday-reset",
    category: "meditation",
    kind: "guided",
    minutes: 2,
    level: "beginner",
    art: "sand",
    soundPreset: "clear-water",
    title: { en: "Midday pause", es: "Pausa de mediodía" },
    subtitle: { en: "Two minutes, no more", es: "Dos minutos, nada más" },
    description: {
      en: "A tiny reset for the middle of the day. Put down the screen, loosen the shoulders, and take three breaths that are actually yours.",
      es: "Un pequeño reinicio para la mitad del día. Suelta la pantalla, afloja los hombros y toma tres respiraciones que sean realmente tuyas.",
    },
    tags: [
      { en: "Quick", es: "Rápido" },
      { en: "Reset", es: "Reinicio" },
      { en: "2 min", es: "2 min" },
    ],
    steps: [
      {
        seconds: 25,
        text: {
          en: "Look away from your screen. Let your eyes rest on something farther away than the wall in front of you, or close them.",
          es: "Aparta la mirada de la pantalla. Deja que los ojos descansen en algo más lejano que la pared frente a ti, o ciérralos.",
        },
      },
      {
        seconds: 30,
        text: {
          en: "Roll your shoulders up toward your ears, then let them drop with a sigh. Do it once more, slower.",
          es: "Sube los hombros hacia las orejas y déjalos caer con un suspiro. Hazlo una vez más, más despacio.",
        },
      },
      {
        seconds: 35,
        bell: true,
        text: {
          en: "Take three breaths. In through the nose, out through the mouth. Let the third exhale be the longest one you have taken in the last hour.",
          es: "Toma tres respiraciones. Inhala por la nariz, exhala por la boca. Deja que la tercera exhalación sea la más larga que has tomado en la última hora.",
        },
      },
      {
        seconds: 20,
        text: {
          en: "Ask yourself: what is one thing I can do next that would be kind to my body? Drink water. Stand up. Look out a window.",
          es: "Pregúntate: ¿cuál es una cosa que puedo hacer ahora que sea amable con mi cuerpo? Beber agua. Levantarme. Mirar por la ventana.",
        },
      },
      {
        seconds: 10,
        bell: true,
        text: {
          en: "Do that one thing. Then return. That was enough.",
          es: "Haz esa única cosa. Luego vuelve. Eso fue suficiente.",
        },
      },
    ],
  },
  {
    id: "evening-release",
    category: "sleep",
    kind: "guided",
    minutes: 10,
    level: "all",
    art: "cosmos",
    soundPreset: "deep-quiet",
    title: { en: "Evening release", es: "Liberar la tarde" },
    subtitle: { en: "Put the day down gently", es: "Baja el día con suavidad" },
    description: {
      en: "A reflective practice for the evening. Review the day without replaying it, extract one lesson, and leave the rest behind.",
      es: "Una práctica reflexiva para la tarde. Repasa el día sin repetirlo, extrae una lección y deja el resto atrás.",
    },
    tags: [
      { en: "Evening", es: "Tarde" },
      { en: "Reflection", es: "Reflexión" },
      { en: "10 min", es: "10 min" },
    ],
    steps: [
      {
        seconds: 60,
        text: {
          en: "Sit or lie down. Let the day come to a stop around you, like a train pulling into a station. You do not have to get off yet. Just stop moving.",
          es: "Siéntate o recuéstate. Deja que el día se detenga a tu alrededor, como un tren que llega a una estación. No tienes que bajarte aún. Solo deja de moverte.",
        },
      },
      {
        seconds: 70,
        bell: true,
        text: {
          en: "Let the day appear in front of you, not as a story but as a series of moments. A morning. A conversation. A moment of frustration. A small pleasure.",
          es: "Deja que el día aparezca frente a ti, no como una historia sino como una serie de momentos. Una mañana. Una conversación. Un momento de frustración. Un pequeño placer.",
        },
      },
      {
        seconds: 75,
        text: {
          en: "Choose one moment that was harder than it needed to be. Look at it without judgment. What did you need in that moment that you did not have?",
          es: "Elige un momento que fue más difícil de lo necesario. Míralo sin juicio. ¿Qué necesitabas en ese momento que no tenías?",
        },
      },
      {
        seconds: 75,
        text: {
          en: "Now choose one moment that was good. Let yourself feel it again, fully. Where did it live in your body? Stay there for a few breaths.",
          es: "Ahora elige un momento que fue bueno. Permítete sentirlo de nuevo, por completo. ¿Dónde vivió en tu cuerpo? Quédate ahí unas respiraciones.",
        },
      },
      {
        seconds: 75,
        text: {
          en: "Ask: what is one thing I learned today? Maybe about myself, or about someone else. It does not have to be big. Let the answer be simple.",
          es: "Pregunta: ¿qué aprendí hoy? Quizá sobre mí, o sobre otra persona. No tiene que ser grande. Deja que la respuesta sea sencilla.",
        },
      },
      {
        seconds: 75,
        text: {
          en: "Whatever did not get done today can wait. Whatever you wish you had said can be said tomorrow, or not at all. The day does not need to be resolved to be complete.",
          es: "Lo que no se hizo hoy puede esperar. Lo que desearías haber dicho puede decirse mañana, o no decirse. El día no necesita resolverse para estar completo.",
        },
      },
      {
        seconds: 65,
        text: {
          en: "Thank yourself for one thing you did today, even if it was simply getting through. You showed up. That counts more than you think.",
          es: "Agradece una cosa que hiciste hoy, aunque haya sido simplemente sobrevivir. Estuviste presente. Eso cuenta más de lo que crees.",
        },
      },
      {
        seconds: 55,
        text: {
          en: "Let the day go. Imagine setting it down on a shelf. It will be there tomorrow if you need it. Tonight, you are free of it.",
          es: "Deja ir el día. Imagina que lo dejas en un estante. Estará ahí mañana si lo necesitas. Esta noche estás libre de él.",
        },
      },
      {
        seconds: 25,
        bell: true,
        text: {
          en: "Take one last breath. Let your eyes close if they are not already. Rest now.",
          es: "Toma un último aire. Cierra los ojos si aún no lo están. Descansa ahora.",
        },
      },
    ],
  },

  /* Soundscape sessions ------------------------------------------------- */
  {
    id: "rain-on-the-roof",
    category: "sleep",
    kind: "soundscape",
    minutes: 45,
    level: "all",
    art: "rain",
    featured: true,
    title: { en: "Rain on the roof", es: "Lluvia en el tejado" },
    subtitle: { en: "Soft rain, distant fire", es: "Lluvia suave, fuego lejano" },
    description: {
      en: "A steady rain with a thread of firelight underneath. Made for reading, resting, or falling asleep without a script.",
      es: "Una lluvia constante con un hilo de luz de fuego debajo. Para leer, descansar o dormirte sin guion.",
    },
    tags: [
      { en: "Soundscape", es: "Paisaje sonoro" },
      { en: "Sleep", es: "Dormir" },
      { en: "45 min", es: "45 min" },
    ],
    soundPreset: "soft-rain",
    layers: [
      { id: "rain", volume: 0.72 },
      { id: "fire", volume: 0.18 },
    ],
  },
  {
    id: "ocean-at-dusk",
    category: "sleep",
    kind: "soundscape",
    minutes: 60,
    level: "all",
    art: "ocean",
    title: { en: "Ocean at dusk", es: "Océano al atardecer" },
    subtitle: { en: "Long waves, open horizon", es: "Olas largas, horizonte abierto" },
    description: {
      en: "Slow waves and a low wind. The sound of a wide place where nothing needs your attention.",
      es: "Olas lentas y un viento bajo. El sonido de un lugar amplio donde nada necesita tu atención.",
    },
    tags: [
      { en: "Soundscape", es: "Paisaje sonoro" },
      { en: "Ocean", es: "Océano" },
      { en: "60 min", es: "60 min" },
    ],
    soundPreset: "ocean-dusk",
    layers: [
      { id: "ocean", volume: 0.7 },
      { id: "wind", volume: 0.22 },
      { id: "bowl", volume: 0.12 },
    ],
  },
  {
    id: "forest-morning",
    category: "focus",
    kind: "soundscape",
    minutes: 45,
    level: "all",
    art: "forest",
    title: { en: "Forest morning", es: "Bosque al amanecer" },
    subtitle: { en: "Birds, leaves, first light", es: "Pájaros, hojas, primera luz" },
    description: {
      en: "A bright, living soundscape for deep work or a slow start. Birds arrive and leave; the forest stays.",
      es: "Un paisaje sonoro vivo y luminoso para trabajo profundo o un comienzo lento. Los pájaros llegan y se van; el bosque se queda.",
    },
    tags: [
      { en: "Soundscape", es: "Paisaje sonoro" },
      { en: "Focus", es: "Foco" },
      { en: "45 min", es: "45 min" },
    ],
    soundPreset: "forest-path",
    layers: [
      { id: "forest", volume: 0.62 },
      { id: "wind", volume: 0.18 },
    ],
  },
  {
    id: "firelight",
    category: "sleep",
    kind: "soundscape",
    minutes: 60,
    level: "all",
    art: "ember",
    title: { en: "Firelight", es: "Luz de chimenea" },
    subtitle: { en: "Crackle, warmth, slow hours", es: "Crepitar, calor, horas lentas" },
    description: {
      en: "A low fire and a quiet room. No melody, no voices, just warmth you can hear.",
      es: "Un fuego bajo y una habitación silenciosa. Sin melodía, sin voces, solo un calor que se puede oír.",
    },
    tags: [
      { en: "Soundscape", es: "Paisaje sonoro" },
      { en: "Evening", es: "Tarde" },
      { en: "60 min", es: "60 min" },
    ],
    soundPreset: "warm-light",
    layers: [
      { id: "fire", volume: 0.7 },
      { id: "wind", volume: 0.12 },
    ],
  },
  {
    id: "night-garden",
    category: "sleep",
    kind: "soundscape",
    minutes: 60,
    level: "all",
    art: "night",
    title: { en: "Night garden", es: "Jardín nocturno" },
    subtitle: { en: "Crickets, breeze, moonlight", es: "Grillos, brisa, luz de luna" },
    description: {
      en: "A summer night made into sound. Crickets and a soft breeze, with a distant singing bowl every few minutes.",
      es: "Una noche de verano convertida en sonido. Grillos y una brisa suave, con un cuenco lejano cada pocos minutos.",
    },
    tags: [
      { en: "Soundscape", es: "Paisaje sonoro" },
      { en: "Sleep", es: "Dormir" },
      { en: "60 min", es: "60 min" },
    ],
    soundPreset: "night-garden-bed",
    layers: [
      { id: "night", volume: 0.68 },
      { id: "wind", volume: 0.12 },
      { id: "bowl", volume: 0.1 },
    ],
  },
  {
    id: "deep-quiet",
    category: "focus",
    kind: "soundscape",
    minutes: 45,
    level: "all",
    art: "cosmos",
    title: { en: "Deep quiet", es: "Silencio profundo" },
    subtitle: { en: "A low drone with space around it", es: "Un zumbido bajo con espacio alrededor" },
    description: {
      en: "A near-empty sound field for reading, writing, or thinking. Warm low tones and a slow bowl, nothing more.",
      es: "Un campo sonoro casi vacío para leer, escribir o pensar. Tonos bajos y cálidos y un cuenco lento, nada más.",
    },
    tags: [
      { en: "Soundscape", es: "Paisaje sonoro" },
      { en: "Deep work", es: "Trabajo profundo" },
      { en: "45 min", es: "45 min" },
    ],
    soundPreset: "deep-quiet",
    layers: [
      { id: "drone", volume: 0.5 },
      { id: "bowl", volume: 0.18 },
    ],
  },
  {
    id: "focus-rain",
    category: "focus",
    kind: "soundscape",
    minutes: 25,
    level: "all",
    art: "rain",
    title: { en: "Focus rain", es: "Lluvia de foco" },
    subtitle: { en: "One session, one sound", es: "Una sesión, un sonido" },
    description: {
      en: "A single block of steady rain, sized for one pomodoro. Start the timer and let the world go quiet.",
      es: "Un solo bloque de lluvia constante, del tamaño de un pomodoro. Inicia el temporizador y deja que el mundo se aquiete.",
    },
    tags: [
      { en: "Soundscape", es: "Paisaje sonoro" },
      { en: "25 min", es: "25 min" },
      { en: "Pomodoro", es: "Pomodoro" },
    ],
    soundPreset: "soft-rain",
    layers: [
      { id: "rain", volume: 0.55 },
      { id: "drone", volume: 0.08 },
    ],
  },
  {
    id: "singing-bowl",
    category: "meditation",
    kind: "soundscape",
    minutes: 20,
    level: "all",
    art: "sand",
    title: { en: "Singing bowl", es: "Cuenco tibetano" },
    subtitle: { en: "Slow strikes, long decay", es: "Toques lentos, largo desvanecimiento" },
    description: {
      en: "A single bowl in a quiet room. Let each strike travel all the way to silence before the next one arrives.",
      es: "Un solo cuenco en una habitación silenciosa. Deja que cada toque viaje hasta el silencio antes de que llegue el siguiente.",
    },
    tags: [
      { en: "Soundscape", es: "Paisaje sonoro" },
      { en: "Meditation", es: "Meditación" },
      { en: "20 min", es: "20 min" },
    ],
    soundPreset: "bowl-only",
    layers: [
      { id: "bowl", volume: 0.8 },
      { id: "drone", volume: 0.08 },
    ],
  },
];

export const sessionById = new Map(sessions.map((session) => [session.id, session]));

export const featuredSessions = sessions.filter((session) => session.featured);

export const guidedSessions = sessions.filter((session) => session.kind !== "soundscape");

export function getSessionSeconds(session: Session): number {
  if (session.steps?.length) {
    return session.steps.reduce((total, step) => total + step.seconds, 0);
  }
  return session.minutes * 60;
}

export function formatSessionLength(session: Session, lang: "en" | "es"): string {
  const minutes = Math.round(getSessionSeconds(session) / 60);
  return lang === "es" ? `${minutes} min` : `${minutes} min`;
}
