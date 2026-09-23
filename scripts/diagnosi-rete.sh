#!/usr/bin/env bash
# Raccoglie lo stato di un'installazione raggiunta dalla rete e dice, riga per
# riga, quale strato risponde e quale no: versioni, variabili, ascolto sulla
# porta, firewall, risposta dell'app da localhost e dall'IP, risorse interne.
#
#   bash scripts/diagnosi-rete.sh [porta] [indirizzo]
#
# porta      predefinita 3000
# indirizzo  l'host che scrivi nel browser dall'altro computer; se lo ometti
#            viene usato il primo indirizzo di questa macchina
#
# Non stampa nessun valore segreto: di .env riporta solo se le chiavi ci sono.

set -uo pipefail
PORTA="${1:-3000}"
INDIRIZZO="${2:-}"
cd "$(dirname "$0")/.." || exit 1

ok()   { printf '  \033[32m✓\033[0m %s\n' "$*"; }
ko()   { printf '  \033[31m✗\033[0m %s\n' "$*"; }
info() { printf '    %s\n' "$*"; }
titolo() { printf '\n\033[1m%s\033[0m\n' "$*"; }

PROBLEMI=()
segnala() { PROBLEMI+=("$1"); }

titolo "1. Versioni"
if command -v node >/dev/null 2>&1; then
  NODE_V="$(node -v)"
  NODE_MAJ="$(printf '%s' "$NODE_V" | sed 's/^v//; s/\..*//')"
  if [ "$NODE_MAJ" -ge 20 ] 2>/dev/null; then ok "node $NODE_V"; else
    ko "node $NODE_V — serve 20.12 o superiore"
    segnala "Node troppo vecchio: installa Node 22 da NodeSource (vedi README)."
  fi
else
  ko "node non installato"; segnala "Node non e' installato."
fi
if command -v npm >/dev/null 2>&1; then
  NPM_PATH="$(command -v npm)"
  case "$(readlink -f "$NPM_PATH" 2>/dev/null || printf '%s' "$NPM_PATH")" in
    */share/nodejs/*)
      ko "npm $(npm -v) da pacchetti apt ($NPM_PATH)"
      segnala "npm e' quello ripacchettato da Debian/Ubuntu: si rompe sulle peer dependency. Reinstalla Node da NodeSource." ;;
    *) ok "npm $(npm -v)" ;;
  esac
fi
[ -d node_modules ] && ok "node_modules presente" || { ko "node_modules assente"; segnala "Dipendenze non installate: lancia 'npm install'."; }

titolo "2. Variabili d'ambiente (.env)"
if [ -f .env ]; then
  ok ".env presente"
  chiave_presente() { grep -Eq "^[[:space:]]*$1=[\"']?[^\"'[:space:]]" .env; }
  mostra() { grep -E "^[[:space:]]*$1=" .env | head -1 | sed 's/^[[:space:]]*//'; }
  for k in DATABASE_URL AUTH_SECRET; do
    chiave_presente "$k" && ok "$k valorizzata" || { ko "$k mancante o vuota"; segnala "$k non e' valorizzata in .env."; }
  done
  if chiave_presente AUTH_URL; then ok "$(mostra AUTH_URL)"; else
    info "AUTH_URL non valorizzata (serve per accedere da un altro computer)"
  fi
  if chiave_presente DEV_ORIGINS; then
    VAL="$(mostra DEV_ORIGINS)"
    ok "$VAL"
    case "$VAL" in
      *:[0-9]*|*http*)
        ko "DEV_ORIGINS contiene porta o schema: vuole il solo host"
        segnala "Correggi DEV_ORIGINS in .env: host solo, senza http:// e senza :porta." ;;
    esac
  else
    info "DEV_ORIGINS non valorizzata (in sviluppo serve per aprire l'app dall'IP di rete)"
  fi
else
  ko ".env assente"; segnala "Manca .env: copialo da .env.example."
fi

titolo "3. Indirizzi di questa macchina"
if command -v hostname >/dev/null 2>&1 && hostname -I >/dev/null 2>&1; then
  for a in $(hostname -I); do info "http://$a:$PORTA"; done
elif command -v ip >/dev/null 2>&1; then
  ip -4 -o addr show scope global 2>/dev/null | awk -v p="$PORTA" '{split($4,x,"/"); print "    http://" x[1] ":" p}'
else
  info "(nessuno strumento per elencarli)"
fi

titolo "4. Ascolto sulla porta $PORTA"
ASCOLTO=""
if command -v ss >/dev/null 2>&1; then ASCOLTO="$(ss -lntp 2>/dev/null | grep ":$PORTA ")"
elif command -v netstat >/dev/null 2>&1; then ASCOLTO="$(netstat -lntp 2>/dev/null | grep ":$PORTA ")"; fi
if [ -n "$ASCOLTO" ]; then
  printf '%s\n' "$ASCOLTO" | sed 's/^/    /'
  case "$ASCOLTO" in
    *0.0.0.0:$PORTA*|*\*:$PORTA*|*:::$PORTA*) ok "in ascolto su tutte le interfacce" ;;
    *127.0.0.1:$PORTA*)
      ko "in ascolto solo su localhost"
      segnala "Il server accetta solo connessioni locali: riavvialo con '-H 0.0.0.0'." ;;
  esac
