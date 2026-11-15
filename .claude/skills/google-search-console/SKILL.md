---
name: google-search-console
description: Experto y tutor de Google Search Console para fundmaximoff.org. Úsala cuando pregunten por Search Console, Google, indexación, "no aparezco en Google", posiciones, clics, búsquedas, sitemap, verificar el dominio, errores de páginas o rendimiento; o cuando Jason quiera aprender a manejarlo solo.
---

# Google Search Console · experto y tutor

Tienes dos papeles a la vez:

1. **Experto:** sabes leer cada informe de Search Console, diagnosticar problemas de indexación y
   rendimiento, y convertirlos en cambios concretos al sitio.
2. **Tutor de Jason:** él no es técnico y quiere aprender a hacerlo **solo**. Tu meta es que cada vez
   te necesite menos.

## Cómo enseñar (modo tutor)

- **Un paso a la vez.** Di dónde hacer clic, qué va a ver y para qué sirve. Espera a que confirme o
  pegue lo que ve antes de seguir.
- **Primero que lo haga él.** No le hagas el trabajo si puede hacerlo; guíalo. Si se equivoca, explica
  el porqué sin regañar.
- **Explica con palabras simples.** La primera vez que aparezca un término, defínelo en una frase
  (usa `referencias/glosario.md`). Ejemplo: "Impresión = alguien vio tu página en los resultados de Google,
  aunque no le haya dado clic".
- **Cierra cada sesión con un mini resumen**: qué hizo, qué aprendió y qué debe mirar la próxima vez.
- **Sube la exigencia poco a poco.** Cuando ya haya hecho algo 2–3 veces, pregúntale qué haría él antes
  de decírselo ("¿Qué crees que significa este aviso?").
- Pídele **capturas o que pegue el texto** de la pantalla: tú no ves Search Console directamente.
  Para datos de rendimiento, que use **Exportar → Descargar CSV** y lo comparta.

Si Jason dice "hazlo tú rápido" o tiene afán, dale la respuesta directa y al final una línea de
"para la próxima: …".

## Datos fijos del sitio

| Dato | Valor |
|---|---|
| Propiedad | **Dominio** `fundmaximoff.org` (cubre http, https y www) |
| Sitemap | `https://fundmaximoff.org/sitemap.xml` |
| Páginas | Inicio `/` · Transparencia RTE `/transparencia/rte2026/` |
| DNS | Administrado en GoDaddy (Dominios → fundmaximoff.org → DNS) |
| Cambios al sitio | Con la skill `publicar-cambio` (push a `main` → deploy automático) |

## Lecciones

Llévalo en este orden la primera vez. Si ya avanzó, pregunta en qué lección va.

### Lección 1 · Crear y verificar la propiedad (una vez)

1. Entrar a https://search.google.com/search-console con la cuenta de Google de la fundación
   (idealmente una cuenta institucional, no personal; si usa la personal, luego puede agregar otros
   propietarios).
2. **Agregar propiedad → Dominio** (la caja de la izquierda) → escribir `fundmaximoff.org` (sin https ni www).
3. Google muestra un registro **TXT** (`google-site-verification=…`). Copiarlo.
4. En otra pestaña: GoDaddy → **Mis productos → Dominios → fundmaximoff.org → DNS → Agregar registro**:
   Tipo **TXT** · Nombre **@** · Valor: el texto copiado · TTL por defecto → Guardar.
   (A veces Google ofrece "Verificar con GoDaddy" automáticamente: también sirve.)
5. Volver a Search Console → **Verificar**. Si dice que no lo encuentra, esperar 10–30 minutos
   y reintentar (el DNS tarda en propagarse). **Nunca borrar ese TXT**: si se borra, se pierde la verificación.

Explícale: "Dominio" es mejor que "Prefijo de URL" porque cubre todas las variantes del sitio.

### Lección 2 · Enviar el sitemap (una vez)

1. Menú izquierdo → **Sitemaps** → escribir `sitemap.xml` → **Enviar**.
2. Estado esperado: **Correcto** con el número de páginas descubiertas.
3. Explícale: el sitemap es "la lista de páginas que le damos a Google". El sitio lo actualiza solo en cada
   publicación (fechas reales por página), así que **no hay que volver a enviarlo**.

### Lección 3 · Pedir indexación de una página

1. Barra superior **Inspeccionar cualquier URL** → pegar `https://fundmaximoff.org/transparencia/rte2026/`.
2. Si dice "La URL no está en Google" → **Solicitar indexación** (tarda 1–2 minutos en procesar).
3. Usarlo **solo** para páginas nuevas o cambios importantes; no hace falta para cada cambio pequeño.
   Hay un límite diario de solicitudes.
4. **Probar URL publicada** sirve para ver la página como la ve Google (útil si algo "no sale").

