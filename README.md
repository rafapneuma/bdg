# Balcón del Golf — App de comunidad (prototipo)

Prototipo de web app para la comunidad de vecinos **Balcón del Golf** (Riviera del Sol, Mijas, ~200 viviendas).

> ⚠️ **Es solo una demo.** Sin login, sin backend y con **datos inventados**. Los cambios (crear una incidencia, votar un sondeo) solo se mantienen durante la sesión del navegador; al recargar, se reinician.

## Secciones

- **Inicio** — resumen: último aviso, incidencias abiertas, saldo y sondeo activo.
- **Incidencias** — lista con estado (Abierta / En curso / Resuelta), ficha de detalle y formulario para crear una nueva (con foto opcional).
- **Sondeos** — un sondeo activo para votar (resultados en barras en directo) y sondeos cerrados.
- **Avisos** — tablón de comunicados de la comunidad.
- **Documentos** — actas, presupuestos y facturas (visor de ejemplo, sin PDF real).
- **Económico** — presupuestos, saldo, previsiones y estado de deuda de una vivienda (solo lectura, sin pagos).

## Stack

React + TypeScript + Vite + Tailwind CSS · enrutado con `HashRouter` · estado en memoria (React Context) · diseño mobile-first.

## Desarrollo

```bash
npm install
npm run dev      # servidor local
npm run build    # compilar para producción
npm run preview  # previsualizar el build
```

## Despliegue

Automático a **GitHub Pages** mediante GitHub Actions (`.github/workflows/deploy.yml`) en cada `push` a `main`. El `base` de Vite está fijado a `/balcon-del-golf/`.