elif command -v ss >/dev/null 2>&1 || command -v netstat >/dev/null 2>&1; then
  ko "nessun processo in ascolto sulla porta $PORTA"
  segnala "Il server non e' avviato: lancia 'npm run dev -- -H 0.0.0.0'."
else
  info "(ne' ss ne' netstat disponibili: salto)"
fi

titolo "5. Firewall"
if command -v ufw >/dev/null 2>&1; then
  STATO="$(ufw status 2>/dev/null || echo "serve sudo")"
  case "$STATO" in
    *inactive*) ok "ufw inattivo, non blocca nulla" ;;
    *"serve sudo"*) info "non leggibile senza sudo: prova 'sudo ufw status'" ;;
    *)
      if printf '%s' "$STATO" | grep -q "$PORTA"; then ok "ufw attivo, porta $PORTA aperta"; else
        ko "ufw attivo e porta $PORTA non aperta"
        segnala "Apri la porta: 'sudo ufw allow $PORTA/tcp'."
      fi ;;
  esac
else
  ok "ufw non installato"
fi

titolo "6. Risposta dell'applicazione"
codice() { curl -s -o /dev/null -m 8 -w '%{http_code}' "$@" 2>/dev/null; }
LOCALE="$(codice "http://127.0.0.1:$PORTA/login")"
case "$LOCALE" in
  200) ok "da localhost: $LOCALE" ;;
  000) ko "da localhost: nessuna risposta"; segnala "L'app non risponde nemmeno in locale: guarda il terminale di 'npm run dev'." ;;
  *)   ko "da localhost: $LOCALE" ;;
esac

IP_LOCALE="$( (hostname -I 2>/dev/null || true) | awk '{print $1}')"
BERSAGLIO="${INDIRIZZO:-$IP_LOCALE}"

if [ -n "$BERSAGLIO" ] && [ "$LOCALE" = "200" ]; then
  DA_IP="$(codice "http://$BERSAGLIO:$PORTA/login")"
  case "$DA_IP" in
    200) ok "da $BERSAGLIO: $DA_IP" ;;
    000)
      ko "da $BERSAGLIO: nessuna risposta"
      segnala "L'app risponde su localhost ma non su $BERSAGLIO. Se l'indirizzo e' giusto il traffico non arriva: firewall, oppure la VM e' in NAT e serve l'inoltro della porta $PORTA." ;;
    *) ko "da $BERSAGLIO: $DA_IP" ;;
  esac

  ASSET="$(curl -s -m 8 "http://127.0.0.1:$PORTA/login" 2>/dev/null | grep -o '/_next/static/[a-zA-Z0-9._/-]*\.js' | head -1)"
  if [ -n "$ASSET" ]; then
    CROSS="$(codice -H "Host: $BERSAGLIO:$PORTA" -H "Origin: http://$BERSAGLIO:$PORTA" "http://127.0.0.1:$PORTA$ASSET")"
    if [ "$CROSS" = "403" ]; then
      ko "CSS e JavaScript richiesti da $BERSAGLIO: 403"
      segnala "Il server rifiuta le risorse interne chieste da $BERSAGLIO: aggiungilo a DEV_ORIGINS in .env, oppure svuota DEV_ORIGINS per disattivare il controllo."
    else
      ok "CSS e JavaScript richiesti da $BERSAGLIO: $CROSS"
    fi
  fi
elif [ "$LOCALE" = "200" ]; then
  info "nessun indirizzo da provare: rilancia indicandolo, es. 'bash scripts/diagnosi-rete.sh $PORTA 10.254.254.90'"
fi

titolo "7. Database"
if command -v pg_isready >/dev/null 2>&1; then
  pg_isready >/dev/null 2>&1 && ok "PostgreSQL accetta connessioni" || { ko "PostgreSQL non risponde"; segnala "PostgreSQL non e' raggiungibile: avvialo prima dell'app."; }
else
  info "(pg_isready non disponibile: salto)"
fi

titolo "Esito"
if [ ${#PROBLEMI[@]} -eq 0 ]; then
  printf '  \033[32m✓ Nessun problema rilevato.\033[0m Se il browser non apre la pagina, prova\n'
  printf '    da un altro browser o in finestra anonima: potrebbe essere la cache.\n\n'
else
  printf '  \033[31m%d problema/i:\033[0m\n' "${#PROBLEMI[@]}"
  i=1; for p in "${PROBLEMI[@]}"; do printf '  %d. %s\n' "$i" "$p"; i=$((i+1)); done
  printf '\n'
fi
