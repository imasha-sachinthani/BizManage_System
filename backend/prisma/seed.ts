import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default permissions
  const permissions = [
    // Invoice permissions
    { module: 'invoices', action: 'create' },
    { module: 'invoices', action: 'read' },
    { module: 'invoices', action: 'update' },
    { module: 'invoices', action: 'delete' },
    { module: 'invoices', action: 'approve' },
    
    // Payment permissions
    { module: 'payments', action: 'create' },
    { module: 'payments', action: 'read' },
    { module: 'payments', action: 'update' },
    { module: 'payments', action: 'delete' },
    
    // Purchase permissions
    { module: 'purchases', action: 'create' },
    { module: 'purchases', action: 'read' },
    { module: 'purchases', action: 'update' },
    { module: 'purchases', action: 'delete' },
    { module: 'purchases', action: 'approve' },
    
    // Reports permissions
    { module: 'reports', action: 'read' },
    { module: 'reports', action: 'export' },
    
    // Admin permissions
    { module: 'users', action: 'create' },
    { module: 'users', action: 'read' },
    { module: 'users', action: 'update' },
    { module: 'users', action: 'delete' },
    
    // CUSDEC permissions
    { module: 'cusdec', action: 'create' },
    { module: 'cusdec', action: 'read' },
    { module: 'cusdec', action: 'update' },
    { module: 'cusdec', action: 'delete' },
    
    // Asset permissions
    { module: 'assets', action: 'create' },
    { module: 'assets', action: 'read' },
    { module: 'assets', action: 'update' },
    { module: 'assets', action: 'delete' },
    
    // Tender permissions
    { module: 'tenders', action: 'create' },
    { module: 'tenders', action: 'read' },
    { module: 'tenders', action: 'update' },
    { module: 'tenders', action: 'delete' },
    
    // Expense permissions
    { module: 'expenses', action: 'create' },
    { module: 'expenses', action: 'read' },
    { module: 'expenses', action: 'update' },
    { module: 'expenses', action: 'delete' },
    { module: 'expenses', action: 'approve' },
    
    // Client permissions
    { module: 'clients', action: 'create' },
    { module: 'clients', action: 'read' },
    { module: 'clients', action: 'update' },
    { module: 'clients', action: 'delete' },
    
    // Supplier permissions
    { module: 'suppliers', action: 'create' },
    { module: 'suppliers', action: 'read' },
    { module: 'suppliers', action: 'update' },
    { module: 'suppliers', action: 'delete' },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { module_action: { module: permission.module, action: permission.action } },
      update: {},
      create: permission,
    });
  }

  console.log('✅ Permissions created');

  // Create default roles
  const directorRole = await prisma.role.upsert({
    where: { name: 'DIRECTOR' },
    update: {},
    create: {
      name: 'DIRECTOR',
      description: 'Full system access - Directors and owners',
      isSystem: true,
      permissions: {
        connect: await prisma.permission.findMany().then(perms => perms.map(p => ({ id: p.id })))
      }
    },
  });

  const auditRole = await prisma.role.upsert({
    where: { name: 'AUDIT_TEAM' },
    update: {},
    create: {
      name: 'AUDIT_TEAM',
      description: 'Read-only access to financial data and audit trails',
      isSystem: true,
      permissions: {
        connect: [
          { module: 'invoices', action: 'read' },
          { module: 'payments', action: 'read' },
          { module: 'purchases', action: 'read' },
          { module: 'reports', action: 'read' },
          { module: 'reports', action: 'export' },
          { module: 'clients', action: 'read' },
          { module: 'suppliers', action: 'read' },
        ].map(p => ({ module_action: p }))
      }
    },
  });

  const accountantRole = await prisma.role.upsert({
    where: { name: 'ACCOUNTANT' },
    update: {},
    create: {
      name: 'ACCOUNTANT',
      description: 'Financial modules access - Accounts department',
      isSystem: true,
      permissions: {
        connect: [
          { module: 'invoices', action: 'create' },
          { module: 'invoices', action: 'read' },
          { module: 'invoices', action: 'update' },
          { module: 'payments', action: 'create' },
          { module: 'payments', action: 'read' },
          { module: 'payments', action: 'update' },
          { module: 'purchases', action: 'create' },
          { module: 'purchases', action: 'read' },
          { module: 'purchases', action: 'update' },
          { module: 'reports', action: 'read' },
          { module: 'reports', action: 'export' },
          { module: 'clients', action: 'create' },
          { module: 'clients', action: 'read' },
          { module: 'clients', action: 'update' },
          { module: 'suppliers', action: 'create' },
          { module: 'suppliers', action: 'read' },
          { module: 'suppliers', action: 'update' },
          { module: 'cusdec', action: 'create' },
          { module: 'cusdec', action: 'read' },
          { module: 'cusdec', action: 'update' },
        ].map(p => ({ module_action: p }))
      }
    },
  });

  const executiveRole = await prisma.role.upsert({
    where: { name: 'EXECUTIVE' },
    update: {},
    create: {
      name: 'EXECUTIVE',
      description: 'Limited access to relevant modules - Executive staff',
      isSystem: true,
      permissions: {
        connect: [
          { module: 'invoices', action: 'create' },
          { module: 'invoices', action: 'read' },
          { module: 'invoices', action: 'update' },
          { module: 'payments', action: 'read' },
          { module: 'purchases', action: 'read' },
          { module: 'clients', action: 'read' },
          { module: 'suppliers', action: 'read' },
          { module: 'tenders', action: 'create' },
          { module: 'tenders', action: 'read' },
          { module: 'tenders', action: 'update' },
        ].map(p => ({ module_action: p }))
      }
    },
  });

  const coordinatorRole = await prisma.role.upsert({
    where: { name: 'COORDINATOR' },
    update: {},
    create: {
      name: 'COORDINATOR',
      description: 'Data entry and basic reports - Coordinators',
      isSystem: true,
      permissions: {
        connect: [
          { module: 'invoices', action: 'create' },
          { module: 'invoices', action: 'read' },
          { module: 'purchases', action: 'create' },
          { module: 'purchases', action: 'read' },
          { module: 'clients', action: 'read' },
          { module: 'suppliers', action: 'read' },
          { module: 'expenses', action: 'create' },
          { module: 'expenses', action: 'read' },
        ].map(p => ({ module_action: p }))
      }
    },
  });

  console.log('✅ Roles created');

  // Create default company
  let defaultCompany = await prisma.company.findFirst({
    where: { email: 'info@bizmanage.lk' },
  });
  
  if (!defaultCompany) {
    defaultCompany = await prisma.company.create({
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
        fiscalYearStart: 1, // January
      },
    });
  }

  console.log('✅ Default company created');

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  
  const adminUser = await prisma.user.upsert({
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
      companyId: defaultCompany.id,
      isActive: true,
    },
  });

  console.log('✅ Admin user created');

  // Create sample accountant user
  const accountantPassword = await bcrypt.hash('Accountant@123', 10);
  
  await prisma.user.upsert({
    where: { email: 'accountant@bizmanage.lk' },
    update: {},
    create: {
      email: 'accountant@bizmanage.lk',
      username: 'accountant',
      password: accountantPassword,
      firstName: 'Finance',
      lastName: 'Manager',
      phone: '+94 77 987 6543',
      roleId: accountantRole.id,
      companyId: defaultCompany.id,
      isActive: true,
    },
  });

  console.log('✅ Sample users created');

  // Create sample clients
  const sampleClients = [
    {
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
      category: 'VIP' as const,
    },
    {
      code: 'CLI-002',
      name: 'XYZ Trading Company',
      email: 'info@xyztrading.lk',
      phone: '+94 11 567 8901',
      taxId: 'VAT-XYZ456',
      address: '789 Commercial Street, Colombo 01',
      city: 'Colombo',
      country: 'Sri Lanka',
      creditLimit: 300000,
      paymentTerms: 45,
      category: 'REGULAR' as const,
    },
  ];

  for (const clientData of sampleClients) {
    await prisma.client.upsert({
      where: { code: clientData.code },
      update: {},
      create: {
        ...clientData,
        companyId: defaultCompany.id,
      },
    });
  }

  console.log('✅ Sample clients created');

  // Create sample suppliers
  const sampleSuppliers = [
    {
      code: 'SUP-001',
      name: 'Global Electronics Supplier',
      email: 'sales@globalelectronics.com',
      phone: '+86 138 0013 8000',
      address: 'Shenzhen, China',
      city: 'Shenzhen',
      country: 'China',
      currency: 'USD',
      paymentTerms: 30,
      leadTime: 45,
    },
    {
      code: 'SUP-002',
      name: 'Local Office Supplies',
      email: 'orders@localsupplies.lk',
      phone: '+94 11 345 6789',
      address: '321 Supply Road, Colombo 10',
      city: 'Colombo',
      country: 'Sri Lanka',
      currency: 'LKR',
      paymentTerms: 15,
      leadTime: 7,
    },
  ];

  for (const supplierData of sampleSuppliers) {
    await prisma.supplier.upsert({
      where: { code: supplierData.code },
      update: {},
      create: {
        ...supplierData,
        companyId: defaultCompany.id,
      },
    });
  }

  console.log('✅ Sample suppliers created');

  // Create sample products
  const sampleProducts = [
    {
      sku: 'LAPTOP-001',
      name: 'Business Laptop',
      description: 'High-performance laptop for business use',
      category: 'Electronics',
      unit: 'PCS',
      costPrice: 85000,
      sellingPrice: 125000,
      currentStock: 10,
      reorderLevel: 5,
      hsCode: '8471.30.00',
    },
    {
      sku: 'PHONE-001',
      name: 'Smartphone',
      description: 'Latest smartphone model',
      category: 'Electronics',
      unit: 'PCS',
      costPrice: 45000,
      sellingPrice: 65000,
      currentStock: 25,
      reorderLevel: 10,
      hsCode: '8517.12.00',
    },
  ];

  for (const productData of sampleProducts) {
    await prisma.product.upsert({
      where: { sku: productData.sku },
      update: {},
      create: {
        ...productData,
        companyId: defaultCompany.id,
      },
    });
  }

  console.log('✅ Sample products created');

  console.log('🎉 Database seeding completed successfully!');
  
  console.log('\n📋 IMPORTANT: Default Login Credentials');
  console.log('=======================================');
  console.log('Admin User:');
  console.log('  Email: admin@bizmanage.lk');
  console.log('  Password: Admin@123');
  console.log('');
  console.log('Accountant User:');
  console.log('  Email: accountant@bizmanage.lk');
  console.log('  Password: Accountant@123');
  console.log('');
  console.log('⚠️  Please change these passwords after first login!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });