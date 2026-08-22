# 🌍 GlobeTrotter — Smart Travel Itinerary Planner

> **Plan trips, build itineraries, track budgets, and share your travel plans — powered by a modern full-stack architecture with Docker containerization.**

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Screens & UI](#screens--ui)
- [Design Decisions](#design-decisions)
- [Team](#team)
- [License](#license)

---

## 📖 About the Project

**GlobeTrotter** is a full-stack travel itinerary planning application built during an **8-hour hackathon** by a **2-person team**. Users can sign up (email or Google OAuth), create trips, add cities as stops, browse and attach activities, log expenses, view budget breakdowns, and share itineraries publicly via unique links.

The backend is a **monolithic Express API** backed by **Prisma ORM** and **PostgreSQL**, containerized with **Docker Compose**. The frontend is a **React 19 SPA** built with **Vite** and **Tailwind CSS v4**.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Email/password signup & login, Google OAuth, OTP-based password reset |
| 🗺️ **Trip Management** | Create, view, and manage personal trips with dates and descriptions |
| 🏙️ **City & Activity Catalog** | Browse a curated, seeded list of cities (with regions & popularity scores) and activities |
| 📋 **Itinerary Builder** | Add cities as stops to a trip, attach activities to each stop |
| 💰 **Budget & Expenses** | Log expenses by category (Transport, Stay, Meals, Misc) and view trip budget breakdowns |
| 📌 **Saved Destinations** | Save favorite cities for quick access |
| 🔗 **Public Sharing** | Generate a unique share slug for read-only public trip viewing |
| 🐳 **Dockerized** | One-command PostgreSQL setup via Docker Compose |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Docker Compose                    │
│  ┌───────────────────────────────────────────────┐  │
│  │  postgres (PostgreSQL 15-Alpine)  Port: 5433  │  │
│  └────────────────────┬──────────────────────────┘  │
└───────────────────────┼─────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
┌───────┴────────┐             ┌────────┴────────┐
│    Backend     │             │    Frontend     │
│  Express API   │◄───────────│  React + Vite   │
│  (Monolith)    │   Axios    │  Tailwind CSS   │
│  Port: 3000    │             │  Port: 5173     │
│  Prisma ORM    │             │                 │
└────────────────┘             └─────────────────┘
```

- **Monolithic backend** — single Express server with logically separated route modules (`/api/auth/*` and `/api/core/*`)
- **PostgreSQL 15** containerized via Docker Compose with health checks and persistent volume
- **React 19 SPA** communicating with the backend via Axios

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, React Router v7, Axios |
| **Backend** | Node.js, Express 5, ES Modules |
| **Database / ORM** | PostgreSQL 15 (Alpine), Prisma 7 |
| **Authentication** | JWT, bcrypt, Google Auth Library, OTP (otp-generator + Nodemailer) |
| **Containerization** | Docker Compose |
| **Linting** | OxLint (frontend) |
| **Version Control** | Git |

---

## 📁 Project Structure

```
GlobeTrotter/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Full data model (8 models, 3 enums)
│   │   ├── seed.js                # Seed script for cities & activities
│   │   └── migrations/            # Prisma migration history
│   ├── src/
│   │   ├── app.js                 # Express app setup (CORS, JSON, routes)
│   │   ├── server.js              # Server entry point
│   │   ├── config/
│   │   │   └── db.js              # Database configuration
│   │   ├── controllers/
│   │   │   ├── auth.controller.js     # Register, login, Google OAuth, OTP reset
│   │   │   ├── trip.controller.js     # Trip CRUD, stops, stop-activities, public share
│   │   │   ├── city.controller.js     # City listing & search
│   │   │   ├── activity.controller.js # Activity listing
│   │   │   └── budget.controller.js   # Expense logging & budget breakdown
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js     # JWT verification middleware
│   │   ├── routes/
│   │   │   ├── index.js               # Route aggregator (/api/auth, /api/core)
│   │   │   ├── auth.route.js          # Auth endpoints
│   │   │   └── core.route.js          # Core business endpoints
│   │   └── utils/
│   │       ├── jwt.js                 # JWT sign/verify helpers
│   │       ├── prisma.js             # Prisma client singleton
│   │       ├── email.js              # Nodemailer transporter
│   │       ├── otpUtils.js           # OTP generation
│   │       └── googleAuthUtils.js    # Google token verification
│   ├── docker-compose.yml         # PostgreSQL container definition
│   └── package.json
│
├── frontend/
│   ├── public/                    # Static assets (favicon, icons)
│   ├── src/
│   │   ├── main.jsx               # App entry point
│   │   ├── App.jsx                # Root component with routing
│   │   ├── App.css / index.css    # Global styles
│   │   ├── assets/                # Images (hero.png, etc.)
│   │   └── pages/
│   │       ├── Auth/              # Login, signup, password reset
│   │       ├── Dashboard/         # Trip listing / home
│   │       ├── TripBuilder/       # Itinerary builder
│   │       ├── Budget/            # Expense tracking & breakdown
│   │       └── Profile/           # User profile & settings
│   ├── vite.config.js
│   └── package.json
│
├── .agents/                       # AI agent configurations
├── GlobeTrotter_Implementation_Plan.md
├── GlobeTrotter.pdf               # Original project brief
└── README.md
```

---

## 🗃️ Database Schema

The Prisma schema defines **8 models** and **3 enums**:

### Models

| Model | Key Fields | Description |
|---|---|---|
| **User** | `email`, `passwordHash`, `name`, `photoUrl`, `googleId`, `resetOtp`, `role` | Supports email & Google OAuth, OTP password reset, admin roles |
| **City** | `name`, `country`, `region`, `costIndex`, `popularityScore`, `imageUrl` | Seeded catalog of travel destinations |
| **Activity** | `cityId`, `name`, `category`, `cost`, `durationMinutes`, `description` | City-specific activities (Sightseeing, Food, Adventure, Relaxation) |
| **Trip** | `userId`, `name`, `startDate`, `endDate`, `isPublic`, `shareSlug` | User-created trips with optional public sharing |
| **TripStop** | `tripId`, `cityId`, `arrivalDate`, `departureDate`, `sortOrder` | Ordered city stops within a trip |
| **StopActivity** | `tripStopId`, `activityId`, `scheduledTime`, `customCost` | Activities attached to a specific stop |
| **TripExpense** | `tripId`, `tripStopId`, `category`, `amount`, `description` | Logged expenses (Transport, Stay, Meals, Misc) |
| **SavedDestination** | `userId`, `cityId` | User's bookmarked cities |

### Enums

| Enum | Values |
|---|---|
| `Role` | `USER`, `ADMIN` |
| `ActivityCategory` | `SIGHTSEEING`, `FOOD`, `ADVENTURE`, `RELAXATION` |
| `ExpenseCategory` | `TRANSPORT`, `STAY`, `MEALS`, `MISC` |

---

## 🔌 API Endpoints

All API routes are mounted under `/api`.

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | ❌ | Register with email & password |
| `POST` | `/login` | ❌ | Login and receive JWT |
| `POST` | `/google` | ❌ | Google OAuth authentication |
| `POST` | `/forgot-password` | ❌ | Request OTP for password reset |
| `POST` | `/reset-password` | ❌ | Reset password with OTP |
| `GET` | `/me` | ✅ | Get current user profile |

### Core Routes — `/api/core`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/cities` | ❌ | List/search all cities |
| `GET` | `/cities/:id` | ❌ | Get city details |
| `GET` | `/activities` | ❌ | List activities (filterable) |
| `GET` | `/public/trips/:shareSlug` | ❌ | View a shared trip |
| `POST` | `/trips` | ✅ | Create a new trip |
| `GET` | `/trips` | ✅ | List current user's trips |
| `GET` | `/trips/:id` | ✅ | Get trip with stops & activities |
| `POST` | `/trips/:id/stops` | ✅ | Add a city stop to a trip |
| `POST` | `/trips/:id/stops/:stopId/activities` | ✅ | Add an activity to a stop |
| `POST` | `/trips/:id/expenses` | ✅ | Log an expense |
| `GET` | `/trips/:id/budget` | ✅ | Get trip budget breakdown |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) & Docker Compose
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/yugdave2005/GlobeTrotter-YUG-SAMARTH.git
cd GlobeTrotter-YUG-SAMARTH
```

### 2. Start the Database

```bash
cd backend
docker compose up -d
```

This starts PostgreSQL 15 on **port 5433** with persistent storage.

### 3. Set Up the Backend

```bash
# Install dependencies
npm install

# Create .env file (see Environment Variables section)

# Run Prisma migrations
npx prisma migrate deploy

# Seed the database
npx prisma db seed

# Start the dev server
npm run dev
```

### 4. Set Up the Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

### 5. Open the App

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| Health Check | http://localhost:3000/health |

---

## 🔧 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
DATABASE_URL="postgresql://postgres:supersecretpassword@localhost:5433/globetrotter"

# JWT
JWT_SECRET="your-jwt-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"

# Email (for OTP password reset)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

---

## 🖥️ Screens & UI

| Page | Description |
|---|---|
| **Auth** | Login, signup, Google OAuth, forgot/reset password |
| **Dashboard** | Overview of user's trips |
| **Trip Builder** | Core feature — add cities as stops, attach activities, build itineraries |
| **Budget** | Log expenses and view per-trip budget breakdowns by category |
| **Profile** | User profile and settings |

---

## 🎯 Design Decisions

| Decision | Rationale |
|---|---|
| **Monolithic backend** with route-level separation | Faster to develop in 8hrs while maintaining clean code boundaries (`/auth` vs `/core`) |
| **Prisma ORM** | Type-safe queries, auto-generated migrations, built-in seeding |
| **Google OAuth + OTP reset** | Production-grade auth without heavy infrastructure |
| **Docker for DB only** | PostgreSQL container with health checks; backend/frontend run natively for faster dev iteration |
| **Tailwind CSS v4** | Utility-first styling with latest features and performance |
| **Seeded city/activity data** | Realistic demo without needing an admin panel |

---

## 👥 Team

| Member | Role |
|---|---|
| **Yug Dave** | Full-Stack Development |
| **Samarth** | Full-Stack Development |

### Git Strategy

- Trunk-based — single `main` branch
- Regular commits & pushes
- Clear `MVP DEMO READY` checkpoint

---

## 📄 License

This project was built for a hackathon/academic submission. Feel free to fork and extend!

---

<p align="center">
  Made with ❤️ by the GlobeTrotter Team
</p>
