# React Job Board Application

A full-featured, production-ready Job Board Application built with React, Vite, and Bootstrap.

## 🚀 Objectives & Features

This application serves two primary user personas:
- **Job Seekers**: Browse, filter, view details, and save jobs to their personal list.
- **Recruiters**: Create, edit, and delete their own job postings, and view applicants.
- **Admins**: Have overarching control to edit and delete any job postings across the platform and manage user statuses.

### Key Features
- **Role-Based Access Control**: Secure routing for Guests, Authenticated Users, Recruiters, and Admins.
- **Dynamic Search & Filtering**: Real-time filtering with 300ms debounce.
- **Premium Design**: Fully responsive, dark-mode ready UI built with Bootstrap.
- **Form Validation**: Robust client-side validation using Formik and Yup.
- **API Integration**: Centralized Axios instance with request interceptors for JWT auth.

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

Create a `.env` file in the root directory and configure your API URL:

```env
VITE_API_URL=http://localhost:8181
```

*(See `.env.example` for reference).*

## 🏃 Build & Run Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

---
**Submitted by:** Yair Klausner
