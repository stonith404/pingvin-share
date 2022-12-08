FROM node:18-slim AS frontend-builder
WORKDIR /opt/app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY ./frontend .
RUN npm run build

FROM node:18-slim AS backend-builder
RUN apt-get update && apt-get install -y openssl
WORKDIR /opt/app
COPY backend/package.json backend/package-lock.json ./
RUN npm ci
COPY ./backend .
RUN npx prisma generate
RUN npm run build

FROM node:18-slim AS runner
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y openssl
WORKDIR /opt/app/frontend
COPY --from=frontend-builder /opt/app/next.config.js .
COPY --from=frontend-builder /opt/app/public ./public
COPY --from=frontend-builder /opt/app/.next ./.next
COPY --from=frontend-builder /opt/app/node_modules ./node_modules

WORKDIR /opt/app/backend
COPY --from=backend-builder /opt/app/node_modules ./node_modules
COPY --from=backend-builder /opt/app/dist ./dist
COPY --from=backend-builder /opt/app/prisma ./prisma
COPY --from=backend-builder /opt/app/package.json ./

WORKDIR /opt/app
EXPOSE 3000
CMD cd frontend && node_modules/.bin/next start & cd backend && npm run prod