# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y versionado [SemVer](https://semver.org/lang/es/).

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

[1.1.0]: https://github.com/AndresDj06/ARQO/releases/tag/v1.1.0
[1.0.0]: https://github.com/AndresDj06/ARQO/releases/tag/v1.0.0
