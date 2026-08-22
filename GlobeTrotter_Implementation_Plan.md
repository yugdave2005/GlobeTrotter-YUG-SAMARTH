# GlobeTrotter — Hackathon Implementation Plan
### Team size: 2 | Window: 8 hours | Target: containerized, microservice-oriented, Docker + Git

---

## 0. Architecture Philosophy (read this first — 8hr version)

8 hours for 2 people is coding time of roughly **6 hrs after setup/demo prep**, i.e. ~3 productive hours per person. At this budget, a 3-service split is already a stretch, not a given. Below is the real plan:

- **Default plan (recommended):** 2 services — `auth-service` and `core-service` (trips + stops + activities + a small hardcoded/seeded city-activity catalog live in the SAME service, just different route files/DB tables). Two containers is still genuinely "microservices" for judging purposes — separate deploys, separate concerns, separate Dockerfiles — and it's the difference between finishing and not finishing.
- **If you're both fast / one of you has done this before:** 3 services as in the original plan (auth, trip, catalog) — only attempt this if scaffolding is done by hour 1.
- **Do not attempt RabbitMQ, Redis, or a gateway/Nginx layer in 8 hours.** Cut from Section 10 entirely — those are 36hr+ ideas. Skip straight to CORS on Express instead of a gateway.

Pick 2-service or 3-service **before you start**, don't decide mid-hackathon.

---

## 1. Team Split (2 people)

**Person A — Backend (auth-service + core-service), DB, Docker**
- Both services' Express skeletons, Prisma models, migrations, seed data
- docker-compose.yml
- Owns ALL backend files — Person B never touches backend code, to avoid merge conflicts under time pressure

**Person B — Frontend (React), all screens, all API integration**
- Owns ALL frontend files
- Builds against the API contract (Section 5) using mock/hardcoded data for the first ~90 min if backend isn't ready yet, then swaps in real calls

**Non-negotiable first 20 minutes (do this together, out loud, before splitting up):**
1. Finalize the trimmed screen list (Section 6) and DB schema (Section 4) — no changes after this.
2. Finalize API contract (Section 5) exactly — endpoint names, request/response shapes, written down somewhere both can see.
3. `git init`, push empty scaffolds for both services + client, confirm both can pull/push before diving in.

Do not skip this step to "save time" — it's the single biggest cause of two people redoing each other's work at hour 6.

---

## 2. Services & Containers (8hr default: 2 services)

| # | Service | Responsibility | Port | Owner |
|---|---------|----------------|------|-------|
| 1 | `auth-service` (Express + JWT) | Signup, login, profile | 4001 | A |
| 2 | `core-service` (Express) | Trips, stops, activities, hardcoded/seeded city+activity list, budget calc, public share | 4002 | A |
| 3 | `client` (React + Vite) | All UI screens, calls both services directly (`VITE_AUTH_URL`, `VITE_CORE_URL`), plain CORS instead of a gateway | 5173 | B |
| 4 | `postgres` | One instance, **2 schemas**: `auth`, `core` | 5432 | A |

No Nginx gateway, no Redis, no RabbitMQ. Note the intentional 2-service split in your README/pitch as a deliberate scope decision for an 8hr window — judges respect a stated tradeoff far more than an unfinished 3rd service.

**Stretch (only if core-service + client are both done and demo-able by hour 5):** split `core-service` into `trip-service` + `catalog-service` as originally planned (Section 9 old version) — but treat this as optional polish, not the goal.

---

## 3. Tech Stack

- **Frontend:** React + Vite, Tailwind CSS, Recharts (budget charts), React Router, Axios
- **Backend:** Node.js + Express (3 services, same skeleton copy-pasted and adapted)
- **DB/ORM:** PostgreSQL 16 (Alpine), Prisma (one schema file per service, `multiSchema` Prisma feature or separate Prisma clients)
- **Auth:** JWT (access + refresh), bcrypt for password hashing
- **Gateway:** Nginx reverse proxy (also solves CORS — one origin for the browser)
- **Containerization:** Docker Compose (single `docker-compose.yml` at root)
- **Version control:** Git — trunk-based with short-lived feature branches (Section 8)

---

## 4. Database Schema (core tables — 2-schema plan)

