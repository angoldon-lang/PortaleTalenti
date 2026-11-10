#!/usr/bin/env bash
# Dice se le porte che lo stack vuole pubblicare sono libere, e se non lo sono
# chi le occupa e quali usare invece. Da lanciare PRIMA di 'docker compose up':
# il compose fallirebbe a meta' avvio, con il database gia' creato e il proxy
# no, che e' lo stato piu' scomodo in cui trovarsi.
#
#   bash docker/controlla-porte.sh [file-env]      (predefinito: .env.docker)

set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
FILE_ENV="${1:-.env.docker}"

ok()   { printf '  \033[32m✓\033[0m %s\n' "$*"; }
ko()   { printf '  \033[31m✗\033[0m %s\n' "$*"; }
info() { printf '    %s\n' "$*"; }

# Legge una variabile dal file env: ultima assegnazione, senza apici attorno
# al valore e senza eventuale commento in coda.
leggi() {
  [ -f "$FILE_ENV" ] || return 1
  grep -E "^[[:space:]]*$1=" "$FILE_ENV" | tail -1 |
    sed -E "s/^[[:space:]]*$1=[[:space:]]*//" |
    sed -E 's/^"(.*)"$/\1/' |
    sed -E "s/^'(.*)'\$/\\1/" |
    sed -E 's/[[:space:]]+#.*$//; s/[[:space:]]+$//'
}

if [ -f "$FILE_ENV" ]; then
  HTTPS_PORT="$(leggi HTTPS_PORT)"; HTTP_PORT="$(leggi HTTP_PORT)"
  printf 'Porte lette da %s\n' "$FILE_ENV"
else
  printf '%s non c'\''e'\'' ancora: uso i valori predefiniti.\n' "$FILE_ENV"
fi
HTTPS_PORT="${HTTPS_PORT:-8443}"
HTTP_PORT="${HTTP_PORT:-8080}"

# Chi occupa la porta. Prova gli strumenti nell'ordine in cui e' probabile
# trovarli su un server: ss (iproute2), poi lsof, poi fuser.
occupante() {
  local porta="$1" out=""
  if command -v ss >/dev/null 2>&1; then
    out="$(ss -lntpH 2>/dev/null | awk -v p=":$porta\$" '$4 ~ p {print $4, $NF}')"
  elif command -v lsof >/dev/null 2>&1; then
    out="$(lsof -nP -iTCP:"$porta" -sTCP:LISTEN 2>/dev/null | tail -n +2)"
  elif command -v fuser >/dev/null 2>&1; then
    out="$(fuser -n tcp "$porta" 2>/dev/null)"
  else
    printf '__nessuno_strumento__'; return
  fi
  printf '%s' "$out"
}

# Secondo parere indipendente: un bind di prova. Se la porta e' presa il bind
# fallisce, e questo vale anche quando nessuno strumento di ispezione c'e'.
bind_riesce() {
  local porta="$1"
  if command -v python3 >/dev/null 2>&1; then
    python3 - "$porta" <<'PYEOF' >/dev/null 2>&1
import socket, sys
s = socket.socket()
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
try:
    s.bind(('0.0.0.0', int(sys.argv[1])))
finally:
    s.close()
PYEOF
    return $?
  fi
  return 2  # non verificabile
}

# Porte alte plausibili da proporre in alternativa.
suggerisci() {
  local candidate=(8443 9443 10443 8444 18443 8080 8081 9080 18080)
  for c in "${candidate[@]}"; do
    if [ "$c" != "$HTTPS_PORT" ] && [ "$c" != "$HTTP_PORT" ] && bind_riesce "$c"; then
      printf '%s' "$c"; return
    fi
  done
}

PROBLEMI=0
printf '\n'
for coppia in "HTTPS:$HTTPS_PORT" "HTTP:$HTTP_PORT"; do
  NOME="${coppia%%:*}"; PORTA="${coppia##*:}"

  if ! printf '%s' "$PORTA" | grep -Eq '^[0-9]+$' || [ "$PORTA" -lt 1 ] || [ "$PORTA" -gt 65535 ]; then
    ko "$NOME: \"$PORTA\" non e' un numero di porta valido"
    PROBLEMI=$((PROBLEMI+1)); continue
  fi

  CHI="$(occupante "$PORTA")"
  bind_riesce "$PORTA"; ESITO_BIND=$?

  if [ -n "$CHI" ] && [ "$CHI" != "__nessuno_strumento__" ]; then
    ko "$NOME: porta $PORTA gia' occupata"
    printf '%s\n' "$CHI" | sed 's/^/      /'
    PROBLEMI=$((PROBLEMI+1))
  elif [ "$ESITO_BIND" -eq 1 ]; then
    ko "$NOME: porta $PORTA gia' occupata (non riesco a dire da chi)"
    PROBLEMI=$((PROBLEMI+1))
  elif [ "$ESITO_BIND" -eq 0 ]; then
    ok "$NOME: porta $PORTA libera"
  else
    info "$NOME: porta $PORTA non verificabile su questa macchina"
  fi

  if [ "$PORTA" -lt 1024 ]; then
    info "sotto la 1024: Docker la pubblica solo con privilegi di root"
  fi
done

printf '\n'
if [ "$PROBLEMI" -eq 0 ]; then
  printf '  \033[32mPuoi avviare:\033[0m docker compose --env-file %s up -d --build\n\n' "$FILE_ENV"
  exit 0
fi

ALTERNATIVA="$(suggerisci)"
printf '  \033[31m%d porta/e da cambiare.\033[0m Modifica HTTPS_PORT / HTTP_PORT in %s' "$PROBLEMI" "$FILE_ENV"
[ -n "$ALTERNATIVA" ] && printf ' (per esempio %s, che risulta libera)' "$ALTERNATIVA"
printf '.\n  Ricordati di allineare AUTH_URL alla nuova porta HTTPS.\n\n'
exit 1
