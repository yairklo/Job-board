# JobBoard API

Node.js + Express + MongoDB backend for the React Job Board. It implements the REST contract the frontend already uses (`/users`, `/jobs`, `x-auth-token`).

## Requirements

- Node.js 18+
- MongoDB locally (default) or Atlas

## Setup

```bash
cd jobboard-api
npm install
copy .env.example .env
```

Edit `.env` if needed. Defaults assume local MongoDB and port **8181**.

```env
PORT=8181
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/JobBoard
JWT_SECRET=change-this-to-a-long-random-string
JWT_EXPIRES_IN=24h
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@jobboard.local
ADMIN_PASSWORD=Admin1234!
```

## Run

```bash
npm run seed
npm run dev
```

The API listens on `http://localhost:8181`.

Point the React app at it:

```env
VITE_API_URL=http://localhost:8181
```

## Seed accounts

| Role      | Email                     | Password         |
|-----------|---------------------------|------------------|
| Admin     | `admin@jobboard.local`    | `Admin1234!`     |
| Recruiter | `recruiter@jobboard.local`| `Recruiter1234!` |
| Seeker    | `seeker@jobboard.local`   | `Seeker1234!`    |

`npm run seed` wipes `users` and `jobs` and recreates the accounts plus sample listings.

## Auth

Send the JWT from login in:

```http
x-auth-token: <JWT>
```

`Authorization: Bearer <JWT>` is accepted as a fallback.

Login returns the raw JWT string so the existing React `login(token)` flow works.

## Main routes

| Method | Path | Access |
|--------|------|--------|
| POST | `/users` | Public |
| POST | `/users/login` | Public (3 failed attempts → 24h lock) |
| GET | `/users` | Admin |
| GET/PUT/PATCH | `/users/:id` | Owner or admin |
| DELETE | `/users/:id` | Admin (cannot delete admins) |
| GET | `/jobs` | Public |
| GET | `/jobs/my-jobs` | Recruiter |
| GET | `/jobs/:id` | Public |
| POST | `/jobs` | Recruiter |
| PUT/DELETE | `/jobs/:id` | Owner or admin |
| PATCH | `/jobs/:id` | Authenticated (toggle saved) |
