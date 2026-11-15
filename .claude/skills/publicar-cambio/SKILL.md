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
- PDF del RTE: cópialos a `public_html/transparencia/rte2026/docs/` con el nombre exacto de `LEEME.txt`.
- Si agregas una página nueva, agrégala también a `public_html/sitemap.xml` y enlázala desde el menú
  o el pie (rutas relativas, igual que las existentes).

## 4. Compilar y probar

```bash
cd herramientas
npm run listo
```

- `ERRORES` = no se puede publicar: corrígelos y vuelve a correr.
- `AVISOS` de PDF faltantes no bloquean, pero menciónalos.

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
git commit -m "<tipo>: <qué cambia, en una línea>"
git push origin main
```

Tipos de commit: `contenido` (textos), `diseno` (estilos), `rte` (página de transparencia o sus PDF),
`imagen`, `pagina` (página nueva), `arreglo`.

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
