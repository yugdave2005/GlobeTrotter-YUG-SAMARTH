# 🌍 GlobeTrotter — Smart Travel Itinerary Planner

<p align="center">
  <strong>Plan trips · Build itineraries · Track budgets · Share with friends</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Socket.IO-4-010101?logo=socket.io&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
</p>

---

## 📌 Table of Contents

- [About](#about)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Screenshots](#screenshots)
- [Design Decisions](#design-decisions)
- [Team](#team)
- [License](#license)

---

## 📖 About

**GlobeTrotter** is a full-stack travel itinerary planning application built during an **8-hour hackathon** by a **2-person team**. It lets users:

- Sign up via **email/password** or **Google OAuth**
- Create and manage multi-city trips with ordered stops
- Browse a curated catalog of **cities and activities**
- Attach activities to stops and build day-by-day itineraries
- Log expenses and view **budget breakdowns** by category
- Set **travel preferences** (style, pace, budget, companions)
- **Share trips publicly** via unique links
- Get **real-time updates** via WebSockets when collaborating on trips

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Multi-Auth** | Email/password, Google OAuth, OTP-based password reset via email |
| 🗺️ **Trip Management** | Create, view, and manage trips with dates, descriptions, and cover photos |
| 🏙️ **City & Activity Catalog** | Browse seeded cities (with region, cost index, popularity) and activities (4 categories) |
| 📋 **Itinerary Builder** | Add ordered city stops, attach activities with scheduled times and custom costs |
| 💰 **Budget & Expenses** | Log expenses by category (Transport, Stay, Meals, Misc), view per-trip breakdowns |
| 🎯 **Travel Preferences** | Set interests, travel style, pace, budget range, and companion type |
| 📌 **Saved Destinations** | Bookmark favorite cities for quick access |
| 🔗 **Public Sharing** | Generate unique share slugs for read-only public trip pages |
| ⚡ **Real-Time Updates** | Socket.IO integration for live trip collaboration |
| 🔔 **Toast Notifications** | React Hot Toast for elegant feedback on all actions |
| 🎨 **Animated UI** | Framer Motion animations, Lucide icons, responsive dashboard layout |

---

## 🏗️ Architecture

```
                    ┌─────────────────────────────┐
                    │      Frontend (React)       │
                    │      localhost:5173          │
                    │  React 19 · Vite 8 · TW v4  │
                    └──────┬──────────┬───────────┘
                           │ Axios    │ Socket.IO
                           │ REST     │ WebSocket
                    ┌──────▼──────────▼───────────┐
                    │      Backend (Express)       │
                    │      localhost:5000          │
                    │  Express 5 · Prisma 7 · JWT  │
                    │  /api/auth · /api/core        │
                    └──────────────┬───────────────┘
                                   │ Prisma Client
                    ┌──────────────▼───────────────┐
                    │    PostgreSQL 15 (Docker)     │
                    │    localhost:5433             │
                    │    Volume: postgres_data      │
                    └──────────────────────────────┘
```

**Key architectural choices:**
- **Monolithic backend** with logically separated route modules (`/api/auth` and `/api/core`)
- **Single PostgreSQL instance** containerized via Docker Compose with health checks
- **Socket.IO** server layered on top of the Express HTTP server for real-time features
- **Axios interceptor** on the frontend automatically attaches JWT to all authenticated requests

---

## 🛠️ Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js + Express | 5.x | REST API server |
| Prisma | 7.x | ORM, migrations, seeding |
| PostgreSQL | 15 Alpine | Relational database |
| Socket.IO | 4.x | Real-time WebSocket communication |
| JWT + bcrypt | — | Authentication & password hashing |
| Google Auth Library | 11.x | Google OAuth token verification |
| Nodemailer + otp-generator | — | Email-based OTP password reset |
| Docker Compose | — | Database containerization |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI framework |
| Vite | 8.x | Build tool & dev server |
| Tailwind CSS | 4.x | Utility-first styling |
| React Router | 7.x | Client-side routing |
| Axios | 1.x | HTTP client with interceptors |
| Framer Motion | 13.x | Animations & transitions |
| Lucide React | 1.x | Icon library |
| React Hot Toast | 2.x | Toast notifications |
| Socket.IO Client | 4.x | Real-time WebSocket client |
| @react-oauth/google | 0.13 | Google sign-in button |

---

## 📁 Project Structure

```
GlobeTrotter/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma              # 9 models, 3 enums
│   │   ├── seed.js                    # City & activity seed data
│   │   └── migrations/               # Migration history
│   ├── src/
│   │   ├── app.js                     # Express setup (CORS, JSON, routes)
│   │   ├── server.js                  # HTTP server + Socket.IO init
│   │   ├── config/
│   │   │   └── db.js                  # Database configuration
│   │   ├── controllers/
│   │   │   ├── auth.controller.js     # Register, login, Google OAuth, OTP, profile update
│   │   │   ├── trip.controller.js     # Trip CRUD, stops, stop-activities, public share
│   │   │   ├── city.controller.js     # City listing & details
│   │   │   ├── activity.controller.js # Activity listing
│   │   │   └── budget.controller.js   # Expense logging & budget breakdown
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js     # JWT verification
│   │   ├── routes/
│   │   │   ├── index.js              # Route aggregator → /api/auth + /api/core
│   │   │   ├── auth.route.js         # 7 auth endpoints
│   │   │   └── core.route.js         # 11 core business endpoints
│   │   └── utils/
│   │       ├── prisma.js             # Prisma client singleton
│   │       ├── jwt.js                # JWT sign/verify helpers
│   │       ├── socket.js             # Socket.IO server setup & room management
│   │       ├── email.js              # Nodemailer transporter
│   │       ├── otpUtils.js           # OTP generation
│   │       └── googleAuthUtils.js    # Google token verification
│   ├── docker-compose.yml            # PostgreSQL container
│   └── package.json
│
├── frontend/
│   ├── public/                        # Static assets (favicon, icons)
│   ├── src/
│   │   ├── main.jsx                   # App entry + providers (Router, Google OAuth)
│   │   ├── App.jsx                    # Root component (routes, SocketProvider, Toaster)
│   │   ├── App.css / index.css        # Global styles
│   │   ├── assets/                    # Images (hero.png, etc.)
│   │   ├── components/
│   │   │   ├── AnimatedCard.jsx       # Framer Motion animated card wrapper
│   │   │   ├── SettingsModal.jsx      # User settings modal
│   │   │   └── layout/
│   │   │       ├── LandingLayout.jsx  # Public pages layout
│   │   │       ├── DashboardLayout.jsx# Auth-protected dashboard shell
│   │   │       ├── Sidebar.jsx        # Navigation sidebar
│   │   │       └── Topbar.jsx         # Top navigation bar
│   │   ├── context/
│   │   │   └── SocketContext.jsx      # Socket.IO React context provider
│   │   ├── pages/
│   │   │   ├── Landing.jsx            # Landing/home page
│   │   │   ├── DashboardHome.jsx      # Dashboard overview
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx          # Login form
│   │   │   │   ├── Register.jsx       # Registration with travel preferences
│   │   │   │   ├── ForgotPasswordModal.jsx  # OTP password reset flow
│   │   │   │   └── routes.jsx         # Auth route definitions
│   │   │   ├── Budget/               # Budget tracking (in progress)
│   │   │   ├── TripBuilder/          # Itinerary builder (in progress)
│   │   │   └── Profile/              # User profile (in progress)
│   │   └── utils/
│   │       └── api.js                 # Axios instance with JWT interceptor
│   ├── vite.config.js
│   └── package.json
│
├── .agents/                           # AI agent configurations
├── GlobeTrotter_Implementation_Plan.md
├── GlobeTrotter.pdf                   # Original project brief
└── README.md
```

---

## 🗃️ Database Schema

The Prisma schema defines **9 models** and **3 enums**:

### Models

| Model | Key Fields | Description |
|---|---|---|
| **User** | `email`, `passwordHash`, `name`, `photoUrl`, `googleId`, `resetOtp`, `role`, `languagePreference` | Email & Google OAuth, admin roles, OTP reset |
| **TravelPreference** | `userId`, `interests[]`, `travelStyle`, `travelPace`, `budget`, `companions`, `priorities[]` | User's personalized travel preferences |
| **City** | `name`, `country`, `region`, `costIndex`, `popularityScore`, `imageUrl` | Seeded destination catalog |
| **Activity** | `cityId`, `name`, `category`, `cost`, `durationMinutes`, `description`, `imageUrl` | City-specific activities |
| **Trip** | `userId`, `name`, `startDate`, `endDate`, `coverPhotoUrl`, `isPublic`, `shareSlug` | User trips with public sharing |
| **TripStop** | `tripId`, `cityId`, `arrivalDate`, `departureDate`, `sortOrder` | Ordered city stops within a trip |
| **StopActivity** | `tripStopId`, `activityId`, `scheduledTime`, `customCost` | Activities attached to stops |
| **TripExpense** | `tripId`, `tripStopId`, `category`, `amount`, `description` | Logged expenses per trip/stop |
| **SavedDestination** | `userId`, `cityId` | Bookmarked cities |

### Enums

| Enum | Values |
|---|---|
| `Role` | `USER`, `ADMIN` |
| `ActivityCategory` | `SIGHTSEEING`, `FOOD`, `ADVENTURE`, `RELAXATION` |
| `ExpenseCategory` | `TRANSPORT`, `STAY`, `MEALS`, `MISC` |

### Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o| TravelPreference : has
    User ||--o{ Trip : creates
    User ||--o{ SavedDestination : saves
    City ||--o{ Activity : offers
    City ||--o{ TripStop : visited_in
    City ||--o{ SavedDestination : saved_by
    Trip ||--o{ TripStop : contains
    Trip ||--o{ TripExpense : tracks
    TripStop ||--o{ StopActivity : schedules
    TripStop ||--o{ TripExpense : incurs
    Activity ||--o{ StopActivity : booked_as
```

---

## 🔌 API Reference

Base URL: `http://localhost:5000/api`

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | ❌ | Register with email, password, name & travel preferences |
| `POST` | `/login` | ❌ | Login → JWT token |
| `POST` | `/google` | ❌ | Google OAuth authentication |
| `POST` | `/forgot-password` | ❌ | Send OTP to email |
| `POST` | `/reset-password` | ❌ | Reset password with OTP |
| `GET` | `/me` | ✅ | Get current user profile |
| `PUT` | `/profile` | ✅ | Update profile (name, photo, language, travel preferences) |

### Core — `/api/core`

#### Public Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/cities` | List all cities (searchable) |
| `GET` | `/cities/:id` | Get city details with activities |
| `GET` | `/activities` | List all activities (filterable) |
| `GET` | `/public/trips/:shareSlug` | View a publicly shared trip |

#### Protected Endpoints (JWT required)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/trips` | Create a new trip |
| `GET` | `/trips` | List current user's trips |
| `GET` | `/trips/:id` | Get trip with all stops, activities & expenses |
| `POST` | `/trips/:id/stops` | Add a city stop to a trip |
| `POST` | `/trips/:id/stops/:stopId/activities` | Attach an activity to a stop |
| `POST` | `/trips/:id/expenses` | Log an expense |
| `GET` | `/trips/:id/budget` | Get budget breakdown by category |

### WebSocket Events

| Event | Direction | Description |
|---|---|---|
| `join_trip` | Client → Server | Join a trip room for real-time updates |
| `leave_trip` | Client → Server | Leave a trip room |
| `connection` | Server → Client | New client connected |
| `disconnect` | Server → Client | Client disconnected |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) & Docker Compose
- [Git](https://git-scm.com/)
- A [Google Cloud](https://console.cloud.google.com/) project (for OAuth — optional)

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

> PostgreSQL 15 starts on **port 5433** with persistent volume `postgres_data`.

### 3. Set Up the Backend

```bash
# Install dependencies
npm install

# Create .env file (see Environment Variables section below)

# Run Prisma migrations
npx prisma migrate deploy

# Seed the database with cities & activities
npx prisma db seed

# Start the dev server (with hot-reload)
npm run dev
```

> Backend runs on **http://localhost:5000** with Socket.IO on the same port.

### 4. Set Up the Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

> Frontend runs on **http://localhost:5173**.

### 5. Quick Links

| Service | URL |
|---|---|
| 🌐 Frontend | http://localhost:5173 |
| 🔧 Backend API | http://localhost:5000/api |
| ❤️ Health Check | http://localhost:5000/health |
| 🐘 PostgreSQL | localhost:5433 |

---

## 🔧 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=5000

# Database (matches docker-compose.yml)
DATABASE_URL="postgresql://postgres:supersecretpassword@localhost:5433/globetrotter"

# JWT
JWT_SECRET="your-strong-jwt-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"

# Email (for OTP password reset)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-gmail-app-password"
```

---

## 🖥️ Screenshots

> *Coming soon — the frontend is actively being built!*

### Available Pages

| Page | Status | Description |
|---|---|---|
| **Landing** | ✅ Built | Hero section, feature highlights, call-to-action |
| **Login** | ✅ Built | Email/password + Google OAuth sign-in |
| **Register** | ✅ Built | Multi-step registration with travel preferences |
| **Forgot Password** | ✅ Built | OTP-based password reset modal |
| **Dashboard** | ✅ Built | Dashboard home with sidebar navigation |
| **Trip Builder** | 🚧 In Progress | Itinerary creation and management |
| **Budget** | 🚧 In Progress | Expense tracking and breakdown charts |
| **Profile** | 🚧 In Progress | User profile and settings |

---

## 🎯 Design Decisions

| Decision | Rationale |
|---|---|
| **Monolithic backend** with route-level separation | Faster development in 8hrs; clean boundaries via `/api/auth` and `/api/core` modules |
| **Prisma ORM** | Type-safe queries, auto-generated migrations, declarative schema, built-in seeding |
| **Socket.IO for real-time** | Enables live trip collaboration without polling; room-based architecture per trip |
| **Google OAuth + OTP reset** | Production-grade auth without heavy infrastructure (no Redis sessions needed) |
| **Docker for DB only** | PostgreSQL containerized with health checks; backend/frontend run natively for faster dev iteration |
| **Axios interceptors** | Automatically attaches JWT to all requests; centralized API config |
| **Framer Motion** | Smooth page transitions and card animations for a polished feel |
| **Tailwind CSS v4** | Latest utility-first CSS with better performance and native nesting |
| **Seeded catalog data** | Realistic demo experience without needing an admin panel |

---

## 👥 Team

| Member | GitHub | Role |
|---|---|---|
| **Yug Dave** | [@yugdave2005](https://github.com/yugdave2005) | Full-Stack Development |
| **Samarth** | — | Full-Stack Development |

### Git Workflow

- **Trunk-based** — single `main` branch for rapid iteration
- Regular commits & pushes after each feature
- Clear `MVP DEMO READY` checkpoint for demo readiness

---

## 📄 License

This project was built for a hackathon / academic submission. Feel free to fork and extend!

---

<p align="center">
  Made with ❤️ by the GlobeTrotter Team
</p>
