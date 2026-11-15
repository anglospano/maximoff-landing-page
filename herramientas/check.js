/*
 * Prueba el sitio antes de publicarlo:
 *   - enlaces internos, imágenes, CSS y anclas (#seccion) que no existan
 *   - SEO de cada página: <title>, descripción, un solo <h1>, idioma, canonical,
 *     vista previa social (og:*), JSON-LD válido, imágenes con alt, página incluida en sitemap.xml
 *   - que cada ícono usado esté en la lista icon_names de Google Fonts (si no, se ve como texto)
 *   - que los datos legales del RTE sigan iguales a los reportados a la DIAN
 *   - que no se cuelen promesas o cifras que la fundación no puede respaldar
 * Los PDF del RTE que falten salen como AVISO (no bloquean), el resto como ERROR.
 * Uso: npm run probar     (sale con código 1 si hay errores: el deploy se detiene)
 */
const fs = require("fs");
const path = require("path");
const { crearServidor } = require("./servir");

const PUBLIC = path.resolve(__dirname, "..", "public_html");
const PUERTO = 8766;
const BASE = `http://127.0.0.1:${PUERTO}`;
const errores = [];
const avisos = [];
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"');

// Datos que deben coincidir con los formatos 2530, 2531 y 5245. Si cambian de verdad,
// se cambian aquí Y en la página, con autorización del representante legal.
const DATOS_RTE = [
  "Fundación Maximoff", "FUNDMAXIMOFF", "902.109.154", "Carrera 1J No. 71A 18",
  "Jason Gómez", "1.006.016.620", "$500.000", "23 de septiembre de 2026",
  "Información publicada para comentarios de la sociedad civil, en cumplimiento del registro web del Régimen Tributario Especial",
];

// Frases que no se pueden publicar mientras la entidad no esté calificada o sin soporte.
const PROHIBIDAS = [/deducci[oó]n\s+(del\s+)?25\s*%/i, /25\s*%\s*DIAN/i, /blockchain/i, /cripto/i];

const DOMINIO = "https://fundmaximoff.org";
const largo = (s) => decode(s).length;

function revisarSeo(url, html, enSitemap) {
  const titulo = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
  if (!titulo) errores.push(`sin <title>: ${url}`);
  else if (largo(titulo) < 30 || largo(titulo) > 65) avisos.push(`título de ${largo(titulo)} caracteres en ${url} (ideal 30–65)`);
  if (!desc) errores.push(`sin meta description: ${url}`);
  else if (url !== "/404.html" && (largo(desc) < 70 || largo(desc) > 160)) avisos.push(`descripción de ${largo(desc)} caracteres en ${url} (ideal 70–160)`);
  if (!/<html lang="[^"]+"/.test(html)) errores.push(`sin atributo lang en <html>: ${url}`);
  for (const img of html.match(/<img\b[^>]*>/g) || []) {
    if (!/\salt="/.test(img)) errores.push(`imagen sin alt en ${url}: ${img.slice(0, 80)}`);
    if (!/\swidth="/.test(img) || !/\sheight="/.test(img)) avisos.push(`imagen sin width/height (la página "salta" al cargar) en ${url}: ${img.slice(0, 80)}`);
  }
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { errores.push(`JSON-LD inválido en ${url}: ${e.message}`); }
  }
  // Íconos: con icon_names Google solo envía esos; uno fuera de la lista se ve como texto ("download")
  const lista = (html.match(/icon_names=([a-z0-9_,]+)/) || [])[1];
  if (lista) {
    const nombres = lista.split(",");
    if (nombres.join(",") !== [...nombres].sort().join(",")) errores.push(`icon_names debe ir en orden alfabético en ${url}`);
    for (const m of html.matchAll(/class="icon[^"]*">\s*([a-z0-9_]+)\s*</g))
      if (!nombres.includes(m[1])) errores.push(`ícono "${m[1]}" no está en icon_names de ${url}`);
  }
  if (url === "/404.html") return;
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || "";
  if (canon !== DOMINIO + url) errores.push(`canonical de ${url} debe ser ${DOMINIO + url} (tiene "${canon}")`);
  for (const og of ["og:title", "og:description", "og:image", "og:url"])
    if (!new RegExp(`<meta property="${og}" content="[^"]+"`).test(html)) errores.push(`falta ${og} en ${url}`);
  if (!enSitemap.has(url)) errores.push(`${url} no está en sitemap.xml`);
  if (!/<script type="application\/ld\+json">/.test(html)) avisos.push(`sin datos estructurados (JSON-LD) en ${url}`);
}

(async () => {
  const servidor = crearServidor().listen(PUERTO, "127.0.0.1");
  const vistos = new Map();
  const sitemap = await (await fetch(BASE + "/sitemap.xml")).text();
  const enSitemap = new Set([...sitemap.matchAll(/<loc>https:\/\/fundmaximoff\.org([^<]*)<\/loc>/g)].map((m) => m[1]));
  const cola = ["/", "/404.html", ...enSitemap];

  while (cola.length) {
    const [url, ancla] = cola.shift().split("#");
    if (!vistos.has(url)) {
      const r = await fetch(BASE + url);
      const tipo = r.headers.get("content-type") || "";
      const texto = tipo.includes("html") ? await r.text() : "";
      vistos.set(url, texto);
      if (r.status !== 200 && url !== "/404.html") {
        (url.includes("/docs/") ? avisos : errores).push(`${r.status} ${url}${enSitemap.has(url) ? " (está en sitemap.xml)" : ""}`);
        continue;
      }
      if (texto) {
        revisarSeo(url, texto, enSitemap);
        const h1 = (texto.match(/<h1[\s>]/g) || []).length;
        if (h1 !== 1) errores.push(`${h1} <h1> en ${url} (debe ser 1)`);
        for (const p of PROHIBIDAS) if (p.test(texto)) errores.push(`frase no permitida (${p}) en ${url}`);
        const ids = new Set([...texto.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
        for (const m of texto.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
          const v = decode(m[1]);
          if (/^(https?:|mailto:|tel:|data:)/.test(v)) continue;
          if (v.startsWith("#")) { if (v.length > 1 && !ids.has(v.slice(1))) errores.push(`ancla rota ${v} en ${url}`); continue; }
          if (url === "/404.html") continue;
          cola.push(new URL(v, BASE + url).pathname + (v.includes("#") ? "#" + v.split("#")[1] : ""));
        }
      }
    }
    const html = vistos.get(url);
    if (ancla && html && !new RegExp(`\\sid="${ancla}"`).test(html)) errores.push(`ancla rota #${ancla} en ${url}`);
  }

  const rte = vistos.get("/rte/") || "";
  const textoRte = decode(rte.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
  for (const d of DATOS_RTE) if (!textoRte.includes(d)) errores.push(`la página RTE ya no contiene: "${d}"`);

  servidor.close();
  console.log(`Revisados: ${vistos.size} recursos`);
  if (avisos.length) console.log("AVISOS (no bloquean):\n  " + [...new Set(avisos)].join("\n  "));
  if (errores.length) { console.log("ERRORES:\n  " + [...new Set(errores)].join("\n  ")); process.exit(1); }
  console.log("✔ Sin errores.");
})();
