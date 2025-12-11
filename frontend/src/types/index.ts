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

export interface ReturnItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  total: number;
  reason: string;
}

export interface Return {
  id: string;
  returnNumber: string;
  invoiceNumber: string;
  client: string;
  clientId?: string;
  amount: number;
  vatAmount: number;
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  date: string;
  reason: string;
  items: ReturnItem[];
  refundMethod?: 'cash' | 'bank_transfer' | 'credit_note' | 'replacement';
  approvedBy?: string;
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  supplierCountry?: string;
  supplierEmail?: string;
  supplierPhone?: string;
  amount: number;
  taxAmount?: number;
  status: 'approved' | 'pending' | 'rejected' | 'draft' | 'confirmed' | 'received';
  date: string;
  deliveryDate: string;
  currency?: string;
  exchangeRate?: number;
  incoterms?: string; // For international shipping terms
  terms?: string;
  notes?: string;
  items?: PurchaseOrderItem[];
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

export interface PurchaseOrderItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total?: number;
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
  tenderNumber: string;
  title: string;
  client: string;
  description?: string;
  value: number;
  currency?: string;
  status: 'pending' | 'submitted' | 'won' | 'lost' | 'cancelled';
  type: 'quotation' | 'tender' | 'rfq' | 'bid';
  publishDate: string;
  deadline: string;
  submissionDate?: string;
  resultDate?: string;
  daysToDeadline?: number;
  
  // Bid Security
  bidSecurityRequired: boolean;
  bidSecurityAmount?: number;
  bidSecurityType?: 'bank_guarantee' | 'cash' | 'bond' | 'letter_of_credit';
  bidSecurityBankName?: string;
  bidSecurityReferenceNumber?: string;
  bidSecurityIssueDate?: string;
  bidSecurityExpiryDate?: string;
  bidSecurityStatus?: 'pending' | 'submitted' | 'expired' | 'returned' | 'encashed';
  
  // Performance Security
  performanceSecurityRequired: boolean;
  performanceSecurityAmount?: number;
  performanceSecurityType?: 'bank_guarantee' | 'cash' | 'bond' | 'letter_of_credit';
  performanceSecurityBankName?: string;
  performanceSecurityReferenceNumber?: string;
  performanceSecurityIssueDate?: string;
  performanceSecurityExpiryDate?: string;
  performanceSecurityStatus?: 'pending' | 'submitted' | 'expired' | 'returned' | 'encashed';
  
  // Special Documents
  pca1Required: boolean;
  pca1SubmissionDate?: string;
  pca1ExpiryDate?: string;
  pca1Status?: 'pending' | 'submitted' | 'approved' | 'rejected' | 'expired';
  
  technicalDocumentsRequired: string[];
  financialDocumentsRequired: string[];
  otherDocumentsRequired: string[];
  
  // Additional Info
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
  notes?: string;
  alertDays?: number; // Days before deadline to alert
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'director' | 'audit' | 'accounts' | 'executive' | 'coordinator' | 'manager' | 'staff' | 'admin';
  department?: string;
  position?: string;
  avatar?: string;
  isActive: boolean;
  requireOTP: boolean;
  allowMultipleLocations: boolean;
  lastLogin?: string;
  lastLoginLocation?: string;
  lastLoginIP?: string;
  createdAt: string;
  updatedAt: string;
  permissions: UserPermission[];
}

export interface UserPermission {
  module: 'dashboard' | 'invoices' | 'clients' | 'companies' | 'purchases' | 'returns' | 'payments' | 'tenders' | 'reports' | 'settings' | 'users';
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
  canApprove: boolean;
}

export interface LoginSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  loginTime: string;
  logoutTime?: string;
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  isActive: boolean;
  otpVerified: boolean;
  otpMethod?: 'email' | 'sms' | 'app';
  sessionDuration?: number;
  activities?: SessionActivity[];
}

export interface SessionActivity {
  id: string;
  action: string;
  module: string;
  timestamp: string;
  details?: string;
}

export interface LoginAlert {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  loginTime: string;
  location: string;
  ipAddress: string;
  device: string;
  isUnusualLocation: boolean;
  isMultipleSession: boolean;
  otpRequired: boolean;
  status: 'success' | 'failed' | 'blocked' | 'pending_otp';
  alertSent: boolean;
  alertType?: 'email' | 'sms' | 'system';
}

export interface Payment {
  id: string;
  paymentNumber: string;
  invoiceNumber: string;
  client: string;
  clientId?: string;
  amount: number;
  paidAmount?: number;
  balanceAmount?: number;
  status: 'completed' | 'pending' | 'overdue' | 'partial';
  dueDate: string;
  paymentDate?: string;
  method?: 'bank_transfer' | 'cheque' | 'cash' | 'online' | 'credit_card';
  reference?: string;
  notes?: string;
  daysOverdue?: number;
}

export interface Cusdec {
  id: string;
  cusdecNumber: string;
  purchaseOrderNumber?: string;
  importDate: string;
  clearanceDate?: string;
  supplier: string;
  supplierCountry: string;
  portOfEntry: string;
  status: 'pending' | 'cleared' | 'under_inspection' | 'released' | 'held';
  items: CusdecItem[];
  totalCIF: number;
  totalDuty: number;
  totalVAT: number;
  totalPAL: number;
  totalNBT: number;
  otherCharges: number;
  totalAmount: number;
  customsAgent?: string;
  agentContact?: string;
  invoiceValue: number;
  freightCharges: number;
  insuranceCharges: number;
  remarks?: string;
  documents: CusdecDocument[];
  createdDate: string;
  lastUpdated: string;
}

export interface CusdecItem {
  id: string;
  description: string;
  hsCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalValue: number;
  dutyRate: number;
  dutyAmount: number;
  vatRate: number;
  vatAmount: number;
  palRate?: number;
  palAmount?: number;
  nbtRate?: number;
  nbtAmount?: number;
  totalTax: number;
}

export interface CusdecDocument {
  id: string;
  name: string;
  type: 'excel' | 'pdf' | 'image' | 'other';
  fileUrl: string;
  uploadDate: string;
  fileSize: string;
}
