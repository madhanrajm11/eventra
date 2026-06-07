# Eventra — Event Management Platform

> A full-stack event management system with JWT authentication, role-based access control, QR-based attendance tracking, and an admin approval workflow.

**Backend:** Spring Boot 3.5 · Java 21 · Spring Security + JWT · Spring Data JPA · MySQL · Maven  
**Frontend:** React 19 · React Router v7 · Tailwind CSS v3 · Axios · Vite 8

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Event Lifecycle](#event-lifecycle)
- [QR Attendance Flow](#qr-attendance-flow)
- [Role-Based Access](#role-based-access)
- [Deployment](#deployment)
- [Research Publication](#research-publication)

---

## Features

- **Authentication** — JWT-based login/register with OTP password reset via Gmail SMTP
- **Event Management** — Create, edit, delete events with image upload (Cloudinary)
- **Admin Approval Workflow** — All events start as `PENDING` and require admin approval
- **QR-Based Attendance** — Each registration generates a unique QR code; organizers scan to mark attendance
- **Registrant Export** — Export attendee lists as CSV or Excel (Apache POI)
- **Rate Limiting** — Bucket4j protects sensitive endpoints (login, register, OTP) from brute-force
- **Role-Based Access Control** — Three roles: `USER`, `ORGANIZER` (event creator), `ADMIN`
- **Responsive SPA** — React frontend with protected routes per role

---

## Architecture

```
┌─────────────────────┐        REST API (JWT)        ┌──────────────────────────┐
│   React Frontend    │ ◄──────────────────────────► │  Spring Boot Backend     │
│   (Vite + Tailwind) │                              │  (Java 21, Port 8080)    │
└─────────────────────┘                              └────────────┬─────────────┘
         │                                                        │
    Vercel / Railway                                         MySQL DB
                                                        (Local / Neon Cloud)
```

---

## Tech Stack

### Backend

| Layer | Technology |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3.5 |
| Security | Spring Security + JWT (JJWT 0.12.6) |
| ORM | Spring Data JPA / Hibernate |
| Database | MySQL (production) |
| Rate Limiting | Bucket4j 8.10.1 |
| Excel Export | Apache POI 5.3.0 |
| QR Generation | ZXing 3.5.3 |
| Email | Spring Mail (Gmail SMTP) |
| Build Tool | Maven |

### Frontend

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Routing | React Router v7 |
| Styling | Tailwind CSS v3 |
| HTTP Client | Axios |
| QR Scanning | html5-qrcode |
| Bundler | Vite 8 |

---

## Getting Started

### Prerequisites

- Java 21+
- Maven 3.9+
- MySQL 8+ (or PostgreSQL 15+ for production)
- Node.js 18+ and npm
- Gmail account with an [App Password](https://myaccount.google.com/apppasswords) for email

---

### Backend Setup

**1. Clone the repository**

```bash
git clone https://github.com/your-username/eventra-backend.git
cd eventra-backend
```

**2. Create the database**

```sql
CREATE DATABASE eventra;
```

**3. Configure environment variables**

See the [Environment Variables](#environment-variables) section below.

**4. Run the application**

```bash
./mvnw spring-boot:run
```

API starts at `http://localhost:8080`.

---

### Frontend Setup

**1. Clone the repository**

```bash
git clone https://github.com/your-username/eventra-frontend.git
cd eventra-frontend
```

**2. Install dependencies**

```bash
npm install
```

**3. Create `.env` file**

```env
VITE_API_BASE_URL=http://localhost:8080
```

**4. Run the dev server**

```bash
npm run dev
```

App starts at `http://localhost:5173`.

---

## Environment Variables

### Backend (`application.properties` / Railway Variables)

| Variable | Description | Example |
|---|---|---|
| `DB_URL` | JDBC connection string | `jdbc:mysql://localhost:3306/eventra` |
| `DB_USERNAME` | Database username | `root` |
| `DB_PASSWORD` | Database password | `yourpassword` |
| `JWT_SECRET` | Min 256-bit random string | `your-very-long-secret-key` |
| `ADMIN_KEY` | Secret key for admin registration | `some-secret-admin-key` |
| `CORS_ALLOWED_ORIGINS` | Frontend origin allowed by CORS | `http://localhost:5173` |
| `MAIL_USERNAME` | Gmail address for OTP emails | `yourapp@gmail.com` |
| `MAIL_PASSWORD` | Gmail App Password | `xxxx xxxx xxxx xxxx` |

> JWT expiration defaults to `86400000` ms (24 hours) and can be overridden in `application.properties`.

### Frontend (`.env`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend base URL (local or deployed) |

---

## Project Structure

### Backend

```
src/main/java/com/jm/eventra/
├── config/           # CORS and Spring Security configuration
├── controller/       # REST controllers (one per domain)
├── dto/
│   ├── request/      # Incoming request bodies
│   └── response/     # Outgoing response shapes
├── entity/           # JPA entities and enums
├── exception/        # GlobalExceptionHandler + BusinessException
├── mapper/           # Entity ↔ DTO conversion
├── repository/       # Spring Data JPA repositories
├── security/         # JwtService, JwtAuthFilter, UserDetailsService, RateLimitFilter
└── service/          # Business logic layer
```

### Frontend

```
src/
├── api/
│   ├── axios.js          # Axios instance with base URL + JWT interceptor
│   └── cloudinary.js     # Cloudinary image upload helper
├── components/
│   └── Navbar.jsx        # Top navigation bar
├── context/
│   └── AuthContext.jsx   # Global auth state (user, token, login/logout)
├── pages/
│   ├── Home.jsx               # Public event listing
│   ├── EventDetails.jsx       # Single event view + register action
│   ├── CreateEvent.jsx        # Create a new event form
│   ├── EditEvent.jsx          # Edit an existing event
│   ├── MyEvents.jsx           # Events created by the logged-in user
│   ├── MyRegistrations.jsx    # Events the user has registered for
│   ├── MyParticipation.jsx    # Attendance history
│   ├── EventRegistrants.jsx   # Registrant list + CSV/Excel export (organizer)
│   ├── ScanQR.jsx             # QR scanner for marking attendance (organizer)
│   ├── AdminDashboard.jsx     # Admin overview and stats
│   ├── PendingEvents.jsx      # Events awaiting approval (admin)
│   ├── Profile.jsx            # View own profile
│   ├── EditProfile.jsx        # Edit profile details
│   ├── ChangePassword.jsx     # Change password
│   ├── ForgotPassword.jsx     # Request OTP for password reset
│   ├── ResetPassword.jsx      # Submit OTP + new password
│   ├── Login.jsx
│   └── Register.jsx
└── App.jsx                    # Route definitions + ProtectedRoute wrapper
```

---

## API Reference

All protected routes require:
```
Authorization: Bearer <jwt-token>
```

### Auth — `/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login, returns JWT |
| POST | `/auth/register/admin` | Public + Admin Key | Register an admin account |
| POST | `/auth/forgot-password/otp` | Public | Request OTP email for password reset |
| POST | `/auth/forgot-password/reset` | Public | Reset password using OTP |

### Events — `/events`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/events` | Public | List all approved events |
| GET | `/events/{id}` | Public | Get a single event |
| GET | `/events/my` | User | List events created by the logged-in user |
| POST | `/events` | User | Create a new event (starts as PENDING) |
| PUT | `/events/{id}` | Organizer | Update event details |
| DELETE | `/events/{id}` | Organizer | Delete an event |

### Registrations — `/registration`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/registration/events/{eventId}` | User | Register for an event |
| GET | `/registration/my` | User | List my registrations (includes QR code) |
| DELETE | `/registration/{registrationId}` | User | Cancel a registration |

### Attendance — `/attendance`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/attendance/sessions/events/{eventId}` | Organizer | Open an attendance session |
| GET | `/attendance/sessions/events/{eventId}` | Organizer | List sessions for an event |
| POST | `/attendance/mark` | User | Mark attendance via QR scan |
| GET | `/attendance/events/{eventId}` | Organizer | View attendance records for an event |
| GET | `/attendance/my` | User | View own attendance history |

### Registrant Management — `/events/{eventId}/registrants`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/events/{eventId}/registrants` | Organizer | List all registrants for an event |
| GET | `/events/{eventId}/registrants/export/csv` | Organizer | Export registrants as CSV |
| GET | `/events/{eventId}/registrants/export/xlsx` | Organizer | Export registrants as Excel |

### User Profile — `/users`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/users/me` | User | Get own profile |
| PUT | `/users/me` | User | Update profile |
| PUT | `/users/me/password` | User | Change password |

### Admin — `/admin/events`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/admin/events/pending` | Admin | List events awaiting approval |
| PUT | `/admin/events/{id}/approve` | Admin | Approve an event |
| PUT | `/admin/events/{id}/reject` | Admin | Reject an event (with reason) |

### Other

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/dashboard` | User | Summary stats for logged-in user |
| GET | `/health` | Public | Health check |

---

## Event Lifecycle

```
[User creates event]
        ↓
    PENDING  ──(admin approves)──→  APPROVED  → Visible on public listing
             ──(admin rejects)──→  REJECTED   → Hidden from public listing
```

Only `APPROVED` events appear on the public home page.

---

## QR Attendance Flow

```
[User registers for event]
        ↓
Unique QR code generated (ZXing)
        ↓
  qrCode   → Base64 PNG image (displayed in frontend)
  qrContent → Raw string payload (scanned by organizer)
        ↓
[Organizer opens attendance session]
        ↓
[User scans QR → POST /attendance/mark with qrContent]
        ↓
Attendance recorded against the open session
```

> **Local mobile testing:** The camera API requires HTTPS. Use [ngrok](https://ngrok.com/) or generate local certs with [mkcert](https://github.com/FiloSottile/mkcert) and place them in `certs/` — Vite picks them up automatically.

---

## Role-Based Access

| Role | Who | Permissions |
|---|---|---|
| `PUBLIC` | Unauthenticated | Browse approved events |
| `USER` | Registered user | Register for events, create events, view own QR / attendance |
| `ORGANIZER` | Event creator | Edit/delete own events, open attendance sessions, scan QR, export registrants |
| `ADMIN` | Admin account | Approve / reject pending events, view admin dashboard |

Routes in the frontend are protected by `ProtectedRoute` in `App.jsx`. Unauthenticated users are redirected to `/login`.

---

## Frontend Routes

| Path | Access | Page |
|---|---|---|
| `/` | Public | Event listing |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/events/:id` | Public | Event details |
| `/forgot-password` | Public | Request OTP |
| `/reset-password` | Public | Reset password with OTP |
| `/my-registrations` | User | Registered events + QR codes |
| `/my-attendance` | User | Attendance history |
| `/my-events` | User | Events I created |
| `/create-event` | User | Create a new event |
| `/events/:id/edit` | Organizer | Edit an event |
| `/events/:id/registrants` | Organizer | View and export registrants |
| `/scan-qr` | Organizer | QR scanner for attendance |
| `/profile` | User | View profile |
| `/profile/edit` | User | Edit profile |
| `/profile/change-password` | User | Change password |
| `/admin-dashboard` | Admin | Admin stats overview |
| `/pending-events` | Admin | Approve or reject pending events |

---

## Deployment

### Backend → Railway

1. Push to GitHub.
2. Create a Railway project and connect the repository.
3. Set all environment variables in Railway's **Variables** tab.
4. Railway builds and deploys automatically on every push to `main`.

### Database → Neon (PostgreSQL Cloud)

1. Create a free project at [neon.tech](https://neon.tech).
2. Copy the connection string from the Neon dashboard.
3. Convert to JDBC format for Spring Boot:
   ```
   jdbc:postgresql://ep-xxx.region.aws.neon.tech/eventra?sslmode=require
   ```
4. Set this as `DB_URL` in Railway variables.

### Frontend → Vercel

1. Push to GitHub.
2. Import the repo in Vercel.
3. Set `VITE_API_BASE_URL` to your deployed backend URL.
4. Deploy — Vercel handles the build automatically via `vercel.json`.

> You can also deploy the frontend to **Netlify** or **Cloudflare Pages** by running `npm run build` and serving the `dist/` folder.

---

## Available Scripts

### Backend

| Command | Description |
|---|---|
| `./mvnw spring-boot:run` | Start the development server |
| `./mvnw test` | Run tests |
| `./mvnw package` | Build JAR for production |

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Research Publication

This project was published as a research paper in the **Journal of Emerging Technologies and Innovative Research (JETNR)**:

> **"Eventra: A Full-Stack Event Management System with JWT Authentication and QR-Based Attendance"**  
> Madhan Raj M — VELS Institute of Science, Technology & Advanced Studies (VISTAS), Chennai

---

## Author

**Madhan Raj M**  
Final Year BCA — VELS Institute of Science, Technology & Advanced Studies (VISTAS), Chennai  
