# 🌍 GlobeTrotter — Smart Travel Itinerary Planner

> **A containerized, microservice-oriented travel planning platform built for the hackathon.**
> Plan trips, build itineraries, track budgets, and share your travel plans — all powered by a modern full-stack architecture.

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
- [Design Decisions & Tradeoffs](#design-decisions--tradeoffs)
- [Team & Workflow](#team--workflow)
- [License](#license)

---

## 📖 About the Project

**GlobeTrotter** is a full-stack travel itinerary planning application designed and built under an **8-hour hackathon constraint** by a **2-person team**. It allows users to create trips, search and add cities as stops, browse and attach activities, view a budget breakdown, and share their itinerary publicly via a unique link.

The project follows a **microservice architecture** with clearly separated concerns:
- **Authentication** is handled by a dedicated service.
- **Core travel logic** (trips, stops, activities, budget, city catalog) lives in its own service.
- **Frontend** is a standalone React SPA communicating with both services.

All components are fully **containerized with Docker Compose** for seamless local development and deployment.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **User Authentication** | Signup, login, and profile management via JWT |
| 🗺️ **Trip Management** | Create, edit, delete, and view personal trips |
| 🏙️ **City & Activity Catalog** | Search from a curated, seeded list of cities and activities |
| 📋 **Itinerary Builder** | Add cities as stops, attach activities to each stop |
| 💰 **Budget Breakdown** | Auto-calculated budget with per-category totals and a pie chart |
| 🔗 **Public Sharing** | Generate a shareable link for read-only trip viewing |
| 🐳 **Fully Containerized** | One-command startup via Docker Compose |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        Docker Compose                        │
├──────────────┬──────────────┬──────────────┬─────────────────┤
│   client     │ auth-service │ core-service │    postgres     │
│  (React +    │ (Express +   │ (Express +   │  (PostgreSQL    │
│   Vite)      │  JWT)        │  Prisma)     │   16-Alpine)    │
│  Port: 5173  │ Port: 4001   │ Port: 4002   │  Port: 5432     │
├──────────────┴──────────────┴──────────────┴─────────────────┤
│                      Shared Network                          │
└──────────────────────────────────────────────────────────────┘
```

- **2-service backend** split — `auth-service` and `core-service` — a deliberate scope decision for the 8-hour window.
- **Single PostgreSQL instance** with two schemas (`auth` and `core`) for logical separation.
- **No gateway/Nginx** — the React client calls each service directly via CORS.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, Vite, Tailwind CSS, Recharts, React Router, Axios |
| **Backend** | Node.js, Express (2 microservices) |
| **Database / ORM** | PostgreSQL 16 (Alpine), Prisma |
| **Authentication** | JWT (long-lived tokens), bcrypt |
| **Containerization** | Docker, Docker Compose |
| **Version Control** | Git (trunk-based workflow) |

---

## 📁 Project Structure

```
GlobeTrotter/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── pages/             # Login, MyTrips, CreateTrip, ItineraryBuilder, etc.
│   │   ├── components/        # Reusable UI components
│   │   └── ...
│   └── Dockerfile
│
├── services/
│   ├── auth-service/          # Express — signup, login, JWT
│   │   ├── prisma/
│   │   ├── src/
│   │   └── Dockerfile
│   │
│   └── core-service/          # Express — trips, stops, activities, budget, catalog
│       ├── prisma/
│       ├── src/
│       └── Dockerfile
│
├── db/
│   └── init.sql               # Creates `auth` and `core` schemas on first boot
│
├── docker-compose.yml         # Orchestrates all 4 containers
├── .env                       # Shared environment variables
└── README.md
```

---

## 🗃️ Database Schema

### `auth` Schema

| Table | Columns |
|---|---|
| `users` | `id`, `email`, `password_hash`, `name`, `created_at` |

### `core` Schema

| Table | Columns |
|---|---|
| `cities` | `id`, `name`, `country`, `cost_index`, `image_url` |
| `activities` | `id`, `city_id`, `name`, `category`, `cost`, `duration_minutes`, `description` |
| `trips` | `id`, `user_id`, `name`, `start_date`, `end_date`, `description`, `is_public`, `share_slug`, `created_at` |
| `trip_stops` | `id`, `trip_id`, `city_id`, `arrival_date`, `departure_date`, `sort_order` |
| `stop_activities` | `id`, `trip_stop_id`, `activity_id`, `scheduled_time`, `custom_cost` |

> **Seeded data:** ~15–20 cities and ~40–60 activities are pre-loaded for a realistic demo experience.

---

## 🔌 API Endpoints

### Auth Service (`localhost:4001`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `GET` | `/api/auth/me` | Get current user profile (Bearer token) |

### Core Service (`localhost:4002`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/cities?search=` | Search cities |
| `GET` | `/api/cities/:id/activities` | List activities for a city |
| `POST` | `/api/trips` | Create a new trip |
| `GET` | `/api/trips` | List user's trips |
| `GET` | `/api/trips/:id` | Get trip details |
| `PATCH` | `/api/trips/:id` | Update a trip |
| `DELETE` | `/api/trips/:id` | Delete a trip |
| `POST` | `/api/trips/:id/stops` | Add a city stop to a trip |
| `DELETE` | `/api/trips/:id/stops/:stopId` | Remove a stop |
| `POST` | `/api/trips/:id/stops/:stopId/activities` | Add an activity to a stop |
| `DELETE` | `/api/trips/:id/stops/:stopId/activities/:activityId` | Remove an activity |
| `GET` | `/api/trips/:id/budget` | Get budget breakdown |
| `GET` | `/api/public/:shareSlug` | View shared trip (no auth) |

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose installed
- [Git](https://git-scm.com/)

### Run the Application

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/GlobeTrotter.git
cd GlobeTrotter

# 2. Create a .env file (see Environment Variables section below)
cp .env.example .env

# 3. Start all services
docker compose up --build

# 4. Open the app
# Frontend:      http://localhost:5173
# Auth Service:  http://localhost:4001
# Core Service:  http://localhost:4002
```

### Stop the Application

```bash
docker compose down
```

---

## 🔧 Environment Variables

Create a `.env` file in the project root:

```env
# PostgreSQL
POSTGRES_DB=globetrotter
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Auth Service
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/globetrotter?schema=auth
JWT_SECRET=your-secret-key

# Core Service
CORE_DATABASE_URL=postgresql://postgres:postgres@postgres:5432/globetrotter?schema=core
```

---

## 🖥️ Screens & UI

The application includes **8 core screens**, prioritized for the hackathon:

| # | Screen | Description |
|---|---|---|
| 1 | **Login / Signup** | Combined auth form |
| 2 | **My Trips** | Dashboard listing all user trips |
| 3 | **Create Trip** | Form for name, dates, and description |
| 4 | **Itinerary Builder** | Core feature — add cities as stops, attach activities |
| 5 | **City / Activity Search** | Search and filter from the seeded catalog |
| 6 | **Itinerary View** | Grouped-by-city read-only view |
| 7 | **Budget Breakdown** | Total + per-category costs with a pie chart |
| 8 | **Public Share View** | Read-only page accessible via a unique share link |

---

## 🎯 Design Decisions & Tradeoffs

These tradeoffs were made deliberately for the 8-hour hackathon window:

| Decision | Rationale |
|---|---|
| **2 services** instead of 3+ | Ensures a finished, demo-able product over an incomplete architecture |
| **Single PostgreSQL** with 2 schemas | Logical separation without the overhead of multiple DB containers |
| **No API gateway (Nginx)** | Plain CORS on Express keeps setup simple; direct service calls from the client |
| **No refresh tokens** | A single long-lived JWT (7-day expiry) is sufficient for a demo |
| **No image uploads** | Placeholder images used instead of building file upload handling |
| **No RabbitMQ / Redis / CI** | These are 36hr+ additions that add setup risk with no demo upside |
| **Seeded catalog data** | Hardcoded cities/activities instead of an admin CRUD panel |

---

## 👥 Team & Workflow

| Role | Responsibility |
|---|---|
| **Person A** — Backend & DevOps | Both services, Prisma models, migrations, seed data, Docker Compose |
| **Person B** — Frontend | All React screens, API integration, UI/UX |

### Git Strategy
- **Trunk-based** — single `main` branch with strict file ownership to avoid conflicts.
- Commits every ~30 minutes, push after every commit.
- A clear `MVP DEMO READY` commit marks the working end-to-end flow.

---

## 📄 License

This project was built for a hackathon/academic submission. Feel free to fork and extend!

---

<p align="center">
  Made with ❤️ by the GlobeTrotter Team
</p>
