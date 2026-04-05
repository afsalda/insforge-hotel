# Project Overview: Al Baith Hotel Management System

A premium, modern hotel and apartment booking platform designed for Al Baith, featuring a seamless user experience, administrative management, and automated notifications.

## 1. Project Summary
*   **Purpose**: A comprehensive booking and management system for Al Baith Hotel and Apartments. It provides a guest-facing portal for room reservations and an admin-facing dashboard for staff to manage bookings and view statistics.
*   **Client**: Al Baith Hotel.
*   **Developer**: [Placeholder/System Agent - User: John Doe].
*   **Deployment**: Vercel (Frontend & Serverless Functions).
*   **Key Characteristics**: High-end aesthetics, mobile-first design, real-time booking, and robust offline-first synchronization for data integrity.

---

## 2. Tech Stack

### Frontend (Client-side)
*   **Framework**: [React 19](https://react.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: Vanilla CSS (Custom Variable-based Design System)
*   **Animations**: 
    *   [Framer Motion](https://www.framer.com/motion/) (UI state transitions)
    *   [GSAP](https://gsap.com/) (Timeline-based scroll and entrance animations)
    *   [Lenis](https://github.com/darkroomengineering/lenis) (Smooth scrolling)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Database Client**: [@insforge/sdk](https://www.npmjs.com/package/@insforge/sdk) (PostgREST Wrapper)

### Backend (Server-side / Edge)
*   **Computing**: [Vercel Serverless Functions](https://vercel.com/docs/functions) (Located in `/api`)
*   **Legacy/Dev Server**: Node.js with [Express](https://expressjs.com/) (Located in `/server`)
*   **Database**: **InsForge** (Managed PostgreSQL with PostgREST API)
*   **Email Engine**: [Resend](https://resend.com/) (Primary SDK for serverless mail)
*   **Legacy Email**: Nodemailer with Brevo SMTP relay.

---

## 3. Project Structure

```text
.
├── api/                   # Production Vercel Serverless Functions (Node.js/TypeScript)
│   ├── book-room.ts       # Logic for creating reservations and sending emails
│   ├── insforge-proxy.ts  # Secure proxy for database write operations (POST/PUT/DELETE)
│   └── send-booking-email.ts # Dedicated mail handler using Resend
├── client/                # React Vite Frontend SPA
│   ├── public/            # Static assets (logos, images)
│   ├── src/
│   │   ├── assets/        # Styles (index.css), Fonts
│   │   ├── components/    # Reusable UI components (Navbar, Footer, Search)
│   │   ├── lib/           # Core API logic and InsForge SDK initialization (api.js)
│   │   ├── pages/         # Application routes (HomePage, Admin, Checkout, etc.)
│   │   ├── App.jsx        # Routing and entry logic
│   │   └── main.jsx       # React DOM mounting
│   └── package.json       # Frontend dependencies and scripts
├── server/                # Legacy/Development Express Server
│   ├── src/
│   │   ├── config/        # Environment and DB config
│   │   ├── routes/        # Express API endpoints
│   │   └── server.js      # Main server entry
│   └── package.json       # Server dependencies
├── packages/shared/       # Shared logic between Client and Server (Constants, Helpers)
├── .env.example           # Template for required secrets
├── vercel.json            # Vercel deployment configuration (Routing & Proxies)
└── update-room.js         # Maintenance script for codebase patching
```

---

## 4. Core Features

### Guest Portal
*   **Dynamic Room Selection**: Categorized room listings (Standard, Deluxe, Suite, Executive) and Apartment types (1BHK, 2BHK, 3BHK).
*   **Modern Booking Flow**: Interactive date selection, real-time price calculation (including cleaning and service fees), and a mobile-optimized checkout.
*   **Responsive Gallery**: Swipeable image galleries for room details.
*   **Success Feedback**: Animated confirmation screen with audible premium confirmation sounds.
*   **Email Confirmations**: Automated HTML emails sent to guests upon successful reservation.

### Admin Dashboard
*   **Unified Management**: Centralized view of all bookings, filterable by status or date.
*   **Revenue Analytics**: Real-time stats calculation (Total potential vs. confirmed revenue).
*   **CRUD Operations**: Update booking status (Pending/Confirmed/Cancelled), edit guest details, or delete records.
*   **Protected Access**: Hardcoded administrative credential gateway for internal security.

---

## 5. Data Flow & Architecture

### Booking Architecture
The application uses a **Serverless-Proxy pattern** for write operations:
1.  **Frontend (Read)**: Uses `@insforge/sdk` with an **Anonymous Key** to fetch listing data directly from the DB.
2.  **Frontend (Write)**: Calls `/api/insforge-proxy` or `/api/book-room`.
3.  **Proxy (Backend)**: Injects the **Service API Key** (secret) to perform privileged database actions.
4.  **Database**: InsForge (PostgreSQL) stores the record.
5.  **Side Effects**: The serverless function triggers Resend to deliver confirmation emails to both the guest and the hotel owner.

### State Management
*   **UI State**: Handled via standard React `useState` and `useContext` hooks.
*   **Persistence**: `localStorage` is used to flag admin authentication and mirror booking states for offline resiliency.

---

## 6. API & Integrations

### External Services
| Service | Purpose | Key Variables |
| :--- | :--- | :--- |
| **InsForge** | Managed Postgres Database | `VITE_INSFORGE_URL`, `VITE_INSFORGE_ANON_KEY` |
| **Vercel** | Hosting & Computed Logic | `INSFORGE_API_KEY` (Protected Secret) |
| **Resend** | Transactional Emails | `RESEND_API_KEY`, `FROM_EMAIL` |
| **Brevo** | SMTP Fallback | `SMTP_PASS`, `SMTP_USER` |
| **WhatsApp** | (Configured/Partial) Alerts | `WHATSAPP_ACCESS_TOKEN` |

### Environment Variables (.env)
*   `VITE_INSFORGE_URL`: Public endpoint for the database.
*   `VITE_INSFORGE_ANON_KEY`: Client-safe key for read-only access.
*   `INSFORGE_API_KEY`: Service key for write permissions (Server-only).
*   `RESEND_API_KEY`: API key for email delivery via Resend.
*   `HOTEL_EMAIL`: The recipient for internal booking alerts.

---

## 7. Pages & Components

### Key Pages
*   **Home (`/`)**: High-impact landing page with GSAP hero animations and room category discovery.
*   **Room Detail (`/room/:id`)**: Comprehensive listing info, amenities, and host details.
*   **Checkout (`/checkout/:id`)**: Multi-step booking form (Details -> Payment Sim -> Review).
*   **Apartments (`/apartments`)**: Dedicated filter for long-stay options.
*   **Admin Dashboard (`/admin`)**: Management console for staff.
*   **Admin Login (`/admin-login`)**: Credential gate for the dashboard.

### Core Components
*   **Navbar**: Sticky, transparent-to-solid transition with scroll-driven elevation.
*   **RoomCard**: Premium hover effects and dynamic price badge.
*   **BookingCalendar**: Custom custom date-picker interface for room availability.

---

## 8. Performance & Animations
*   **Smooth Scroll**: Powered by `Lenis` for a "premium" feel on all devices.
*   **Scroll-Triggered Reveals**: GSAP ScrollTrigger used for fading in cards as the user scrolls.
*   **Glassmorphism**: Heavy use of `backdrop-filter: blur()` for modern UI depth.
*   **Micro-interactions**: Subtle scale-up effects on buttons and card hovers.

---

## 9. Getting Started

### Prerequisites
*   Node.js 18+
*   NPM or Yarn

### Local Installation
1.  **Clone the repository**:
    ```bash
    git clone [repository-url]
    ```
2.  **Install dependencies**:
    ```bash
    cd final\ hotel/client && npm install
    cd ../server && npm install
    ```
3.  **Configure Environment**:
    Create a `.env` file in the root using `.env.example` as a template.
4.  **Run Development Mode**:
    ```bash
    # From the client directory
    npm run dev
    ```

---

## 10. Deployment
The project is optimized for deployment on **Vercel**.
1.  Connect your repository to a Vercel Project.
2.  Add both **Frontend** (Variables starting with `VITE_`) and **Backend** secrets to the Vercel Dashboard.
3.  The `vercel.json` file handles the routing of `/api/*` to the serverless functions and SPA fallback for other routes.

---

## 11. Known Issues & Roadmap

### Active Challenges
*   **Hardcoded Listings**: Room and Apartment data are currently stored in `ListingDetailPage.jsx` and `HomePage.jsx` as static constants.
*   **Simple Auth**: Admin authentication relies on a `localStorage` flag; this should be migrated to a session-based or JWT-based system for scaling.

### Roadmap
*   [ ] **Dynamic Inventory**: Move room data from code to the InsForge database for true CMS functionality.
*   [ ] **Secure Admin Auth**: Implement a proper login service with expiring sessions.
*   [ ] **General Settings**: Implement the currently "Coming Soon" settings panel for dynamic hotel info updates.
*   [ ] **WhatsApp Integration**: Finalize and test the WhatsApp notification flow for instant staff alerts.
*   [ ] **Image Optimization**: Integrate a CDN like Cloudinary or Vercel Image Optimization for faster asset delivery.

---

## 12. AI & Developer Guidelines

### Context for Future Development
*   **Database Writes**: For all operations involving `POST`, `PUT`, `PATCH`, or `DELETE` to the database, use the `/api/insforge-proxy` serverless function. Direct client-side writes using the anonymous SDK key will fail.
*   **Routing**: The application uses a SPA (Single Page Application) model. Ensure `vercel.json` is always maintained to route non-API traffic to `index.html`.
*   **Styling**: Avoid using utility frameworks like Tailwind for core UI unless requested. The project heavily relies on standard CSS classes in `index.css` for its premium aesthetic.
*   **Animations**: When adding new sections, maintain the "premium" feel by using GSAP `ScrollTrigger` or `Framer Motion` entrance animations.
*   **Testing**: When modifying the booking process, verify the `/api/book-room` function individually as it manages both database persistence and email side effects.
