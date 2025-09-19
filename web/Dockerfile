# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
WORKDIR /app

# Install Bun
RUN npm i -g bun

# Install deps using Bun
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build
COPY . .
RUN bun run build

EXPOSE 3000
CMD ["bun", "run", "start"]

