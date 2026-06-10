import api, { ApiResponse } from './api';
import { Invoice, InvoiceItem, Client } from '../types';

// Backend API response types (matching backend schema)
export interface BackendInvoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  client: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  invoiceDate: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'DRAFT' | 'PENDING' | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE' | 'CANCELLED';
  notes?: string;
  terms?: string;
  items: BackendInvoiceItem[];
  payments?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface BackendInvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateInvoiceRequest {
  clientId: string;
  amount: number;
  taxAmount?: number;
  discountAmount?: number;
  dueDate: string;
  notes?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
  }[];
  status?: 'DRAFT' | 'PENDING';
}

export interface UpdateInvoiceRequest {
  clientId?: string;
  amount?: number;
  taxAmount?: number;
  discountAmount?: number;
  dueDate?: string;
  notes?: string;
  items?: {
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
  }[];
  status?: 'DRAFT' | 'PENDING' | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE' | 'CANCELLED';
}

export interface InvoiceListResponse {
  invoices: BackendInvoice[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalAmount: number;
    totalTax: number;
    totalDiscount: number;
  };
}

export interface InvoiceFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  clientId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Transform backend invoice to frontend invoice
function transformBackendInvoice(backendInvoice: BackendInvoice): Invoice {
  return {
    id: backendInvoice.id,
    invoiceNumber: backendInvoice.invoiceNumber,
    client: typeof backendInvoice.client === 'string' ? backendInvoice.client : backendInvoice.client?.name || '',
    // Prisma Decimal values may be serialized as strings; coerce to numbers for frontend
    amount: Number((backendInvoice as any).totalAmount ?? (backendInvoice as any).amount ?? 0),
    status: transformStatus(backendInvoice.status),
    date: new Date(backendInvoice.invoiceDate).toISOString().split('T')[0],
    dueDate: new Date(backendInvoice.dueDate).toISOString().split('T')[0],
    items: (backendInvoice.items || []).map(item => ({
      id: item.id,
      description: item.description,
      quantity: Number((item as any).quantity ?? 0),
      unitPrice: Number((item as any).unitPrice ?? (item as any).unitPrice ?? 0),
      vatRate: Number((item as any).taxRate ?? 15), // Default VAT rate if missing
      total: Number((item as any).totalPrice ?? (item as any).total ?? 0),
    }))
  };
}

// Transform backend status to frontend status
function transformStatus(backendStatus: BackendInvoice['status']): Invoice['status'] {
  const statusMap: Record<BackendInvoice['status'], Invoice['status']> = {
    'DRAFT': 'draft',
    'PENDING': 'pending',
    'PAID': 'paid',
    'PARTIALLY_PAID': 'pending',
    'OVERDUE': 'overdue',
    'CANCELLED': 'draft', // Map cancelled to draft for frontend display
  };
  
  return statusMap[backendStatus] || 'draft';
}

// Transform frontend status to backend status
function transformStatusToBackend(frontendStatus: Invoice['status']): BackendInvoice['status'] {
  const statusMap: Record<Invoice['status'], BackendInvoice['status']> = {
    'draft': 'DRAFT',
    'pending': 'PENDING',
    'paid': 'PAID',
    'overdue': 'OVERDUE',
  };
  
  return statusMap[frontendStatus] || 'DRAFT';
}

// Invoice API service
export const invoiceService = {
  // Get all invoices with filters
  async getInvoices(filters: InvoiceFilters = {}): Promise<{
    invoices: Invoice[];
    pagination: InvoiceListResponse['pagination'];
    summary: InvoiceListResponse['summary'];
  }> {
    try {
      const response = await api.get<InvoiceListResponse>('/invoices', filters);
      
      return {
        invoices: response.invoices.map(transformBackendInvoice),
        pagination: response.pagination,
        summary: response.summary,
      };
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      throw error;
    }
  },

  // Get invoice by ID
  async getInvoice(id: string): Promise<Invoice> {
    try {
      const response = await api.get<{ invoice: BackendInvoice }>(`/invoices/${id}`);
      return transformBackendInvoice(response.invoice);
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
      throw error;
    }
  },

  // Create new invoice
  async createInvoice(invoiceData: CreateInvoiceRequest): Promise<Invoice> {
    try {
      const response = await api.post<{ invoice: BackendInvoice }>('/invoices', invoiceData);
      return transformBackendInvoice(response.invoice);
    } catch (error) {
      console.error('Failed to create invoice:', error);
      throw error;
    }
  },

  // Update invoice
  async updateInvoice(id: string, invoiceData: UpdateInvoiceRequest): Promise<Invoice> {
    try {
      const response = await api.put<{ invoice: BackendInvoice }>(`/invoices/${id}`, invoiceData);
      return transformBackendInvoice(response.invoice);
    } catch (error) {
      console.error('Failed to update invoice:', error);
      throw error;
    }
  },

  // Delete invoice
  async deleteInvoice(id: string): Promise<void> {
    try {
      await api.delete(`/invoices/${id}`);
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      throw error;
    }
  },

  // Send invoice
  async sendInvoice(id: string): Promise<void> {
    try {
      await api.post(`/invoices/${id}/send`);
    } catch (error) {
      console.error('Failed to send invoice:', error);
      throw error;
    }
  },

  // Mark invoice as paid
  async markInvoiceAsPaid(id: string, paymentData?: {
    paymentAmount?: number;
    paymentMethod?: string;
    paymentDate?: string;
  }): Promise<void> {
    try {
      await api.post(`/invoices/${id}/mark-paid`, paymentData);
    } catch (error) {
      console.error('Failed to mark invoice as paid:', error);
      throw error;
    }
  },

  // Get invoice statistics
  async getInvoiceStats(dateFrom?: string, dateTo?: string): Promise<{
    totalInvoices: number;
    totalAmount: number;
    paidInvoices: number;
    paidAmount: number;
    pendingInvoices: number;
    overdueInvoices: number;
    unpaidAmount: number;
    statusBreakdown: Array<{
      status: string;
      count: number;
      amount: number;
    }>;
  }> {
    try {
      const params: any = {};
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const response = await api.get<{ stats: any }>('/invoices/stats/summary', params);
      return response.stats;
    } catch (error) {
      console.error('Failed to fetch invoice stats:', error);
      throw error;
    }
  },
};