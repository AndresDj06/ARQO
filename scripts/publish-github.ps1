# Publicar ARQO en GitHub (ejecutar tras: gh auth login)
param(
    [string]$Repo = "arqo",
    [ValidateSet('public', 'private')]
    [string]$Visibility = 'private'
)

$ErrorActionPreference = 'Stop'
$gh = "$env:TEMP\gh-cli\bin\gh.exe"
if (-not (Test-Path $gh)) {
    Write-Host "Descarga gh portable o instala GitHub CLI, luego: gh auth login"
    exit 1
}

& $gh auth status | Out-Null

$remote = git remote get-url origin 2>$null
if (-not $remote) {
    & $gh repo create $Repo --$Visibility --source=. --remote=origin --description "ARQO — landing y CMS de arquitectura (Laravel + React)"
} else {
    Write-Host "Remote origin ya existe: $remote"
}

git push -u origin main
git push origin --tags
Write-Host "Listo. Crea releases en GitHub o deja que el workflow las genere con cada tag v*."
