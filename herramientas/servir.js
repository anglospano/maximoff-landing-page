/*
 * Servidor local mínimo para ver el sitio tal como quedará publicado.
 * Uso: npm run servir   ->   http://127.0.0.1:8765
 * También lo usa check.js para probar enlaces.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const PUBLIC = path.resolve(__dirname, "..", "public_html");
const TIPOS = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".svg": "image/svg+xml", ".ico": "image/x-icon", ".pdf": "application/pdf",
  ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".json": "application/json",
};

function crearServidor() {
  return http.createServer((req, res) => {
    let ruta = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let archivo = path.join(PUBLIC, ruta);
    if (!archivo.startsWith(PUBLIC)) { res.writeHead(403).end(); return; }
    if (fs.existsSync(archivo) && fs.statSync(archivo).isDirectory()) archivo = path.join(archivo, "index.html");
    if (!fs.existsSync(archivo)) {
      res.writeHead(404, { "content-type": TIPOS[".html"] });
      res.end(fs.readFileSync(path.join(PUBLIC, "404.html")));
      return;
    }
    res.writeHead(200, { "content-type": TIPOS[path.extname(archivo).toLowerCase()] || "application/octet-stream" });
    fs.createReadStream(archivo).pipe(res);
  });
}

module.exports = { crearServidor };

if (require.main === module) {
  crearServidor().listen(8765, "127.0.0.1", () => console.log("Sitio en http://127.0.0.1:8765  (Ctrl+C para salir)"));
}
