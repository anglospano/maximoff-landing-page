/*
 * Prueba el sitio antes de publicarlo:
 *   - enlaces internos, imágenes, CSS y anclas (#seccion) que no existan
 *   - cada página con <title>, descripción y un solo <h1>
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

(async () => {
  const servidor = crearServidor().listen(PUERTO, "127.0.0.1");
  const vistos = new Map();
  const cola = ["/", "/transparencia/rte2026/", "/404.html"];

  while (cola.length) {
    const [url, ancla] = cola.shift().split("#");
    if (!vistos.has(url)) {
      const r = await fetch(BASE + url);
      const tipo = r.headers.get("content-type") || "";
      const texto = tipo.includes("html") ? await r.text() : "";
      vistos.set(url, texto);
      if (r.status !== 200 && url !== "/404.html") {
        (url.includes("/docs/") ? avisos : errores).push(`${r.status} ${url}`);
        continue;
      }
      if (texto) {
        if (!/<title>[^<]+<\/title>/.test(texto)) errores.push(`sin <title>: ${url}`);
        if (!/<meta name="description" content="[^"]+"/.test(texto)) errores.push(`sin descripción: ${url}`);
        const h1 = (texto.match(/<h1[\s>]/g) || []).length;
        if (h1 !== 1 && url !== "/404.html") errores.push(`${h1} <h1> en ${url} (debe ser 1)`);
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

  const rte = vistos.get("/transparencia/rte2026/") || "";
  const textoRte = decode(rte.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
  for (const d of DATOS_RTE) if (!textoRte.includes(d)) errores.push(`la página RTE ya no contiene: "${d}"`);

  servidor.close();
  console.log(`Revisados: ${vistos.size} recursos`);
  if (avisos.length) console.log("AVISOS (faltan archivos, no bloquean):\n  " + [...new Set(avisos)].join("\n  "));
  if (errores.length) { console.log("ERRORES:\n  " + [...new Set(errores)].join("\n  ")); process.exit(1); }
  console.log("✔ Sin errores.");
})();
