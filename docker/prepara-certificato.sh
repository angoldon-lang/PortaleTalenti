#!/usr/bin/env bash
# Genera il certificato che il proxy usa per l'HTTPS. Si lancia sulla macchina
# ospite, una volta sola, prima del primo 'docker compose up':
#
#   bash docker/prepara-certificato.sh [file-env]    (predefinito: .env.docker)
#
# Gira qui e non in un contenitore perche' openssl c'e' su qualsiasi Ubuntu e
# su macOS, mentre nessuna immagine ufficiale di Node, Postgres o Caddy lo
# porta: installarlo avrebbe aggiunto uno stadio di build e una dipendenza di
# rete per due righe di comando.
#
# E' autofirmato: il browser avvisera' che non riconosce l'emittente, perche'
# per un indirizzo di rete interna nessuna autorita' pubblica puo' firmare
# nulla. La connessione resta cifrata. Con un dominio pubblico raggiungibile
# si passa a Caddyfile.letsencrypt e l'avviso sparisce.
#
# INDIRIZZO (letto da .env.docker): host o IP con cui si apre il portale.
# Finisce nel SAN, l'unico campo che i browser guardano da anni: se non
# combacia, il certificato viene rifiutato prima dell'avviso sull'emittente.

set -eu

cd "$(dirname "$0")/.." || exit 1
FILE_ENV="${1:-.env.docker}"

DESTINAZIONE="${DESTINAZIONE:-./certificati}"
GIORNI="${GIORNI:-825}"

# INDIRIZZO puo' arrivare dall'ambiente o dal file env.
if [ -z "${INDIRIZZO:-}" ] && [ -f "$FILE_ENV" ]; then
  INDIRIZZO="$(grep -E '^[[:space:]]*INDIRIZZO=' "$FILE_ENV" | tail -1 |
    sed -E 's/^[[:space:]]*INDIRIZZO=[[:space:]]*//' |
    sed -E 's/^"(.*)"$/\1/' |
    sed -E "s/^'(.*)'\$/\\1/" |
    sed -E 's/[[:space:]]+#.*$//; s/[[:space:]]+$//')"
fi

if [ -z "${INDIRIZZO:-}" ]; then
  echo "INDIRIZZO non impostato." >&2
  echo "Mettilo in $FILE_ENV (host o IP con cui apri il portale), per esempio:" >&2
  echo '  INDIRIZZO="10.254.254.90"' >&2
  exit 1
fi

if ! command -v openssl >/dev/null 2>&1; then
  echo "openssl non e' installato su questa macchina." >&2
  echo "  Ubuntu/Debian:  sudo apt install -y openssl" >&2
  exit 1
fi

CERT="$DESTINAZIONE/portale.crt"
CHIAVE="$DESTINAZIONE/portale.key"
IMPRONTA="$DESTINAZIONE/.indirizzo"

mkdir -p "$DESTINAZIONE"

# Rigenera se manca, se e' scaduto, o se l'indirizzo e' cambiato: altrimenti
# un cambio di IP lascerebbe in giro un certificato che non combacia piu'.
if [ -f "$CERT" ] && [ -f "$CHIAVE" ] && [ -f "$IMPRONTA" ] &&
   [ "$(cat "$IMPRONTA")" = "$INDIRIZZO" ] &&
   openssl x509 -checkend 2592000 -noout -in "$CERT" >/dev/null 2>&1; then
  echo "Certificato già presente e valido per $INDIRIZZO, non lo rigenero."
  openssl x509 -noout -subject -enddate -in "$CERT"
  exit 0
fi

# Un IP va dichiarato come IP nel SAN, un nome come DNS: scambiarli invalida
# il certificato agli occhi del browser.
if echo "$INDIRIZZO" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$'; then
  SAN="IP:$INDIRIZZO"
else
  SAN="DNS:$INDIRIZZO"
fi
# localhost serve per le prove fatte da dentro la macchina stessa.
case "$INDIRIZZO" in
  localhost|127.0.0.1) ;;
  *) SAN="$SAN,DNS:localhost,IP:127.0.0.1" ;;
esac

echo "Genero un certificato autofirmato per $INDIRIZZO ($SAN), valido $GIORNI giorni."
# openssl riversa su stderr una riga di puntini per ogni byte di entropia:
# la trattengo e la mostro solo se qualcosa va storto.
RUMORE="$(mktemp)"
trap 'rm -f "$RUMORE"' EXIT
if ! openssl req -x509 -newkey rsa:2048 -sha256 -nodes \
  -days "$GIORNI" \
  -keyout "$CHIAVE" \
  -out "$CERT" \
  -subj "/CN=$INDIRIZZO" \
  -addext "subjectAltName=$SAN" \
  -addext "basicConstraints=critical,CA:FALSE" \
  -addext "keyUsage=critical,digitalSignature,keyEncipherment" \
  -addext "extendedKeyUsage=serverAuth" 2>"$RUMORE"; then
  echo "openssl ha fallito:" >&2
  cat "$RUMORE" >&2
  exit 1
fi

printf '%s' "$INDIRIZZO" > "$IMPRONTA"
chmod 644 "$CERT"
chmod 600 "$CHIAVE"

openssl x509 -noout -subject -enddate -ext subjectAltName -in "$CERT"
echo "Fatto."
