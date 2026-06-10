# BizManage ERP

> A comprehensive Enterprise Resource Planning (ERP) system designed for trading companies and businesses in Sri Lanka.

## Overview

BizManage is a modern, full-stack ERP solution built with **TypeScript**, **Express.js**, **React**, and **PostgreSQL**. It provides integrated management of invoicing, inventory, payments, VAT compliance, and multi-company operations with role-based access control.

### Key Features

- **📋 Invoicing & Billing** — Create, manage, and track invoices with automated VAT calculations
- **💳 Payment Management** — Record and reconcile client and supplier payments with multi-currency support
- **📦 Inventory & Purchases** — Track stock levels, purchase orders, and supplier management
- **🏢 Multi-Company Support** — Manage multiple companies with isolated data and user access
- **👥 Role-Based Access Control (RBAC)** — Fine-grained permissions (Admin, Accountant, Supervisor, etc.)
- **🔐 Secure Authentication** — JWT-based auth with bcrypt password hashing
- **📊 Reports & Analytics** — VAT reports, financial summaries, audit logs
- **🌐 Responsive UI** — Modern React frontend with TypeScript, Tailwind CSS, and Radix UI components
- **📱 Mobile-Friendly** — Works on desktop, tablet, and mobile devices
- **🔄 Real-time Sync** — Live updates across users in a company

## Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (jsonwebtoken), bcrypt
- **File Uploads**: Multer
- **Documentation**: OpenAPI/Swagger-ready

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: React Context
- **HTTP Client**: Fetch API with custom wrapper
- **Forms**: Sonner (toasts), Radix UI components

## Project Structure

```
BizManage/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── server.ts           # Main entry point
│   │   ├── config/             # Configuration (auth, database)
│   │   ├── middleware/         # Auth, validation, rate limiting
│   │   ├── routes/             # API endpoints
│   │   │   ├── auth.ts         # Authentication (login, register, profile)
│   │   │   ├── clients.ts      # Client management
│   │   │   ├── invoices.ts     # Invoice operations
│   │   │   ├── payments.ts     # Payment tracking
│   │   │   ├── purchases.ts    # Purchase orders
│   │   │   ├── returns.ts      # Return management
│   │   │   ├── companies.ts    # Company settings
│   │   │   └── tenders.ts      # Tender management
│   │   └── types/              # Error definitions
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.ts             # Database seeding
│   ├── uploads/                # Uploaded files (avatars, documents)
│   └── package.json
│
├── frontend/                   # React + Vite SPA
│   ├── src/
│   │   ├── App.tsx             # Main app component
│   │   ├── main.tsx            # Entry point
│   │   ├── components/
│   │   │   ├── ui/             # Reusable UI components
│   │   │   ├── DesktopSidebar.tsx
│   │   │   ├── ClientDetail.tsx
│   │   │   └── ...
│   │   ├── pages/              # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Invoices.tsx
│   │   │   ├── Clients.tsx
│   │   │   ├── Profile.tsx     # User profile with avatar upload
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── api.ts          # API wrapper with auth headers
│   │   │   ├── auth.ts         # Authentication service
│   │   │   ├── clientService.ts
│   │   │   └── ...
│   │   ├── types/              # TypeScript interfaces
│   │   └── styles/             # Global styles
│   └── package.json
│
├── docker/                     # Docker configurations
│   └── Dockerfile.backend
│
├── docker-compose.yml          # Multi-container setup
├── DATABASE_SETUP.md           # Database initialization guide
├── DOCKER.md                   # Docker deployment guide
└── README.md                   # This file
```

## Quick Start

### Prerequisites
- **Node.js** v18+
- **PostgreSQL** v12+
- **.env** file configured (see below)

### 1. Environment Setup

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/bizmanage
JWT_SECRET=your-secure-jwt-secret-key
JWT_EXPIRES_IN=24h
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Database Setup

```bash
cd backend

# Generate Prisma client
npm run prisma:generate

# Create/update database schema
npx prisma db push

# Seed with sample data
npm run prisma:seed
```

### 4. Start Development Servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Runs on http://127.0.0.1:4000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### 5. Login with Default Credentials

- **Admin User:**
  - Email: `admin@bizmanage.lk`
  - Password: `Admin@123`

