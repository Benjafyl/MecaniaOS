#!/usr/bin/env bash

set -Eeuo pipefail

APP_DIR="${APP_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)}"
BRANCH="${BRANCH:-Pruebas-Servidor}"
REMOTE="${REMOTE:-origin}"
PM2_BIN="${PM2_BIN:-/home/ignacio/.nvm/versions/node/v24.14.1/bin/pm2}"
PM2_TARGET="${PM2_TARGET:-1}"

log() {
  printf '\n[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1"
}

fail() {
  printf '\n[deploy] Error: %s\n' "$1" >&2
  exit 1
}

command -v git >/dev/null 2>&1 || fail "git no esta disponible"
command -v pnpm >/dev/null 2>&1 || fail "pnpm no esta disponible"
[[ -x "$PM2_BIN" ]] || fail "No se encontro PM2 en $PM2_BIN"
[[ -d "$APP_DIR/.git" ]] || fail "APP_DIR no apunta a un repositorio git: $APP_DIR"

log "Entrando a $APP_DIR"
cd "$APP_DIR"

log "Actualizando codigo desde $REMOTE/$BRANCH"
git fetch "$REMOTE"
git reset --hard "$REMOTE/$BRANCH"

log "Compilando aplicacion"
pnpm build

log "Reiniciando PM2 target $PM2_TARGET"
"$PM2_BIN" restart "$PM2_TARGET" --update-env

log "Guardando estado de PM2"
"$PM2_BIN" save

log "Deploy completado"
