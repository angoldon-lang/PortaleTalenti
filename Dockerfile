# syntax=docker/dockerfile:1
#
# Immagine del portale. Tre stadi:
#   deps      le dipendenze, in un livello che si invalida solo col lockfile
#   builder   la build di Next; serve anche da immagine per migrazioni e seed,
#             perche' e' l'unica che ha prisma, tsx e i sorgenti
#   runner    cio' che va in produzione: l'output standalone e nulla piu'
#
# Il certificato del proxy non si genera qui: lo fa docker/prepara-certificato.sh
# sulla macchina ospite, perche' nessuna immagine ufficiale di Node, Postgres o
# Caddy porta il comando openssl.
#
# Node alpine: l'immagine finale misura circa 390 MB contro gli oltre 1,8 GB
# dello stadio di build, e il client Prisma viene generato dentro questa stessa
# libc, quindi il motore nello standalone e' quello giusto
# (libquery_engine-linux-musl-openssl-3.0.x).

ARG NODE_IMAGE=node:22-alpine

# --------------------------------------------------------------------------- #
FROM ${NODE_IMAGE} AS deps
WORKDIR /app

# Lo schema serve a prisma generate, che npm ci lancia nel postinstall.
COPY package.json package-lock.json ./
COPY prisma/schema.prisma ./prisma/schema.prisma
RUN npm ci

# --------------------------------------------------------------------------- #
FROM ${NODE_IMAGE} AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# La build non apre nessuna connessione, ma prisma generate pretende che
# DATABASE_URL sia presente e sintatticamente valida: senza, la build si
# riempie di "Environment variable not found". Questo valore non viene mai
# usato, a runtime arriva quello vero dal compose. AUTH_SECRET invece alla
# build non serve: verificato togliendola, la build resta verde.
ENV DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public"
RUN npm run build

# --------------------------------------------------------------------------- #
FROM ${NODE_IMAGE} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -S portale && adduser -S -G portale portale

COPY --from=builder --chown=portale:portale /app/.next/standalone ./
COPY --from=builder --chown=portale:portale /app/.next/static ./.next/static

# I font di base del PDF. @react-pdf/renderer li carica a runtime per percorso
# costruito, quindi il tracing di Next non li vede e lo standalone resta senza
# la cartella: l'export PDF rispondeva 500 con "Cannot find module
# pdfkit/js/standard-fonts/Helvetica.cjs". Verificato generando un report.
COPY --from=builder --chown=portale:portale \
  /app/node_modules/pdfkit/js/standard-fonts ./node_modules/pdfkit/js/standard-fonts

USER portale
EXPOSE 3000

# Nessun volume: il portale non scrive su disco, nemmeno il logo, che sta nel
# database. Il contenitore e' sostituibile in qualsiasi momento.
CMD ["node", "server.js"]
