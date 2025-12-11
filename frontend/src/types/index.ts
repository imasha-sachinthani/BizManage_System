export interface KPICard {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: string;
  gradient: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  date: string;
  dueDate: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  amount: number;
  status: 'approved' | 'pending' | 'rejected' | 'draft';
  date: string;
  deliveryDate: string;
}

export interface Client {
  id: string;
  code: string;
  name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  taxId?: string;
  address?: string;
  city?: string;
  country?: string;
  creditLimit?: number;
  paymentTerms?: number;
  category?: 'VIP' | 'REGULAR' | 'NEW' | 'INACTIVE';
  isActive: boolean;
  notes?: string;
  contactPerson?: string;
  businessType?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  _count?: {
    invoices: number;
    payments: number;
  };
}

export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  vatNumber: string;
  registrationNumber: string;
  industry: string;
  website?: string;
  status: 'active' | 'inactive';
}

export interface VATReport {
  period: string;
  totalSales: number;
  totalPurchases: number;
  vatCollected: number;
  vatPaid: number;
  vatPayable: number;
}

export interface Tender {
  id: string;
  title: string;
  client: string;
  value: number;
  deadline: string;
  status: 'open' | 'submitted' | 'won' | 'lost';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'accountant' | 'manager' | 'staff';
  avatar?: string;
}
