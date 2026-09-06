# React Job Board Application

A React + Vite + Bootstrap job browser. The main path is now a **personal WhatsApp job feed** for local use: list, filter, and open apply links from Yair's collector API.

## How to run locally against the WhatsApp jobs API

This is the supported workflow. Do not deploy this phase to Vercel or other hosting.

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Point the app at the collector** — copy `.env.example` to `.env` (or edit `.env`):
   ```env
   VITE_API_URL=http://167.233.98.192:8787
   ```
   `VITE_JOBS_API_URL` is an optional alias if `VITE_API_URL` is unset.

3. **Start Vite**:
   ```bash
   npm run dev
   ```

4. Open the printed localhost URL. The home page calls `GET /api/jobs/recent?limit=200` in the browser (CORS is `*`, HTTP is fine). Cards show cleaned title, parsed company, WhatsApp group, and date. Job detail `/jobs/:id` is resolved from the recent list (there is no get-by-id API). **Apply** opens `applyUrl` in a new tab.

Login, register, saved jobs, my-jobs, and recruiter/admin create/edit/delete still exist as routes but are hidden in the nav. They depend on the old webify API and are unused for this personal feed.

## 🚀 Objectives & Features

- **Personal feed**: browse jobs collected from WhatsApp groups.
- **Client-side search & filters**: title / company / group text search, plus group and status dropdowns.
- **Detail + Apply**: open the original posting (`applyUrl`, usually LinkedIn). This UI does not submit applications.
- Older recruiter/admin flows are left in place but not wired to a new backend.

## Feed mapping

Collector `GET /api/jobs/recent` returns `{ ok, jobs, source, mongo, total }`. Each job is normalized in `src/utils/whatsappJob.js`:

| Collector | UI |
|---|---|
| `id` | `_id` / `id` (routing key) |
| `title` | display title — strip `*`, BOM/RTL marks; if pattern is `Role / Company` and `company` is empty, split them |
| `company` | feed company, or parsed from title, or `—` |
| `group` | badge + filter |
| `applyUrl` | Apply CTA (`applicationUrl` alias for older sidebar code) |
| `status` / `approvalStatus` | detail + filter |
| `createdAt` / `source` | date and overview |
| location / salary / jobType | `—` or hidden so cards do not crash |

## 🛠️ Tech Stack

- **Core Framework**: React 19 + JavaScript
- **Build Tool**: Vite
- **Routing**: `react-router-dom`
- **HTTP Client**: `axios`
- **Form Handling & Validation**: `formik` + `yup`
- **UI Notifications**: `react-toastify`
- **State Management**: React Context API (`AuthContext`, `ThemeContext`)
- **Styling**: Bootstrap
- **Icons**: `react-icons`
- **Testing**: `vitest` + `@testing-library/react`

## 📁 Folder Architecture

```plaintext
src/
├── assets/             # Static media/images
├── components/         # Reusable UI elements (Navbar, JobCard, Modals)
├── contexts/           # Global State (Auth, Theme)
├── hooks/              # Custom React Hooks (if any)
├── layouts/            # Page layout wrappers (MainLayout)
├── pages/              # View components matching routes
├── routes/             # App routing & ProtectedRoute wrappers
├── services/           # Axios instance, interceptors & API methods
├── styles/             # Global CSS and themes
├── utils/              # Helper functions (normalizers, date-utils)
├── validation/         # Yup schemas
├── App.jsx             # Main Application Component
└── main.jsx            # Entry point
```

## 👥 User Roles & Permissions Matrix

| Route Path | View / Component | Access Level |
|---|---|---|
| `/` | Home / Job List | Public |
| `/jobs/:id` | Job Details | Public |
| `/about` | About Page | Public |
| `/login` | Login | Guest Only (Redirect if logged in) |
| `/register` | Register | Guest Only (Redirect if logged in) |
| `/saved-jobs` | Saved Jobs | Authenticated Users |
| `/my-jobs` | My Jobs | Recruiters Only (`isRecruiter: true`) |
| `/jobs/create` | Create Job | Recruiters Only (`isRecruiter: true`) |
| `/jobs/edit/:id` | Edit Job | Creator of Job OR Admin |
| `/profile` | Profile Management | Authenticated Users |
| `/admin` | Admin Dashboard | Admin Only (`isAdmin: true`) |
| `*` | 404 Not Found | Public |

## ⚙️ Environment Setup

See **How to run locally against the WhatsApp jobs API** above. `.env.example` is the reference.

```env
VITE_API_URL=http://167.233.98.192:8787
```

## 🏃 Other scripts

```bash
npm run build
npm run preview
npm test
```

---
**Submitted by:** Yair Klausner