- **Accountant User:**
  - Email: `accountant@bizmanage.lk`
  - Password: `Accountant@123`

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login (returns JWT + permissions) |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/refresh` | Refresh expired token |
| GET | `/api/auth/me` | Get current user profile |
| PUT | `/api/auth/me` | Update profile (supports avatar upload) |
| POST | `/api/auth/logout` | Logout (audit logging) |

### Resource Endpoints

- **`/api/clients`** — Client management (CRUD)
- **`/api/invoices`** — Invoice operations (create, read, update, approve)
- **`/api/payments`** — Payment tracking and reconciliation
- **`/api/purchases`** — Purchase order management
- **`/api/returns`** — Return management
- **`/api/companies`** — Company settings and multi-tenant management
- **`/api/tenders`** — Tender/quotation management

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

## Features

### Authentication & Authorization
- ✅ JWT-based session management
- ✅ Role-Based Access Control (RBAC)
- ✅ Permission-scoped endpoints (e.g., `users:read`, `invoices:approve`)
- ✅ Company-level data isolation
- ✅ Audit logging for sensitive operations

### User Profile Management
- ✅ Avatar upload with image serving
- ✅ Profile information editing (name, phone, email)
- ✅ View profile with role and company info
- ⏳ Change password (TODO)
- ⏳ Two-factor authentication (TODO)

### Invoicing
- ✅ Create and send invoices
- ✅ Line items with taxes
- ✅ VAT compliance calculations
- ✅ Invoice approval workflow
- ✅ Print-friendly invoice templates

### Payment Management
- ✅ Record client and supplier payments
- ✅ Multi-currency support
- ✅ Payment reconciliation
- ✅ Payment tracking dashboard

### Reporting & Compliance
- ✅ VAT reports
- ✅ Financial reports
- ✅ Audit logs
- ✅ User activity tracking

### Admin Features
- ✅ User management (create, deactivate)
- ✅ Company management
- ✅ Role and permission configuration
- ✅ Login sessions monitoring
- ⏳ Impersonation/login-as-user (TODO)

## Development

### Code Organization
- **Services**: Centralized API calls (`api.ts`), authentication (`auth.ts`)
- **Components**: Reusable UI components in `ui/` folder (Radix UI primitives)
- **Pages**: Full-page components with business logic
- **Middleware**: Express middleware for auth, validation, rate limiting

### Build for Production

**Backend:**
```bash
npm run build
npm start
```

**Frontend:**
```bash
npm run build
# Output in dist/
```

### Docker Deployment

```bash
docker-compose up --build
```

See [DOCKER.md](DOCKER.md) for detailed Docker setup instructions.

## Database Schema

The system uses a normalized PostgreSQL schema with:

- **Users** — Employees/staff with roles and permissions
- **Roles** — Role definitions with permission associations
- **Permissions** — Fine-grained action permissions (module:action format)
- **Companies** — Multi-tenant support with isolated data
- **Clients/Suppliers** — Business partners with contact management
- **Invoices/Purchases** — Financial transactions with line items
- **Payments** — Payment records and reconciliation
- **AuditLogs** — System activity and change tracking
- **LoginLogs** — User session and login attempt history

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for schema details.

## Performance & Security

### Security
- ✅ HTTPS-ready (Helmet headers)
- ✅ CORS configured for frontend origins
- ✅ Rate limiting on auth endpoints
- ✅ SQL injection protection (Prisma parameterized queries)
- ✅ CSRF token support (ready for stateful sessions)
- ✅ Bcrypt password hashing (rounds: 12)

### Performance
- ✅ Database query optimization with Prisma select/include
- ✅ Gzip compression on responses
- ✅ Static file caching headers
- ✅ Connection pooling (Prisma)

## Roadmap

- [ ] Change password endpoint + UI
- [ ] Two-factor authentication (2FA)
- [ ] Admin impersonation (login-as-user)
- [ ] Email notifications (invoice, payment reminders)
- [ ] Advanced analytics dashboard
- [ ] API rate limiting per user
- [ ] Export to Excel/PDF bulk operations
- [ ] Mobile app (React Native)
- [ ] Webhook support for external integrations
- [ ] GraphQL API option

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request

## License

MIT License — see [LICENSE](LICENSE) file for details.

## Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Contact: support@bizmanage.lk
- Documentation: [Wiki](../../wiki)

## Changelog

### v1.0.0 (Current)
- ✅ Full ERP system with invoicing, payments, inventory
- ✅ Multi-company support with RBAC
- ✅ JWT authentication with profile management
- ✅ VAT compliance reports
- ✅ Responsive React frontend
- ✅ Docker deployment ready

---

**Made with ❤️ for businesses in Sri Lanka**

BizManage © 2024. All rights reserved.
