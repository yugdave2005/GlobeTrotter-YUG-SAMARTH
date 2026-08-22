# 🌍 GlobeTrotter — Smart Travel Itinerary Planner

<p align="center">
  <strong>Plan trips · Build itineraries · Track budgets · Discover destinations · Share with community</strong>
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
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Page & Feature Status](#page--feature-status)
- [Design Decisions](#design-decisions)
- [Team](#team)
- [License](#license)

---

## 📖 About

**GlobeTrotter** is a full-stack smart travel itinerary planning application designed to revolutionize trip planning. It offers an all-in-one experience for travelers to discover destinations, generate intelligent itineraries based on personal preferences, manage trip budgets, collaborate in real time, and share travel plans with the community.

Built with **React 19**, **Express 5**, **Prisma 7**, **PostgreSQL**, and **Socket.IO**, GlobeTrotter delivers high-performance interactivity wrapped in a sleek, responsive design.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 **Multi-Auth & Security** | Email/password login, Google OAuth, OTP password reset via Nodemailer |
| 🤖 **Smart Itinerary Generator** | AI/Rule-based planner modal auto-crafting customized itineraries based on user travel style, pace, and budget |
| 🗺️ **My Trips Dashboard** | Comprehensive trip manager with status filtering (Active, Upcoming, Completed), search, edit, delete, and share modals |
| 📋 **Interactive Itinerary Builder** | Day-by-day itinerary view, city stop ordering, activity scheduling with custom costs and durations |
| 🏙️ **Discover Destinations** | City exploration with search, popularity scores, cost index indicators, category filters, and saved destination bookmarking |
| 💰 **Budget & Expense Tracker** | Real-time budget monitoring with per-category expense breakdown (Transport, Stay, Meals, Misc) and budget limit alerts |
| 🌐 **Community Hub** | Social travel feed showcasing public trip itineraries shared by fellow travelers |
| 🔗 **Public Itinerary Sharing** | Instant shareable read-only links (`/public/trips/:shareSlug`) for friends and public viewing |
| ⚡ **Real-Time WebSockets** | Socket.IO room-based architecture for live collaborative trip updates |
| 🔔 **Toast Notifications** | React Hot Toast for instant visual feedback on all user interactions |
| 🎨 **Rich UI & Animations** | Framer Motion page transitions, Lucide React icons, dark/light theme accents with Tailwind CSS v4 |

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

---

## 🛠️ Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js + Express | 5.x | High-performance REST API server |
| Prisma | 7.x | Database ORM, migrations, rich seed scripts |
| PostgreSQL | 15 Alpine | Primary relational database |
| Socket.IO | 4.x | WebSockets for real-time trip collaboration |
| JWT + bcrypt | — | Secure token authentication & password hashing |
| Google Auth Library | 11.x | Google OAuth token verification |
| Nodemailer + otp-generator | — | Email OTP dispatch for password recovery |
| Docker Compose | — | Containerized database environment |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | Component-driven UI framework |
| Vite | 8.x | Lightning-fast development server & bundler |
| Tailwind CSS | 4.x | Modern utility-first CSS engine |
| React Router | 7.x | SPA routing & layout nesting |
| Axios | 1.x | HTTP client with bearer token interceptors |
| Framer Motion | 13.x | UI animations & smooth card transitions |
| Lucide React | 1.x | Vector icon suite |
| React Hot Toast | 2.x | Flexible toast notification manager |
| Socket.IO Client | 4.x | Client-side WebSocket integration |
| @react-oauth/google | 0.13 | Native Google Sign-In button integration |

---

## 📁 Project Structure

```
GlobeTrotter/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma              # 9 Prisma models, 3 enums
│   │   ├── seed.js                    # Rich seed dataset (cities, activities, destinations)
│   │   └── migrations/               # Database migration history
│   ├── src/
│   │   ├── app.js                     # Express app configuration & CORS
│   │   ├── server.js                  # HTTP server, Socket.IO & graceful shutdown handling
│   │   ├── config/
│   │   │   └── db.js                  # DB connections
│   │   ├── controllers/
│   │   │   ├── auth.controller.js     # Auth, Google OAuth, OTP reset, profile updates
│   │   │   ├── trip.controller.js     # Smart trip creation, CRUD, stop & activity management
│   │   │   ├── city.controller.js     # City search, details, popularity & cost index
│   │   │   ├── activity.controller.js # Activity discovery by category & city
│   │   │   └── budget.controller.js   # Expense logging & budget breakdown calculations
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js     # JWT bearer authentication guard
│   │   ├── routes/
│   │   │   ├── index.js              # Central API router (/api/auth, /api/core)
│   │   │   ├── auth.route.js         # Authentication & profile routes
│   │   │   └── core.route.js         # Core trip, city, activity & budget routes
│   │   └── utils/
│   │       ├── prisma.js             # Shared Prisma Client instance
│   │       ├── jwt.js                # Token sign & verify utilities
│   │       ├── socket.js             # Socket.IO rooms & connection handlers
│   │       ├── email.js              # HTML email template sender
│   │       ├── otpUtils.js           # Secure numeric OTP generator
│   │       └── googleAuthUtils.js    # Google OAuth ID token verifier
│   ├── docker-compose.yml            # PostgreSQL container config
│   └── package.json
│
├── frontend/
│   ├── public/                        # Public static assets & icons
│   ├── src/
│   │   ├── main.jsx                   # Entry point with Google OAuth & Router context
│   │   ├── App.jsx                    # Top-level routing & layout switcher
│   │   ├── App.css / index.css        # Global CSS & Tailwind imports
│   │   ├── assets/                    # Static image assets
│   │   ├── components/
│   │   │   ├── AnimatedCard.jsx       # Framer Motion animated card component
│   │   │   ├── SettingsModal.jsx      # User settings & preference modal
│   │   │   ├── SmartItineraryPlannerModal.jsx # Smart AI-driven itinerary planner modal
│   │   │   └── layout/
│   │   │       ├── LandingLayout.jsx  # Public page wrapper
│   │   │       ├── DashboardLayout.jsx# Protected dashboard layout
│   │   │       ├── Sidebar.jsx        # Dashboard sidebar navigation
│   │   │       └── Topbar.jsx         # Dashboard topbar navigation
│   │   ├── context/
│   │   │   └── SocketContext.jsx      # WebSocket connection provider
│   │   ├── pages/
│   │   │   ├── Landing.jsx            # Product landing page
│   │   │   ├── DashboardHome.jsx      # User dashboard overview & stats
│   │   │   ├── Discover/
│   │   │   │   └── Discover.jsx       # Destination & activity explorer
│   │   │   ├── Trips/
│   │   │   │   ├── MyTrips.jsx        # Trip management hub & creation modal
│   │   │   │   └── ItineraryBuilder.jsx # Interactive day-by-day itinerary planner
│   │   │   ├── Budget/
│   │   │   │   └── BudgetTracker.jsx   # Expense logger & category breakdown
│   │   │   ├── Community/
│   │   │   │   └── Community.jsx      # Social showcase for public trip itineraries
│   │   │   ├── PublicItinerary.jsx    # Read-only public share trip page
│   │   │   └── Auth/
│   │   │       ├── Login.jsx          # Login view
│   │   │       ├── Register.jsx       # Registration with preference onboarding
│   │   │       ├── ForgotPasswordModal.jsx # OTP verification modal
│   │   │       └── routes.jsx         # Auth route definitions
│   │   └── utils/
│   │       └── api.js                 # Axios client with request interceptors
│   ├── vite.config.js
│   └── package.json
│
├── .agents/                           # AI assistant workflow configs
├── GlobeTrotter_Implementation_Plan.md
├── GlobeTrotter.pdf                   # Original design brief
└── README.md
```

---

## 🗃️ Database Schema

### Models & Definitions

| Model | Key Fields | Description |
|---|---|---|
| **User** | `email`, `passwordHash`, `name`, `photoUrl`, `googleId`, `resetOtp`, `resetOtpExpires`, `role`, `languagePreference` | User account with OAuth & OTP support |
| **TravelPreference** | `userId`, `interests[]`, `travelStyle`, `travelPace`, `budget`, `companions`, `priorities[]` | Personal travel profile |
| **City** | `name`, `country`, `region`, `costIndex`, `popularityScore`, `imageUrl` | Curated city destination catalog |
| **Activity** | `cityId`, `name`, `category`, `cost`, `durationMinutes`, `description`, `imageUrl` | Discoverable activities mapped to cities |
| **Trip** | `userId`, `name`, `description`, `startDate`, `endDate`, `coverPhotoUrl`, `budget`, `isPublic`, `shareSlug` | Core trip entity with shareable slug |
| **TripStop** | `tripId`, `cityId`, `arrivalDate`, `departureDate`, `sortOrder` | Ordered city stop within a trip itinerary |
| **StopActivity** | `tripStopId`, `activityId`, `scheduledTime`, `customCost` | Scheduled activity attached to a trip stop |
| **TripExpense** | `tripId`, `tripStopId`, `category`, `amount`, `description` | Itemized expense for budget calculations |
| **SavedDestination** | `userId`, `cityId` | User saved/bookmarked cities |

### Enums

- **`Role`**: `USER`, `ADMIN`
- **`ActivityCategory`**: `SIGHTSEEING`, `FOOD`, `ADVENTURE`, `RELAXATION`
- **`ExpenseCategory`**: `TRANSPORT`, `STAY`, `MEALS`, `MISC`

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

### Auth Endpoints (`/api/auth`)

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/register` | ❌ | Register user account + initial travel preferences |
| `POST` | `/login` | ❌ | Authenticate credentials & return JWT |
| `POST` | `/google` | ❌ | Authenticate via Google OAuth ID token |
| `POST` | `/forgot-password` | ❌ | Send 6-digit OTP code to email |
| `POST` | `/reset-password` | ❌ | Verify OTP and reset password |
| `GET` | `/me` | ✅ | Fetch current user profile |
| `PUT` | `/profile` | ✅ | Update profile info & travel preferences |

### Core Endpoints (`/api/core`)

#### Public Discovery & Sharing

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/cities` | ❌ | List/search all cities with cost index & popularity |
| `GET` | `/cities/:id` | ❌ | Get city details with associated activities |
| `GET` | `/activities` | ❌ | List activities by category & city |
| `GET` | `/public/trips/:shareSlug` | ❌ | Fetch a publicly shared trip itinerary |

#### Trip & Itinerary Operations (JWT Protected)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/trips` | Create a new trip |
| `GET` | `/trips` | List all trips created by the logged-in user |
| `GET` | `/trips/:id` | Get full trip details (stops, activities, expenses) |
| `PUT` | `/trips/:id` | Update trip details |
| `DELETE` | `/trips/:id` | Delete a trip |
| `POST` | `/trips/:id/stops` | Add a city stop to a trip |
| `POST` | `/trips/:id/stops/:stopId/activities` | Attach an activity to a trip stop |
| `POST` | `/trips/:id/expenses` | Log a trip expense |
| `GET` | `/trips/:id/budget` | Get computed budget breakdown and totals |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) & Docker Compose
- [Git](https://git-scm.com/)

### 1. Clone Repository

```bash
git clone https://github.com/yugdave2005/GlobeTrotter-YUG-SAMARTH.git
cd GlobeTrotter-YUG-SAMARTH
```

### 2. Start PostgreSQL via Docker

```bash
cd backend
docker compose up -d
```
> PostgreSQL 15 will start on **`localhost:5433`** with persistent volume storage.

### 3. Setup & Start Backend

```bash
# Install backend packages
npm install

# Apply database schema migrations
npx prisma migrate deploy

# Seed database with cities & activities
npx prisma db seed

# Launch Express dev server
npm run dev
```
> Backend API runs at **`http://localhost:5000`**.

### 4. Setup & Start Frontend

```bash
cd ../frontend

# Install frontend packages
npm install

# Launch Vite dev server
npm run dev
```
> Frontend application runs at **`http://localhost:5173`**.

---

## 🔧 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000

# Database Connection (Docker Compose)
DATABASE_URL="postgresql://postgres:supersecretpassword@localhost:5433/globetrotter"

# JWT Secret
JWT_SECRET="your-jwt-secret-key"

# Google OAuth Client ID
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"

# Email / OTP Settings (Nodemailer)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-gmail-app-password"
```

---

## 🖥️ Page & Feature Status

| Page / Component | Route | Status | Key Functionality |
|---|---|---|---|
| **Landing** | `/` | ✅ Fully Built | Hero, feature highlights, call to action |
| **Login** | `/auth/login` | ✅ Fully Built | Email/Password + Google OAuth |
| **Register** | `/auth/register` | ✅ Fully Built | Account setup + preference onboarding |
| **Dashboard Home** | `/dashboard` | ✅ Fully Built | Quick stats, trip overview, recent activity |
| **My Trips** | `/dashboard/trips` | ✅ Fully Built | Active/Upcoming/Completed tabs, create modal, share modal |
| **Itinerary Builder** | `/dashboard/trips/:id` | ✅ Fully Built | Interactive stops, activity attachment, day timelines |
| **Smart Itinerary Planner** | Modal | ✅ Fully Built | AI/Rule-based trip generation wizard |
| **Discover** | `/dashboard/discover` | ✅ Fully Built | City search, category filters, saved destinations |
| **Budget Tracker** | `/dashboard/budget` | ✅ Fully Built | Expense logger, category pie breakdown, budget limits |
| **Community** | `/dashboard/community` | ✅ Fully Built | Public itinerary feed, social trip sharing |
| **Public Itinerary** | `/public/trips/:shareSlug` | ✅ Fully Built | Unauthenticated read-only trip viewer |

---

## 🎯 Design Decisions

| Decision | Rationale |
|---|---|
| **Monolithic Backend** | Unified Express API architecture allowing rapid development while maintaining clean `/api/auth` and `/api/core` routing modules |
| **Prisma ORM** | Type-safe database queries, auto-generated migrations, and robust seed scripts for instant setup |
| **Socket.IO Integration** | Room-based real-time WebSocket communication enabling live collaborative itinerary editing |
| **Tailwind CSS v4 & Framer Motion** | Utility-first responsive design coupled with hardware-accelerated animations for a modern UX |
| **Docker-based Database** | Isolated PostgreSQL environment ensuring consistent developer environments across team members |

---

## 👥 Team

| Member | Role | GitHub |
|---|---|---|
| **Yug Dave** | Full-Stack Developer | [@yugdave2005](https://github.com/yugdave2005) |
| **Samarth** | Full-Stack Developer | [@samarth](https://github.com/yugdave2005) |

---

## 📄 License

This project was developed for a hackathon & academic showcase. Feel free to fork and build upon it!

---

<p align="center">
  Made with ❤️ by the GlobeTrotter Team
</p>
