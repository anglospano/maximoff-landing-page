# maximoff-landing-page

Sitio web de la **Fundación Maximoff** · [fundmaximoff.org](https://fundmaximoff.org)

| Ambiente | Dirección | Se publica desde |
|---|---|---|
| Producción | [fundmaximoff.org](https://fundmaximoff.org) | rama `main` (única rama) |

Estructura basada en [Cauce-Ing-LABS/landings](https://github.com/Cauce-Ing-LABS/landings),
simplificada a una sola rama: **cada push a `main` se prueba y se publica solo en GoDaddy.**

---

## Contenido

1. [Estructura del repositorio](#estructura-del-repositorio)
2. [Trabajar en el sitio](#trabajar-en-el-sitio)
3. [Qué pasa automáticamente](#qué-pasa-automáticamente)
4. [El agente editor](#el-agente-editor)
5. [Configuración inicial (una sola vez)](#configuración-inicial-una-sola-vez)
6. [Solución de problemas](#solución-de-problemas)

---

## Estructura del repositorio

| Carpeta / archivo | Qué contiene |
|---|---|
| `public_html/` | El sitio. Es exactamente lo que se publica. Los HTML se editan aquí directamente. |
| `public_html/transparencia/rte2026/` | Página del registro web del Régimen Tributario Especial y sus PDF (`docs/`). |
| `herramientas/` | Tailwind (CSS), pruebas, servidor local y scripts del deploy. |
| `herramientas/src/input.css` | Componentes de diseño: `.card`, `.btn-primary`, `.eyebrow`, `.rte-row`… |
| `herramientas/tailwind.config.js` | Colores y fuentes de la marca. |
| `diseno/` | Línea gráfica (`LINEA-GRAFICA.md`) y referencias del diseño original de Stitch. |
| `CLAUDE.md`, `.claude/`, `.mcp.json` | El agente editor (ver abajo). |
| `.github/workflows/deploy-prod.yml` | Deploy automático a GoDaddy. |

Scripts de `herramientas/`:

| Script | Cuándo corre | Qué hace |
|---|---|---|
| `npm run css` | Al editar y en el deploy | Compila Tailwind a `public_html/assets/css/styles.css`. Solo incluye las clases que usan los HTML. |
| `npm run probar` (`check.js`) | Al editar y en el deploy | Enlaces y anclas rotas; SEO (título, descripción, un `<h1>`, canonical, `og:*`, JSON-LD válido, `alt` en imágenes, página en el sitemap); íconos dentro de `icon_names`; datos legales del RTE intactos y frases prohibidas (p. ej. "25 % DIAN"). Si falla, **no se publica**. |
| `fechas-sitemap.js` | Deploy | Pone en `sitemap.xml` la fecha real del último cambio de cada página, según Git. |
| `versionar-assets.js` | Deploy | Agrega `?v=huella` a CSS y JS para que nadie vea HTML nuevo con CSS viejo. |

---

## Trabajar en el sitio

Requisitos: Git y Node.js 20 o superior.

```bash
cd herramientas
npm install            # la primera vez
npm run css:vivo       # recompila el CSS mientras editas (otra terminal)
npm run servir         # ver el sitio en http://127.0.0.1:8765
npm run listo          # compila y prueba: córrelo antes de cada push
```

Publicar:

```bash
git add -A
git commit -m "feat(inicio): qué cambia, en una línea"
git push origin main
```

En 1–2 minutos el cambio está en [fundmaximoff.org](https://fundmaximoff.org).

Los commits siguen [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/): `tipo(alcance): descripción`
(`feat`, `fix`, `style`, `perf`, `refactor`, `docs`, `chore`, `ci`, `revert`). Tabla y ejemplos en
`.claude/skills/publicar-cambio/SKILL.md`.

Deshacer algo publicado: `git revert <commit>` y `git push origin main`.

---

## Qué pasa automáticamente

Con cada push a `main`, GitHub Actions ([deploy-prod.yml](.github/workflows/deploy-prod.yml)):

1. Instala las herramientas y compila el CSS.
2. Corre las pruebas. **Si algo falla, se detiene y no publica.**
3. Ajusta fechas del sitemap y huellas de CSS/JS.
4. Sube por FTPS a GoDaddy **solo los archivos que cambiaron** (con un reintento si GoDaddy corta la conexión).
5. Si hay firewall de GoDaddy configurado, limpia su caché.

También se puede volver a publicar a mano: **Actions → Deploy PROD (GoDaddy) → Run workflow**.

---

## El agente editor

Pensado para que alguien sin experiencia en código pida cambios en palabras
("cambia el título del inicio", "sube el PDF del 5245", "agrega una sección de eventos")
y Claude los haga respetando la línea gráfica, los pruebe y, con aprobación, haga el push a `main`.

| Archivo | Para qué |
|---|---|
| `CLAUDE.md` | Rol del agente, reglas (línea gráfica, página RTE protegida, solo hechos, solo `main`). |
| `.claude/skills/publicar-cambio/SKILL.md` | Paso a paso: sincronizar → editar → probar → mostrar → aprobar → commit + push → verificar deploy. |
| `.claude/settings.json` | Permisos: puede hacer `git add/commit/push origin main` y `npm run …` sin preguntar; tiene prohibido `--force`, crear ramas, `reset --hard` y editar `.github/` o `.htaccess`. |
| `.claude/skills/google-search-console/` | Experto y tutor de Search Console: lecciones paso a paso para que Jason lo maneje solo, rutina mensual, glosario y diagnósticos de indexación. |
| `.mcp.json` | MCP de GitHub (repos + actions) para revisar si el deploy salió bien. |
| `diseno/LINEA-GRAFICA.md` | Colores, tipografía, componentes y voz que el agente debe respetar. |

### Cómo lo usa el editor

1. Abre **Claude Code** (pestaña *Code* de la app de escritorio de Claude, o `claude` en la terminal)
   **dentro de esta carpeta**. Claude lee `CLAUDE.md` y la skill solo.
2. Escribe lo que quiere cambiar, en palabras.
3. Claude explica qué va a hacer, lo hace, lo prueba y pregunta "¿Lo publico?".
4. Con un "sí", hace el commit y el push; el sitio se actualiza solo.

---

## Configuración inicial (una sola vez)

### 1. GoDaddy (cPanel)

1. **cPanel → Cuentas FTP → Crear cuenta**: usuario p. ej. `github`, directorio `public_html`
   (que la cuenta quede **encerrada** en `public_html`).
2. Anota el **servidor FTP** (en "Configurar cliente FTP"). Si el dominio usa el firewall
   Website Security de GoDaddy, usa la **IP** del hosting, no el dominio.
3. Si en `public_html` hay archivos de un sitio anterior o el "Website Builder", respáldalos y quítalos.

### 2. GitHub (repo `maximoff-landing-page`)

1. **Settings → Environments → New environment** → `produccion`.
   - *Deployment branches*: **Selected branches** → `main`.
   - *Environment secrets*: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`
     (y `SUCURI_API_KEY` / `SUCURI_API_SECRET` solo si tienen firewall).
2. **Settings → Branches → Add rule** para `main` (recomendado): bloquear *force push* y borrado.
3. Si el repo es de una cuenta personal, el editor debe ser **colaborador** con permiso *Write*.

### 3. Equipo del editor

1. Instalar **Git**, **Node.js 20+** y la **app de escritorio de Claude** (o Claude Code).
2. `git clone https://github.com/<dueño>/maximoff-landing-page.git` e iniciar sesión en GitHub cuando lo pida
   (Git Credential Manager guarda el acceso; el push usa esa sesión).
3. `cd maximoff-landing-page/herramientas && npm install`.
4. Para el MCP de GitHub: crear un **token fine-grained** (GitHub → Settings → Developer settings →
   Fine-grained tokens) solo para este repo con permisos *Contents: Read* y *Actions: Read*, y guardarlo
   en la variable de entorno `GITHUB_PAT` del usuario (Windows: *Editar las variables de entorno de esta cuenta*).
   Sin el token todo funciona igual; solo que el agente no puede leer el estado del deploy por MCP.

---

### 4. Google (SEO, una vez publicado)

> Con el agente: abre Claude Code en esta carpeta y escribe *"quiero aprender a configurar Google Search Console"*. La skill `google-search-console` lo guía lección por lección.

1. [Google Search Console](https://search.google.com/search-console) → **Agregar propiedad → Dominio** → `fundmaximoff.org`.
   Verifica con el registro TXT que indica Google (en GoDaddy: **Dominios → DNS → Agregar registro TXT**).
2. **Sitemaps** → enviar `https://fundmaximoff.org/sitemap.xml`.
3. **Inspección de URLs** → pegar la URL del RTE → **Solicitar indexación**.
4. Opcional: crear el perfil de [Google Business](https://business.google.com) de la fundación con la misma dirección y teléfono.

Para revisar la vista previa al compartir: [opengraph.xyz](https://www.opengraph.xyz) con la URL publicada.

---

## Solución de problemas

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| El deploy falla en "Probar el sitio" | Enlace roto, dato del RTE cambiado o frase prohibida | Leer el log, corregir, push de nuevo. |
| Falla "Subir a GoDaddy" dos veces | Secret FTP mal, servidor/IP o cuenta bloqueada | Revisar secrets y la cuenta FTP en cPanel. |
| Falla con error TLS/FTPS | El hosting no acepta FTPS | Cambiar `protocol: ftps` por `ftp` en el workflow (último recurso). |
| El sitio no cambia | Caché del navegador o del firewall | Ctrl+F5; si hay firewall, Clear Cache en Website Security. |
| `rejected (fetch first)` al hacer push | Alguien publicó antes | `git pull --rebase origin main`, `npm run listo`, push. |
