# Using node slim because prisma ORM needs libc for ARM builds

# Stage 1: on frontend dependency change
FROM node:19-slim AS frontend-dependencies
WORKDIR /opt/app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Stage 2: on frontend change
FROM node:19-slim AS frontend-builder
WORKDIR /opt/app
COPY ./frontend .
COPY --from=frontend-dependencies /opt/app/node_modules ./node_modules
RUN npm run build

# Stage 3: on backend dependency change
FROM node:19-slim AS backend-dependencies
WORKDIR /opt/app
COPY backend/package.json backend/package-lock.json ./
RUN npm ci

# Stage 4:on backend change
FROM node:19-slim AS backend-builder
RUN apt-get update && apt-get install -y openssl
WORKDIR /opt/app
COPY ./backend .
COPY --from=backend-dependencies /opt/app/node_modules ./node_modules
RUN npx prisma generate
RUN npm run build  && npm prune --production

# Stage 5: Final image
FROM node:19-slim AS runner
ENV NODE_ENV=docker
RUN apt-get update && apt-get install -y curl openssl

WORKDIR /opt/app/frontend
COPY --from=frontend-builder /opt/app/public ./public
COPY --from=frontend-builder /opt/app/.next/standalone ./
COPY --from=frontend-builder /opt/app/.next/static ./.next/static
COPY --from=frontend-builder /opt/app/public/img /tmp/img

WORKDIR /opt/app/backend
COPY --from=backend-builder /opt/app/node_modules ./node_modules
COPY --from=backend-builder /opt/app/dist ./dist
COPY --from=backend-builder /opt/app/prisma ./prisma
COPY --from=backend-builder /opt/app/package.json ./

WORKDIR /opt/app
RUN chown -R node /opt/app
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s CMD curl -f http://localhost:3000/api/health || exit 1

# HOSTNAME=0.0.0.0 fixes https://github.com/vercel/next.js/issues/51684. It can be removed as soon as the issue is fixed
CMD cp -rn /tmp/img /opt/app/frontend/public && HOSTNAME=0.0.0.0 node frontend/server.js & cd backend && npm run prod
