# CHANGELOG · Losan Smile Path

## v2.5.0 · 2026-11-04 · Antes/después rediseñado como bloque de prueba social
Pedido de Lili: el antes/después debe ir acompañado de un texto que convenza y en un espacio que funcione en la diagramación.
- **Comparador deslizable:** la foto se separó en dos encuadres alineados por la línea de la encía (`ba-before.jpg` y `ba-after.jpg`, 36 KB cada uno, sin la marca de agua que quedaba entre ambas). Se arrastra con dedo, mouse o teclado (input range accesible). La primera vez que entra en pantalla hace un barrido suave para mostrar que se puede mover.
- **Tarjeta azul marino:** "Real result · Losan Dental" → "A smile like this starts with a plan." más un texto que conecta el caso con terminar el quiz o enviar el plan, y tres chips con datos ya verificados de la clínica: Bilingual team, IV sedation available, Hotel in the same building. Cierra con "Drag to compare. Individual results vary."
- **Ubicación en el flujo:** debajo de "What matters most to you?" (capítulo 4). La pregunta sigue arriba y la prueba aparece en cuanto la persona elige su prioridad. Al entrar al capítulo 4 solo queda una línea de avance ("Trip planned. Last chapter, then your plan.").
- **En el resultado:** la misma tarjeta, justo antes del formulario, con el botón aqua "Send my plan to the doctor".
- No se atribuye el caso a un tratamiento ni a un doctor específico, porque la clínica no lo indicó.
- **Panel izquierdo (escritorio):** la foto del Dr. López tapaba los teléfonos. Ahora cada teléfono lleva su etiqueta arriba ("WhatsApp · Coordinator", "U.S. office", "Mexico office") y el número completo abajo, sin cortes.


## v2.4.0 · 2026-11-04 · Reputación: doctores y antes/después
Pedido de Lili: incluir en el flujo el antes/después de un tratamiento, para empujar al usuario a terminar, y la experiencia resumida de los doctores. Todo el texto visible va en inglés.
- **Doctores** (al final del paso `stay`, capítulo 3, y en la tarjeta de especialistas del resultado, ahora con fotos):
  - **Dr. Diego López**, Prosthodontist and CEO: UAG (prostodoncia e implantología protésica), maestría en periodoncia avanzada e implantología en NYU, investigación en UNAM con reconocimientos y publicaciones internacionales, más de 1,000 pacientes en Los Algodones. Es un resumen de la bio que envió la clínica.
  - **Dr. José Luis**, Oral surgeon · Dental implant and smile transformation specialist, con su cita sobre titanio y zirconia. Lili confirmó que el "Dr Joseph" del material es el Dr. José Luis. Se omitieron la mención a "One Destination Clinic San Antonio" y los logros del equipo de esa clínica (Navy, radiología 3D, ortodoncia digital), porque no se pueden atribuir a él.
- **Antes/después** (paciente real de Losan, con etiquetas Before/After y la leyenda "Individual results vary."):
  - Al entrar al capítulo 4 sustituye el dato de "Molar City", con el texto "Two quick questions and your personal plan is ready".
  - En el resultado aparece justo antes del formulario, con el botón "Send my plan to the doctor". No se muestra en casos de revisión médica.
- Imágenes optimizadas de 4.1 MB a 169 KB en `src/assets/img/`. `build.py` las copia a `public/img/` y `dist/img/`. Se sirven como archivos aparte, con carga diferida, y el antes/después se precarga durante el capítulo 3.
- Sin cambios en el payload.


