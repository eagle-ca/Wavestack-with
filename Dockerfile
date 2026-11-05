# Multi-stage Docker build for Aegis Security Bot
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Install build dependencies for native sqlite compilation
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json tsconfig.json ./
RUN npm ci

COPY src/ ./src/
RUN npm run build

# Production Runner
FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --only=production && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/dist ./dist

# Create persistent database folder
RUN mkdir -p /app/data

VOLUME ["/app/data"]

CMD ["node", "dist/index.js"]

