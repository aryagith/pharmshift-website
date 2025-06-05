# Stage 1: Install dependencies and build the application
FROM node:18-slim AS builder
WORKDIR /app

# Install system dependencies required for building some npm packages.
# python3, make, g++ are common for native Node.js modules.
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*

RUN apt-get update -y && apt-get install -y openssl

# Copy package files and install dependencies.
# This order leverages Docker's layer caching effectively.
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts=false
# Note: --ignore-scripts=false is kept as some packages might need their postinstall scripts.
# If you are certain none of your dependencies (including transitive ones) need it,
# you could remove it for a slightly faster install.

# Copy the rest of the application source code.
# Ensure local node_modules and .next are in .dockerignore.
COPY . .

RUN npx prisma generate

# Build the Next.js application.
# This Dockerfile assumes `output: 'standalone'` is set in your next.config.js.
RUN npm run build

# Stage 2: Setup the production environment for the standalone Next.js app
FROM node:18-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8000

# Create a non-root user and group for better security.
RUN addgroup --system --gid 1001 nextjsgroup && \
    adduser --system --uid 1001 --ingroup nextjsgroup nextjsuser

# Copy only the necessary artifacts from the builder stage for the standalone output.
# This includes the server, minimal node_modules, public assets, and static assets.
COPY --from=builder --chown=nextjsuser:nextjsgroup /app/.next/standalone ./
COPY --from=builder --chown=nextjsuser:nextjsgroup /app/public ./public
COPY --from=builder --chown=nextjsuser:nextjsgroup /app/.next/static ./.next/static

# Set the user for running the application.
USER nextjsuser

# Expose the port the app will run on.
EXPOSE 8000

# Command to run the standalone Next.js server.
CMD ["node", "server.js"]