## v2.3.0 · 2026-11-03 · Movimiento y acabado
Pedido de Lili: efectos sutiles que hagan la experiencia más elegante, robusta y confiable. Todo anima solo `transform` y `opacity` (fluido en móvil) y se apaga con `prefers-reduced-motion`.
- **Transiciones entre pasos:** entrada escalonada de cada bloque (55 ms entre bloques) con curva `cubic-bezier(.22,1,.36,1)` y dirección según si se avanza o se retrocede.
- **Barra de progreso:** antes se reconstruía en cada paso y no se animaba; ahora avanza de forma fluida y el capítulo activo tiene un brillo lento.
- **Barra superior fija** con fondo translúcido desenfocado y sombra al hacer scroll.
- **Opciones:** se elevan al pasar el mouse, el ícono crece y aparece un anillo aqua al seleccionarlas.
- **Botón "Continue":** pulsa una vez, con un destello, en el momento en que el paso queda completo; al entrar a un paso no pulsa.
- **Mapa dental:** cada diente hace un pequeño rebote al marcarlo.
- **Tarjeta "Did you know?":** destello suave al aparecer y check animado.
- **Resultado:** luz de fondo que se desplaza en la tarjeta principal, planes que aparecen escalonados, puntaje que cuenta de 0 al valor real y tarjetas que aparecen al hacer scroll (`IntersectionObserver`; sin soporte, se muestran todas).
- **Notas de IA:** líneas de carga tipo esqueleto en lugar de solo un spinner.
- **Envío exitoso:** check que se dibuja (círculo y palomita).
- **Íconos:** ya no se ve el texto del ícono (p. ej. "arrow_forward") mientras carga la fuente; aparecen con un fundido, con tope de 2.5 s.
- **Panel de marca en escritorio:** luz ambiental lenta y entrada escalonada del contenido.
- Sin cambios en marca, colores, textos ni payload.


## v2.2.1 · 2026-11-03 · Corrección: texto "null" visible
- En la intro, sin `?demo=1`, aparecía la palabra "null" donde va el enlace de demo. El mismo error afectaba al formulario (bloque de error vacío) y a la pantalla de éxito (aviso de preview).
- Causa: `append()` y `replaceChildren()` del DOM convierten `null` en texto. Se agregó el filtro `kids()` para todos los hijos condicionales.
- La prueba e2e ahora falla si aparece "null", "undefined" o "NaN" en el texto visible (excepto en la vista interna del JSON del CRM).


## v2.2.0 · 2026-11-03 · Flujo continuo, sin gamificación, con datos entre etapas
Pedido de Lili: quitar la gamificación, acortar el quiz y dar datos que enganchen al pasar de etapa.
- **Sin gamificación:** se eliminaron los puntos, el contador, las pantallas de "etapa completada" (+100 puntos), la opción B de recompensa (`ENABLE_REWARD` y `rewardText`) y el confeti del resultado. Esto reemplaza la sección 3 de v2.0.
- **Más corto:** de 11 pasos + 4 pantallas intermedias (15 pantallas) a **10 pasos seguidos**. "Which travel document do you have?" ahora va dentro del paso `getting` y solo aparece si la persona no viaja desde México; con esto desaparece el paso `docs`.
- **"Did you know?" entre etapas:** al entrar a los capítulos 2, 3 y 4 se muestra una tarjeta con lo que la persona acaba de completar ("Smile Map done: you marked 6 teeth.") y un dato elegido según sus respuestas:
  - Capítulo 2: dentadura completa o 20+ dientes → 1 de cada 8 estadounidenses mayores de 65 perdió todos sus dientes (CDC, NCHS Data Brief 368). Dientes marcados y 1+ año sin ellos → pérdida de ~50% del ancho del hueso en un año (Schropp et al., 2003). En cualquier otro caso → 178 millones de estadounidenses con al menos un diente faltante (American College of Prosthodontists).
  - Capítulo 3: fuma o vapea → el doble de riesgo de enfermedad de encías (CDC). Ansiedad → 1 de cada 3 adultos con ansiedad dental y 1 de cada 8 con miedo extremo (Adult Dental Health Survey, Reino Unido, 2009). En cualquier otro caso → 42% de los adultos de 30+ con enfermedad de encías (CDC, Eke et al. 2018).
  - Capítulo 4: Los Algodones, "Molar City" (KYMA News 11; TRT World). No lleva cifras porque las estimaciones publicadas de pacientes y dentistas varían demasiado.
- Cada dato muestra su fuente en la tarjeta. Regla: no se agrega una cifra a `FACTS` sin fuente pública.
- No cambia el payload del CRM (los puntos nunca se enviaban).


## v2.1.0 · 2026-11-03 · Migración a GitHub + Vercel + Supabase
- El repo `liliferro/losandental` es la fuente única. Vercel despliega `public/` en cada push a `main`.
- `api/lead.js` guarda el lead en Supabase con `public.submit_lead()`, que valida consentimiento, contacto y tamaño, y descarta duplicados por `lead_id`. Si existe `CRM_WEBHOOK_URL`, reenvía el mismo JSON.
- `api/upload-url.js` firma la subida directa a Storage (bucket privado `xrays`). Solo se permite subir dentro de la carpeta de un lead que ya existe.
- `api/notes.js` arma el prompt en el servidor y llama a Claude. Necesita `ANTHROPIC_API_KEY`; sin ella, la página usa las notas fijas.
- La tabla `leads` tiene RLS activo y ninguna política: la anon key no puede leer nada. Esquema en `supabase/migrations/`.
- `build.py` ahora genera `public/index.html` (producción, con endpoints) y `dist/artifact.html` (artefacto de Claude, sin endpoints).


## v2.0.0 · 2026-11-03

Objetivo: que más gente termine el quiz (de 17 a 11 pasos), que el resultado convierta mejor y que el lead le llegue a la clínica más útil. No cambian la marca, los colores ni el tono.

### 1. Pasos unidos (17 → 11)
Toda la definición de preguntas está en el arreglo `STEPS`, dentro de `smile-path.src.html`. Es el equivalente a `steps.config.ts`: la página es un solo archivo HTML sin paso de compilación de TypeScript. Cada paso tiene `id`, `chapter`, `fields[]`, `validation()` y `next()`. Un solo renderizador genérico (`renderFields`) dibuja todos los campos.

| Capítulo | Paso (`id`) | Contenido |
|---|---|---|
| 1 · Smile Map (2) | `teeth` | Mapa dental (sin cambios de contenido) |
| | `today` | ¿Qué usas hoy? + ¿hace cuánto? (slider) + **¿Qué te molesta más?** (`impacto_principal[]`) |
| 2 · Health Check (4) | `about` | Edad + ¿fumas o vapeas? |
| | `health` | Condiciones médicas (sin cambios) |
| | `mouth` | Encías/mordida + tratamientos previos (dos grupos de chips) |
| | `prep` | Consulta previa + radiografías de los últimos 12 meses + ansiedad (3 chips) |
| 3 · Your Trip (3) | `getting` | ¿Desde dónde viajas? + ¿cómo llegarías? |
| | `docs` | Documento de viaje + aviso de la garita de Andrade (sin cambios) |
| | `stay` | Días de estancia + segunda visita (sin cambios) |
| 4 · Your Goals (2) | `priority` | ¿Qué te importa más? (elige 2) (sin cambios) |
| | `plan` | ¿Cuándo quieres empezar? + ¿cómo pagarías? |

- "Continuar" solo se activa con todos los campos obligatorios visibles del paso completos.
- La barra de progreso y el conteo "n of m" por capítulo se calculan sobre los pasos activos. Por ejemplo, viajando desde México son 10 pasos y el capítulo 3 muestra "of 2".
- **Interpretación:** el brief pide pasar el capítulo 1 de 4 a 2 pasos, pero lista tres bloques (mapa, uso+tiempo, impacto). Para llegar a 2, "¿Qué te molesta más?" va dentro del paso `today`.
- **Agregado:** la opción "None of these" en "¿Qué te molesta más?". Sin ella, alguien sin molestias no podría continuar, porque el campo es obligatorio. Sigue el mismo patrón que las demás preguntas de chips.

### 2. Lógica condicional
- Mapa sin dientes faltantes ni dañados → se oculta "¿hace cuánto?" y el resultado se orienta a **"An evaluation and cosmetic consultation"** (valoración / estética). **Matiz:** si la persona usa dentadura completa o parcial, la pregunta sí se muestra, porque el tiempo sin dientes afecta el hueso aunque no haya marcado dientes en el mapa.
- `from = mx` → se omite el paso `docs` (`getting.next()` salta directo a `stay`).
- `pay = insurance` → aviso con `[[POR CONFIRMAR: política de seguros de Losan]]` hasta que se llene `insurancePolicy`.
- Condiciones `chemo`, `radiation` o `pregnant` → el resultado dice **"Requires a medical evaluation before defining a plan"**, sin plan probable, precio, mapa de resultado, viaje ni notas de IA. Además se envía `requiere_revision_medica: true`.

### 3. Puntos
- La opción B queda detrás de `ENABLE_REWARD`, pero solo se activa si además está lleno `rewardText`. Mientras el beneficio no esté confirmado, la página usa la opción A: sin puntos visibles, solo el avance por capítulos.
- El confeti solo aparece en el resultado final, y no aparece en el caso de revisión médica.

### 4. Pantalla de resultado
Nuevo orden: solución probable + botón principal **"Send my plan to the doctor"** → bloque de precio → 4 beneficios → formulario → "More about your plan" (mapa, notas, puntaje de preparación, viaje, especialistas).
- Bloque de precio: si `priceFrom` está vacío, dice "Get your personalized quote" y su botón lleva al formulario (`intencion: "cotizacion"`).
- Se quitaron "I need a full examination" y "Confirm this solution with the doctor". Ahora la intención se guarda en `intencion` (ver valores abajo).
- WhatsApp: `https://wa.me/19288678333?text=<resumen del plan>`. Teléfonos con `tel:`. "Copy number" queda como opción secundaria.
- Para el caso Evaluation se agregaron 2 beneficios, para llegar a 4. Usan solo datos que ya estaban en la página: odontología cosmética del nombre de la clínica, traslado desde Yuma y hotel.

### 5. Formulario
- `REQUIRED_CONTACT = "email" | "phone"` (por defecto `"email"`, `[[POR CONFIRMAR]]`).
- Selector de país: US +1, Canada +1 y México +52. Se valida el número (NANP de 10 dígitos o MX de 10 dígitos) y se envía en formato E.164. El país se preselecciona según el idioma del navegador o según "¿Desde dónde viajas?".
- El idioma preferido se toma de `navigator.language` y se puede cambiar.
- El consentimiento es explícito, aparece sin marcar e incluye un enlace al aviso de privacidad (`[[POR CONFIRMAR: URL]]` hasta que se llene `privacyUrl`).
- Estados del formulario: enviando, éxito ("…will write to you within `[[POR CONFIRMAR: tiempo]]`") y error con botón "Try again".
- El avance se guarda en `localStorage` (`losan-smile-path-v2`) y la intro ofrece "Continue where you left off". El guardado se borra al enviar el formulario.

### 6. Radiografías
- La carga se movió a la pantalla de éxito. Acepta JPG, PNG, PDF y DICOM (.dcm), con barra de avance por archivo, y cada archivo queda asociado a su `lead_id`.
- Contrato de `uploadEndpoint`: `POST {lead_id, filename, size}` → `{uploadUrl}`. Luego el navegador hace `PUT` del archivo a esa URL firmada, directo a Supabase Storage (`xrays/<lead_id>/<timestamp>-<archivo>`), con avance real.
- Tamaño máximo: `maxUploadMB`, `[[POR CONFIRMAR]]`. Con 0 no se aplica límite en el navegador.

### 7. Payload del CRM (cambio de formato)
**Antes (v1):** `submittedAt, page, utm{...todos los parámetros}, contact{email, firstName, phone, whatsapp, language, consent}, wants, plan{...}, teeth{n: estado}, readiness{score, band, flags}, tags[], answers{...}, summary, points`.

**Ahora (v2):** un solo JSON:

```json
{
  "lead_id": "uuid",
  "timestamp": "ISO-8601",
  "idioma": "en | es",
  "contacto": { "nombre": "", "email": "", "telefono": "+1XXXXXXXXXX", "pais_telefono": "US|CA|MX", "whatsapp": true, "consentimiento": true, "consentimiento_texto": "..." },
  "mapa_dental": { "faltantes": [3,4], "dañados": [30], "sanos": [], "uso_actual": ["partial"], "dentadura_completa": null, "tiempo_sin_dientes": "3–5 years", "impacto_principal": ["chew","smile"] },
  "salud": { "edad": 58, "tabaco": "never|former|vape|smoke", "anios_sin_fumar": null, "cigarros_dia": null, "pausaria_tabaco": null, "condiciones": [], "control_diabetes": null, "encias_mordida": [], "tratamientos_previos": [], "consulta_previa": "yes|no", "radiografias_12m": "ct|pano|none|unsure", "ansiedad": "calm|nervous|fear", "alertas": [] },
  "viaje": { "desde": "az|ca|nvut|us|ca2|mx", "como_llega": "drive|fly|help|unsure", "documento": "passport|card|sentri|edl|none|null", "dias_estancia": 5, "segunda_visita": "yes|maybe|no" },
  "metas": { "prioridades": ["fixed"], "inicio": "asap|1-3|3-6|research", "pago": "full|finance|insurance|unsure" },
  "solucion_probable": { "familia": "All-on-4|Implants|Evaluation|Medical review", "titulo": "", "superior": { "tipo": "full|bridge|single|none", "detalle": "" }, "inferior": { "tipo": "", "detalle": "" }, "sitios_implante": [], "caso_limite": false },
  "puntaje_preparacion": 82,
  "requiere_revision_medica": false,
  "intencion": "enviar_plan | cotizacion | valoracion_medica",
  "utm": { "source": "", "medium": "", "campaign": "", "content": "", "term": "" },
  "referrer": ""
}
```
- Los dientes usan la numeración universal (2–15 arriba, 18–31 abajo).
- Los valores son códigos estables. Las etiquetas visibles están en los arreglos de opciones del código.
- Se dejaron de enviar los sliders de impacto (`pain`, `chewing`, `hidingSmile`), `tags`, `summary`, `answers` y `points`.
- Atención: la clave `dañados` lleva ñ porque así la pide el brief. Si el CRM o el webhook no aceptan claves con ñ, hay que cambiarla a `danados` en un solo lugar (`leadPayload`).
- Los UTM y el referrer se capturan al cargar la página y se guardan en el estado. Al retomar una sesión se conserva la primera atribución.
- "Clinic view" solo aparece con `?modo=clinica` y "Preview with a sample patient" solo con `?demo=1`. Como un enlace de artefacto de Claude no lleva query string, también funcionan `#clinica` y `#demo`.

### 8. Medición
Capa `window.dataLayer.push`, sin píxeles de terceros:
`quiz_start` (`resumed` al retomar), `step_complete {step_id, chapter}`, `chapter_complete {chapter}`, `result_view {solucion_probable}`, `lead_submit {intencion}`, `xray_upload`, `whatsapp_click {location}`, `call_click {location}` y `quiz_abandon {last_step_id}` (con `visibilitychange`, `pagehide` y `beforeunload`; se dispara una sola vez y no cuenta las salidas a WhatsApp o a una llamada). En modo vista previa, `lead_submit` y `xray_upload` llevan `modo: "preview"`.

### 9. Móvil y accesibilidad
- Debajo de 980 px, el panel de marca se convierte en un encabezado compacto con logo, rating 5.0 y botón de WhatsApp. Así queda cubierta la regla de < 768 px.
- Mapa dental: el modo principal es tocar, y la página hace scroll sobre el mapa. El modo de arrastrar solo se activa con "Paint several", y solo entonces se aplica `touch-action: none`.
- Teclado: navegación con flechas por cada arcada (tabindex itinerante), Enter o Espacio para marcar y `aria-label` en cada diente ("Tooth 14, missing. Upper left first molar").
- Tamaños mínimos: 12 px en microetiquetas (también en el texto del SVG), 16 px en campos y 44×44 px en los objetivos táctiles de la interfaz. Los dientes del SVG quedan por debajo de 44 px por geometría; para eso existen el modo tocar con zoom y los botones rápidos.
- Contraste: aqua #93E5F9 sobre azul marino #002553 da 10.7:1 (AA). Las etiquetas grises del mapa se aclararon a #7FB6D1 (8.8:1).
- `prefers-reduced-motion`: sin confeti, sin escaneo y sin animación del medidor.

### 10. Pantalla de carga
El plan se calcula en el navegador. La pantalla dura ~2 s y cada línea corresponde a un cálculo real (mapa, factores de salud, plan, viaje). Se quitó "Writing your personal notes", porque la IA no se espera ahí: sus notas cargan en el resultado con su propio indicador.

### Valores pendientes (`SMILE_PATH_CONFIG`)
`REQUIRED_CONTACT`, `rewardText`, `priceFrom`, `insurancePolicy`, `privacyUrl`, `replyTime` y `maxUploadMB`. Mientras estén vacíos, la página no inventa nada: o muestra `[[POR CONFIRMAR: …]]` o usa la alternativa segura.
