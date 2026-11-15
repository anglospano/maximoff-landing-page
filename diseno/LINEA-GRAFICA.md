# Línea gráfica · Fundación Maximoff

Esta es la regla de diseño **vigente** del sitio. Viene del proyecto de Stitch "Vibrant Pulse"
(`DESIGN.md` y `stitch/portal-referencia.jpg`), adaptado a modo oscuro. Si algo de `DESIGN.md`
contradice este archivo, manda este archivo.

## Personalidad

Cálida, valiente y sin estigma. Pedir ayuda en salud mental debe sentirse como unirse a una comunidad,
no como entrar a una clínica. Alto contraste: rojo Maximoff sobre carbón.

## Colores (definidos en `herramientas/tailwind.config.js`)

| Nombre (clase) | Hex | Uso |
|---|---|---|
| `primary` | `#E50914` | Botones principales, acentos, palabras destacadas del título, numeración |
| `primary-hover` | `#C90812` | Hover del botón principal |
| `primary-soft` | `#FFB4AA` | Texto rojo claro sobre fondo oscuro (chips, enlaces) |
| `base` | `#0F1012` | Fondo de página |
| `layer1` | `#18191C` | Tarjetas |
| `layer2` | `#232428` | Tarjetas elevadas, chips neutros |
| `highlight` | `#2E3035` | Hover de elementos neutros |
| `line` | `#383A40` | Bordes |
| `ink` | `#F4F4F6` | Texto principal |
| `muted` | `#A1A1AA` | Texto secundario |
| `ok` | `#22C55E` | Estados positivos (uso mínimo) |
| `warn` | `#F59E0B` | Solo para "No aplica" en la página RTE |

**No se agregan colores nuevos.** Nada de azules, morados ni degradados de otros tonos.
Los únicos degradados permitidos son los de fondo carbón (`from-[#131417] to-base`) y los
resplandores rojos difuminados del hero (`bg-primary/15 blur-[140px]`).

## Tipografía

- **Space Grotesk** (`font-display`): títulos, cifras, etiquetas. Peso 700, tracking apretado.
- **Plus Jakarta Sans** (`font-sans`, por defecto): párrafos, botones, formularios.
- El título principal (h1) del inicio va en MAYÚSCULAS con 1–2 palabras en rojo (`text-primary`).
- Etiquetas pequeñas sobre los títulos: clase `.eyebrow` (mayúsculas, rojo, espaciado amplio).

## Componentes (en `herramientas/src/input.css`)

| Clase | Qué es |
|---|---|
| `.wrap` | Contenedor centrado, máx. 1240 px, con márgenes laterales |
| `.eyebrow` | Etiqueta roja en mayúsculas sobre un título |
| `.card` | Tarjeta: fondo `layer1`, borde suave, esquinas de 16 px |
| `.chip` + colores | Etiqueta en forma de píldora |
| `.btn-primary` | Botón rojo en píldora (acción principal; máximo 1–2 por sección) |
| `.btn-ghost` | Botón oscuro con borde (acción secundaria) |
| `.icon` | Ícono de Material Symbols: `<span class="icon">nombre</span>` ([lista](https://fonts.google.com/icons)) |
| `.rte-row`, `.rte-num`, `.rte-label`, `.rte-value`, `.na` | Filas de la tabla del RTE |

Patrón de una sección:

```html
<section id="nombre" class="wrap py-16 md:py-24">
  <p class="eyebrow">Etiqueta</p>
  <h2 class="mt-2 text-3xl font-bold md:text-4xl">Título de la sección</h2>
  <p class="mt-3 max-w-2xl text-muted">Texto de apoyo.</p>
  <div class="mt-10 grid gap-5 md:grid-cols-2">
    <article class="card">…</article>
  </div>
</section>
```

Las secciones alternan fondo: una con `base` y la siguiente envuelta en
`<section class="border-y border-layer2 bg-[#131417]"><div class="wrap …">`.

Tarjeta destacada: agregar una barra roja arriba
`<span class="absolute inset-x-0 top-0 h-1 bg-primary"></span>` (la tarjeta lleva `relative overflow-hidden`).

## Formas y espacio

- Tarjetas `rounded-2xl`; botones y chips en píldora (`rounded-full`).
- Mucho aire: `py-16 md:py-24` entre secciones, `gap-5` entre tarjetas.
- Sin sombras grises difusas; la profundidad se da con bordes y, en lo destacado, un brillo rojo suave.

## Imágenes

- Formato WebP (o JPG), máximo ~300 KB, ancho máximo 1600 px. Van en `public_html/assets/img/`.
- Siempre con `alt` que describa la imagen. Nada de fotos de menores de edad identificables sin autorización.
- El logo siempre sobre una caja blanca redondeada (`bg-white rounded-xl px-2.5`), nunca sobre el fondo oscuro directo.

## Voz y contenido

- Español de Colombia, cercano, tuteando ("Conoce", "Escríbenos").
- Frases cortas. Nada de jerga clínica innecesaria.
- **Solo hechos verificables.** Nada de cifras, testimonios, alianzas, premios o servicios que la fundación
  no tenga o no pueda soportar con un documento.
- Toda mención de crisis lleva la Línea 106 de Cali (24/7, WhatsApp 316 245 8423) o el 123.
