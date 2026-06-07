# Eventra — Frontend

> React-based SPA for the Eventra event management platform. Supports event browsing, registration, QR-based attendance scanning, organizer tools, user profiles, and an admin approval panel.

**Stack:** React 19 · React Router v7 · Tailwind CSS v3 · Axios · Vite 8

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Routes](#routes)
- [Authentication](#authentication)
- [HTTPS for Local Mobile Testing](#https-for-local-mobile-testing)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Research Publication](#research-publication)

---

## Features

- Public event browsing and event detail view
- User registration, login, and OTP-based password reset
- Event creation, editing, and deletion (organizer)
- QR code display per registration for attendance
- QR scanner (camera) for marking attendance (organizer)
- Registrant list with CSV / Excel export (organizer)
- Admin dashboard with pending event approval / rejection
- Role-based protected routes: `USER`, `ORGANIZER`, `ADMIN`
- Responsive design with Tailwind CSS

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Routing | React Router v7 |
| Styling | Tailwind CSS v3 |
| HTTP Client | Axios |
| QR Scanning | html5-qrcode |
| Image Upload | Cloudinary |
| Bundler | Vite 8 |

---

## Prerequisites

- Node.js 18+
- npm or yarn
- Eventra backend running locally or deployed

---

## Getting Started

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

Point this at wherever your backend is running. For production, use your deployed backend URL (e.g. your Railway domain).

**4. Run the dev server**

```bash
npm run dev
```

App starts at `http://localhost:5173`.

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend base URL (local or deployed) |

---

## Project Structure

```
src/
├── api/
│   ├── axios.js               # Axios instance with base URL + JWT interceptor
│   └── cloudinary.js          # Cloudinary image upload helper
├── components/
│   └── Navbar.jsx             # Top navigation bar
├── context/
│   └── AuthContext.jsx        # Global auth state (user, token, login/logout)
├── pages/
│   ├── Home.jsx               # Public event listing
│   ├── EventDetails.jsx       # Single event view + register action
│   ├── CreateEvent.jsx        # Create a new event form
│   ├── EditEvent.jsx          # Edit an existing event
│   ├── MyEvents.jsx           # Events created by the logged-in user
│   ├── MyRegistrations.jsx    # Events the user has registered for (+ QR codes)
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

## Routes

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

## Authentication

Auth state is managed globally via `AuthContext`. On login, the JWT is stored in `localStorage` and automatically attached to every API request by the Axios interceptor in `src/api/axios.js`.

`ProtectedRoute` in `App.jsx` guards routes by role (`USER` / `ADMIN`). Unauthenticated users are redirected to `/login`.

---

## HTTPS for Local Mobile Testing

The QR scanner requires camera access, which browsers only allow over HTTPS. For testing on a mobile device locally:

**Option 1 — mkcert (recommended)**

1. Install [mkcert](https://github.com/FiloSottile/mkcert) and generate a local certificate.
2. Place the cert files in a `certs/` folder at the project root.
3. Vite auto-detects the certs and serves over HTTPS (see `vite.config.js`).

**Option 2 — ngrok**

Use [ngrok](https://ngrok.com/) to tunnel your local frontend or backend over HTTPS instantly.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Deployment

The project includes a `vercel.json` for zero-config deployment on [Vercel](https://vercel.com):

1. Push to GitHub.
2. Import the repository in Vercel.
3. Set `VITE_API_BASE_URL` to your deployed backend URL in Vercel's environment variables.
4. Deploy — Vercel handles the build automatically.

You can also deploy to **Railway**, **Netlify**, or **Cloudflare Pages** by running `npm run build` and serving the `dist/` folder.

---

## Research Publication

This project was published as a research paper in the **Journal of Emerging Technologies and Innovative Research (JETNR)**:

> **"Eventra: A Full-Stack Event Management System with JWT Authentication and QR-Based Attendance"**  
> Madhan Raj M — VELS Institute of Science, Technology & Advanced Studies (VISTAS), Chennai

---

## Author

**Madhan Raj M **  
Final Year BCA — VELS Institute of Science, Technology & Advanced Studies (VISTAS), Chennai  
