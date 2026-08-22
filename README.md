# 🌍 GlobeTrotter — Smart Travel Itinerary Planner & Real-Time Expense Tracker

<p align="center">
  <img src="photos/41-globetrotter-brand-logo.png" alt="GlobeTrotter Logo" width="120" />
</p>

<p align="center">
  <strong>AI-Powered Itineraries · GPS Route Mapping · Live Budget Deduction · Destination Discovery · PDF Export · Real-Time Collaboration</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.2.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Express-5.2.1-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-7.4.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Socket.IO-4.8.1-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Leaflet-1.9.4-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

---

## 📌 Table of Contents

1. [Overview](#-overview)
2. [Visual Walkthrough & Screenshot Gallery](#-visual-walkthrough--screenshot-gallery)
3. [System Architecture & Data Flow](#-system-architecture--data-flow)
4. [User Journey & Workflow Diagrams](#-user-journey--workflow-diagrams)
5. [Smart Itinerary Recommendation Engine](#-smart-itinerary-recommendation-engine)
6. [Real-Time WebSocket Synchronization Flow](#-real-time-websocket-synchronization-flow)
7. [Database ER Diagram & Schema](#-database-er-diagram--schema)
8. [Core Feature Breakdown](#-core-feature-breakdown)
9. [REST API Reference](#-rest-api-reference)
10. [Getting Started & Local Setup](#-getting-started--local-setup)
11. [Environment Variables](#-environment-variables)
12. [Project Structure](#-project-structure)

---

## 📖 Overview

**GlobeTrotter** is a modern full-stack travel planning platform built to simplify how modern travelers organize, budget, and visualize vacations. 

From smart itinerary generation and multi-city stop sequencing to real-time expense deduction, GPS route mapping with Leaflet, and professional PDF export, GlobeTrotter delivers an intuitive travel management experience.

---

## 🖼️ Visual Walkthrough & Screenshot Gallery

### 1. Authentication & Secure Onboarding
Complete authentication lifecycle supporting direct email/password login, Google OAuth integration, and automated 6-digit OTP verification via Nodemailer for secure password recovery.

<p align="center">
  <img src="photos/01-auth-signin.png" alt="Sign In Screen" width="48%" />
  <img src="photos/02-auth-signup.png" alt="Sign Up Screen" width="48%" />
</p>
<p align="center">
  <img src="photos/04-auth-otp-verification.png" alt="OTP Verification" width="48%" />
  <img src="photos/08-auth-password-reset-confirmed.png" alt="Password Reset Success" width="48%" />
</p>

---

### 2. Dashboard Overview & Notifications
Centralized travel mission control displaying quick trip stats, upcoming journey countdowns, budget utilization meters, and real-time notification alerts.

<p align="center">
  <img src="photos/10-dashboard-overview.png" alt="Dashboard Overview" width="48%" />
  <img src="photos/11-notifications-popover.png" alt="Real-time Notification Alerts" width="48%" />
</p>

---

### 3. Smart Dynamic Itinerary Assistant
Configurable automated trip generator that creates multi-day itineraries based on travel style, companion profile, pace, and spending budget tiers with pre-calculated financial allocations across stays, transport, meals, and sightseeing.

<p align="center">
  <img src="photos/12-smart-planner-package-selection.png" alt="Curated Packages" width="48%" />
  <img src="photos/13-smart-planner-destination-choice.png" alt="Destination Choice" width="48%" />
</p>
<p align="center">
  <img src="photos/14-smart-planner-travel-persona.png" alt="Travel Persona Selection" width="48%" />
  <img src="photos/15-smart-planner-budget-breakdown.png" alt="Budget Category Allocation" width="48%" />
</p>

---

### 4. Interactive Itinerary Builder & Dynamic Expense Deductor
Detailed day-by-day itinerary management. Add destination stops with strict date-collision guardrails, schedule curated 1-click activities, and watch allocated trip budgets deduct dynamically in real time.

<p align="center">
  <img src="photos/16-itinerary-builder-timeline.png" alt="Itinerary Timeline View" width="48%" />
  <img src="photos/20-itinerary-builder-budget-deductor.png" alt="Dynamic Budget Deductor Bar" width="48%" />
</p>
<p align="center">
  <img src="photos/18-itinerary-builder-assign-activity.png" alt="Curated Activity Selection" width="48%" />
  <img src="photos/19-itinerary-builder-custom-activity.png" alt="Custom Activity Form" width="48%" />
</p>

---

### 5. Interactive GPS Route Map & Travel Schedule
Visual route map powered by Leaflet & OpenStreetMap tiles. Displays glowing connecting paths between sequential destinations, custom numbered pulse markers, and activity detail popups.

<p align="center">
  <img src="photos/21-itinerary-builder-interactive-map.png" alt="Interactive GPS Route Map" width="100%" />
</p>
<p align="center">
  <img src="photos/22-itinerary-builder-calendar-view.png" alt="Calendar Schedule Matrix" width="48%" />
  <img src="photos/24-public-itinerary-view.png" alt="Public Shareable Link View" width="48%" />
</p>

---

### 6. My Trips & Itinerary Management
Comprehensive trip organizer featuring search filtering, active/upcoming/completed status segmentation, quick deletion confirmation modals, and one-click sharing.

<p align="center">
  <img src="photos/26-my-trips-dashboard-grid.png" alt="My Trips Grid" width="48%" />
  <img src="photos/27-my-trips-filtering-search.png" alt="My Trips Search & Filters" width="48%" />
</p>

---

### 7. Discover Destinations & Pricing Benchmarks
Explore worldwide and domestic destinations featuring estimated daily budget indices, 5-day package cost estimates, and direct 1-click itinerary integration.

<p align="center">
  <img src="photos/28-discover-destinations-overview.png" alt="Discover Destinations" width="48%" />
  <img src="photos/29-discover-destinations-pricing-cards.png" alt="Destination Pricing Cards" width="48%" />
</p>
<p align="center">
  <img src="photos/30-discover-destination-activities-modal.png" alt="Destination Activities Modal" width="48%" />
  <img src="photos/31-discover-add-to-trip-flow.png" alt="Add Destination to Itinerary" width="48%" />
</p>

---

### 8. Budget & Expense Tracking
Trip-by-trip financial ledger aggregating scheduled itinerary activity costs with logged on-trip expenses across Stays, Transport, Food, and Sightseeing.

<p align="center">
  <img src="photos/32-budget-tracker-overview.png" alt="Budget Tracker Overview" width="48%" />
  <img src="photos/33-budget-tracker-category-breakdown.png" alt="Spending Category Breakdown" width="48%" />
</p>
<p align="center">
  <img src="photos/34-budget-tracker-transaction-ledger.png" alt="Itemized Transaction Ledger" width="100%" />
</p>

---

### 9. Account & Travel Persona Preferences
Sticky mini-sidebar navigation allowing users to customize avatar styles (DiceBear), personal travel personas, budget comfort tiers, and preferred pace.

<p align="center">
  <img src="photos/35-settings-sidebar-avatar-picker.png" alt="Settings & Avatar Picker" width="48%" />
  <img src="photos/37-settings-travel-style-persona.png" alt="Travel Persona Preferences" width="48%" />
</p>
<p align="center">
  <img src="photos/38-settings-pace-and-budget-tiers.png" alt="Pace & Budget Preferences" width="48%" />
  <img src="photos/39-settings-companions-interests.png" alt="Companions & Interest Tags" width="48%" />
</p>

---

## 🏗️ System Architecture & Data Flow

```mermaid
graph TB
    subgraph Client Layer ["Frontend (React 19 + Vite 8)"]
        UI[User Interface / Pages]
        State[React Context & State]
        SocketClient[Socket.IO Client]
        LeafletMap[Leaflet GPS Map Engine]
        PDFEngine[jsPDF Generator]
    end

    subgraph Gateway Layer ["API & Real-Time Gateway"]
        AuthRoute["/api/auth (JWT, OAuth, OTP)"]
        CoreRoute["/api/core (Trips, Stops, Activities, Budget)"]
        SocketServer["Socket.IO Server (Rooms per tripId)"]
    end

    subgraph Service Layer ["Backend Controllers & Business Logic"]
        TripController[Trip & Itinerary Controller]
        BudgetController[Budget Calculation Engine]
        AuthController[Authentication & Mailer Service]
        CityController[Destination Search Engine]
    end

    subgraph Persistence Layer ["Database & Cache"]
        PrismaORM[Prisma 7 ORM]
        PostgreSQL[(PostgreSQL 15 Database)]
        BrevoSMTP[Brevo / Nodemailer SMTP Service]
    end

    UI -->|REST API Calls| AuthRoute
    UI -->|REST API Calls| CoreRoute
    State <-->|Bi-directional Sync| SocketClient
    SocketClient <-->|WebSockets| SocketServer
    UI --> LeafletMap
    UI --> PDFEngine

    AuthRoute --> AuthController
    CoreRoute --> TripController
    CoreRoute --> BudgetController
    CoreRoute --> CityController
    SocketServer <--> TripController

    AuthController --> PrismaORM
    AuthController --> BrevoSMTP
    TripController --> PrismaORM
    BudgetController --> PrismaORM
    CityController --> PrismaORM

    PrismaORM <--> PostgreSQL
```

---

## 🔄 User Journey & Workflow Diagrams

### 1. End-to-End Trip Planning Lifecycle

```mermaid
flowchart TD
    Start([User Arrives]) --> Auth{Authenticated?}
    Auth -- No --> SignUp[Sign Up / Login / Google OAuth]
    Auth -- Yes --> Dash[Dashboard Home]
    SignUp --> Dash

    Dash --> PathChoice{Choose Creation Method}
    PathChoice -- "Smart AI Planner" --> SmartModal[Open Smart Planner Modal]
    PathChoice -- "Discover Page" --> Discover[Browse Destinations & Prices]
    PathChoice -- "Manual Creation" --> Manual[Create Custom Trip]

    SmartModal --> SelectPkg[Select Curated Destination Package]
    SelectPkg --> CustomizePace[Tune Budget, Style & Pace]
    CustomizePace --> AutoGenerate[Generate Itinerary & Stops]

    Discover --> PickCity[Pick City with Budget Index]
    PickCity --> AddCityToTrip[Add Destination as Trip Stop]

    Manual --> Itinerary[Itinerary Builder Page]
    AutoGenerate --> Itinerary
    AddCityToTrip --> Itinerary

    subgraph ItineraryManagement ["Itinerary Management & Live Deductions"]
        Itinerary --> AddStops[Add / Reorder Stops with Date Validation]
        AddStops --> AssignActs[Assign Activities: Curated / Custom]
        AssignActs --> DeductBudget[Dynamic Budget Deduction in ₹]
        DeductBudget --> ViewModes{Switch View Mode}
        ViewModes -- Timeline --> TimelineView[Timeline Schedule Cards]
        ViewModes -- Calendar --> CalView[Day-by-Day Calendar Grid]
        ViewModes -- Route Map --> MapView[Interactive GPS Leaflet Map]
    end

    Itinerary --> ExportPDF[Export Formatted PDF Itinerary]
    Itinerary --> SharePublic[Generate Shareable Public Link]
    Itinerary --> TrackExpenses[Log Manual Expenses in Budget Tracker]
```

---

## 🧠 Smart Itinerary Recommendation Engine

```mermaid
flowchart LR
    UserPreferences["User Travel Profile\n(Style, Pace, Budget, Companions)"] --> Engine["Smart Recommendation\nAlgorithm"]
    DestinationDB["Curated Destination\nDatabase (20+ Regions)"] --> Engine
    ActivityDB["Activity Library\n(Sightseeing, Food, Adventure)"] --> Engine

    Engine --> StopsOutput["Optimized Sequential\nDestination Stops"]
    Engine --> BudgetMatrix["Budget Allocation Matrix:\n• Stays (40%)\n• Transport (35%)\n• Meals (15%)\n• Activities (10%)"]
    Engine --> ActivitySchedule["Curated Daily\nActivity Roster"]
```

---

## ⚡ Real-Time WebSocket Synchronization Flow

```mermaid
sequenceDiagram
    autonumber
    actor UserA as Traveler A (Desktop)
    participant ClientA as React Frontend (A)
    participant Server as Express + Socket.IO Server
    participant DB as PostgreSQL (Prisma)
    participant ClientB as Traveler B (Mobile)
    actor UserB as Traveler B (Mobile)

    UserA->>ClientA: Adds "Scuba Diving" to Stop (₹3,500)
    ClientA->>Server: POST /api/core/trips/:id/stops/:stopId/activities
    Server->>DB: INSERT into StopActivity & recalculate
    DB-->>Server: StopActivity Record Created
    Server-->>ClientA: 201 Created (Updated Stop Data)
    Server->>Server: Broadcasts 'activity_added' to room tripId
    Server-->>ClientB: Socket event 'activity_added'
    ClientB->>Server: GET /api/core/trips/:id (Instant Auto-Sync)
    Server-->>ClientB: Returns Updated Trip Structure
    ClientB->>UserB: Re-renders itinerary & deducts ₹3,500 from budget
```

---

## 🗄️ Database ER Diagram & Schema

```mermaid
erDiagram
    User ||--o{ Trip : creates
    User ||--o| TravelPreference : has
    User ||--o{ Expense : logs
    Trip ||--o{ TripStop : contains
    Trip ||--o{ Expense : tracks
    City ||--o{ TripStop : locates
    City ||--o{ Activity : offers
    TripStop ||--o{ StopActivity : schedules
    Activity ||--o{ StopActivity : instances

    User {
        string id PK
        string email UK
        string name
        string passwordHash
        string googleId
        string photoUrl
        string otpCode
        datetime otpExpiresAt
        datetime createdAt
    }

    TravelPreference {
        string id PK
        string userId FK
        string travelStyle
        string travelPace
        string budget
        string companions
        string[] interests
        string[] priorities
    }

    Trip {
        string id PK
        string userId FK
        string name
        string description
        datetime startDate
        datetime endDate
        float budget
        string coverPhotoUrl
        string shareSlug UK
        boolean isPublic
        datetime createdAt
    }

    TripStop {
        string id PK
        string tripId FK
        string cityId FK
        datetime arrivalDate
        datetime departureDate
        int sortOrder
    }

    City {
        string id PK
        string name
        string country
        string region
        float costIndex
        float popularityScore
        string imageUrl
    }

    Activity {
        string id PK
        string cityId FK
        string name
        string category
        float cost
        int durationMinutes
        string description
    }

    StopActivity {
        string id PK
        string tripStopId FK
        string activityId FK
        datetime scheduledTime
        float customCost
    }

    Expense {
        string id PK
        string tripId FK
        string userId FK
        string title
        float amount
        string category
        datetime date
    }
```

---

## 🚀 Core Feature Breakdown

| Feature Module | Capabilities |
|---|---|
| 🔐 **Authentication & Security** | Email/password login with bcrypt hashing, Google Sign-In, 6-digit OTP verification email dispatch with expiration timer |
| 🤖 **Smart Itinerary Planner** | AI-inspired multi-step wizard matching user personas to domestic & international travel routes with pre-configured budget splits |
| 📋 **Itinerary Builder** | Timeline, Calendar, and Route Map view modes; collapsible stop cards; 1-click curated experiences; custom activity authoring |
| 💰 **Dynamic Budget Deductor** | Real-time budget deduction progress bar changing colors (Emerald → Amber → Rose) based on utilization percentage |
| 🗺️ **GPS Route Mapping** | Interactive Leaflet map with exact latitude/longitude coordinates, polyline pathways, numbered pulse pins, and activity popups |
| 📄 **PDF Itinerary Export** | Professional formatted PDF download powered by `jsPDF` & `jspdf-autotable` with trip summaries, tables, and cost ledgers |
| 🌐 **Destination Discovery** | 20+ domestic and international destinations with real-time daily cost benchmarks, average trip costs, and filters |
| 📊 **Budget & Expense Tracker** | Comprehensive financial tracker merging planned stop activities with manual on-trip expenses in a unified ledger |
| ⚙️ **Personalization & Settings** | Sticky mini-sidebar navigation, DiceBear avatar selector, travel persona preferences (Backpacker, Luxury, Heritage, Adventure) |

---

## 📡 REST API Reference

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/auth/register` | Register new user with email, name, and password | No |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT bearer token | No |
| `POST` | `/api/auth/google` | Verify Google ID token and login/register | No |
| `POST` | `/api/auth/forgot-password` | Send 6-digit OTP code to user's email | No |
| `POST` | `/api/auth/verify-otp` | Validate 6-digit OTP code | No |
| `POST` | `/api/auth/reset-password` | Reset account password with verified OTP | No |
| `GET` | `/api/auth/me` | Fetch active user profile and preferences | Yes |
| `PUT` | `/api/auth/profile` | Update profile details and travel preferences | Yes |

### Core Trip & Itinerary Endpoints (`/api/core`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/core/trips` | Get all trips created by authenticated user | Yes |
| `POST` | `/api/core/trips` | Create a new trip itinerary | Yes |
| `GET` | `/api/core/trips/:id` | Get detailed trip by ID (including stops & activities) | Yes |
| `PUT` | `/api/core/trips/:id` | Update trip details or budget allocation | Yes |
| `DELETE` | `/api/core/trips/:id` | Permanently delete trip and all nested stops | Yes |
| `POST` | `/api/core/trips/:id/stops` | Add a destination stop to a trip itinerary | Yes |
| `DELETE` | `/api/core/trips/:id/stops/:stopId` | Remove destination stop and its scheduled activities | Yes |
| `POST` | `/api/core/trips/:id/stops/:stopId/activities` | Assign curated or custom activity to a stop | Yes |
| `DELETE` | `/api/core/trips/:id/stops/:stopId/activities/:actId` | Remove activity and restore cost to trip budget | Yes |
| `GET` | `/api/core/cities` | Search & filter destination cities with cost indices | Yes |
| `GET` | `/api/core/public/trips/:shareSlug` | View public shared read-only itinerary | No |

---

## 🛠️ Getting Started & Local Setup

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **Docker & Docker Compose** (for PostgreSQL database)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/GlobeTrotter.git
cd GlobeTrotter
```

### 2. Start PostgreSQL Database via Docker
```bash
cd backend
docker compose up -d
```

### 3. Backend Setup
```bash
cd backend
npm install
npx prisma db push
node prisma/seed.js
npm run dev
```
*Backend server will start at `http://localhost:5001`.*

### 4. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend application will start at `http://localhost:5173`.*

---

## 🔑 Environment Variables

### Backend Configuration (`backend/.env`)
```env
PORT=5001
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/globetrotter?schema=public"
JWT_SECRET="your_secure_jwt_random_secret_key"
FRONTEND_URL="http://localhost:5173"

# Email Delivery (Brevo / Nodemailer)
EMAIL_HOST="smtp-relay.brevo.com"
EMAIL_PORT=587
EMAIL_USER="your_smtp_user@mail.com"
EMAIL_PASS="your_smtp_password"
EMAIL_FROM="GlobeTrotter <noreply@globetrotter.app>"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_oauth_client_id.apps.googleusercontent.com"
```

### Frontend Configuration (`frontend/.env`)
```env
VITE_API_URL="http://localhost:5001/api"
VITE_SOCKET_URL="http://localhost:5001"
VITE_GOOGLE_CLIENT_ID="your_google_oauth_client_id.apps.googleusercontent.com"
```

---

## 📁 Project Structure

```
GlobeTrotter/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database models (Trip, Stop, Activity, User)
│   │   └── seed.js                # Initial database seed data (cities, activities)
│   ├── src/
│   │   ├── controllers/           # Auth, Trip, City, Budget route handlers
│   │   ├── middleware/            # JWT auth & error handling middleware
│   │   ├── routes/                # Express API router configuration
│   │   ├── utils/                 # Prisma client, Nodemailer, Socket.IO instance
│   │   └── server.js              # Express app entry point
│   ├── docker-compose.yml         # PostgreSQL 15 container definition
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/            # Reusable UI components (TripRouteMap, Modals)
│   │   ├── context/               # Auth & Socket.IO React Context providers
│   │   ├── pages/
│   │   │   ├── Auth/              # Login, Register, Forgot Password, Reset Password
│   │   │   ├── DashboardHome.jsx  # Main travel command center
│   │   │   ├── Trips/             # My Trips Grid, ItineraryBuilder
│   │   │   ├── Discover/          # Destination search & pricing benchmarks
│   │   │   ├── Budget/            # Expense breakdown & transaction ledger
│   │   │   └── Settings/          # User profile & travel persona preferences
│   │   ├── App.jsx                # Application routes & layout wrapper
│   │   ├── main.jsx               # React 19 root bootstrap
│   │   └── index.css              # Tailwind CSS v4 & Leaflet style imports
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── photos/                        # Full UI walkthrough screenshot assets
└── README.md                      # Primary project documentation
```

---

<p align="center">
  Built with ❤️ for travelers worldwide by the <strong>GlobeTrotter Team</strong>.
</p>
