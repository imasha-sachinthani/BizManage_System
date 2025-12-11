const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('Creating admin user...');

    // Check if company exists
    let company = await prisma.company.findFirst({
      where: { email: 'info@bizmanage.lk' }
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: 'BizManage Trading Company',
          taxId: 'VAT-123456789',
          registrationNo: 'PV-12345',
          email: 'info@bizmanage.lk',
          phone: '+94 11 234 5678',
          address: '123 Main Street',
          city: 'Colombo',
          country: 'Sri Lanka',
          currency: 'LKR',
          fiscalYearStart: 1,
        }
      });
      console.log('Company created');
    }

    // Get DIRECTOR role
    const directorRole = await prisma.role.findUnique({
      where: { name: 'DIRECTOR' }
    });

    if (!directorRole) {
      console.error('DIRECTOR role not found. Please ensure the database is seeded properly.');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    // Create admin user
    const admin = await prisma.user.upsert({
      where: { email: 'admin@bizmanage.lk' },
      update: {},
      create: {
        email: 'admin@bizmanage.lk',
        username: 'admin',
        password: hashedPassword,
        firstName: 'System',
        lastName: 'Administrator',
        phone: '+94 77 123 4567',
        roleId: directorRole.id,
        companyId: company.id,
        isActive: true,
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@bizmanage.lk');
    console.log('Password: Admin@123');

    // Create sample client
    await prisma.client.upsert({
      where: { code: 'CLI-001' },
      update: {},
      create: {
        code: 'CLI-001',
        name: 'ABC Corporation Ltd',
        email: 'contact@abccorp.lk',
        phone: '+94 11 234 5678',
        taxId: 'VAT-ABC123',
        address: '456 Business Avenue, Colombo 03',
        city: 'Colombo',
        country: 'Sri Lanka',
        creditLimit: 500000,
        paymentTerms: 30,
        category: 'VIP',
        companyId: company.id,
      }
    });

    console.log('✅ Sample client created!');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();