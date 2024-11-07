FROM node:21-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package manager lock files and set npm registry
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm config set registry https://registry.npmjs.org/

# Install the latest version of npm
RUN npm install -g npm@latest

# Install dependencies with extended network settings
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile --network-timeout 100000 --network-concurrency 1; \
  elif [ -f package-lock.json ]; then npm ci --timeout=100000 --legacy-peer-deps --maxsockets=1; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile --network-concurrency 1; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copy the .env and .env.development files
COPY .env ./

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3000

# Start the server using the production build
CMD ["npm", "run", "start"]