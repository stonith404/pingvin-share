FROM node:18 AS deps
WORKDIR /opt/app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci
RUN npx prisma generate


FROM node:18 As build
WORKDIR /opt/app
COPY . .
COPY --from=deps /opt/app/node_modules ./node_modules
RUN npm run build


FROM node:18 As runner
WORKDIR /opt/app
COPY --from=build /opt/app/node_modules ./node_modules
COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/prisma ./prisma
COPY --from=deps /opt/app/package.json ./
CMD npm run prod
