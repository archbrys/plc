# PLC-MC Raspberry Pi Full-Stack App

Production-ready **single-server** architecture for Raspberry Pi:

- **Express + TypeScript** backend (`backend/`)
- **React + Vite** frontend (`frontend/`)
- **SQLite + Prisma ORM** storage
- All APIs under `/api/*`
- Frontend static build served by the same Express process
- Offline-first deployment (no cloud dependency)

Open on LAN at:

- `http://raspberrypi.local`

---

## Architecture

Browser → `http://raspberrypi.local` → Express Server

- `/api/*` → REST API
- static files (`frontend/dist`) → React app
- SQLite (`backend/prisma/dev.db`) → persistent local data

---

## Project Structure

- `frontend/` — existing React UI (preserved; now API-backed)
- `backend/` — Express application, modules, middleware, Prisma, services
- `shared/types/` — shared API envelope types
- `package.json` — root workspace scripts

---

## Backend Stack

- Node.js
- Express
- TypeScript
- Prisma ORM
- SQLite
- bcrypt
- express-session
- Zod
- CORS

---

## Features Implemented

### Authentication (session-based)

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Supports roles:

- `admin`
- `student`

Passwords/PINs are hashed with `bcrypt`.

### Authorization

- route protection middleware (`authMiddleware`)
- role guard middleware (`roleMiddleware`)

### Question Sets

Admin can:

- create
- edit
- delete
- publish
- archive

### Question Types

- multiple choice
- true/false
- short answer

### Student Flow

- login
- list published question sets
- submit answers
- view own results
- logout

### Admin Flow

- manage question sets/questions/choices
- view submissions/results

---

## API Response Format

All endpoints return:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {}
}
```

---

## Environment Variables

Configured in root `.env`:

- `PORT` (default: `3000`)
- `NODE_ENV` (`development` | `production`)
- `SESSION_SECRET` (required; use a strong secret)
- `FRONTEND_DEV_ORIGIN` (default: `http://localhost:5173`)

Use `.env.example` as a template.

---

## Installation Guide

From project root:

1. Install dependencies (`root`, `frontend`, `backend` workspaces)
2. Create SQLite schema migration
3. Seed database

### Recommended first-time setup

- `npm install`
- `npm run prisma:migrate`
- `npm run prisma:seed`

---

## Development Guide

Run frontend + backend together:

- `npm run dev`

Run separately:

- `npm run dev:frontend`
- `npm run dev:backend`

Dev details:

- Vite runs in `frontend` and proxies `/api` to backend
- Express runs on `http://localhost:3000`
- Session cookies are enabled with `credentials: include`

---

## Production Guide

Build both apps:

- `npm run build`

Start single Express server:

- `npm start`

Production behavior:

- Express serves `frontend/dist`
- unknown routes return `index.html` (React Router compatible)
- APIs available at `/api/*`

---

## Raspberry Pi Deployment (No Docker, No Nginx)

1. Install Node.js LTS on Raspberry Pi 4
2. Clone/copy project
3. Configure `.env` (`SESSION_SECRET` especially)
4. Run migrate + seed
5. Build and start app
6. Ensure mDNS hostname resolves (`raspberrypi.local`)

Open from any device on the same network:

- `http://raspberrypi.local`

---

## Prisma

- Schema: `backend/prisma/schema.prisma`
- Migration: `backend/prisma/migrations/*`
- Seed: `backend/prisma/seed.ts`

Seeded sample data:

- 1 admin (`admin` / `admin123`)
- 2 students (`S1001`/`1234`, `S1002`/`5678`)
- 2 sample quizzes

---

## Folder Documentation

### `backend/src/routes`
HTTP route declarations only.

### `backend/src/controllers`
Input/output orchestration only (no business logic).

### `backend/src/services`
Core business rules (auth, question set lifecycle, scoring).

### `backend/src/repositories`
Data access layer via Prisma.

### `backend/src/middleware`
Auth, role checks, request validation, logging, error handling.

### `backend/src/validation`
Zod request schemas.

### `backend/src/modules`
Feature-module placeholders for future expansion.

---

## Extensibility Notes

Architecture is prepared for future features such as:

- RFID login
- QR login
- barcode scanner integration
- cloud synchronization
- multiple Raspberry Pi nodes
- exam timer
- image/audio/essay question types

---

## Scripts

### Root

- `npm run dev`
- `npm run dev:frontend`
- `npm run dev:backend`
- `npm run build`
- `npm start`
- `npm run lint`
- `npm run prisma:migrate`
- `npm run prisma:seed`

### Backend

- `npm run dev --prefix backend`
- `npm run build --prefix backend`
- `npm run start --prefix backend`
- `npm run prisma:migrate --prefix backend`
- `npm run prisma:seed --prefix backend`

### Frontend

- `npm run dev --prefix frontend`
- `npm run build --prefix frontend`

---

## Notes

- Existing React UI pages/components were preserved.
- Frontend services were migrated from localStorage mocks to backend `/api` calls.
- For production security, rotate credentials and set a strong `SESSION_SECRET`.
