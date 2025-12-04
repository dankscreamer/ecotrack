# EcoTrack 🌿

EcoTrack is a modern, gamified carbon footprint tracker designed to help users monitor and reduce their environmental impact. It goes beyond traditional tracking by including **Digital Carbon Footprint** metrics (streaming, gaming, internet data) alongside physical activities.

## 🚀 Features

### 🎨 UI/UX
- **Premium Design**: Glassmorphism, sleek animations, and a modern aesthetic.
- **Dark Mode**: Fully responsive dark mode with a toggle.
- **Interactive Dashboard**: Staggered animations, hover effects, and a "Nature Soundscape" for focus.

### 🌍 Tracking
- **Activity Logging**: Log activities like Driving, Cycling, Flights, and Electricity usage.
- **Digital Carbon**: Track emissions from Streaming, Gaming, and Internet Data.
- **Dynamic Units**: Automatically adjusts units (km, kWh, GB, hours) based on activity type.

### 🎮 Gamification & Insights
- **Eco Points**: Earn points for logging activities and making eco-friendly choices.
- **Badges**: Unlock achievements (e.g., "Eco Starter", "Carbon Neutral").
- **EcoNudge**: Receive personalized tips based on your recent activity.
- **Visual Stats**: View your emission history and progress with beautiful charts and tables.

### 🔒 Security
- **Authentication**: Secure Signup/Login with JWT (JSON Web Tokens).
- **Protected Routes**: Dashboard and profile pages are secured.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React + Vite
- **Styling**: Tailwind CSS (with custom animations & glassmorphism)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (via Neon)
- **ORM**: Prisma
- **Authentication**: JWT + Bcrypt

---

## 📂 Folder Structure

```
/ecotrack
├── backend
│   ├── controllers/      # Logic for Auth, Activities, Rewards
│   ├── routes/           # API Routes
│   ├── middlewares/      # Auth Middleware
│   ├── prisma/           # Database Schema
│   └── server.js         # Entry Point
└── frontend
    ├── src
    │   ├── components/   # Reusable UI (Navbar, EcoNudge, etc.)
    │   ├── pages/        # Dashboard, Login, AddActivity, Profile
    │   ├── services/     # Axios Configuration
    │   └── index.css     # Global Styles (Tailwind + Custom)
    └── vercel.json       # Deployment Config
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL Database (e.g., Neon, local)

### 1. Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "PORT=4040
DATABASE_URL='your_postgres_connection_string'
JWT_SECRET='your_secret_key'
JWT_EXPIRY='24h'" > .env

# Run Migrations
npx prisma migrate dev --name init

# Start Server
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:4040" > .env

# Start Dev Server
npm run dev
```

Visit `http://localhost:5173` (or the port shown in terminal) to view the app.

---

## 🔗 API Endpoints

- **Auth**: `/api/auth/signup`, `/api/auth/login`, `/api/auth/me`
- **Activities**: `/api/activities` (GET, POST, DELETE)
- **Rewards**: `/api/rewards` (GET)

---

## ☁️ Deployment

- **Frontend**: Configured for Vercel (`vercel.json` included for SPA routing).
- **Backend**: Ready for deployment on platforms like Render, Railway, or Vercel (Serverless).