**auth schema**
```
users(id, email, password_hash, name, created_at)
```
Drop avatar_url — not worth building upload handling in 8hrs, use a static placeholder in the UI.

**core schema**
```
cities(id, name, country, cost_index, image_url)              -- seed ~15-20 rows by hand, no admin CRUD needed
activities(id, city_id, name, category, cost, duration_minutes, description)  -- seed ~40-60 rows by hand
trips(id, user_id, name, start_date, end_date, description, is_public, share_slug, created_at)
trip_stops(id, trip_id, city_id, arrival_date, departure_date, sort_order)
stop_activities(id, trip_stop_id, activity_id, scheduled_time, custom_cost)
```

Write the seed data (cities + activities) as a plain SQL/JSON file **first**, before any backend code — Person B can build the search/filter UI against it immediately without waiting on live endpoints.

**Budget calc** = sum(nights per stop × city.cost_index stay estimate) + sum(activity costs). Skip the transport-between-cities estimate and the "alerts for overbudget days" feature — nice-to-have, not core.

---

## 5. API Contracts (lock these in the first 20 minutes, no changes after)

**auth-service**
```
POST   /api/auth/signup      { email, password, name } -> { user, token }
POST   /api/auth/login       { email, password }        -> { user, token }
GET    /api/auth/me          (Bearer token)              -> { user }
```
Skip refresh tokens — one long-lived JWT (e.g. 7 days) is fine for a demo.

**core-service** (Bearer JWT required except public route)
```
GET    /api/cities?search=
GET    /api/cities/:id/activities

POST   /api/trips
GET    /api/trips
GET    /api/trips/:id
PATCH  /api/trips/:id
DELETE /api/trips/:id

POST   /api/trips/:id/stops
DELETE /api/trips/:id/stops/:stopId
POST   /api/trips/:id/stops/:stopId/activities
DELETE /api/trips/:id/stops/:stopId/activities/:activityId

GET    /api/trips/:id/budget
GET    /api/public/:shareSlug     (no auth)
```
No PATCH on stops (just delete + re-add if reordering) — reordering logic is a time sink, skip it unless everything else is done early.

---

## 6. Screen List — Cut from 13 to 8 for 8 Hours

Build these 8, in this order, and treat everything after as stretch:

| Priority | Screen | Notes |
|---|---|---|
| 1 | Login/Signup | Single combined form, no "forgot password" |
| 2 | My Trips | Doubles as the dashboard — skip a separate Dashboard screen |
| 3 | Create Trip | Name, dates, description only — no cover photo upload |
| 4 | Itinerary Builder | Add city (from search) as a stop, add activities to a stop — this is the core feature, budget most time here |
| 5 | City/Activity Search | One combined search screen, or fold directly into the Itinerary Builder as a side panel (faster) |
| 6 | Itinerary View | Simple grouped-by-city list, not a calendar |
| 7 | Budget Breakdown | Total + per-category numbers and ONE chart (pie), skip alerts |
| 8 | Shared/Public View | Read-only page at `/trip/:shareSlug`, no "Copy Trip" button |

