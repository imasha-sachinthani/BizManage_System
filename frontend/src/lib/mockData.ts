import { Invoice, PurchaseOrder, Client, Company, VATReport, Tender, User } from '../types';

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    client: 'ABC Corporation Ltd',
    amount: 2450000,
    status: 'paid',
    date: '2024-10-01',
    dueDate: '2024-10-15',
    items: [
      { id: '1', description: 'Professional Services - October', quantity: 1, unitPrice: 2000000, vatRate: 15, total: 2300000 },
      { id: '2', description: 'Consulting Hours', quantity: 10, unitPrice: 15000, vatRate: 15, total: 172500 },
    ]
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    client: 'XYZ Enterprises',
    amount: 1875000,
    status: 'pending',
    date: '2024-10-15',
    dueDate: '2024-10-30',
    items: [
      { id: '1', description: 'Software Development', quantity: 1, unitPrice: 1500000, vatRate: 15, total: 1725000 },
      { id: '2', description: 'Training Services', quantity: 5, unitPrice: 30000, vatRate: 15, total: 172500 },
    ]
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    client: 'Global Trading Co',
    amount: 3250000,
    status: 'overdue',
    date: '2024-09-20',
    dueDate: '2024-10-05',
    items: [
      { id: '1', description: 'Annual Maintenance Contract', quantity: 1, unitPrice: 2800000, vatRate: 15, total: 3220000 },
    ]
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    client: 'Tech Solutions Inc',
    amount: 985000,
    status: 'draft',
    date: '2024-10-25',
    dueDate: '2024-11-10',
    items: [
      { id: '1', description: 'Web Development Services', quantity: 1, unitPrice: 850000, vatRate: 15, total: 977500 },
    ]
  },
  {
    id: '5',
    invoiceNumber: 'INV-2024-005',
    client: 'Retail Mart Ltd',
    amount: 4200000,
    status: 'paid',
    date: '2024-10-10',
    dueDate: '2024-10-25',
    items: [
      { id: '1', description: 'POS System Integration', quantity: 1, unitPrice: 3500000, vatRate: 15, total: 4025000 },
      { id: '2', description: 'Hardware Supply', quantity: 5, unitPrice: 35000, vatRate: 15, total: 201250 },
    ]
  },
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    poNumber: 'PO-2024-001',
    supplier: 'Office Supplies Lanka',
    amount: 145000,
    status: 'approved',
    date: '2024-10-01',
    deliveryDate: '2024-10-10',
  },
  {
    id: '2',
    poNumber: 'PO-2024-002',
    supplier: 'Tech Hardware Pvt Ltd',
    amount: 875000,
    status: 'pending',
    date: '2024-10-15',
    deliveryDate: '2024-10-25',
  },
  {
    id: '3',
    poNumber: 'PO-2024-003',
    supplier: 'Cloud Services International',
    amount: 250000,
    status: 'approved',
    date: '2024-10-05',
    deliveryDate: '2024-10-15',
  },
  {
    id: '4',
    poNumber: 'PO-2024-004',
    supplier: 'Marketing Solutions',
    amount: 320000,
    status: 'draft',
    date: '2024-10-20',
    deliveryDate: '2024-11-01',
  },
];

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'ABC Corporation Ltd',
    email: 'contact@abccorp.lk',
    phone: '+94 11 234 5678',
    address: '123 Galle Road, Colombo 03',
    vatNumber: 'VAT-123456789',
    contactPerson: 'Nimal Perera',
    businessType: 'Retail',
    status: 'active',
  },
  {
    id: '2',
    name: 'XYZ Enterprises',
    email: 'info@xyzent.lk',
    phone: '+94 11 876 5432',
    address: '456 Duplication Road, Colombo 04',
    vatNumber: 'VAT-987654321',
    contactPerson: 'Kamala Silva',
    businessType: 'Manufacturing',
    status: 'active',
  },
  {
    id: '3',
    name: 'Global Trading Co',
    email: 'sales@globaltrading.lk',
    phone: '+94 11 345 6789',
    address: '789 Main Street, Colombo 01',
    vatNumber: 'VAT-456789123',
    contactPerson: 'Sunil Fernando',
    businessType: 'Trading',
    status: 'active',
  },
  {
    id: '4',
    name: 'Tech Solutions Inc',
    email: 'hello@techsolutions.lk',
    phone: '+94 11 654 3210',
    address: '321 Park Street, Colombo 02',
    vatNumber: 'VAT-789123456',
    contactPerson: 'Dilshan Jayawardena',
    businessType: 'IT Services',
    status: 'inactive',
  },
  {
    id: '5',
    name: 'Retail Mart Ltd',
    email: 'info@retailmart.lk',
    phone: '+94 11 555 4444',
    address: '88 Ward Place, Colombo 07',
    vatNumber: 'VAT-555444333',
    contactPerson: 'Thilini Wickramasinghe',
    businessType: 'Retail',
    status: 'active',
  },
];

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Ceylon Textile Industries',
    email: 'info@ceylontextiles.lk',
    phone: '+94 11 222 3333',
    address: '45 Baseline Road, Colombo 09',
    vatNumber: 'VAT-111222333',
    registrationNumber: 'PV-12345',
    industry: 'Textile Manufacturing',
    website: 'www.ceylontextiles.lk',
    status: 'active',
  },
  {
    id: '2',
    name: 'Lanka Export Corporation',
    email: 'contact@lankaexport.lk',
    phone: '+94 11 444 5555',
    address: '100 York Street, Colombo 01',
    vatNumber: 'VAT-444555666',
    registrationNumber: 'PV-54321',
    industry: 'Export & Import',
    website: 'www.lankaexport.lk',
    status: 'active',
  },
  {
    id: '3',
    name: 'Digital Solutions Hub Pvt Ltd',
    email: 'hello@digitalhub.lk',
    phone: '+94 11 777 8888',
    address: '25 Parkland Avenue, Colombo 05',
    vatNumber: 'VAT-777888999',
    registrationNumber: 'PV-98765',
    industry: 'Information Technology',
    website: 'www.digitalhub.lk',
    status: 'active',
  },
  {
    id: '4',
    name: 'Ceylon Tea Exporters Ltd',
    email: 'sales@ceylontea.lk',
    phone: '+94 11 333 2222',
    address: '67 Chatham Street, Colombo 01',
    vatNumber: 'VAT-333222111',
    registrationNumber: 'PV-11122',
    industry: 'Agriculture & Export',
    website: 'www.ceylontea.lk',
    status: 'active',
  },
  {
    id: '5',
    name: 'Metro Construction Pvt Ltd',
    email: 'info@metroconstruct.lk',
    phone: '+94 11 999 0000',
    address: '12 Union Place, Colombo 02',
    vatNumber: 'VAT-999000111',
    registrationNumber: 'PV-33344',
    industry: 'Construction',
    website: 'www.metroconstruct.lk',
    status: 'inactive',
  },
];