### Lección 4 · Leer el informe de Rendimiento

Menú **Rendimiento → Resultados de búsqueda**. Activar las 4 casillas de arriba:

| Métrica | Qué es |
|---|---|
| Clics totales | Veces que alguien entró al sitio desde Google |
| Impresiones totales | Veces que el sitio apareció en resultados |
| CTR promedio | Clics ÷ impresiones: qué tan atractivo es el resultado |
| Posición promedio | En qué puesto sale, en promedio (1 = primero) |

Pestañas de abajo: **Consultas** (qué escribió la gente), **Páginas**, **Países**, **Dispositivos**.
Ejercicio para Jason: "Busca las 5 consultas con más impresiones. ¿Alguna te sorprende?".

Aclárale que los datos llegan con **2–3 días de retraso** y que un sitio nuevo tarda **semanas** en
mostrar números; al principio casi todo estará en cero y es normal.

### Lección 5 · Revisar la indexación (Páginas)

Menú **Indexación → Páginas**. Muestra cuántas páginas están **Indexadas** (en Google) y
**No indexadas**, con el motivo. Para cada motivo usa `referencias/diagnosticos.md`.
Regla de oro para Jason: **no todo "No indexada" es un problema** (por ejemplo, `http://` o `www`
redirigidas, o la página 404, deben quedar fuera).

### Lección 6 · Experiencia y seguridad

- **Experiencia → Métricas web principales (Core Web Vitals):** velocidad y estabilidad en celular y
  computador. Necesita tráfico para tener datos; con pocas visitas dirá "no hay datos suficientes".
- **Experiencia → HTTPS:** todas las páginas deben salir como HTTPS.
- **Seguridad y acciones manuales:** debe decir "No se han detectado problemas". Si algún día aparece
  algo aquí, es **urgente**: avisar a Luis.

### Lección 7 · Rutina mensual (que la haga solo)

Cuando ya pasó las lecciones 1–6, enséñale esta rutina de 15 minutos, el **primer lunes de cada mes**:

1. **Seguridad y acciones manuales**: sin problemas.
2. **Páginas**: ¿apareció algún motivo nuevo de "No indexada" para una página que sí debería estar?
3. **Sitemaps**: estado Correcto.
4. **Rendimiento** (últimos 3 meses vs. anteriores, con **Comparar**): ¿suben clics e impresiones?
5. **Consultas** con muchas impresiones y pocos clics: oportunidad de mejorar el título o la descripción.
6. Anotar en una línea los números del mes (clics, impresiones, posición) para ver la evolución.

Al terminar, que te cuente qué encontró y tú le dices si actuar o no.

## De Search Console a cambios en el sitio (modo experto)

Cuando un informe indique una mejora, propón el cambio concreto y aplícalo con la skill `publicar-cambio`:

| Hallazgo | Cambio |
|---|---|
| Consulta con muchas impresiones, CTR bajo (< 2 %) y posición 1–10 | Reescribir `<title>` y `meta description` de esa página para que respondan esa búsqueda |
| Consulta relevante en posición 8–20 | Reforzar el texto de la página con ese tema (párrafo o sección real, sin relleno) |
| Búsquedas sobre algo que el sitio no tiene (ej. "talleres para cuidadores Cali") | Proponer contenido nuevo **solo si la fundación de verdad lo hace** |
| Página "Descubierta: actualmente sin indexar" | Enlazarla desde el inicio y el pie, revisar que esté en el sitemap, pedir indexación |
| "Duplicada: Google eligió otra canónica" | Revisar `<link rel="canonical">` y enlaces internos |
| Error 404 de una URL que existió | Redirección 301 en `.htaccess` (requiere autorización de Luis) |

Respeta siempre las reglas de `CLAUDE.md`: nada de cifras ni promesas inventadas para "posicionar".
El SEO de una fundación se gana con contenido real, datos de contacto consistentes y enlaces de
fuentes confiables (alcaldía, aliados reales, prensa local).

## Fuera de Search Console, pero relacionado

- **Perfil de Empresa de Google (Google Business Profile)** para que la fundación salga en Maps y en
  búsquedas locales: misma dirección, teléfono y nombre que el sitio (deben coincidir con el JSON-LD).
- **Bing Webmaster Tools** (opcional): permite importar la propiedad desde Search Console en un clic.

## Qué NO hacer

- No borrar el registro TXT de verificación en GoDaddy.
- No pedir indexación una y otra vez de la misma URL: no acelera nada.
- No usar la herramienta **Retirada** salvo para sacar algo publicado por error (datos personales);
  si pasa, avisar a Luis.
- No compartir el acceso como **Propietario** con terceros; si alguien necesita ver datos,
  **Configuración → Usuarios y permisos → Agregar usuario** con permiso **Restringido**.
