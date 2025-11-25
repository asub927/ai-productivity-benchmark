# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies including dev dependencies for build
RUN npm ci

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies AND prisma (needed for generate)
RUN npm ci --only=production && npm install -D prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start the application (NestJS builds to dist/src/main.js by default)
CMD ["node", "dist/src/main"]
