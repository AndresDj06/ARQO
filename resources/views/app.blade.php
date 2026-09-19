<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="app-basename" content="{{ $webBase ?? '/' }}">
        <title>{{ config('app.name', 'ARQO') }}</title>
        {{-- El tema se aplica antes de pintar para que no se vea un parpadeo claro al recargar. --}}
        <script>
            (function () {
                var tema = 'claro';
                try {
                    if (localStorage.getItem('arqo-tema') === 'oscuro') tema = 'oscuro';
                } catch (error) {}
                document.documentElement.dataset.tema = tema;
                document.documentElement.style.colorScheme = tema === 'oscuro' ? 'dark' : 'light';
            })();
        </script>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    </head>
    <body class="min-h-screen text-slate-800 antialiased">
        <div id="app"></div>
    </body>
</html>
