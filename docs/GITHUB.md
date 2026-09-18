# Publicar en GitHub (ARQO)

## Primera subida

1. Crea un repositorio vacío en GitHub (sin README ni `.gitignore`), por ejemplo `arqo`.
2. En la raíz del proyecto:

```powershell
git remote add origin https://github.com/TU_USUARIO/arqo.git
git push -u origin main
git push origin v1.0.0
```

3. Actualiza en `CHANGELOG.md` el enlace de la release con tu usuario/org.

## Nuevas versiones (SemVer)

1. Actualiza `VERSION` y `CHANGELOG.md` (sección `[x.y.z]`).
2. Commit, tag y push:

```powershell
git add VERSION CHANGELOG.md
git commit -m "chore: release v1.1.0"
git tag -a v1.1.0 -m "ARQO 1.1.0"
git push origin main
git push origin v1.1.0
```

El workflow `.github/workflows/release.yml` crea la **GitHub Release** al subir un tag `v*`.

## Requisitos

- [GitHub CLI](https://cli.github.com/) (opcional): `gh auth login` y `gh repo create TU_USUARIO/arqo --private --source=. --push`

Nunca subas `.env` ni claves; ya están en `.gitignore`.
