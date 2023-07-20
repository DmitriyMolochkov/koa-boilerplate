FROM node:lts-hydrogen

ARG node_env

ENV NODE_ENV=${node_env}

WORKDIR /app

COPY . .

RUN npm pkg delete scripts.prepare && npm ci --no-audit --unsafe-perm

ENTRYPOINT [ "npm", "run", "deploy" ]
