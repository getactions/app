ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-slim as build

ARG BUN_VERSION=1.1.4

WORKDIR /build

RUN apt update && apt install -y bash curl unzip && \
 curl https://bun.sh/install | bash -s -- bun-v${BUN_VERSION}

ENV PATH="${PATH}:/root/.bun/bin"

# Install node modules
COPY bun.lockb package.json ./

RUN bun install --frozen-lockfile

# Copy application code
COPY . .

# Build application
RUN bun run build

# Remove development dependencies
# Encountered a bug with super slow installs on a populated bun package cache.
# This seems to be related to: https://github.com/oven-sh/bun/issues/4066
# Install only the production dependencies
ENV CI=true
RUN rm -rf node_modules && \
  rm -rf /root/.bun/install/cache/ && \
  bun install --frozen-lockfile --production

RUN curl -sf https://gobinaries.com/tj/node-prune | sh && \
    node-prune

FROM node:${NODE_VERSION}-slim as distribution

ENV NODE_ENV="production"

WORKDIR /app

# Copy built application
# This is Remix related, copying only the files which are required
COPY --from=build --chown=node:node /build/node_modules ./node_modules
COPY --from=build --chown=node:node /build/build ./build
COPY --from=build --chown=node:node /build/public ./public
COPY --from=build --chown=node:node /build/workflows ./workflows
COPY --from=build --chown=node:node /build/package.json .

RUN chown -R node:node /app

USER node

EXPOSE 3000

CMD [ "npm", "run", "start" ]