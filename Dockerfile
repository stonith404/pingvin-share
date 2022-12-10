# Using node slim because prisma ORM needs libc for ARM builds

# Stage 1: on frontend dependency change
FROM node:18-slim AS frontend-dependencies
WORKDIR /opt/app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Stage 2: on frontend change
FROM node:18-slim AS frontend-builder
WORKDIR /opt/app
COPY ./frontend .
COPY --from=frontend-dependencies /opt/app/node_modules ./node_modules
RUN npm run build

# Stage 3: on backend dependency change
FROM node:18-slim AS backend-dependencies
WORKDIR /opt/app
COPY backend/package.json backend/package-lock.json ./
RUN npm ci

# Stage 4:on backend change
FROM node:18-slim AS backend-builder
RUN apt-get update && apt-get install -y openssl
WORKDIR /opt/app
COPY ./backend .
COPY --from=backend-dependencies /opt/app/node_modules ./node_modules
RUN npx prisma generate
RUN npm run build  && npm prune --production

# Stage 5: Final image
FROM node:18-slim AS runner
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y openssl

WORKDIR /opt/app/frontend
COPY --from=frontend-builder /opt/app/public ./public
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=frontend-builder /opt/app/.next/standalone ./
COPY --from=frontend-builder /opt/app/.next/static ./.next/static

WORKDIR /opt/app/backend
COPY --from=backend-builder /opt/app/node_modules ./node_modules
COPY --from=backend-builder /opt/app/dist ./dist
COPY --from=backend-builder /opt/app/prisma ./prisma
COPY --from=backend-builder /opt/app/package.json ./

WORKDIR /opt/app
EXPOSE 3000
EXPOSE 8080
CMD node frontend/server.js & cd backend && npm run prod