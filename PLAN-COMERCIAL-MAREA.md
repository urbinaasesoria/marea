# Marea — Documento maestro de producto y análisis comercial

> Última actualización: **22 de octubre de 2026**
> Producto: aplicación PWA de meditación, sueño y concentración bilingüe (EN/ES)
> Producto conceptual independiente — no afiliado a ninguna otra marca de meditación.

---

## Índice

1. [Ficha de producto](#1-ficha-de-producto)
2. [Historial de trabajo técnico (sesión 22/10/2026)](#2-historial-de-trabajo-técnico)
3. [Estado de despliegue](#3-estado-de-despliegue)
4. [Operación: comandos y estructura](#4-operación-comandos-y-estructura)
5. [Análisis de mercado y tarifas](#5-análisis-de-mercado-y-tarifas-pago-único)
6. [Hoja de ruta: fase de pruebas familiares](#6-hoja-de-ruta-fase-de-pruebas-familiares)
7. [Plan de expansión del catálogo (×3 mínimo)](#7-plan-de-expansión-del-catálogo)
8. [Pendientes y decisiones abiertas](#8-pendientes-y-decisiones-abiertas)
9. [Fuentes](#9-fuentes)

---

## 1. Ficha de producto

| Atributo | Valor |
|---|---|
| Nombre | **Marea** |
| Tipo | PWA (React 19 + Vite + TypeScript), instalación instalable, funcionamiento offline |
| Idiomas | Español e inglés nativos (diccionarios vigilados por tests) |
| Modelo de datos | 100% local — `localStorage` (`marea.data.v1`, `marea.lang`). Sin cuentas, sin analítica, sin rastreo |
| Audio | Síntesis via Web Audio (`src/lib/audio.ts`), narración via SpeechSynthesis del dispositivo (`src/lib/speech.ts`) |
| Contenido | **24 prácticas originales** (`src/data/*.ts`): meditación, sueño, concentración, respiración, pases de sonido |
| Marca | Paleta propia en `src/styles/tokens.css` (tinta/papel/coral/mar). Fuentes Fraunces + Manrope |
| Licencia | MIT (archivo `LICENSE`) |

**Propuesta de valor:** "Breathe. Come home to yourself." / "Respira. Vuelve a ti." — bilingüe de nacimiento, privado por diseño, sin renovaciones automáticas, gratis mientras se produce en acceso anticipado.

---

## 2. Historial de trabajo técnico

Todo el trabajo de la sesión del 22/10/2026, listo, verificado y desplegado.

### Fase 1 — Bloqueos de calidad

- **Test i18n corregido** (`src/i18n/i18n.test.ts`): la lista blanca de claves idénticas EN/ES se amplió al microtexto legítimo (duraciones "1 min / 25 min / 10-20 min", nombres de idioma, "Ctl K", "No", y las 4 claves de las tarjetas de idioma `landing.language.*` que se muestran cada una en su propio idioma por diseño). Se mantienen los guardianes de: mismas claves, ES no vacío, alineación de `{var}`. Resultado: **14/14 unit tests**.
- **Suite e2e nueva** (`playwright.config.ts` + `e2e/smoke.spec.ts`), integrada en el script `verify`:
  1. Landing conduce a onboarding para recién llegados
  2. Recorrido completo de onboarding → Today, persiste tras recarga
  3. Reproductor: Play → "Step 1 of 8" → Finish early → "You showed up." → volver a Library
  4. Búsqueda en Library filtra correctamente
  5. Interfaz funciona en español y lo recuerda
  6. Rutas desconocidas → página 404
  - Alias pruebas fallan si la página emite errores JS no capturados (`pageerror`).
  - Lección registrada: la seed de localStorage debe ser **idempotente por contexto** (bandera `sessionStorage`), o se sobrescribe en cada recarga falsificando el estado.
- **Git**: repositorio inicializado en main, `.gitignore` (node_modules, dist, artefactos de pruebas, `.vercel/`, `.env.local`), push a `github.com/urbinaasesoria/marea`.

### Fase 2 — Nivel comercial

- **Página `/legal` bilingüe** (`src/pages/Legal.tsx` + `src/styles/legal.css`, claves `legal.*` en los diccionarios): Privacidad local-first, Uso de Marea, Nota de bienestar (aviso no médico), Contacto. Texto largo bilingüe vive dentro del componente (documentación legal, no microtexto de UI). Enlazada desde el footer de la landing.
- **`public/og-image.png`** (1200×630): generada con identidad de marca (Fraunces, sol coral, olas, chips de características). Metas `og:image`, `og:image:width/height/type/alt`, `twitter:image` en `index.html`.
- **`public/favicon.ico`**: contenedor ICO real con entradas de 16/32/48 px generadas desde `icon.svg`; enlazado como fallback junto al SVG primario.
- **`public/robots.txt`** (Permite `/`; bloquea `/onboarding` y `/app/practice`; apunta al sitemap) y **`public/sitemap.xml`** (`/` y `/legal`).
- **`LICENSE`** MIT.
- **Barrido de copy**: `app.library.search` — EN "Search practices, tags, teachers…" → "Search practices, tags, moments…"; ES "Buscar prácticas, etiquetas, voces…" → "Busca prácticas, etiquetas y momentos…".
- Nota de proceso: los archivos con acentos se editan siempre con Node/UTF-8, nunca con PowerShell nativo (riesgo de corruptos exhibibles como mojibake).

### Fase 3 — Verificación

- `npm run verify` completo en verde: typecheck + 14 unit + 6 e2e + build producción.
- Humo de producción sobre `vite preview`: `/`, `/legal`, `/app`, `sw.js`, `manifest.webmanifest`, `og-image.png`, `favicon.ico`, `robots.txt`, `sitemap.xml` → todos 200.
- Limpieza de servidores locales al terminar.

### Fase 4 — Despliegue

- Vercel CLI authenticado vía device code (`vercel login` → flujo OAuth del navegador).
- Proyecto correcto: **`marea`** (se eliminó el proyecto accidental `re-headspace` creado por nombre de carpeta).
- Producción: **https://marea-orcin.vercel.app** (Vercel asignó sufijo porque `marea.vercel.app` estaba tomado).
- Commits desplegados: `5cfda71` (base), `6b12038` (preparación comercial), `1db235b` (dominio canónico).

### Corrección post-despliegue del dominio canónico

`index.html` (og:image, twitter:image), `public/robots.txt` y `public/sitemap.xml` ahora apuntan a `https://marea-orcin.vercel.app/`. **Si algún día hay dominio propio, actualizar esas 3 referencias** (hay comentarios en los archivos).

---

## 3. Estado de despliegue

| Ítem | Valor | Verificado |
|---|---|---|
| Producción | https://marea-orcin.vercel.app | ✅ |
| Repositorio | https://github.com/urbinaasesoria/marea | ✅ |
| Proyecto Vercel | `marea` (cuenta `urbinaasesoria`, email `urbinaasesoriaeinversiones@gmail.com`) | ✅ |
| Deep links (`/app`, `/legal`) | rewrites a `index.html` → 200 | ✅ |
| `sw.js` | `Cache-Control: no-cache, must-revalidate` | ✅ |
| Cabeceras de seguridad | HSTS preload 2 años, nosniff, `referrer-policy`, `permissions-policy` (camera/mic/geo off) | ✅ |
| Service worker | Activo en producción, scope `/` | ✅ |
| Manifest PWA | Nombre, iconos (192/512/maskable), `start_url: /app`, `display: standalone` | ✅ |
| OG/Twitter image | Presentes en el HTML vivo | ✅ |
| Auto-deploy | **Pendiente**: conectar el repo en vercel.com/dashboard → marea → Settings → Git (un clic). Mientras tanto, desplegar con `npx vercel --prod --yes` | ⏳ |

---

## 4. Operación: comandos y estructura

```
npm run dev        # desarrollo, puerto 5173 (strictPort)
npm run build      # tsc -b && vite build
npm run test       # 14 unit tests (vitest)
npm run test:e2e   # 6 pruebas e2e (Playwright, dev server automático)
npm run verify     # typecheck + unit + e2e + build — el chequeo completo
npm run preview    # build de producción en :4173 (strictPort)
```

Archivos clave:

| Archivo | Rol |
|---|---|
| `src/i18n/en.ts` / `es.ts` | Diccionarios bilingües + tipo `TranslationKey` |
| `src/i18n/i18n.test.ts` | Guardián de traducciones (claves, vacíos, placeholders, lista blanca) |
| `src/data/*.ts` | Contenido: 24 prácticas, cursos, pases de sonido, notas diarias |
| `src/store/StoreProvider.tsx` | Estado + persistencia/exportación/borrado (`marea.data.v1`) |
| `src/lib/audio.ts` / `speech.ts` | Síntesis de audio y narración |
| `public/sw.js` / `manifest.webmanifest` | Capa PWA |
| `vercel.json` | rewrites + cabeceras de producción |
| `playwright.config.ts` / `e2e/` | Suite e2e |

---

## 5. Análisis de mercado y tarifas (pago único)

*Precios verificados en fuentes web en octubre 2026 (ver §9). Cada número está citado; las recomendaciones siguen de la evidencia.*

### 5.1 Resumen ejecutivo

El mercado cobra **US$60–80/año** en suscripción autorenovable (Headspace, Calm, Balance) con bibliotecas enormes (500–1,000+ piezas). Las señales de pago único muestran que el punto psicológico de una transacción de una vez para una app indie está **por debajo de US$50** — la señal más fuerte: Calm está probando ahora "Calm for Life" a **US$39.99 pago único** mientras su anual normal subió de $69.99 a $79.99 (+14% sept 2026).

Queda una franja desierta entre "gratis" (Medito, Healthy Minds) y "$60–80/año autorenovable": la app con **pago único razonable, sin cuentas, sin renovación** no existe entre los líderes. Marea ya está posicionada exactamente ahí.

### 5.2 Tabla comparativa (octubre 2026)

| App | Anual | Mensual | Pago único / lifetime | Familia | Nota |
|---|---|---|---|---|---|
| Calm | $79.99 ⬆️ | $16.99 | **$39.99 "for Life" (prueba activa)**; $399.99–499.99 lifetime histórico | $99.99/año, 6 miembros | Subió precio en sept 2026 |
| Headspace | $69.99 (€57.99, £49.99) | $12.99 | — | $99/año | Estudiantes $9.99 |
| Balance | $69.99 | $11.99 | **$399.99 lifetime** | — | Primer año gratis (prueba extendida) |
| Insight Timer | $59.99 | $9.99 | — | — | El económico del mercado grande |
| Aura | $69.99 | — | — | — | |
| Waking Up | $129.99 | $19.99 | — | — | Nicho premium |
| Happier Meditation | $99.99 | — | — | — | |
| Medito / Healthy Minds | Gratis | Gratis | — | — | Sin ánimo de lucro — no compite por precio |

### 5.3 Escalera recomendada para Marea (pago anual único, sin auto-renovación)

| Tier | USD | MXN aprox. | Incluye |
|---|---|---|---|
| **Marea Anual** | **$24.99** | ~$349 | Acceso completo 12 meses, 1 persona |
| **Marea Familia Anual** | **$39.99** | ~$549 | Hasta 5 personas |
| **Marea Vida** *(ancla)* | **$79.99** | ~$1,099 | Acceso permanente |
| Descuento fundador (pruebas familiares → lanzamiento) | **$14.99** | ~$199 | Primer año, cupos limitados |

**Racional de $24.99:**
1. ≈35% del anual de Headspace — proporcional al catálogo (24 vs 1,000+) pero con diferenciadores estructurales: bilingüe nativo EN/ES,datos 100% locales, sin cuentas, sin renovación automática.
2. El experimento de Calm ("for Life" $39.99) valida que la disposición a pagar en un solo golpe vive en los $40 bajos, no en $400. $24.99 queda bajo el umbral de dolor; $79.99 de "Vida" queda tan lejos de los $399–499 de Balance/Calm que funciona como ancla inversa que dispara la compra anual.
3. Escalera con saltos de 1.6× ($24.99 → $39.99 → $79.99): el salto intermedio tiene fricción, más de la mitad converge al tier del medio.
4. Coherencia de marca: sin cuentas ⇒ no se puede cobrar auto-renovación cómodamente. Pago anual manual renovable o "Vida" son el modelo natural.

**LatAm:** las tiendas aplican paridad de poder de compra (~40–50% del precio USD). Con Stripe (PWA, sin tiendas), fijar manualmente: Anual **$279–349 MXN**, Familia **$499 MXN**, Vida **$999 MXN`. Empezar con MXN + USD; otras monedas locales después.

### 5.4 Riesgos y contrapesos

- **Catálogo pequeño (24 prácticas) frente a líderes con cientos**: el precio de $24.99 ya lo compensa; la respuesta estructural es la expansión de catálogo (§7) antes de subir precios.
- **Pago anual sin auto-renovación ⇒ churn de renovación 30–50%** en el peor de los casos: mitigación — al vencer la licencia la app baja a modo invitado (respiración y prácticas básicas siempre libres), nunca bloqueo total. La renovación es invitación, no castigo.
- **Medito gratis** es el contrapeso de precio cero; la defensa de Marea es el bilingüe nativo, la narración en español latino de calidad y la privacidad real — Medito no cubre el manejo ES/EN ni LatAm de forma nativa.

---

## 6. Hoja de ruta: fase de pruebas familiares

**Premisa de esta fase: todo gratuito.** El objetivo es validar utilidad y hábito, no monetizar. La fase de precios va después del catálogo ampliado (§7).

### 6.1 Qué pedir a los testers

1. **Instalación como app** (PWA desde el navegador) + uso real ≥ 2 semanas.
2. **Métricas que la app ya guarda localmente** y que el tester puede compartir: Settings → exportar JSON (`marea.data.v1`): sesiones completadas, minutos, racha, estados de ánimo, notas del diario. El export es la "encuesta invisible" sin violar la promesa de privacidad.
3. **Feedback semanal ligero** por canal informal (WhatsApp/familia): 1 pregunta por semana, p. ej. "¿Qué práctica usaste más esta semana y cuándo?"

### 6.2 Cuestionario de precios (Van Westendorp) — solo al final de la fase

Cada tester responde 4 preguntas por tier:
1. ¿A qué precio la consideras **demasiado barata para confiar**?
2. ¿A qué precio estaría **barata / un buen trato**?
3. ¿A qué precio empieza a ser **cara pero remunerada**?
4. ¿A qué precio sería **más cara de lo que pagarías jamás** (no comprarías ni en oferta)?

El cruce de respuestas da el rango de aceptación real del grupo — el dato más barato de conseguir y el más costoso de adivinar mal.

### 6.3 Señales de éxito de la fase (antes de pasar a comercial)

| Señal | Umbral mínimo |
|---|---|
| Retención semanal 2+ prácticas/semana | ≥ 50% de testers |
| Instalada como app (no solo navegador) | ≥ 70% |
| Completarían unmistakable la lectura de purchase | ≥ 40% en el rango $20–35 |
| NPS informal ("¿la recomendarías a otra familia?") | ≥ 8/10 |

---

## 7. Plan de expansión del catálogo

**Objetivo: mínimo ×3 — de 24 a 72+ prácticas originales** manteniendo el estándar actual de calidad bilingüe.

### 7.1 Dónde está el contenido hoy

- `src/data/*.ts`: sesiones (id, título EN/ES, pasos con textos, nivel, duración, etiquetas, arte, preajuste de sonido), cursos, pases de sonido, notas diarias.
- Cada práctica nueva requiere: textos bilingües (título, guiones paso a paso), segundos totales, variante de arte (`SceneArt`), preajuste de sonido opcional, nivel y etiquetas para búsqueda.
- Guardianes automáticos existentes que protegen la calidad: test i18n (claves/acentos/`{vars}`), typecheck, e2e del reproductor.

### 7.2 Distribución objetivo de 72 prácticas (aprox.)

| Categoría | Hoy | Objetivo | Contenido a crear |
|---|---|---|---|
| Meditación / calma | ~8 | ~20 | Cursos por semana (ansiedad, amabilidad, estados difíciles, gratitud), "SOS" de 3–5 min, sesiones de 15–20 min |
| Sueño | ~6 | ~18 | Rutinas nocturnas, body scans largos, pases de sonido nocturnos, historias de sueño originales (propias), wind-down 10–30 min |
| Concentración | ~4 | ~12 | Pomodoro guiado, deep work 50 min, respiración de enfoque, sesiones "reset" |
| Respiración | ~3 | ~10 | Técnicas nombradas (coherencia, box, 4-7-8, fisiológica), progresiones por nivel |
| Pases de sonido / paisajes | ~3 | ~12 | Mezclas ambientales por momento (lluvia, mar, bosque, noche), duraciones extendidas |
| Familiares / niños *(nueva)* | 0 | ~6 | Micro-sesiones de 2–4 min con lenguaje sencillo — alineado con la fase de pruebas familiares |

### 7.3 Ritmo de producción (estimación)

- ~16 prácticas nuevas/mes × 3 meses = +48 → **72 total**.
- Ritmo sostenible con pipeline por lotes temáticos: escribir lote (10–12) → revisión cruzada bilingüe → integración + tests → entrada en Library/cursos.
- Reglas de calidad no negociables: guiones **originales** (nada derivado de otras marcas), español latino neutro cercano, es-MX preferido; los textos legales/promocionales siempre revisados por persona nativa.
- Cada lote debe incluir al menos una práctica "hero" más larga (20–30 min) para dar peso percibido al catálogo.

### 7.4 Secuencia sugerida (dependencias)

1. **Semanas 1–4 (con pruebas familiares):** +1 práctica/mes ligera; capacidad de recoger qué horas/moment falta (el export JSON de los testers lo dice).
2. **Mes 2–3:** lotes por categoría + pases de sonido; medir horas de contenido y racha.
3. **Mes 4:** página de precios + Payment Links (Anual/Familia/Vida) con catálogo ya "comercial"; descuento fundador para el grupo de pruebas.

---

## 8. Pendientes y decisiones abiertas

| # | Ítem | Estado |
|---|---|---|
| 1 | Conectar Git en Vercel (auto-deploy en push) | Pendiente (1 clic dashboard) |
| 2 | Dominio propio (opcional): actualizar og/robots/sitemap + configurar en Vercel | Opcional |
| 3 | Pruebas familiares — reclutar grupo, fijar canal de feedback, duración sugerida 4–6 semanas | En curso |
| 4 | Expansión de catálogo 24 → 72+ | Planeado (§7), inicia próximas semanas |
| 5 | Página de precios + Stripe Payment Links — solo tras catálogo ampliado y validación de precio | Bloqueado por #3 y #4 |
| 6 | Modo "invitado" al expirar la licencia (renovación sin bloqueo duro) | Decisión de producto futura |
| 7 | Publicar versión, App Store nativa?: no recomendable en fase actual; PWA permite Stripe directo sin comisión de tiendas 15–30% | Decisión futura |

---

## 9. Fuentes

Precios y señales de mercado verificados en octubre 2026:

- Calm — página de planes oficial: calm.com/freetrial/plans (Premium $79.99/año tras la subida de $69.99 → $79.99 del 17 sept 2026; "Calm for Life" $39.99 pago único activo en la página)
- Calm — historial de precio y subida: getpulsesignal.com/pricing/calm (verificado 2026-10-19)
- Calm — familia $99.99/años 6 miembros y lifetime $399.99–499.99: Groupon/carepaths/autonomous.ai (oct 2026)
- Headspace — App Store US: $12.99/mes, $69.99/año; help center: Solo $69.99, €57.99, £49.99; Familia $99.00; estudiante $9.99 (apps.apple.com, headspace.com, stille.theill.com — 20 oct 2026)
- Balance — Google Play US: $11.99/mes, $69.99/año, lifetime $399.99 (play.google.com)
- Insight Timer — $59.99/año, $9.99/mes (insight compare sources, oct 2026)
- Aura — $69.99/año (manaiapp.com verificado 2026-10-09)
- Waking Up — $129.99/año web; Happier Meditation $99.99/año (cloudspress, ago 2026)
- Medito — modelo gratis de la fundación (meditofoundation.org)
- Comparativas agregadas: manaiapp.com (verificados 2026-10-09), autonomous.ai (20 abr 2026), carepaths.com, cloudspress.com (9 ago 2026)

*Los precios cambian: el número del checkout real siempre manda sobre cualquier tabla.*

---

*Marea es un producto conceptual independiente. Todo el contenido (prácticas, guiones, identidad visual) es original del proyecto; las comparaciones de precios citan datos públicos de terceros con fines de investigación de mercado únicamente.*
