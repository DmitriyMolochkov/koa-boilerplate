# Koa typescript boilerplate
## Motivation
Have a template for quick start backend REST API applications.

Stack: typescript, koa, typeorm, class-validator, pino, jest, redis, bullmq.

## Features:
- configured to build js files as ES modules
- ts-node - run server without typescript build step
- nodemon - server auto-restarts when code changes
- class-validator - validation of http requests, config, etc.
- pino - logging of any place, including automatic logging of http requests with the ability to hide sensitive/secret information
- detailed typing of koa controllers
- handling business errors in endpoints
- bullmq - fast and robust queue system built on top of Redis
- message bus - efficient and reliable queuing and message delivery on top of Redis Streams and Consumer Groups
- using mixins to create reusable classes and to eliminate duplicate code
- implementation of the server health check API according to RFC: https://inadarei.github.io/rfc-healthcheck/
- graceful shutdown of the server
- husky - configured pre-commit git hook to check code format
- detailed eslint settings
- jest unit tests

# Getting Started
- Clone the repository
```
git clone --depth=1 https://github.com/DmitriyMolochkov/koa-boilerplate.git <project_name>
```

- Install dependencies
```
cd <project_name>
npm install
```
- Create and fill `.env` file
- Create and fill `./config/default.cjs` file


- Run the project directly in TS
```
npm run start
```

- Build and run the project in JS
```
npm run build-js
npm run start-js
```

- Run unit tests
```
npm run test-spec
```

- Generate database migration script file
```
npm run migration:generate --name=<migration_name>
```
