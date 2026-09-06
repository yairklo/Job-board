# React Job Board Application

A React + Vite + Bootstrap job browser with two backends:

- **Job Board** on `/` — recruiter listings from `jobboard-api` (register, save, post, admin).
- **WhatsApp feed** on `/whatsapp` — list, filter, and open apply links from the collector API.

## How to run locally

1. **Install frontend dependencies**:
   ```bash
   npm install
   ```

2. **Copy env** — `.env.example` to `.env`:
   ```env
   VITE_API_URL=http://localhost:8181
   VITE_JOBS_API_URL=http://167.233.98.192:8787
   ```

3. **Start the Job Board API** (auth, profile, my-jobs, create/edit):
   ```bash
   cd jobboard-api
   npm install
   npm run seed
   npm run dev
   ```
   Seed accounts: `admin@jobboard.local` / `Admin1234!`, `recruiter@jobboard.local` / `Recruiter1234!`, `seeker@jobboard.local` / `Seeker1234!`.

4. **Start Vite** from the repo root:
   ```bash
   npm run dev
   ```

Home calls `GET /jobs` on `VITE_API_URL`. `/whatsapp` calls `GET /api/jobs/recent?limit=200` on `VITE_JOBS_API_URL`. Job detail `/jobs/:id` tries the Job Board first, then the WhatsApp recent-list cache. **Apply** on feed jobs opens `applyUrl` in a new tab.

Login, register, saved jobs, my-jobs, and recruiter/admin routes use `VITE_API_URL` (`jobboard-api` on port 8181).

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
- **Course API**: Node.js, Express, MongoDB (Mongoose)

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
jobboard-api/           # Node + Express + MongoDB REST API
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

## 🏃 Other scripts

```bash
npm run build
npm run preview
npm test
```

---
**Submitted by:** Yair Klausner
