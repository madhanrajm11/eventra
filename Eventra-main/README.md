# Eventra — Backend

> REST API for the Eventra event management platform. Built with Spring Boot, it handles authentication, event lifecycle, attendee registration, QR-based attendance tracking, organizer tools, and an admin approval workflow.

**Stack:** Spring Boot 3.5 · Java 21 · Spring Security + JWT · Spring Data JPA · MySQL · Maven

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Event Lifecycle](#event-lifecycle)
- [QR Attendance Flow](#qr-attendance-flow)
- [Rate Limiting](#rate-limiting)
- [Deployment](#deployment)
- [Research Publication](#research-publication)

---

## Features

- JWT-based authentication with OTP password reset via Gmail SMTP
- Event creation with admin approval workflow (`PENDING` → `APPROVED` / `REJECTED`)
- QR code generation per registration (ZXing) for attendance marking
- Organizer tools: open attendance sessions, view records, export registrants as CSV / Excel
- Rate limiting on sensitive endpoints (login, register, OTP) via Bucket4j
- Role-based access control: `USER`, `ORGANIZER`, `ADMIN`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3.5 |
| Security | Spring Security + JWT (JJWT 0.12.6) |
| ORM | Spring Data JPA / Hibernate |
| Database | MySQL (local) / PostgreSQL on Neon (production) |
| Rate Limiting | Bucket4j 8.10.1 |
| Excel Export | Apache POI 5.3.0 |
| QR Generation | ZXing 3.5.3 |
| Email | Spring Mail (Gmail SMTP) |
| Build Tool | Maven |

---

## Prerequisites

- Java 21+
- Maven 3.9+
- MySQL 8+ (local) or PostgreSQL 15+ (production via Neon)
- Gmail account with an [App Password](https://myaccount.google.com/apppasswords) for OTP emails

---

## Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/your-username/eventra-backend.git
cd eventra-backend
```

**2. Create the database**

```sql
CREATE DATABASE eventra;
```

**3. Set environment variables**

See the [Environment Variables](#environment-variables) section below.

**4. Run**

```bash
./mvnw spring-boot:run
```

API starts at `http://localhost:8080`.

---

## Environment Variables

Set these in your shell, a `.env` file, or your deployment platform's variables panel:

| Variable | Description | Example |
|---|---|---|
| `DB_URL` | JDBC connection string | `jdbc:mysql://localhost:3306/eventra` |
| `DB_USERNAME` | Database username | `root` |
| `DB_PASSWORD` | Database password | `yourpassword` |
| `JWT_SECRET` | Min 256-bit random string | `your-very-long-secret-key` |
| `ADMIN_KEY` | Secret key required to register an admin account | `some-secret-admin-key` |
| `CORS_ALLOWED_ORIGINS` | Frontend origin(s) allowed by CORS | `http://localhost:5173` |
| `MAIL_USERNAME` | Gmail address for sending OTP emails | `yourapp@gmail.com` |
| `MAIL_PASSWORD` | Gmail App Password (not your login password) | `xxxx xxxx xxxx xxxx` |

> JWT expiration defaults to `86400000` ms (24 hours) and can be overridden in `application.properties`.

---

## Project Structure

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

### Registrant Management

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
| GET | `/dashboard` | User | Summary stats for the logged-in user |
| GET | `/health` | Public | Health check |

---

## Event Lifecycle

```
[User creates event]
        ↓
    PENDING  ──(admin approves)──→  APPROVED  →  Visible on public listing
             ──(admin rejects)──→  REJECTED   →  Hidden from public listing
```

Only `APPROVED` events appear on the public listing.

---

## QR Attendance Flow

```
[User registers for event]
        ↓
Unique QR code generated (ZXing)
        ↓
  qrCode    → Base64 PNG image  (rendered in frontend)
  qrContent → Raw string payload (scanned by organizer)
        ↓
[Organizer opens an attendance session]
        ↓
[User's QR scanned → POST /attendance/mark with qrContent]
        ↓
Attendance recorded against the open session
```

> For local mobile testing (QR scanning from a phone), use [ngrok](https://ngrok.com/) to expose `localhost:8080` over HTTPS — the camera API requires a secure context.

---

## Rate Limiting

`SensitiveEndPointsRateLimitFilter` uses Bucket4j to protect login, registration, and OTP endpoints from brute-force attempts.

---

## Available Scripts

| Command | Description |
|---|---|
| `./mvnw spring-boot:run` | Start the development server |
| `./mvnw test` | Run tests |
| `./mvnw package` | Build production JAR |

> Unit and integration tests are not yet implemented. The project currently contains only the default Spring Boot context load test.

---

## Deployment

### Database → Neon (PostgreSQL Cloud)

1. Create a free project at [neon.tech](https://neon.tech).
2. Copy the connection string from the Neon dashboard.
3. Convert to JDBC format:
   ```
   jdbc:postgresql://ep-xxx.region.aws.neon.tech/eventra?sslmode=require
   ```
4. Use this as your `DB_URL` environment variable.

### Backend → Railway

1. Push to GitHub.
2. Create a Railway project and connect the repository.
3. Set all environment variables in Railway's **Variables** tab (use the Neon JDBC URL for `DB_URL`).
4. Railway builds and deploys automatically on every push to `main`.

---

## Research Publication

This project was published as a research paper in the **Journal of Emerging Technologies and Innovative Research (JETNR)**:

> **"Eventra: A Full-Stack Event Management System with JWT Authentication and QR-Based Attendance"**  
> Madhan Raj M — VELS Institute of Science, Technology & Advanced Studies (VISTAS), Chennai

---

## Author

**Madhan Raj M (San)**  
Final Year BCA — VELS Institute of Science, Technology & Advanced Studies (VISTAS), Chennai  
