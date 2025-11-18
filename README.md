# EcoTrack Authentication Module

Production-ready authentication stack for EcoTrack, covering backend (Node/Express/Sequelize/MySQL) and frontend (React/Tailwind). Scope is limited strictly to signup/login, JWT issuance, verification middleware, and a protected dashboard example.

## Folder Structure
```
/Users/aditsingh/Desktop/projects/ecotrack
├── backend
│   ├── package.json
│   ├── .env.example
│   ├── sequelize-config.cjs
│   ├── prisma/schema.prisma
│   ├── db/migrations/202511180001-create-users.cjs
│   └── src
│       ├── server.js
│       ├── config/database.js
│       ├── config/prismaClient.js
│       ├── models/{index.js,User.js}
│       ├── controllers/authController.js
│       ├── routes/auth.js
│       ├── middleware/{authMiddleware.js,errorHandler.js}
│       ├── utils/validationSchemas.js
│       └── seed/seedAdmin.js
└── frontend
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src
        ├── main.jsx
        ├── App.jsx
        ├── services/axiosInstance.js
        ├── components/ProtectedRoute.jsx
        ├── pages/{Login.jsx,Signup.jsx,Dashboard.jsx}
        └── styles/index.css
```

## Backend Setup (Node + Express + Sequelize)
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and update values:
   - `PORT`, `DB_*`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `BCRYPT_SALT_ROUNDS`
   - `DATABASE_URL` (Prisma) e.g. `mysql://user:pass@localhost:3306/ecotrack`
   - Optional: `CLIENT_ORIGIN` (comma-separated list) for CORS, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`
4. Ensure MySQL database exists (matching `DB_NAME`).
5. Run migration: `npx sequelize-cli db:migrate --config sequelize-config.cjs --migrations-path db/migrations`
6. Generate Prisma client: `npx prisma generate`
7. (Optional) Seed admin: `npm run seed:admin`
8. Start API: `npm run dev` (hot reload) or `npm start`.

The API exposes:
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)

Password hashing uses bcrypt with configurable rounds. JWT payload includes `id`, `role`, `email` and honors `JWT_EXPIRES_IN`.

## Frontend Setup (React + Tailwind)
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Visit `http://localhost:5173`

Vite dev server proxies `/api` to `http://localhost:5000`. Tailwind styles live under `src/styles/index.css`. Axios instance auto-attaches JWT from `localStorage` (`ecotrack_token`). `ProtectedRoute` validates tokens by calling `/api/auth/me`.

## Database Schema (users table)
- `id` INT UNSIGNED PK AI
- `name` VARCHAR(80)
- `email` VARCHAR(120) UNIQUE
- `password` VARCHAR(255)
- `role` ENUM('user','admin') DEFAULT 'user'
- `createdAt` DATETIME
- `updatedAt` DATETIME

Managed via Sequelize model `User` and migration `202511180001-create-users.cjs`.

## Example Requests
### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{"name":"Aditi","email":"aditi@example.com","password":"Passw0rd!"}'
```
Response:
```json
{
  "message": "User created successfully",
  "token": "<jwt>",
  "user": {
    "id": 1,
    "name": "Aditi",
    "email": "aditi@example.com",
    "role": "user"
  }
}
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"aditi@example.com","password":"Passw0rd!"}'
```

### Get Profile (Protected)
```bash
curl http://localhost:5000/api/auth/me \
  -H 'Authorization: Bearer <jwt>'
```

## JWT Middleware Flow
1. Frontend stores JWT in `localStorage` after signup/login.
2. Axios interceptor attaches `Authorization: Bearer <token>`.
3. `authMiddleware.js` verifies token, fetches user, attaches to `req.user`.
4. Protected routes (e.g., `/api/auth/me`) rely on `req.user`.

## Seed Admin User
Environment-driven script (`npm run seed:admin`) authenticates DB connection, hashes password, and upserts an admin (`role: admin`). Configure credentials via `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` in `.env` before running.

## Prisma ORM Setup
- Prisma schema lives in `backend/prisma/schema.prisma` and mirrors the Sequelize `users` table (including the `Role` enum). After updating `.env`, run:
  - `cd backend`
  - `npx prisma generate` (or `npm run prisma:generate`)
  - (Optional) `npx prisma db pull` to sync schema from an existing database
- Import the ready-to-use client from `src/config/prismaClient.js` whenever you need Prisma alongside Sequelize.

## Notes
- Centralized error handling ensures consistent JSON responses.
- Input validation uses Yup on the backend and simple client-side checks on the frontend.
- No additional EcoTrack features are included beyond authentication scaffolding.
