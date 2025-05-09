ARG NODE_VERSION="22"
ARG ALPINE_VERSION=""

# Preamble: define base image used by all stages
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base
WORKDIR /opt/app

# Stage 1: Frontend dependencies
FROM base AS frontend-dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Stage 2: Build frontend
FROM base AS frontend-builder
COPY ./frontend .
COPY --from=frontend-dependencies /opt/app/node_modules ./node_modules
RUN npm run build

# Stage 3: Backend dependencies
FROM base AS backend-dependencies
RUN apk add --no-cache python3
WORKDIR /opt/app
COPY backend/package.json backend/package-lock.json ./
RUN npm ci

# Stage 4: Build backend
FROM base AS backend-builder
RUN apk add openssl

COPY ./backend .
COPY --from=backend-dependencies /opt/app/node_modules ./node_modules
RUN npx prisma generate
RUN npm run build && npm prune --production

# Stage 5: Final image
FROM base AS runner
ENV NODE_ENV=docker

# Delete default node user
RUN deluser --remove-home node

RUN apk update --no-cache \
    && apk upgrade --no-cache \
    && apk add --no-cache curl caddy su-exec openssl

COPY --from=frontend-builder /opt/app/public ./frontend/public
COPY --from=frontend-builder /opt/app/.next/standalone ./frontend/
COPY --from=frontend-builder /opt/app/.next/static ./frontend/.next/static
COPY --from=frontend-builder /opt/app/public/img /tmp/img

COPY --from=backend-builder /opt/app/node_modules ./backend/node_modules
COPY --from=backend-builder /opt/app/dist ./backend/dist
COPY --from=backend-builder /opt/app/prisma ./backend/prisma
COPY --from=backend-builder /opt/app/package.json ./backend/
COPY --from=backend-builder /opt/app/tsconfig.json ./backend/

COPY ./reverse-proxy  /opt/app/reverse-proxy
COPY ./scripts/docker ./scripts/docker

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s CMD /bin/sh -c '(if [[ "$CADDY_DISABLED" = "true" ]]; then curl -fs http://localhost:${BACKEND_PORT:-8080}/api/health; else curl -fs http://localhost:3000/api/health; fi) || exit 1'

ENTRYPOINT ["sh", "./scripts/docker/create-user.sh"]
CMD ["sh", "./scripts/docker/entrypoint.sh"]