# Athlynk

Athlynk is a fitness and social networking app for finding workout partners, connecting with matches, messaging, and managing a public fitness profile.

The project contains:
- React/Vite/Tailwind frontend at the project root
- Node/Express/PostgreSQL backend in `backend/backend-github`

## Tech Stack

Frontend:
- React
- Vite
- Tailwind CSS
- React Router
- Lucide Icons

Backend:
- Node.js + Express 5
- PostgreSQL 16
- Prisma
- JWT auth
- bcryptjs password hashing
- multer local photo uploads
- Docker Compose for local Postgres

## Features

- Register, login, logout, and current-user loading
- Profile and preference save/load
- Profile photo upload, delete, reorder, and in-browser camera capture
- Discover users with filters and swipe actions
- Public profile view
- Connections/matches
- Conversations and messages
- Reports and mutual blocking
- Local mock fallback where needed for development resilience

## Frontend Setup

From the project root:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

The frontend runs at `http://localhost:5173`.

Root `.env` example:

```env
VITE_API_URL=http://localhost:4000
```

## Backend Setup

From `backend/backend-github`:

```powershell
npm install
Copy-Item .env.example .env
docker compose up -d
npm run prisma:migrate
npm run seed
npm run dev
```

The backend API runs at `http://localhost:4000`.

Local Postgres note: Docker maps host port `5433` to container port `5432`, so the local `DATABASE_URL` uses `127.0.0.1:5433`.

Backend `.env` example:

```env
PORT=4000
DATABASE_URL="postgresql://fitfriends:fitfriends_pw@127.0.0.1:5433/fitfriends"
JWT_ACCESS_SECRET="fitfriends_super_secret_change_me_123456789"
CLIENT_URL="http://localhost:5173"
```

## Seeded Test Accounts

Run `npm run seed` in `backend/backend-github`.

All seeded users use password:

```text
password123
```

Accounts:
- `lyndon@example.com`
- `alex@example.com`
- `maya@example.com`

## Useful Commands

Frontend:

```powershell
npm run dev
npm run build
```

Backend:

```powershell
docker compose up -d
npm run prisma:migrate
npm run prisma:generate
npm run seed
npx prisma validate
npm run dev
```

Reset local backend database only:

```powershell
cd backend/backend-github
npm run db:reset:local
```

## Local Dev Notes

- Do not commit real `.env` files.
- Backend uploads are served from `http://localhost:4000/uploads/<filename>`.
- Backend generated Prisma client and uploaded files are ignored by git.
- The backend reset script is intentionally limited to the local `fitfriends` database.
