# Stage 1: Build
FROM node:20-alpine AS builder

# Install build tools to compile native dependencies
RUN apk add --no-cache \
  g++ \
  make \
  python3

WORKDIR /app

COPY package*.json ./

# Install dependencies, including sharp
RUN npm install

COPY . .

ARG NEXT_PUBLIC_ENDPOINT_BASE
ENV NEXT_PUBLIC_ENDPOINT_BASE=$NEXT_PUBLIC_ENDPOINT_BASE
ARG BACKEND_URL
ENV BACKEND_URL=$BACKEND_URL

# Build the Next.js application
RUN npm run build

RUN npm ci --omit=dev

# Stage 2: Run
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/.next  /app/.next
COPY --from=builder /app/node_modules /app/node_modules

# Expose the port that the app runs on
EXPOSE 3000

# Define the command to run the application
# CMD ["node", "standalone/server.js"]
CMD ["npx", "next", "start"]
