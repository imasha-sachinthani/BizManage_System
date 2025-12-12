import api from './api';
import { Client } from '../types';

// Backend API response types
export interface BackendClient {
  id: string;
  companyId: string;
  code: string;
  name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  taxId?: string;
  address?: string;
  city?: string;
  country?: string;
  creditLimit: number;
  paymentTerms: number;
  category: 'VIP' | 'REGULAR' | 'NEW' | 'INACTIVE';
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientRequest {
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
  category?: BackendClient['category'];
  notes?: string;
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {
  isActive?: boolean;
}

export interface ClientListResponse {
  clients: BackendClient[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ClientFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Transform backend client to frontend client
function transformBackendClient(backendClient: any): Client {
  return {
    id: backendClient.id,
    code: backendClient.code,
    name: backendClient.name,
    email: backendClient.email,
    phone: backendClient.phone,
    mobile: backendClient.mobile,
    taxId: backendClient.taxId,
    address: backendClient.address,
    city: backendClient.city,
    country: backendClient.country,
    creditLimit: Number(backendClient.creditLimit),
    paymentTerms: backendClient.paymentTerms,
    category: backendClient.category,
    isActive: backendClient.isActive,
    notes: backendClient.notes,
    contactPerson: '', // Not available in backend schema yet
    businessType: '', // Not available in backend schema yet
    status: backendClient.isActive ? 'active' : 'inactive',
    createdAt: backendClient.createdAt,
    updatedAt: backendClient.updatedAt,
    _count: backendClient._count,
  };
}

// Transform frontend status to backend status
function transformStatusToBackend(frontendStatus: Client['status']): boolean {
  return frontendStatus === 'active';
}

// Client API service
export const clientService = {
  // Get all clients with filters
  async getClients(filters: ClientFilters = {}): Promise<{
    clients: Client[];
    pagination?: ClientListResponse['pagination'];
  }> {
    try {
      const response = await api.get<ClientListResponse>('/clients', filters);
      
      return {
        clients: response.clients.map(transformBackendClient),
        pagination: response.pagination,
      };
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      throw error;
    }
  },

  // Get client by ID
  async getClient(id: string): Promise<Client> {
    try {
      const response = await api.get<{ client: BackendClient }>(`/clients/${id}`);
      return transformBackendClient(response.client);
    } catch (error) {
      console.error('Failed to fetch client:', error);
      throw error;
    }
  },

  // Create new client
  async createClient(clientData: CreateClientRequest): Promise<Client> {
    try {
      const response = await api.post<{ client: BackendClient }>('/clients', clientData);
      return transformBackendClient(response.client);
    } catch (error) {
      console.error('Failed to create client:', error);
      throw error;
    }
  },

  // Update client
  async updateClient(id: string, clientData: UpdateClientRequest): Promise<Client> {
    try {
      const response = await api.put<{ client: BackendClient }>(`/clients/${id}`, clientData);
      return transformBackendClient(response.client);
    } catch (error) {
      console.error('Failed to update client:', error);
      throw error;
    }
  },

  // Delete client
  async deleteClient(id: string): Promise<void> {
    try {
      await api.delete(`/clients/${id}`);
    } catch (error) {
      console.error('Failed to delete client:', error);
      throw error;
    }
  },

  // Get client statistics
  async getClientStats(): Promise<{
    totalClients: number;
    activeClients: number;
    inactiveClients: number;
    categoryBreakdown: Array<{
      category: string;
      count: number;
    }>;
  }> {
    try {
      const response = await api.get<{ stats: any }>('/clients/stats/summary');
      return response.stats;
    } catch (error) {
      console.error('Failed to fetch client stats:', error);
      throw error;
    }
  },
};