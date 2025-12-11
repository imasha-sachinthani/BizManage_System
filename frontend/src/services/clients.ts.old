import { Client } from '../types';
import { authService } from './auth';
import { mockClientData, mockClientStats } from './mockClients';

const API_BASE_URL = 'http://localhost:3000/api';
const USE_MOCK_DATA = false; // Set to true to use mock data during development

export interface CreateClientData {
  name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  creditLimit?: number;
  paymentTerms?: number;
  category?: 'VIP' | 'REGULAR' | 'NEW' | 'INACTIVE';
  notes?: string;
}

export interface UpdateClientData extends Partial<CreateClientData> {
  isActive?: boolean;
}

export interface ClientsListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ClientStats {
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
}

class ClientService {
  private getAuthHeaders() {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getAllClients(params?: ClientsListParams) {
    if (USE_MOCK_DATA) {
      // Use mock data for development
      let filteredClients = [...mockClientData];
      
      // Apply search filter
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filteredClients = filteredClients.filter(client =>
          client.name.toLowerCase().includes(searchLower) ||
          (client.email && client.email.toLowerCase().includes(searchLower)) ||
          (client.phone && client.phone.includes(params.search!))
        );
      }
      
      // Apply status filter
      if (params?.status) {
        filteredClients = filteredClients.filter(client => client.status === params.status);
      }
      
      // Apply sorting
      if (params?.sortBy) {
        filteredClients.sort((a, b) => {
          const aValue = a[params.sortBy as keyof Client];
          const bValue = b[params.sortBy as keyof Client];
          
          if (aValue === undefined && bValue === undefined) return 0;
          if (aValue === undefined) return 1;
          if (bValue === undefined) return -1;
          
          if (aValue < bValue) return params.sortOrder === 'desc' ? 1 : -1;
          if (aValue > bValue) return params.sortOrder === 'desc' ? -1 : 1;
          return 0;
        });
      }
      
      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        clients: filteredClients.slice(startIndex, endIndex),
        total: filteredClients.length,
        page,
        limit,
        totalPages: Math.ceil(filteredClients.length / limit)
      };
    }

    try {
      const token = await authService.getToken();
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const url = `${API_BASE_URL}/clients${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to fetch clients');
      }

      const data = await response.json();
      
      // Transform the response to match frontend expectations
      const transformedClients = data.data.clients.map((client: any) => ({
        ...client,
        status: client.isActive ? 'active' : 'inactive',
        contactPerson: client.contacts?.[0]?.name || '', // Use primary contact if available
      }));
      
      return {
        clients: transformedClients as Client[],
        total: data.data.pagination.total,
        page: data.data.pagination.page,
        limit: data.data.pagination.limit,
        totalPages: data.data.pagination.totalPages
      };
    } catch (error) {
      console.error('Get all clients error:', error);
      throw error;
    }
  }

  async createClient(clientData: CreateClientData): Promise<Client> {
    if (USE_MOCK_DATA) {
      const newClient: Client = {
        id: `mock-${Date.now()}`,
        code: `CL${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`,
        name: clientData.name,
        email: clientData.email || '',
        phone: clientData.phone || '',
        mobile: clientData.mobile || '',
        address: clientData.address || '',
        city: clientData.city || '',
        country: clientData.country || '',
        taxId: clientData.taxId || '',
        creditLimit: clientData.creditLimit || 0,
        paymentTerms: clientData.paymentTerms || 30,
        category: clientData.category || 'REGULAR',
        notes: clientData.notes || '',
        contactPerson: '', // Will be handled by contacts
        isActive: true,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return newClient;
    }

    try {
      const token = await authService.getToken();
      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to create client');
      }

      const data = await response.json();
      const client = data.data.client;
      
      // Transform the response to match frontend expectations
      return {
        ...client,
        status: client.isActive ? 'active' : 'inactive',
        contactPerson: '', // Will be handled separately by contacts
      } as Client;
    } catch (error) {
      console.error('Create client error:', error);
      throw error;
    }
  }

  async updateClient(id: string, clientData: UpdateClientData): Promise<Client> {
    if (USE_MOCK_DATA) {
      const existingClient = mockClientData.find(c => c.id === id);
      if (!existingClient) {
        throw new Error('Client not found');
      }
      
      const updatedClient: Client = {
        ...existingClient,
        ...clientData,
        updatedAt: new Date().toISOString(),
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return updatedClient;
    }

    try {
      const token = await authService.getToken();
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        throw new Error('Failed to update client');
      }

      return await response.json();
    } catch (error) {
      console.error('Update client error:', error);
      throw error;
    }
  }

  async deleteClient(id: string): Promise<{ success: boolean, message: string }> {
    if (USE_MOCK_DATA) {
      const existingClient = mockClientData.find(c => c.id === id);
      if (!existingClient) {
        throw new Error('Client not found');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return { success: true, message: 'Client deleted successfully' };
    }
    
    try {
      const token = await authService.getToken();
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete client');
      }

      return { success: true, message: 'Client deleted successfully' };
    } catch (error) {
      console.error('Delete client error:', error);
      throw error;
    }
  }

  async getClient(id: string): Promise<Client> {
    if (USE_MOCK_DATA) {
      const client = mockClientData.find(c => c.id === id);
      if (!client) {
        throw new Error('Client not found');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return client;
    }
    
    try {
      const token = await authService.getToken();
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch client');
      }

      return await response.json();
    } catch (error) {
      console.error('Get client error:', error);
      throw error;
    }
  }

  async getClientStats(): Promise<{ totalClients: number, activeClients: number, inactiveClients: number }> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const totalClients = mockClientData.length;
      const activeClients = mockClientData.filter(c => c.status === 'active').length;
      const inactiveClients = mockClientData.filter(c => c.status === 'inactive').length;
      
      return { totalClients, activeClients, inactiveClients };
    }
    
    try {
      const token = await authService.getToken();
      const response = await fetch(`${API_BASE_URL}/clients/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch client statistics');
      }

      return await response.json();
    } catch (error) {
      console.error('Get client stats error:', error);
      throw error;
    }
  }
}

export const clientService = new ClientService();