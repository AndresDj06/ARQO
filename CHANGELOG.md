# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y versionado [SemVer](https://semver.org/lang/es/).

## [1.2.0] - 2026-09-18

### Added

- Portafolio con identidad propia: índice editorial sobre fondo grafito, dos vistas (índice y mosaico), barra de filtros adherida, contadores de obras/categorías/estilos y barra de progreso de lectura.
- Vista previa de imagen que sigue al cursor al recorrer el índice (solo escritorio con puntero fino).
- Transiciones entre pestañas más expresivas: la navbar se mantiene estable mientras el contenido entra con revelado por recorte.
- Footer con variante oscura y navbar con variante para páginas de fondo oscuro.
- Al cambiar de pestaña la página vuelve arriba; con ancla busca la sección aunque los datos tarden en llegar.
- Etiquetas visibles en todos los campos de «Sobre mí» del panel.

### Fixed

- La navbar dejaba de estar anclada al viewport: `.page-stage` conservaba el transform final de su animación y se volvía el bloque contenedor del header `fixed`.
- Extensión GD de PHP activada y llamadas a funciones de imagen con prefijo global en `App\Support\Media` (fallaba la carga del avatar).
- El login ya no precarga credenciales de ejemplo; usa placeholders.

## [1.1.0] - 2026-09-18

### Added

- Banda metálica a todo el ancho en «Para mí» (`.band-metal`).
- Identidad propia para «Cómo trabajamos»: cabecera sticky, riel vertical con nodos, índices en glass y barrido de luz al hover.
- Identidad propia para «Archivo abierto»: fichas desfasadas, número fantasma en contorno y flecha animada.

### Fixed

- CSRF token mismatch en login y CRUD del admin (cookie Sanctum dinámica + reintento en 419).
- Cambio de imagen del arquitecto en «Sobre mí» (validación de archivo y previsualización).

## [1.0.0] - 2026-09-18

### Added

- Landing ARQO con hero de video scroll-locked, tema Liquid Glass y portafolio editorial.
- SPA React + Laravel 12: API pública, Sanctum, panel admin (proyectos, servicios, recursos, perfil, pie de página).
- Página `/portafolio`, fichas de proyecto, footer editable desde admin.
- CRUD de categorías y estilos arquitectónicos.
- Animaciones optimizadas (CSS + Motion), admin responsive con menú móvil.
- MySQL (XAMPP), seeders de demo y video hero en `public/vids`.

[1.2.0]: https://github.com/AndresDj06/ARQO/releases/tag/v1.2.0
[1.1.0]: https://github.com/AndresDj06/ARQO/releases/tag/v1.1.0
[1.0.0]: https://github.com/AndresDj06/ARQO/releases/tag/v1.0.0
