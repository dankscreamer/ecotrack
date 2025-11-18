# EcoTrack Auth Stack

Lightweight authentication setup for EcoTrack using Node/Express/Prisma/MySQL on the backend and React + Vite on the frontend. The current scope covers user signup/login/logout, JWT issuance and verification, and a protected dashboard that only renders when a stored token is valid.

## Folder Structure
```
/Users/aditsingh/Desktop/projects/ecotrack
├── backend
│   ├── package.json
│   ├── server.js
│   ├── controllers/authController.js
│   ├── routes/authRoutes.js
│   ├── middlewares/authMiddleware.js
│   ├── lib/prisma.js
│   └── prisma
│       └── schema.prisma
└── frontend
    ├── package.json
    ├── vite.config.js
    └── src
        ├── App.jsx
        ├── pages/{Signup.jsx,Dashboard.jsx}
        ├── components/ProtectedRoute.jsx
        └── services/axiosInstance.js
```

## Backend (Express + Prisma + MySQL)
1. `cd backend`
2. `npm install`
3. Create `.env` with:
   ```
   PORT=5000
   DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/ecotrack"
   JWT_SECRET="replace-me"
   JWT_EXPIRY="1h"
   CORS_ORIGINS="http://localhost:5173"
   ```
4. Apply Prisma schema (first migrate removes existing migrations if provider changed):
   ```
   npx prisma migrate dev --name init
   ```
5. Start the API: `npm start`

### API Surface
- `POST /api/auth/signup` – create user, store bcrypt-hashed password, return JWT and profile.
- `POST /api/auth/login` – verify credentials, return JWT and profile.
- `POST /api/auth/logout` – client tosses the token; server responds with success message.
- `GET /api/auth/me` – protected route; uses `Authorization: Bearer <token>` and Prisma to return the logged-in user.

### Implementation Notes
- Prisma client is centralized in `lib/prisma.js` to avoid connection storms during hot reloads.
- `authMiddleware.js` verifies JWTs and populates `req.user`; routes mount the middleware explicitly.
- `server.js` wires Express, Prisma health check, auth routes, error handler, and CORS (default origin `http://localhost:5173`, override via `CORS_ORIGINS` env var).

## Frontend (React + Vite)
1. `cd frontend`
2. `npm install`
3. Ensure `@vitejs/plugin-react` is installed (`npm install -D @vitejs/plugin-react`) if not already present.
4. Run `npm run dev` and visit `http://localhost:5173`.

### Frontend Auth Flow
- `axiosInstance` reads `ecotrack_token` from `localStorage` and attaches it as `Authorization: Bearer <token>` for `/api` calls.
- `ProtectedRoute` checks whether a token exists and validates it via `/api/auth/me`; unauthenticated users are redirected to signup/login.
- `Dashboard.jsx` consumes `/me` to display current user details; `Signup.jsx` handles both signup and login flows and stores the returned token in `localStorage`.

## Example Requests
### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{"name":"Aditi","email":"aditi@example.com","password":"Passw0rd!"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"aditi@example.com","password":"Passw0rd!"}'
```

### Get Current User
```bash
curl http://localhost:5000/api/auth/me \
  -H 'Authorization: Bearer <jwt>'
```

## Prisma Schema (excerpt)
```
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique @db.VarChar(191)
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Troubleshooting
- **`.env` permission errors**: ensure the backend process can read `/backend/.env` and that `JWT_SECRET`/`DATABASE_URL` are defined.
- **Provider mismatch**: if switching from Postgres to MySQL, delete `prisma/migrations` before running `npx prisma migrate dev`.
- **Frontend dev server**: install missing dev dependencies (e.g., `@vitejs/plugin-react`) if `vite.config.js` import errors appear.

This README reflects the project’s current state (Prisma + Express backend, Vite + React frontend) and should be kept up to date as new features land.