export const mockVATReport: VATReport = {
  period: 'Q3 2024',
  totalSales: 12760000,
  totalPurchases: 1590000,
  vatCollected: 1914000,
  vatPaid: 238500,
  vatPayable: 1675500,
};

export const mockTenders: Tender[] = [
  {
    id: '1',
    title: 'Government Digital Transformation Project',
    client: 'Ministry of Digital Economy',
    value: 25000000,
    deadline: '2024-11-15',
    status: 'open',
  },
  {
    id: '2',
    title: 'Banking System Upgrade',
    client: 'National Bank of Ceylon',
    value: 18500000,
    deadline: '2024-11-30',
    status: 'submitted',
  },
  {
    id: '3',
    title: 'E-Commerce Platform Development',
    client: 'Retail Giants Ltd',
    value: 12000000,
    deadline: '2024-10-20',
    status: 'won',
  },
  {
    id: '4',
    title: 'Mobile App Development',
    client: 'Startup Ventures',
    value: 5500000,
    deadline: '2024-09-30',
    status: 'lost',
  },
];

export const revenueData = [
  { month: 'Jan', revenue: 2400000, expenses: 980000 },
  { month: 'Feb', revenue: 3100000, expenses: 1200000 },
  { month: 'Mar', revenue: 2800000, expenses: 1100000 },
  { month: 'Apr', revenue: 3900000, expenses: 1400000 },
  { month: 'May', revenue: 4200000, expenses: 1600000 },
  { month: 'Jun', revenue: 3800000, expenses: 1350000 },
  { month: 'Jul', revenue: 4500000, expenses: 1700000 },
  { month: 'Aug', revenue: 5100000, expenses: 1850000 },
  { month: 'Sep', revenue: 4800000, expenses: 1750000 },
  { month: 'Oct', revenue: 5500000, expenses: 2000000 },
];

export const statusDistribution = [
  { name: 'Paid', value: 45, color: '#047857' },
  { name: 'Pending', value: 30, color: '#F59E0B' },
  { name: 'Overdue', value: 15, color: '#DC2626' },
  { name: 'Draft', value: 10, color: '#64748B' },
];

export const currentUser: User = {
  id: '1',
  name: 'Ravindu Perera',
  email: 'ravindu@company.lk',
  role: 'admin',
};
