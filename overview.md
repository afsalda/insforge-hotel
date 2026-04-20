# Project Overview: StayBnB (Final Hotel)

StayBnB is a full-stack, high-premium vacation rental marketplace and hotel booking application. It is designed with a modern aesthetic, featuring smooth animations and a robust backend integration.

## 🚀 Quick Links
- **Client Root**: `client/`
- **Server Root**: `server/`
- **API (Serverless)**: `api/`
- **Design System**: `design-system/`
- **Project Configuration**: `package.json`, `gemini.md`, `AGENTS.md`

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React.js (via Vite)
- **Styling**: Tailwind CSS 3.4, Vanilla CSS
- **Animations**: GSAP (GreenSock), Framer Motion
- **Scrolling**: Lenis (Smooth Scroll)
- **Routing**: React Router DOM (v6)
- **State/Notifications**: React Hot Toast

### Backend & Infrastructure
- **Serverless**: Vercel Functions (TypeScript)
- **Node.js**: Express.js (Dedicated server in `server/`)
- **BaaS**: **InsForge** (Database, Auth, AI, Realtime)
- **Database**: PostgreSQL (via InsForge)
- **Proxy**: custom proxy for InsForge in `api/insforge-proxy.ts`

### Integrations
- **Payments**: Razorpay (Live mode enabled)
- **Email Notifications**: Brevo (Sendinblue)
- **SMS/WhatsApp**: WhatsApp Business API (for booking alerts)

---

## 📂 Directory Structure

```text
.
├── api/                # Vercel Serverless Functions (Prod Backend)
│   ├── book-room.ts           # Room booking logic
│   ├── create-booking.ts      # Initial booking creation
│   ├── send-booking-email.ts # Email notification logic
│   └── verify-payment.ts     # Razorpay webhook and verification
├── client/             # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page-level components
│   │   └── index.css         # Main styles (Tailwind + Custom)
├── server/             # Express.js Backend (Internal/Legacy)
│   ├── src/
│   │   ├── routes/           # API routes
│   │   ├── models/           # Data models
│   │   └── controllers/      # Business logic
├── packages/shared/    # Shared types and utilities
└── design-system/      # Design tokens and visual assets
```

---

## ✨ Key Features

### 1. Booking Flow
- Interactive room/apartment listings with high-quality media.
- Real-time availability check (planned/integrated with InsForge).
- Checkout system integrated with **Razorpay**.
- Automatic booking confirmation via Email (Brevo) and WhatsApp.

### 2. Admin Dashboard
- Protected route (`/admin`) for property management.
- Live scanner/check-in system (`scanner-card-stream.tsx`).
- Booking management and analytics.

### 3. User Experience
- **Smooth Navigation**: Global smooth scroll using Lenis.
- **Premium UI**: Custom "ticket-style" booking confirmations.
- **Responsive**: Fully optimized for mobile (dedicated fixes for sticky elements).

---

## 🔗 Routing Table (Frontend)

| Path | Component | Description |
| :--- | :--- | :--- |
| `/` | `HomePage` | Hero section, featured properties |
| `/rooms` | `RoomsPage` | Grid of available rooms |
| `/rooms/:id` | `ListingDetailPage` | Detailed view of a specific room |
| `/apartments` | `ApartmentsPage` | Multi-unit property listings |
| `/checkout/:id` | `CheckoutPage` | Booking form and payment trigger |
| `/login` | `AdminLoginPage` | Entry to admin panel |
| `/admin` | `AdminDashboardPage` | Management tools |
| `/terms` | `TermsConditions` | Legal terms |
| `/privacy-policy` | `PrivacyPolicy` | Data privacy details |

---

## 🛡 Environment Variables (Reference)
The project relies on the following key variables across `.env.local` and Vercel:

- `VITE_INSFORGE_URL` / `VITE_INSFORGE_ANON_KEY`
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`
- `BREVO_API_KEY`
- `WHATSAPP_API_TOKEN` / `WHATSAPP_PHONE_NUMBER_ID`
- `ADMIN_SECRET_KEY`

---

## 📝 Recent Progress
- [x] Transitioned Razorpay to **Live Mode**.
- [x] Fixed booking confirmation UI (ticket notches, centering).
- [x] Implemented legal pages (Privacy, Terms, Cancellation).
- [x] Standardized WhatsApp notification triggers in payment flow.
- [x] Optimized mobile header and button overlaps.

---
> [!NOTE]
> This overview is automatically generated to maintain project coherence. For deep-dive technical rules, refer to `AGENTS.md` and `gemini.md`.
