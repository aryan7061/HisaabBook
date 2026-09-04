# 🚀 HisaabBook

Frontend for **HisaabBook**, a modern CRM application for managing **Companies, Contacts, Deals, and Tasks**.

🔗 **Live App:** https://hisaab-book-three.vercel.app
🌐 **Backend API:** https://hisaabbook-api.onrender.com

---

## ✨ Overview

HisaabBook is a React admin dashboard built with the **Refine** framework, using **Ant Design** for the UI and **GraphQL** for backend communication.

The application is fully connected to a live PostgreSQL-backed API—nothing here is a static mockup. Every list, form, and chart displays real data, with per-user data scoping to ensure each account only sees the records it owns.

---

## 📸 Screenshots

### Login and Demo Access

<p align="center">
  <img src="https://github.com/user-attachments/assets/97fef846-844c-45b3-89c9-eef6239bf7d7" alt="Login and Demo Access" width="900">
</p>

The sign-in screen with the **Live Demo** button, allowing visitors to explore the application using a sandboxed account with seeded sample data—no signup required.

---

### Dashboard — Overview

<p align="center">
  <img src="https://github.com/user-attachments/assets/cb3bd5a1-fcfc-4fb6-923f-062f89c281be" alt="Dashboard Overview" width="900">
</p>

Overview cards showing total Companies, Contacts, Deals, the **Win Rate** donut chart, and the **Deals Overview** trend chart with currency toggle and Excel export.

---

### Dashboard — Activity and Task Flow

<p align="center">
  <img src="https://github.com/user-attachments/assets/00ec4c42-b762-47d7-aae3-d8f7b3512c77" alt="Dashboard Activity and Task Flow" width="900">
</p>

Recent Activity feed alongside the **Task Stage Flow** chart, showing task movement across stages over time.

---

### Companies

<p align="center">
  <img src="https://github.com/user-attachments/assets/b2ab52ae-024f-4a5c-bf24-c1171c1f2f55" alt="Companies List" width="900">
</p>

Companies list with sorting by open deal amount and date-range filtering.

---

### Company — Edit

<p align="center">
  <img src="https://github.com/user-attachments/assets/91ea280f-e56d-4cc6-aad8-9ff6b2255731" alt="Company Edit" width="900">
</p>

Company edit form featuring a **View Contacts** shortcut that automatically filters the Contacts page for the selected company.

---

### Contacts

<p align="center">
  <img src="https://github.com/user-attachments/assets/5881247f-febc-42de-a506-37fa624e2ca1" alt="Contacts List" width="900">
</p>

Contacts list displaying status stages such as **New**, **Contacted**, **Interested**, **Won**, **Lost**, and **Churned**.

---

### Deals Dashboard

<p align="center">
  <img src="https://github.com/user-attachments/assets/324c9b91-2f0e-480b-b397-0d7e3805dc12" alt="Deals Dashboard" width="900">
</p>

Pipeline analytics including total, open, won, and lost deals, pipeline value by stage, top companies by deal value, and the complete deals table.

---

### Tasks — Kanban Board

<p align="center">
  <img src="https://github.com/user-attachments/assets/407c96aa-b0f1-459b-9075-a46b905da308" alt="Tasks Kanban Board" width="900">
</p>

Drag-and-drop Kanban board with task stages, per-column counts, pagination, and filtering.

---

## 🛠 Tech Stack

| Category        | Technology                             |
| --------------- | -------------------------------------- |
| Framework       | React 19, TypeScript, Vite             |
| Admin Framework | Refine                                 |
| UI Library      | Ant Design 5                           |
| Charts          | @ant-design/plots (G2), hand-built SVG |
| Drag & Drop     | @dnd-kit/core                          |
| Data Layer      | GraphQL, graphql-codegen               |
| Routing         | React Router 7                         |
| Rich Text       | @uiw/react-md-editor                   |
| Excel Export    | exceljs                                |
| Date Handling   | dayjs (UTC-aware)                      |
| Deployment      | Vercel                                 |

---

## ✨ Features

- Email & Password Login and Registration
- Demo Login (no signup required to explore the app)
- Companies, Contacts, Deals, and Tasks management
- Per-user data scoping (each account only sees its own records)
- Tasks Kanban board with drag-and-drop, per-column pagination, and filters (stage + date range)
- Dashboard analytics:

  - Total counts
  - Win Rate donut chart
  - Deals Overview trend chart
  - Task Stage Flow chart
  - Recent Activity feed

- Multi-currency deal values (INR/USD) using live exchange rates
- Excel export for Deals and Dashboard charts
- Dark theme with a custom branded UI (not Refine's default look)
- Route-level code splitting for faster initial load

---

## 📦 Pages

| Resource  | Pages                                              |
| --------- | -------------------------------------------------- |
| Company   | List, Create, Edit                                 |
| Contact   | List, Create, Edit (nested under Company)          |
| Deal      | List, Create, Edit                                 |
| Task      | List (Kanban), Create, Edit                        |
| Auth      | Login, Register, Forgot Password, Complete Profile |
| Dashboard | Home                                               |

> **Note:** The Forgot Password page exists in the UI, but it isn't connected to any backend logic yet, so submitting it does not reset a password.

---

## 📊 Dashboard

The Home page includes:

- Total counts for Companies, Contacts, Deals, and Tasks
- A Win Rate donut chart (Won vs. Lost deals)
- A Deals Overview trend chart with currency toggle (INR/USD) and Excel export
- A Task Stage Flow chart showing task distribution over time
- A Recent Activity feed combining the latest changes across all resources

---

## 🔐 Authentication

The application supports:

- Email & Password Registration and Login
- A Demo Login button that signs visitors into a sandboxed demo account with its own seeded data—no real user data is exposed
- JWT-based sessions, stored and sent with every GraphQL request

Password reset is not implemented yet—this is a known limitation, not a bug.

---

## 🌱 Environment Variables

```env
VITE_API_BASE_URL=https://hisaabbook-api.onrender.com

VITE_WS_URL=wss://hisaabbook-api.onrender.com/graphql

VITE_DEMO_LOGIN_EMAIL=demo@hisaabbook.com
```

| Variable              | Description                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| VITE_API_BASE_URL     | Base URL of the backend. `/graphql` is appended in code — do not include it here                 |
| VITE_WS_URL           | WebSocket endpoint (present in the configuration; live subscriptions are not used yet)           |
| VITE_DEMO_LOGIN_EMAIL | Email of the shared demo account. Must match the API's `DEMO_LOGIN_EMAIL` or demo scoping breaks |

---

## 🚀 Getting Started

### Install Dependencies

```bash
npm install
```

Create a `.env` file using the environment variables shown above.

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run start
```

---

## ☁ Deployment

The application is deployed on **Vercel** as a static Vite build, with SPA routing handled through `vercel.json`.

---

## 📌 Project Highlights

- Built as a solo project end-to-end, including the frontend, backend, database, and deployment
- Real per-user data scoping, enforced on both the frontend and backend
- Custom dark-themed UI built on top of Ant Design instead of Refine's default look
- Live currency conversion for deal values
- Kanban board with true server-side pagination for each column
- Dashboard charts rebuilt as custom SVG components where the charting library couldn't support the required design

---

## 📄 License

MIT License.
