FROM node:18-alpine AS frontend-builder
WORKDIR /opt/app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY ./frontend .
RUN npm run build

FROM node:18 AS backend-builder
WORKDIR /opt/app
COPY backend/package.json backend/package-lock.json ./
RUN npm ci
COPY ./backend .
RUN npx prisma generate
RUN npm run build





FROM node:18 AS runner
WORKDIR /opt/app/frontend
ENV NODE_ENV=production
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

RUN npm i -g dotenv-cli

EXPOSE 3000
CMD cd frontend && dotenv -e .env.development node_modules/.bin/next start & cd backend && npm run prod