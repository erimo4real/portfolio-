# Backend Run Guide

## Local (MongoDB on localhost)
- Copy environment: `.env.example` to `.env`
- Edit `.env`:
  - `MONGO_URI=mongodb://localhost:27017/portfolio`
  - `DB_NAME=portfolio`
  - `JWT_SECRET=<secure-string>`
- Install deps: `npm install`
- Seed admin (first time): `npm run seed:admin`
- Start server: `npm start`
- Health: `GET /api/health`
- Docs: `GET /api/docs`

## Docker (MongoDB service in compose)
- From project root run: `docker-compose up --build`
- Compose sets:
  - `MONGO_URI=mongodb://mongo:27017/portfolio`
  - `PORT=4000`
  - `JWT_SECRET=dev_secret_key_change_in_prod`
- Uploads are persisted via volume: `./backend/src/storage/uploads:/app/src/storage/uploads`
- Health: `GET http://localhost:4000/api/health`
- Docs: `GET http://localhost:4000/api/docs`

## Switching Between Local and Docker
- Local: ensure `.env` uses `mongodb://localhost:27017/...`; run `npm start`
- Docker: use `docker-compose` which overrides `MONGO_URI` to Docker network
- No code changes needed — backend reads `MONGO_URI` at startup

## Admin Onboarding
- Login: `POST /api/auth/login` with `identifier`, `password`
- Seed admin: `npm run seed:admin` (default: `admin@example.com` / `admin123`)

## Backups
- Run: `npm run backup`
- Saves JSON dumps and uploads copy under `src/storage/backups/<timestamp>/`

## Swagger Docs
- Location: `/api/docs` served from [swagger.js](file:///c:/Users/ERIMO/Documents/trae_projects/protfolio/backend/src/docs/swagger.js)
- It uses `swagger-jsdoc` to build an OpenAPI spec. You can add endpoint annotations to route files to populate detailed schemas and examples.

## Structured Logging
- Implemented with `pino` and `pino-http` in [server.js](file:///c:/Users/ERIMO/Documents/trae_projects/protfolio/backend/src/server.js)
- Each request gets a unique `req.id` to correlate logs across middleware and handlers.
- Logs include method, URL, status, response time, and error stack when applicable.
- Change log level with `LOG_LEVEL` env (default `info`).

## Metrics (Prometheus)
- Endpoint: `GET /api/metrics`
- Exposes default Node process metrics and `http_request_duration_seconds` histogram.
- Labels: `method`, `path`, `status_code` to slice performance by route.
