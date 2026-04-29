# Laura Cortés — Portafolio

Portafolio web personal de **Laura Cortés** · Diseño Gráfico & Arquitectura.
Sitio estático (HTML, CSS, JS) listo para desplegarse en **GitHub Pages**.

## Estructura

```
.
├── index.html          # Single-page con todas las secciones
├── css/styles.css      # Estilos + animaciones
├── js/script.js        # Interacciones (scroll, menú, formulario, tilt)
├── img/                # Recursos visuales
│   ├── arqui/          # Proyectos de arquitectura
│   ├── diseño grafico/ # Proyectos de diseño gráfico
│   └── ...             # Logos, fondos, decoraciones
└── README.md
```

## Probar localmente

Abre `index.html` directamente en el navegador, o monta un servidor estático:

```bash
# Python 3
python -m http.server 8080
# Node
npx serve .
```

Visita: `http://localhost:8080`

## Desplegar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `portafolio` o `<usuario>.github.io`).
2. Sube todo el contenido de esta carpeta:
   ```bash
   git init
   git add .
   git commit -m "Portafolio inicial"
   git branch -M main
   git remote add origin https://github.com/<usuario>/<repo>.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Source: `main` / `/ (root)`**.
4. Tu sitio estará en `https://<usuario>.github.io/<repo>/` (o `https://<usuario>.github.io/` si el repo se llama `<usuario>.github.io`).

> **Tip:** Para evitar problemas con caracteres especiales en URLs en algunos hostings, considera renombrar la carpeta `diseño grafico` a `diseno-grafico` (y actualizar las rutas en `index.html`). En GitHub Pages funciona, pero la URL queda más limpia.

## Personalización rápida

- Colores: variables CSS en `:root` (archivo `css/styles.css`).
- Tipografía: enlaces a Google Fonts en `<head>` de `index.html`.
- Textos / proyectos: directamente en `index.html`.
- Imágenes nuevas: súbelas a `img/` y referencia en el HTML.

## Tecnologías

- HTML5 semántico
- CSS moderno (Grid, Flex, custom properties, animaciones)
- JavaScript vanilla (sin dependencias)
- Google Fonts: *Abril Fatface*, *Playfair Display*, *Caveat*, *Poppins*

— Hecho con cariño para Laura ✦
