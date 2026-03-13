# Project Management App

A comprehensive project management application built with Next.js 14+, TanStack Query, and shadcn/ui, consuming a NestJS backend API.

## Features

- **Authentication**: JWT-based auth with automatic token refresh
- **Role-Based Access Control**: Admin, Manager, and Employee roles with different permissions
- **Employee Management**: Full CRUD operations with profile, skills, projects, and workload tracking
- **Skills Management**: Track and assign skills to employees with proficiency levels
- **Task Management**: Kanban board view with drag-and-drop status updates
- **Dashboard**: Role-based views with analytics and task overview
- **Responsive Design**: Mobile-friendly UI with sidebar navigation

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 19, TypeScript
- **UI**: shadcn/ui, TailwindCSS, Lucide icons
- **Data Fetching**: TanStack Query v5 with optimistic updates
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- NestJS backend running at `http://localhost:8000`

### Installation

```bash
# Install dependencies
pnpm install

# Create environment file (optional)
# The app defaults to http://localhost:8000
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
app/
├── (auth)/              # Authentication pages
│   ├── login/
│   └── register/
├── (dashboard)/         # Protected dashboard pages
│   ├── layout.tsx       # Dashboard layout with sidebar
│   ├── dashboard/       # Main dashboard
│   ├── employees/       # Employee management
│   ├── skills/          # Skills management
│   ├── tasks/           # Task management (Kanban)
│   ├── sprints/         # Sprint tracking
│   ├── products/        # Projects (to be renamed)
│   ├── clients/         # Client management
│   └── users/           # User profile
├── layout.tsx           # Root layout
└── page.tsx             # Home page (redirects)

lib/
├── api/                 # API service files
├── hooks/               # TanStack Query hooks
├── schemas/             # Zod validation schemas
├── types/               # TypeScript types
├── providers/           # React providers
└── config.ts            # App configuration

components/
├── auth/                # Auth-related components
└── layout/              # Layout components
```

## User Roles & Permissions

### Admin

- Full access to all features
- Manage employees, projects, skills, sprints, tasks, clients

### Manager

- Create/edit projects
- Assign employees to projects/tasks
- Manage skills, sprints, and clients
- View all employees

### Employee

- View all employees
- View own tasks and projects
- Update task status for assigned tasks
- View own profile and workload

## API Integration

The app consumes a NestJS backend with the following endpoints:

- `/api/auth/*` - Authentication
- `/api/users/*` - User management
- `/api/employees/*` - Employee management
- `/api/skills/*` - Skills management
- `/api/projects/*` - Project management
- `/api/sprints/*` - Sprint tracking
- `/api/tasks/*` - Task management
- `/api/clients/*` - Client management
- `/api/assignments/*` - Employee-skill and employee-project assignments

## Key Features

### Authentication

- JWT tokens stored in localStorage
- Automatic token refresh on 401 responses
- Protected routes with role-based access

### Optimistic Updates

All mutations use TanStack Query's optimistic updates for instant UI feedback with automatic rollback on errors.

### Form Validation

All forms use Zod schemas with React Hook Form for type-safe validation.

### Responsive Design

- Mobile-first approach
- Collapsible sidebar on mobile
- Responsive tables and grids

## Development

```bash
# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## Known Issues

- TypeScript errors related to Zod version compatibility with `@hookform/resolvers` (type-level only, doesn't affect runtime)

## License

MIT
