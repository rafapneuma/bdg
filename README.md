# Balcón del Golf — App de comunidad (prototipo)

Prototipo de web app para la comunidad de vecinos **Balcón del Golf** (Riviera del Sol, Mijas, ~200 viviendas).

> ⚠️ **Es solo una demo.** Sin login, sin backend y con **datos inventados**. Los cambios (crear una incidencia, votar un sondeo) solo se mantienen durante la sesión del navegador; al recargar, se reinician.

## Secciones

- **Inicio** — resumen: último aviso, incidencias abiertas, saldo y sondeo activo.
- **Incidencias** — lista con estado (Abierta / En curso / Resuelta), ficha de detalle y formulario para crear una nueva (con foto opcional).
- **Sondeos** — un sondeo activo para votar (resultados en barras en directo) y sondeos cerrados.
- **Avisos** — tablón de comunicados de la comunidad.
- **Documentos** — actas, presupuestos y facturas (visor de ejemplo, sin PDF real).
- **Económico** — saldo y fondo **calculados** a partir de un mini-libro de movimientos, viviendas con cuotas/recibos (estado y morosidad automáticos) y partidas aprobadas con presupuesto adjunto (solo lectura, sin pagos).
- **Administración** — panel de gestión visible solo para roles con permisos (crear avisos, subir documentos, crear/cerrar sondeos, editar económico).

## Roles (demo)

Como la demo no tiene login, hay un **selector de rol** en la cabecera para ponerte en la piel de cada cargo:

| Acción | Administrador | Presidente | Vicepresidente | Vecino |
|---|:--:|:--:|:--:|:--:|
| Editar económico | ✅ | — | — | — |
| Gestionar documentos | ✅ | ✅ | — | — |
| Crear avisos | ✅ | ✅ | ✅ | — |
| Crear/cerrar sondeos | ✅ | ✅ | ✅ | — |
| Cambiar estado de incidencias | ✅ | ✅ | ✅ | — |
| Crear incidencias / votar | ✅ | ✅ | ✅ | ✅ |

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

Automático a **GitHub Pages** mediante GitHub Actions (`.github/workflows/deploy.yml`) en cada `push` a `main`. El `base` de Vite está fijado a `/bdg/`.