**Cut entirely for 8hrs:** separate Dashboard, Trip Calendar/Timeline view, Profile/Settings screen (hardcode the logged-in user's name in a header instead), Admin/Analytics dashboard, drag-to-reorder, social sharing buttons.

If you finish all 8 with time left: add Profile/Settings first (cheapest), then Calendar/Timeline view, then Admin dashboard — in that order.

---

## 7. docker-compose.yml (2-service, no gateway — generate this in the first 15 min)

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment: [POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD]
    ports: ["5432:5432"]
    volumes: [pgdata:/var/lib/postgresql/data, ./db/init.sql:/docker-entrypoint-initdb.d/init.sql]
    healthcheck: pg_isready

  auth-service:
    build: ./services/auth-service
    env_file: .env
    ports: ["4001:4001"]
    depends_on: [postgres]

  core-service:
    build: ./services/core-service
    env_file: .env
    ports: ["4002:4002"]
    depends_on: [postgres]

  client:
    build: ./client
    ports: ["5173:5173"]
    environment:
      - VITE_AUTH_URL=http://localhost:4001
      - VITE_CORE_URL=http://localhost:4002
    depends_on: [auth-service, core-service]

volumes:
  pgdata:
```

`init.sql` creates the `auth` and `core` schemas before Prisma migrations run. Get `docker compose up` booting all 4 containers (even with stub `/health` routes returning 200) as the literal first thing you do — before any real business logic — so integration is never a last-minute surprise.

---

## 8. Git Workflow (2 people, 8hrs — keep this simple)

- Just `main`. No `dev` branch, no PR review ceremony — you don't have time for it, and with strict file ownership (A = backend, B = frontend) you're not going to conflict.
- Commit every ~30 min, push every commit. Pull before you start each new chunk of work.
- Tag/commit-message a clear `MVP DEMO READY` point the moment login → create trip → add stop/activity → view budget → public share all work end-to-end. Everything after that is stretch — don't let stretch-feature work risk breaking a working demo in the final hour. If you're touching risky code after MVP is reached, commit working state first.

---

## 9. Hackathon Timeline (8 hours, hard deadline mindset)

| Time | Milestone |
|---|---|
| 0:00–0:20 | Together: lock schema (Sec 4), API contract (Sec 5), screen list (Sec 6). Write seed data JSON/SQL. Push empty repo. |
| 0:20–0:40 | A: docker-compose + Prisma schema + `init.sql`, get `docker compose up` running all 4 containers with stub health routes. B: `npx create-vite` client, router set up, page shells for all 8 screens (empty divs, just routing working) |
| 0:40–2:00 | A: auth-service fully working (signup/login/me + JWT middleware). B: Login/Signup UI wired to it as soon as it's up; meanwhile build My Trips + Create Trip UI against mock data |
| 2:00–4:00 | A: core-service — cities/activities read endpoints (seeded data) + trip CRUD + stops. B: swap mock data for real calls on My Trips/Create Trip; build Itinerary Builder UI |
| 4:00–5:30 | A: stop-activities endpoints + budget calc endpoint. B: finish Itinerary Builder + City/Activity search panel, wire to core-service |
| 5:30–6:30 | A: public share endpoint. B: Itinerary View + Budget Breakdown screen (chart) + Public share page. **This is your "MVP DEMO READY" checkpoint — hit it here or start cutting scope.** |
| 6:30–7:15 | Both: integration pass — click through the entire flow together in the actual Docker Compose stack (not dev servers), fix breakage. This step is not optional; things that work in isolation often don't work integrated. |
| 7:15–7:45 | Seed data polish (better city/activity names/images so the demo looks real), UI polish pass, README with architecture diagram + your deliberate scope-cut notes |
| 7:45–8:00 | Demo script/dry run — decide who drives, what order screens are shown, have a fallback if live demo breaks (screen recording) |

**If you're behind at the 4hr mark**, cut in this order: Budget chart (show numbers only, no chart) → City/Activity search UI polish (basic dropdown, not filters) → Public share view (nice-to-have if genuinely tight) → Itinerary View becomes just a re-use of the Itinerary Builder in read-only mode.

**Never cut:** auth, Create Trip → Itinerary Builder flow, Docker Compose actually working. That end-to-end flow plus visibly running containers is the whole demo.

---

## 10. Stretch: Only If MVP Is Done by Hour 6

In order of value-per-minute for an 8hr demo — do NOT attempt more than one or two of these:
1. Split `core-service` into `trip-service` + `catalog-service` (genuinely strengthens the "microservices" story for judges — this is the single best use of spare time)
2. Profile/Settings screen (cheap, ~20 min)
3. Trip Calendar/Timeline view (nicer visual than the plain list)
4. Basic drag-to-reorder stops

**Do not attempt in 8hrs, regardless of spare time:** RabbitMQ/event-driven anything, separate DB instances per service, an Nginx gateway, Redis caching, a CI pipeline, an Admin/Analytics dashboard. These are all real 36hr+ ideas that add setup risk right before a demo with no upside if something breaks.

---

## 11. What to Tell the Agentic IDE

When you hand this to the IDE, give it this file plus:
1. "Scaffold the folder structure and docker-compose.yml from Section 7 first, get all containers to boot with health-check stubs before writing business logic."
2. "Generate Prisma schema files per service from Section 4."
3. "Implement auth-service fully before trip-service, since trip-service depends on JWT middleware."
4. Point it at the original GlobeTrotter PDF brief for exact screen copy/UX details this plan intentionally left out (field labels, validation text, etc.).
