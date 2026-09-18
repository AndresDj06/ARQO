# ARQO

Landing y CMS para estudio de arquitectura: hero con video, portafolio editorial, panel de administración y API Laravel.

## Stack

- **Backend:** Laravel 12, Sanctum (sesión SPA), MySQL
- **Frontend:** React 19, TypeScript, Vite 7, Tailwind CSS 4, Motion
- **Servidor local:** XAMPP — URL base `http://localhost/arqo`

## Requisitos

- PHP 8.2+, Composer
- Node.js 20+
- MySQL (base de datos `arqo`)

## Instalación

```bash
cp .env.example .env
composer install
npm install
php artisan key:generate
php artisan migrate --seed
npm run build
```

Configura en `.env`: `APP_URL`, credenciales MySQL, `ARQO_HERO_VIDEO`, `ARQO_WHATSAPP`.

**Admin de prueba:** `admin@arqo.test` / `password`

## Versiones

Consulta [CHANGELOG.md](CHANGELOG.md). Las releases se publican con tags `v*` en GitHub.

## Licencia

Proyecto privado del estudio ARQO.
