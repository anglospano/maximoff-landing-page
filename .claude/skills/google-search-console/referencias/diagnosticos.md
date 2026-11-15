# Diagnósticos del informe "Páginas" (Indexación)

Para cada motivo: qué significa, si es normal en este sitio y qué hacer.

| Motivo en Search Console | Qué significa | ¿Normal aquí? | Qué hacer |
|---|---|---|---|
| **Página con redirección** | La URL manda a otra | Sí, para `http://…` y `www.…` (el `.htaccess` las lleva a `https://fundmaximoff.org`) | Nada, si son esas variantes |
| **No se ha encontrado (404)** | La URL no existe | Sí, si es una URL inventada o vieja sin importancia | Si era una página real que se movió: redirección 301 en `.htaccess` (con autorización de Luis) |
| **Excluida por la etiqueta "noindex"** | La página pide no ser indexada | Sí para `/404.html` | Si sale en otra página, revisar su `<head>` |
| **Descubierta: actualmente sin indexar** | Google sabe que existe pero no la ha visitado | Normal en sitios nuevos las primeras semanas | Enlazarla desde inicio/pie, confirmar que está en el sitemap, **Solicitar indexación** una vez |
| **Rastreada: actualmente sin indexar** | Google la leyó y decidió no guardarla (por ahora) | Puede pasar con páginas con poco texto | Mejorar el contenido real de la página (más útil y específico); esperar y volver a pedir indexación |
| **Duplicada: el usuario no ha indicado ninguna versión canónica** | Hay varias versiones iguales | No debería pasar (todas las páginas tienen canonical) | Revisar `<link rel="canonical">` de esa página |
| **Duplicada: Google ha elegido una canónica diferente a la del usuario** | Google prefiere otra URL como oficial | No debería | Revisar canonical, enlaces internos y sitemap: los tres deben apuntar a la misma URL exacta |
| **Error del servidor (5xx)** | El hosting falló al responder | No | Ver si el sitio abre; si se repite, revisar GoDaddy (estado del hosting) y avisar a Luis |
| **Bloqueada por robots.txt** | `robots.txt` le prohíbe entrar | No (nuestro robots permite todo) | Revisar `public_html/robots.txt` |
| **Soft 404** | La página existe pero Google cree que está vacía | No debería | Revisar que la página tenga contenido real |

## Otras alertas

| Alerta | Qué hacer |
|---|---|
| Sitemap con estado **No se ha podido obtener** | Abrir `https://fundmaximoff.org/sitemap.xml` en el navegador; si no abre, el último deploy pudo fallar (revisar GitHub Actions) |
| **Problemas de HTTPS** | Revisar el certificado en GoDaddy (Certificate Inventory) y en cPanel → SSL/TLS Status |
| **Acciones manuales** o **Problemas de seguridad** distintos de "sin problemas" | Urgente: avisar a Luis el mismo día |
| Caída brusca de clics | Primero verificar que el sitio abre y que el último deploy salió bien; luego comparar fechas con los cambios publicados (`git log`) |
