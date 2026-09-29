# ---------- Stage 1: install dependencies ----------
FROM node:22-alpine@sha256:2c752226d477b4a886378baa95b9af252be59301b725fdb0b7e15208131505a8 AS deps
ENV NODE_ENV=production
WORKDIR /app
COPY site/package.json ./
RUN npm install

# ---------- Stage 2: runtime ----------
FROM node:22-alpine@sha256:2c752226d477b4a886378baa95b9af252be59301b725fdb0b7e15208131505a8
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY site/ ./
USER no-root
CMD ["npm","start"]
