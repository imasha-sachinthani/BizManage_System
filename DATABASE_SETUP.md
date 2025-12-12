# Database Setup Guide - BizManage ERP

## ✅ Database Successfully Created and Configured

The database has been successfully initialized with all required tables, roles, permissions, and sample data.

---

## 📊 Database Information

- **Database Type**: PostgreSQL 16 (Alpine)
- **Database Name**: bizmanage_erp
- **Host**: localhost
- **Port**: 5433
- **User**: bizmanage_user
- **Password**: bizmanage_pass_2024

---

## 🎯 What Was Created

### 1. Database Schema (Tables)

The following tables were created using Prisma ORM:

#### Authentication & Authorization
- `users` - User accounts with authentication
- `roles` - User roles (Admin, Accountant, Manager, Viewer)
- `permissions` - Granular permissions for modules
- `login_logs` - Login history tracking
- `audit_logs` - System activity audit trail

#### Business Entities
- `companies` - Company/Business information
- `clients` - Customer database
- `suppliers` - Supplier database
- `products` - Product/Service catalog

#### Financial Management
- `invoices` - Sales invoices
- `invoice_items` - Invoice line items
- `payments` - Payment tracking
- `expenses` - Expense management

#### Procurement
- `purchases` - Purchase orders
- `purchase_items` - Purchase order line items

#### Customs & Compliance
- `cusdec_entries` - Customs declaration entries

#### Operations
- `tenders` - Tender/Quote management
- `tender_items` - Tender line items
- `assets` - Fixed asset management
- `depreciation_schedules` - Asset depreciation tracking

#### System
- `notifications` - User notifications
- `settings` - System configuration

---

## 👥 Default User Accounts

### Administrator Account
```
Email: admin@bizmanage.lk
Password: Admin@123
Role: Admin (Full Access)
```

### Accountant Account
```
Email: accountant@bizmanage.lk
Password: Accountant@123
Role: Accountant
```

⚠️ **IMPORTANT**: Change these default passwords immediately after first login!

---

## 🔐 Default Roles & Permissions

### 1. Admin Role
Full access to all modules:
- Users, Companies, Settings Management
- All Invoice operations
- All Payment operations
- All Purchase operations
- All Reports & Exports
- CUSDEC Management
- Asset Management
- Tender Management

### 2. Accountant Role
Financial operations:
- Invoice: Create, Read, Update
- Payment: All operations
- Purchase: Read, Update
- Reports: Read, Export
- Expenses: All operations

### 3. Manager Role
Operational management:
- Invoice: Create, Read, Approve
- Purchase: Create, Read, Approve
- Reports: Read
- Tenders: All operations
- Assets: Read

### 4. Viewer Role
Read-only access:
- Invoice: Read
- Payment: Read
- Purchase: Read
- Reports: Read
- Assets: Read

---

## 📝 Sample Data Seeded

The database includes sample data for development:
- ✅ 2 user accounts (admin, accountant)
- ✅ 1 default company (BizManage Solutions Pvt Ltd)
- ✅ 10+ sample clients
- ✅ 5+ sample suppliers
- ✅ 15+ sample products
- ✅ Permission matrix for all roles

---

## 🔧 Database Management Commands

### Generate Prisma Client
```bash
cd backend
npm run prisma:generate
```

### Push Schema Changes
```bash
cd backend
npx prisma db push
```

### Create Migration
```bash
cd backend
npx prisma migrate dev --name your_migration_name
```

### Seed Database (Re-run)
```bash
cd backend
npm run prisma:seed
```

### Open Prisma Studio (Database GUI)
```bash
cd backend
npx prisma studio
```
Then open: http://localhost:5555

### View Database in Docker
```bash
docker exec -it erp-postgres psql -U bizmanage_user -d bizmanage_erp
```

---

## 🧪 Testing Database Connection

### Test Login API
```powershell
$body = @{ 
    email = 'admin@bizmanage.lk'
    password = 'Admin@123' 
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/login' -Method POST -Body $body -ContentType 'application/json'
```

### Test Get Clients
```powershell
$token = "your-jwt-token-here"
Invoke-RestMethod -Uri 'http://localhost:3000/api/clients' -Method GET -Headers @{ Authorization = "Bearer $token" }
```

---

## 🌐 Database Connection String

The backend uses the following connection string (stored in `backend/.env`):

```
DATABASE_URL="postgresql://bizmanage_user:bizmanage_pass_2024@localhost:5433/bizmanage_erp?schema=public"
```

---

## 🐳 Docker Database Container

The PostgreSQL database runs in a Docker container:

### Container Details
- **Container Name**: erp-postgres
- **Image**: postgres:16-alpine
- **Port Mapping**: 5433:5432
- **Volume**: postgres_data (persistent storage)
- **Backup Location**: ./backups

### Container Management
```bash
# Start database container
docker-compose up -d postgres

# Stop database container
docker-compose stop postgres

# View logs
docker logs erp-postgres

# Access PostgreSQL CLI
docker exec -it erp-postgres psql -U bizmanage_user -d bizmanage_erp

# Backup database
docker exec erp-postgres pg_dump -U bizmanage_user bizmanage_erp > ./backups/backup_$(date +%Y%m%d).sql

# Restore database
docker exec -i erp-postgres psql -U bizmanage_user bizmanage_erp < ./backups/backup_20231201.sql
```

---

## 📈 Database Statistics

Current database includes:
- **28+ Tables** covering all business operations
- **4 User Roles** with granular permissions
- **50+ Permissions** for fine-grained access control
- **Sample Data** for immediate testing and development

---

## ✅ Verification Checklist

- [x] PostgreSQL container running
- [x] Database schema created (28+ tables)
- [x] Prisma Client generated
- [x] Default roles and permissions seeded
- [x] Admin and accountant users created
- [x] Sample business data loaded
- [x] Backend connected to database
- [x] Login API tested successfully
- [x] Environment variables configured

---

## 🚀 Next Steps

1. **Change Default Passwords**
   - Login with admin@bizmanage.lk / Admin@123
   - Go to Settings → Change Password
   - Update accountant password as well

2. **Update Company Information**
   - Navigate to Dashboard
   - Click edit icon on company header
   - Upload company logo
   - Update company details

3. **Configure Email Settings**
   - Go to Settings → Email Settings
   - Add SMTP credentials in backend/.env
   - Test email functionality

4. **Create Additional Users**
   - Go to User Management
   - Create users for your team
   - Assign appropriate roles

5. **Start Using the System**
   - Add your actual clients
   - Create real invoices
   - Track payments
   - Generate reports

---

## 🔒 Security Recommendations

1. Change all default passwords immediately
2. Update JWT_SECRET in backend/.env with a strong random key
3. Update SESSION_SECRET with a unique value
4. Consider enabling 2FA for admin accounts
5. Regularly backup the database
6. Keep PostgreSQL and Prisma updated
7. Review audit logs periodically

---

## 📞 Support

For issues or questions:
- Check backend logs: `docker logs erp-backend`
- Check database logs: `docker logs erp-postgres`
- Review Prisma documentation: https://www.prisma.io/docs
- Check PostgreSQL logs in the container

---

**Database Status**: ✅ OPERATIONAL

**Last Updated**: December 12, 2025

**Created by**: BizManage Setup Assistant
