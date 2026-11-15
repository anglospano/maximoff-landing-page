---
name: publicar-cambio
description: Aplica un cambio pedido en palabras al sitio fundmaximoff.org (textos, secciones, imágenes, PDF del RTE) siguiendo la línea gráfica, lo prueba y, con aprobación, lo publica con push a main. Úsala para cualquier pedido de cambio en la página de la Fundación Maximoff.
---

# Publicar un cambio en fundmaximoff.org

Sigue estos pasos en orden. No te saltes la aprobación del paso 6.

## 1. Sincronizar

```bash
git status --short          # si hay cambios sin publicar de otra sesión, pregunta qué hacer con ellos
git pull origin main
```

Si `herramientas/node_modules` no existe: `cd herramientas && npm install`.

## 2. Entender el pedido

- Repite en una frase lo que entendiste y qué archivo vas a tocar.
- Si el pedido es ambiguo (¿qué sección?, ¿qué texto exacto?), pregunta **una** cosa.
- Revisa las reglas de `CLAUDE.md`. Si el pedido choca con la línea gráfica, la página RTE protegida
  o la regla de "solo hechos", dilo con amabilidad y propone una alternativa que sí se pueda.

## 3. Editar

- Lee `diseno/LINEA-GRAFICA.md` si el cambio es visual.
- Edita solo `public_html/`. Reutiliza los componentes existentes (`.card`, `.btn-primary`, `.eyebrow`, …)
  y copia la estructura de una sección parecida que ya exista.
- Imágenes nuevas: guárdalas en `public_html/assets/img/` en WebP o JPG de menos de ~300 KB
  (si la persona entrega una pesada, redúcela) y con `alt` descriptivo.
- PDF del RTE: cópialos a `public_html/rte/docs/` con el nombre exacto de `LEEME.txt`.
- Si agregas una página nueva: copia el `<head>` completo de una existente y cambia título, descripción,
  canonical, `og:*` y JSON-LD; agrégala a `public_html/sitemap.xml` y enlázala desde el menú o el pie
  (rutas relativas, igual que las existentes).
- **SEO:** después de editar, revisa la sección "SEO" de `CLAUDE.md`. Si el cambio altera de qué trata la
  página (o datos de contacto/dirección), actualiza título, descripción, `og:*` y el JSON-LD.
- Ícono nuevo de Material Symbols: agrégalo a `icon_names=` (orden alfabético) en todas las páginas.

## 4. Compilar y probar

```bash
cd herramientas
npm run listo
```

- `ERRORES` = no se puede publicar: corrígelos y vuelve a correr.
- `AVISOS` (PDF faltantes, títulos o descripciones de largo no ideal, imágenes sin tamaño) no bloquean:
  corrige los que tengan que ver con tu cambio y menciona los demás.

## 5. Mostrar

Resume el cambio en lenguaje simple (qué se ve distinto y dónde). Ofrece verlo en local:

```bash
cd herramientas && npm run servir     # http://127.0.0.1:8765  (Ctrl+C para cerrar)
```

## 6. Pedir aprobación

Pregunta: **"¿Lo publico en fundmaximoff.org?"**. Solo sigues con un sí claro.
Si piden ajustes, vuelve al paso 3.

## 7. Publicar

```bash
git add -A
git status --short                     # revisa que no vaya nada raro (.env, archivos personales, node_modules)
git commit -m "<tipo>(<alcance>): <descripción>"
git push origin main
```

### Mensaje de commit: Conventional Commits

Formato: `tipo(alcance): descripción`, con la descripción **en español, en minúscula, en modo
imperativo, sin punto final y de máximo ~72 caracteres**. Un commit = un cambio con sentido propio;
si el pedido tuvo dos cambios distintos (ej. un texto y un PDF del RTE), haz dos commits.

| Tipo | Cuándo |
|---|---|
| `feat` | Algo nuevo que se ve en el sitio: sección, página, botón, imagen, PDF del RTE |
| `fix` | Corregir algo que estaba mal: error de texto, enlace roto, dato equivocado, algo que se veía mal |
| `style` | Ajuste solo visual sin cambiar contenido (espacios, tamaños, colores dentro de la línea gráfica) |
| `perf` | Hacer el sitio más rápido (imágenes más livianas, menos archivos) |
| `refactor` | Reorganizar el HTML/CSS sin cambiar lo que se ve |
| `docs` | README, `CLAUDE.md`, la skill, `diseno/` |
| `chore` | Mantenimiento: dependencias, `.gitignore`, limpieza |
| `ci` | `.github/workflows/` (solo con autorización de Luis) |
| `revert` | Deshacer un commit (lo genera `git revert`) |

Alcances: `inicio`, `rte`, `seo`, `contacto`, `voluntariado`, `lineas`, `diseno`, `404`, `herramientas`, `agente`.
Si el cambio toca varias zonas, usa la principal o déjalo sin alcance: `feat: agregar sección de eventos`.

Cuerpo opcional (línea en blanco y luego el porqué) cuando el cambio no se explica solo:

```
fix(rte): corregir fecha de corte del estado financiero

El formato 5245 radicado dice 23/09/2026; la página decía 22/09/2026.
```

Ejemplos:

```
feat(rte): publicar formato 5245 y estatutos en PDF
fix(contacto): corregir número de WhatsApp
feat(inicio): agregar sección de próximos talleres
style(lineas): aumentar espacio entre tarjetas en celular
fix(seo): actualizar descripción del inicio tras cambio de enfoque
perf: convertir fotos de talleres a webp
```

Si el push es rechazado porque `main` avanzó: `git pull --rebase origin main`, vuelve a correr
`npm run listo` y repite el push. Nunca uses `--force`.

## 8. Confirmar el despliegue

El push dispara `.github/workflows/deploy-prod.yml`. Verifica el resultado con lo que tengas disponible,
en este orden:

1. MCP de GitHub (servidor `github` de `.mcp.json`): lista las ejecuciones del workflow
   "Deploy PROD (GoDaddy)" del repo y revisa la última.
2. `gh run watch` o `gh run list --workflow deploy-prod.yml --limit 1` si `gh` está instalado.
3. Si no hay ninguno: da el enlace `https://github.com/<dueño>/<repo>/actions` (sale de `git remote get-url origin`).

Si el deploy falla en "Probar el sitio", léelo, corrige y publica de nuevo. Si falla en la subida FTP,
avisa a Luis: suele ser un secret del hosting.

Cierra con: qué se publicó y que en 1–2 minutos se ve en https://fundmaximoff.org
(recargar con Ctrl+F5 si no aparece).

## Deshacer

```bash
git log --oneline -5
git revert <commit>      # crea un commit que deshace ese cambio
git push origin main
```
