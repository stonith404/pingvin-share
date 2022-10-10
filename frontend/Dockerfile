FROM node:18-alpine AS deps
WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:18-alpine AS builder
ENV NODE_ENV=production
WORKDIR /opt/app
COPY . .
COPY --from=deps /opt/app/node_modules ./node_modules
RUN npm run build



FROM node:18-alpine AS runner
WORKDIR /opt/app
ENV NODE_ENV=production
COPY --from=builder /opt/app/next.config.js ./
COPY --from=builder /opt/app/public ./public
COPY --from=builder /opt/app/.next ./.next
COPY --from=builder /opt/app/node_modules ./node_modules

RUN npm i -g dotenv-cli

EXPOSE 3000
CMD dotenv -e .env.development node_modules/.bin/next start