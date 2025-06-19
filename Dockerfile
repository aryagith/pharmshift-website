# Stage 1: Install dependencies and build the application
FROM node:18-slim AS builder
WORKDIR /app

# Install system dependencies. Let's combine these for a cleaner build.
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ openssl && rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies.
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts=false

# Copy the rest of the application source code.
COPY . .

RUN npx prisma generate

# Build the Next.js application for standalone output.
RUN npm run build


# --------------------------------------------------------------------------


# Stage 2: Setup the production environment for the standalone Next.js app
FROM node:18-slim AS runner
WORKDIR /app

# Install OpenSSL in the final runner stage, as Prisma's runtime engine needs it.
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=8000

# Create a non-root user for security.
RUN addgroup --system --gid 1001 nextjsgroup && \
    adduser --system --uid 1001 --ingroup nextjsgroup nextjsuser

# Copy only the necessary artifacts from the builder stage.
COPY --from=builder --chown=nextjsuser:nextjsgroup /app/.next/standalone ./
COPY --from=builder --chown=nextjsuser:nextjsgroup /app/public ./public
COPY --from=builder --chown=nextjsuser:nextjsgroup /app/.next/static ./.next/static

# Set the user for running the application.
USER nextjsuser

# Expose the port the app will run on.
EXPOSE 8000

# Command to run the standalone Next.js server.
CMD ["node", "server.js"]